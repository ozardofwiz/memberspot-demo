import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetPeopleResponse, Person } from '@memberspot-demo/shared-types';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class PeopleService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public getPeople(first: number, rows: number): Observable<GetPeopleResponse> {
    const params = new URLSearchParams();
    params.append('first', first.toString());
    params.append('rows', rows.toString());
    const queryString = `${this.apiUrl}/people?${params.toString()}`;

    return this.http.get<GetPeopleResponse>(queryString);
  }

  public getFilteredPeople(searchText: string): Observable<GetPeopleResponse> {
    const params = new URLSearchParams();
    params.append('searchText', searchText);
    const queryString = `${this.apiUrl}/people?${params.toString()}`;

    console.log(queryString);

    return this.http.get<GetPeopleResponse>(queryString);
  }
}
