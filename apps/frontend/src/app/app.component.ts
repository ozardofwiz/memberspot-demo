import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { PeopleService } from './people.service';
import { Person } from '@memberspot-demo/shared-types';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    InputTextModule,
    CommonModule,
    FormsModule,
    TableModule,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  public people: Person[] = [];
  public loading: boolean = true;
  public totalRecords: number = 0;
  public globalFilter: string = '';

  constructor(private peopleService: PeopleService) {}

  public loadPeople(event: TableLazyLoadEvent): void {
    const first = event.first || 0;
    const rows = event.rows || 10;

    this.loading = true;
    this.peopleService.getPeople(first, rows).subscribe((response) => {
      this.people = response.results;
      this.totalRecords = response.total_records;
      this.loading = false;
    });
  }

  public onFilterKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.loading = true;
      this.peopleService
        .getFilteredPeople(this.globalFilter)
        .subscribe((response) => {
          this.people = response.results;
          this.totalRecords = response.total_records;
          this.loading = false;
        });
    }
  }
}
