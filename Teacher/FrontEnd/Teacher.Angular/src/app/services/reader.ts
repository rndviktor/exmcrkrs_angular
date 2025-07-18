import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


export interface AnswerType {
  answerId: string;
  content: string;
  isCorrect: boolean;
}

export interface QuestionType {
  questionId: string;
  content: string;
  answers: AnswerType[];
}
export interface ExamType {
  // Define the interface or use 'any'
  examId: string;
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
