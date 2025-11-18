import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {AnswerType, ExamType, QuestionType} from "../types";
import {ExamService} from './exam-service';

@Injectable({
  providedIn: 'root'
})
export class Writer {
  private baseUrl: string = 'http://localhost:5010';
  private apiPrefix: string = 'api/v1';
  private teacherId: string = '330125ae-bdc8-44a1-a90c-aa293445be3e';


  constructor(private http: HttpClient, private examService: ExamService) {}

  async createExam(exam: ExamType) {
    const target = `${this.baseUrl}/${this.apiPrefix}/newExam`;
    const {id: examId} = await this.http.post<any>(target, {...exam, authorId: this.teacherId}).toPromise();
    this.examService.addExam({...exam, examId})
  }

  async updateExamTitle(exam: ExamType) {
    const target = `${this.baseUrl}/${this.apiPrefix}/editExamTitle/${exam.examId!}`;
    await this.http.put<any>(target, {authorId: this.teacherId, title: exam.title }).toPromise();
    this.examService.updateExamTitle(exam);
  }

  async assignAccessCode(exam: ExamType) {
    const target = `${this.baseUrl}/${this.apiPrefix}/assignAccessCode/${exam.examId!}`;
    await this.http.put<any>(target, {authorId: this.teacherId, accessCode: exam.accessCode! }).toPromise();
    this.examService.updateExamAccessCode(exam)
  }

  async postQuestion(examId: string, question: any): Promise<any> {
    const target = `${this.baseUrl}/${this.apiPrefix}/addQuestion/${examId}`;
    const {id} = await this.http.put<any>(target, question).toPromise();
    this.examService.addQuestionToExam(examId, {questionId: id, content: question.content});
    return id;
  }

  async updateQuestionContent(examId: string, question: QuestionType){
    const target = `${this.baseUrl}/${this.apiPrefix}/editQuestionContent/${examId}`;
    await this.http.put<any>(target, question).toPromise();
    this.examService.updateQuestionContentAtExam(examId, question)
  }

  async addAnswer(examId: string, questionId: string, answer: AnswerType): Promise<any> {
    const target = `${this.baseUrl}/${this.apiPrefix}/addAnswer/${examId}`;
    const {id: answerId} = await this.http.put<any>(target, { ...answer, questionId }).toPromise();
    this.examService.addAnswerToQuestion(examId, questionId, {...answer, answerId});
  }

  async updateAnswer(examId: string, questionId: string, answer: AnswerType): Promise<any> {
    const target = `${this.baseUrl}/${this.apiPrefix}/editAnswer/${examId}`;
    await this.http.put<any>(target, { ...answer, questionId }).toPromise();
    this.examService.updateAnswerWithinQuestion(examId, questionId, answer);
  }

  async removeAnswer(examId: string, questionId: string, answerId: string): Promise<any> {
    const target = `${this.baseUrl}/${this.apiPrefix}/removeAnswer/${examId}`;
    await this.http.delete<any>(target, { body: { questionId, answerId } }).toPromise();
    this.examService.deleteAnswerWithinQuestion(examId, questionId, answerId)
  }

  async removeQuestion(examId: string, questionId: string): Promise<any> {
    const target = `${this.baseUrl}/${this.apiPrefix}/removeQuestion/${examId}`;
    await this.http.delete<any>(target, { body: { questionId } }).toPromise();
    this.examService.deleteQuestion(examId, questionId)
  }

  async deleteExam(examId: string): Promise<any> {
    const target = `${this.baseUrl}/${this.apiPrefix}/deleteExam/${examId}`;
    await this.http.delete<any>(target, { body: { authorId: this.teacherId } }).toPromise();
    this.examService.deleteExam(examId);
  }
}
