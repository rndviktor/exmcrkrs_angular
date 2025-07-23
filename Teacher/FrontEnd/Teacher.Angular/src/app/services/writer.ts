import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AnswerType, ExamType, QuestionType} from './reader';

@Injectable({
  providedIn: 'root'
})
export class Writer {
  private baseUrl: string = 'http://localhost:5010';
  private apiPrefix: string = 'api/v1';
  private teacherId: string = '330125ae-bdc8-44a1-a90c-aa293445be3e';


  constructor(private http: HttpClient) {}

  async createExam(exam: ExamType) {
    const target = `${this.baseUrl}/${this.apiPrefix}/newExam`;
    return await this.http.post<any>(target, {...exam, authorId: this.teacherId}).toPromise();
  }

  async updateExamTitle(exam: ExamType) {
    const target = `${this.baseUrl}/${this.apiPrefix}/editExamTitle/${exam.examId!}`;
    return await this.http.put<any>(target, {authorId: this.teacherId, title: exam.title }).toPromise();
  }

  async postQuestion(examId: string, question: any): Promise<any> {
    const target = `${this.baseUrl}/${this.apiPrefix}/addQuestion/${examId}`;
    return await this.http.put<any>(target, question).toPromise();
  }

  async updateQuestionContent(examId: string, question: QuestionType){
    const target = `${this.baseUrl}/${this.apiPrefix}/editQuestionContent/${examId}`;
    return await this.http.put<any>(target, question).toPromise();
  }

  async addAnswer(examId: string, questionId: string, answer: AnswerType): Promise<any> {
    const target = `${this.baseUrl}/${this.apiPrefix}/addAnswer/${examId}`;
    return await this.http.put<any>(target, { ...answer, questionId }).toPromise();
  }

  async updateAnswer(examId: string, questionId: string, answer: AnswerType): Promise<any> {
    const target = `${this.baseUrl}/${this.apiPrefix}/editAnswer/${examId}`;
    return await this.http.put<any>(target, { ...answer, questionId }).toPromise();
  }

  async removeAnswer(examId: string, questionId: string, answerId: string): Promise<any> {
    const target = `${this.baseUrl}/${this.apiPrefix}/removeAnswer/${examId}`;
    return await this.http.delete<any>(target, { body: { questionId, answerId } }).toPromise();
  }

  async removeQuestion(examId: string, questionId: string): Promise<any> {
    const target = `${this.baseUrl}/${this.apiPrefix}/removeQuestion/${examId}`;
    return await this.http.delete<any>(target, { body: { questionId } }).toPromise();
  }

  async deleteExam(examId: string): Promise<any> {
    const target = `${this.baseUrl}/${this.apiPrefix}/deleteExam/${examId}`;
    return await this.http.delete<any>(target, { body: { authorId: this.teacherId } }).toPromise();
  }
}
