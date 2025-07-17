import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


export interface AnswerType {
  id: string;
  content: string;
  isCorrect: boolean;
}

export interface QuestionType {
  id: string;
  content: string;
  answers: AnswerType[];
}
export interface ExamType {
  // Define the interface or use 'any'
  id: string;
  title: string;
  questions: QuestionType[];
}

@Injectable({
  providedIn: 'root'
})
export class Reader {
  private teacherId: string = '330125ae-bdc8-44a1-a90c-aa293445be3e';
  private baseUrl: string = 'http://localhost:5011';
  private apiEndpoint: string = '/api/v1/examLookup/byAuthorId/';

  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}${this.apiEndpoint}${this.teacherId}`);
  }
}
