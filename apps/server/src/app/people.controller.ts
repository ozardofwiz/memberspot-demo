import { Controller, Get, Inject, Query } from '@nestjs/common';
import { GetPeopleResponse } from '@memberspot-demo/shared-types';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PeopleService } from './people.service';

@Controller('people')
export class PeopleController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private peopleService: PeopleService
  ) {}

  @Get()
  async getPeople(
    @Query('first') first: number = 0,
    @Query('rows') rows: number = 10,
    @Query('searchText') searchText?: string
  ): Promise<GetPeopleResponse> {
    try {
      let res: GetPeopleResponse;

      // Check if results are already cached
      const cacheKey = `all_people`;
      res = (await this.cacheManager.get<GetPeopleResponse>(
        cacheKey
      )) as GetPeopleResponse;
      if (!res) {
        // Initially load all people
        res = await this.peopleService.getAllPeople();
        await this.cacheManager.set(cacheKey, res);
      }

      // If searchText is provided, filter the results
      if (searchText) {
        const filteredResults = res.results.filter((person) => {
          searchText = searchText?.toLowerCase() as string;

          const personName = person.name.toLowerCase();
          const birthYear = person.birth_year?.toLowerCase();
          const planetName = person.planet?.name.toLowerCase();
          const planetTerrain = person.planet?.terrain.toLowerCase();

          return (
            personName.includes(searchText) ||
            (birthYear && birthYear.includes(searchText)) ||
            (planetName && planetName.includes(searchText)) ||
            (planetTerrain && planetTerrain.includes(searchText))
          );
        });

        return {
          total_records: res.total_records,
          results: filteredResults,
        };
      }

      // Pagination
      const endIndex = Number(first) + Number(rows);
      const paginatedResults = res.results.slice(first, endIndex);

      return {
        total_records: res.total_records,
        results: paginatedResults,
      };
    } catch (error) {
      console.error('An error occurred while getting people:', error);
      throw new Error('An error occurred while getting people.');
    }
  }
}
