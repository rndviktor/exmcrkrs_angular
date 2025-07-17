import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Writer {
  private baseUrl: string = 'http://localhost:5010';

  constructor(private http: HttpClient) {}


}
