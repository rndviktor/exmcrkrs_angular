import { Injectable } from '@angular/core';
import {PaymentConfirmationSubmission, QuestionSubmissionSelection} from '../types';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Writer {
  private studentId: string|null = environment.studentId;
  private apiPrefix: string = 'api/v1';

  constructor(private http: HttpClient) {}

  async startExam(examId: string) {
    const target = `${environment.studentCmdUrl}/${this.apiPrefix}/newExamSubmission`;
    return await this.http.post<any>(target, { studentId: this.studentId, examId }).toPromise();
  }

  async attemptToStartTheExam(examId: string, code: PaymentConfirmationSubmission|null = null) {
    let obj: any = {examId}
    if (code != null) {
      obj = {...obj, ...code }
    }
    const target = `${environment.studentCmdUrl}/${this.apiPrefix}/examStart/${this.studentId}`;
    return await this.http.put<any>(target, { ...obj }).toPromise();
  }

  async updateAnswersSelection( examSubmissionId: string, selection: QuestionSubmissionSelection) {
    const target = `${environment.studentCmdUrl}/${this.apiPrefix}/editQuestionSubmission/${examSubmissionId!}`;
    return await this.http.put<any>(target, { ...selection, studentId: this.studentId }).toPromise();
  }

  async createAnswersSelection( examSubmissionId: string, selection: QuestionSubmissionSelection) {
    const target = `${environment.studentCmdUrl}/${this.apiPrefix}/addQuestionSubmission/${examSubmissionId!}`;
    return await this.http.put<any>(target, { ...selection, studentId: this.studentId }).toPromise();
  }

  async finishExam( examSubmissionId: string, selection: QuestionSubmissionSelection ) {
    const target = `${environment.studentCmdUrl}/${this.apiPrefix}/finishExam/${examSubmissionId!}`;
    return await this.http.put<any>(target, { ...selection, studentId: this.studentId }).toPromise();
  }
}
