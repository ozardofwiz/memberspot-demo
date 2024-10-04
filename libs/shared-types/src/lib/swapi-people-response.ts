export interface SwapiPeopleResponse {
  total_records: number;
  next: string | null;
  previous: string | null;
  results: { url: string }[];
}
