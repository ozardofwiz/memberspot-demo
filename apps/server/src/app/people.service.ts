import { Injectable } from '@nestjs/common';
import axios from 'axios';
import {
  GetPeopleResponse,
  Person,
  SwapiGenericResponse,
  SwapiPeopleResponse,
  SwapiPerson,
  SwapiPlanet,
} from '@memberspot-demo/shared-types';

@Injectable()
export class PeopleService {
  private readonly SWAPI_ALL_PEOPLE_URL: string =
    'https://www.swapi.tech/api/people?page=1&limit=1000';

  async getAllPeople(): Promise<GetPeopleResponse> {
    try {
      // Get all people from the SWAPI (Star Wars API)
      const { data } = await axios.get<SwapiPeopleResponse>(
        `${this.SWAPI_ALL_PEOPLE_URL}`
      );

      const people = data.results;

      // Batch fetching all person details in a single request
      const personRequests = people.map((person) =>
        axios.get<SwapiGenericResponse<SwapiPerson>>(person.url)
      );
      const personResponses = await Promise.all(personRequests);

      // Collect unique homeworld URLs
      const homeworldUrls = [
        ...new Set(
          personResponses.map(
            (response) => response.data.result.properties.homeworld
          )
        ),
      ];

      // Batch fetching all planets in a single request
      const planetRequests = homeworldUrls.map((url) =>
        axios.get<SwapiGenericResponse<SwapiPlanet>>(url)
      );
      const planetResponses = await Promise.all(planetRequests);

      // Create a mapping of homeworld URLs to planet data
      const planets = planetResponses.reduce((acc, response) => {
        const planetData = response.data.result.properties;
        const url = response.config.url;

        if (url) {
          acc[url] = {
            name: planetData.name,
            terrain: planetData.terrain,
            url: planetData.url,
          };
        }

        return acc;
      }, {} as Record<string, SwapiPlanet>);

      // Assemble detailed person data including their corresponding planets
      const detailedPeople = personResponses.map((response) => {
        const personData = response.data.result.properties;
        const planet = planets[personData.homeworld];

        return {
          name: personData.name,
          birth_year: personData.birth_year,
          planet,
        } as Person;
      });

      const responseData = {
        total_records: data.total_records,
        results: detailedPeople,
      };

      return responseData;
    } catch (error: unknown) {
      console.error('An error occurred while fetching data:', error);
      throw new Error('An error occurred while fetching data.');
    }
  }
}
