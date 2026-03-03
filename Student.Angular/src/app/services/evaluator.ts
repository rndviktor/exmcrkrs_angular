import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Evaluator {
  private studentId: string|null = environment.studentId;
  private apiEndpoint: string = '/api/v1/';

  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    return this.http.get<any>(`${environment.evaluatorUrl}${this.apiEndpoint}submissions/${this.studentId}`);
  }

  getSubmission(submissionId: string): Observable<any> {
    return this.http.get<any>(`${environment.evaluatorUrl}${this.apiEndpoint}correctness/${this.studentId}/submissions/${submissionId}`);
  }
}
