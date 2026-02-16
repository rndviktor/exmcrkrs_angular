import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {AnswerType, ExamType, QuestionType} from "../types";
import {ExamService} from './exam-service';
import {firstValueFrom} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Writer {
  private apiPrefix: string = 'api/v1';

  constructor(private http: HttpClient, private examService: ExamService) {}

  async createExam(exam: ExamType) {
    const target = `${environment.teacherCmdUrl}/${this.apiPrefix}/newExam`;
    const {Id: examId} = await firstValueFrom(this.http.post<any>(target, {...exam, authorId: environment.teacherId}));
    this.examService.addExam({...exam, ExamId: examId})
  }

  async updateExamTitle(exam: ExamType) {
    const target = `${environment.teacherCmdUrl}/${this.apiPrefix}/editExamTitle/${exam.ExamId!}`;
    await firstValueFrom(this.http.put<any>(target, {authorId: environment.teacherId, title: exam.Title }));
    this.examService.updateExamTitle(exam);
  }

  async assignAccessCode(exam: ExamType) {
    const target = `${environment.teacherCmdUrl}/${this.apiPrefix}/assignAccessCode/${exam.ExamId!}`;
    await firstValueFrom(this.http.put<any>(target, {authorId: environment.teacherId, accessCode: exam.AccessCode! }));
    this.examService.updateExamAccessCode(exam)
  }

  async postQuestion(examId: string, question: any): Promise<any> {
    const target = `${environment.teacherCmdUrl}/${this.apiPrefix}/addQuestion/${examId}`;
    const {Id} = await firstValueFrom(this.http.put<any>(target, question));
    this.examService.addQuestionToExam(examId, {QuestionId: Id, Content: question.content});
    return Id;
  }

  async updateQuestionContent(examId: string, question: QuestionType){
    const target = `${environment.teacherCmdUrl}/${this.apiPrefix}/editQuestionContent/${examId}`;
    await firstValueFrom(this.http.put<any>(target, question));
    this.examService.updateQuestionContentAtExam(examId, question)
  }

  async addAnswer(examId: string, questionId: string, answer: AnswerType): Promise<any> {
    const target = `${environment.teacherCmdUrl}/${this.apiPrefix}/addAnswer/${examId}`;
    const {Id: answerId} = await firstValueFrom(this.http.put<any>(target, { ...answer, questionId }));
    this.examService.addAnswerToQuestion(examId, questionId, {...answer, AnswerId: answerId});
  }

  async updateAnswer(examId: string, questionId: string, answer: AnswerType): Promise<any> {
    const target = `${environment.teacherCmdUrl}/${this.apiPrefix}/editAnswer/${examId}`;
    await firstValueFrom(this.http.put<any>(target, { ...answer, questionId }));
    this.examService.updateAnswerWithinQuestion(examId, questionId, answer);
  }

  async removeAnswer(examId: string, questionId: string, answerId: string): Promise<any> {
    const target = `${environment.teacherCmdUrl}/${this.apiPrefix}/removeAnswer/${examId}`;
    await firstValueFrom(this.http.delete<any>(target, { body: { questionId, answerId } }));
    this.examService.deleteAnswerWithinQuestion(examId, questionId, answerId)
  }

  async removeQuestion(examId: string, questionId: string): Promise<any> {
    const target = `${environment.teacherCmdUrl}/${this.apiPrefix}/removeQuestion/${examId}`;
    await firstValueFrom(this.http.delete<any>(target, { body: { questionId } }));
    this.examService.deleteQuestion(examId, questionId)
  }

  async deleteExam(examId: string): Promise<any> {
    const target = `${environment.teacherCmdUrl}/${this.apiPrefix}/deleteExam/${examId}`;
    await firstValueFrom(this.http.delete<any>(target, { body: { authorId: environment.teacherId } }));
    this.examService.deleteExam(examId);
  }
}
