import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {QuestionType} from './reader';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Writer {
  private baseUrl: string = 'http://localhost:5010';
  private apiPrefix: string = 'api/v1';


  constructor(private http: HttpClient) {}

  async postQuestion(examId: string, question: any): Promise<any> {
    const target = `${this.baseUrl}/${this.apiPrefix}/addQuestion/${examId}`;
    return await this.http.put<any>(target, question).toPromise();
  }

  async updateQuestionContent(examId: string, question: QuestionType){
    const target = `${this.baseUrl}/${this.apiPrefix}/editQuestionContent/${examId}`;
    return await this.http.put<any>(target, question).toPromise();
  }

  async deleteQuestion(examId: string, questionId: string): Promise<any> {
    const target = `${this.baseUrl}/${this.apiPrefix}/removeQuestion/${examId}`;
    return await this.http.delete<any>(target, { body: { questionId } }).toPromise();
  }
}
