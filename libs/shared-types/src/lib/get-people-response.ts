import { Person } from './person';

export interface GetPeopleResponse {
  total_records: number;
  results: Person[];
}
