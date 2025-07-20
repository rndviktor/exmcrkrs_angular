import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


export interface AnswerType {
  answerId: string | null;
  content: string;
  isCorrect: boolean;
}

export interface QuestionType {
  questionId: string | null | undefined;
  content: string | null;
  answers?: AnswerType[];
}
export interface ExamType {
  examId: string | null;
  title: string;
  questions: QuestionType[];
}

@Injectable({
  providedIn: 'root'
})
export class Reader {
  private teacherId: string = '330125ae-bdc8-44a1-a90c-aa293445be3e';
  private baseUrl: string = 'http://localhost:5011';
  private apiEndpoint: string = '/api/v1/';

  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}${this.apiEndpoint}examLookup/byAuthorId/${this.teacherId}`);
  }

  getQuestionById(questionId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}${this.apiEndpoint}questionLookup/byId/${questionId}`);
  }
}
