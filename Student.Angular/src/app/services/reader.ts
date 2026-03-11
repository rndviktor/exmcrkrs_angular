import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Reader {
  private studentId: string|null = environment.studentId;
  private apiEndpoint: string = '/api/v1/';
  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    return this.http.get<any>(`${environment.studentQueryUrl}${this.apiEndpoint}examView/${this.studentId}`);
  }

  getQuestion(submissionId: string, questionId: string|null): Observable<any> {
    const questEnd = questionId !==null ? `/${questionId}` : '';
    return this.http.get<any>(`${environment.studentQueryUrl}${this.apiEndpoint}questionView/${submissionId}${questEnd}`);
  }

  getSubmissions(): Observable<any> {
    return this.http.get<any>(`${environment.studentQueryUrl}${this.apiEndpoint}submissionView/${this.studentId}`);
  }
}
