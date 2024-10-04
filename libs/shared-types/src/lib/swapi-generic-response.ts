import { SwapiPerson } from './swapi-person';
import { SwapiPlanet } from './swapi-planet';

export interface SwapiGenericResponse<T extends SwapiPlanet | SwapiPerson> {
  result: {
    properties: T;
  };
}
