import { Component, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ExamType, PaymentConfirmationSubmission } from '../../../types';
import { Reader } from '../../../services/reader';
import { Router } from '@angular/router';
import { Writer } from '../../../services/writer';
import { ExamSelect } from '../exam-select/exam-select';
import { SubmissionsView } from '../submissions-view/submissions-view';
import { PaymentConfirmation } from '../payment-confirmation/payment-confirmation';
import { environment } from '../../../../environments/environment';
import { SubmissionTracker } from '../../../services/submission-tracker';

@Component({
  selector: 'app-main-view',
  imports: [
    ExamSelect,
    SubmissionsView,
    PaymentConfirmation
  ],
  template: `
    @if (!storedSubmissions) {
      <app-exam-select [exams]="exams" (examSelected)="startExam($event)"/>
    } @else {
      <ul id="tab_selector" class="flex border-b">
        @for (tab of tabs; track tab) {
          <li
            (click)="selectTab(tab)"
            [class.border-blue-500]="tab === activeTab"
            [class.text-blue-500]="tab === activeTab"
            class="cursor-pointer px-4 py-2 border-b-2">
            {{ tab }}
          </li>
        }
      </ul>

      <div class="p-4">
        @if (activeTab === 'Exams') {
          <app-exam-select [exams]="exams" (examSelected)="startExam($event)"/>
        }
        @if (activeTab === 'Submissions') {
          <app-submissions-view/>
        }
      </div>
    }
    <app-payment-confirmation [code]="accessCode" [publishableKey]="publishableKey" [visible]="paymentVisible"
                              [errorMessage]="errorMessage"
                              (cancel)="handleCancel($event)"
                              (confirmed)="handleConfirmation($event)"/>
  `
})
export class MainView implements OnDestroy {
  private destroy$ = new Subject<void>();
  paymentVisible = false;
  accessCode: string | null | undefined;
  publishableKey: string | null | undefined;
  errorMessage: string | null | undefined;
  startExamId: string | null | undefined;

  tabs = ['Exams', 'Submissions'];
  activeTab = this.tabs[0];

  selectTab = (tab: string) => {
    this.activeTab = tab;
  }

  storedSubmissions = false
  exams: ExamType[] = [];

  constructor(private reader: Reader, private router: Router, private writer: Writer, private submissionTracker: SubmissionTracker) {
    this.handleListUpdate()
  }

  handleListUpdate() {
    this.reader.getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        console.log('received', data);
        if (data) {
          if (!this.submissionTracker.getQuestionNavigatedFlag() && data.ExamInProcess) {
            const { ExamSubmissionId, QuestionId } = data.ExamInProcess;
            this.router.navigate([ExamSubmissionId, 'question', QuestionId])
          }
          this.exams = data.Exams.map((item: any) => {
            return { ...item, composeKey: `${item.examId}_${item.version}` }
          });
          this.storedSubmissions = data.StoredSubmissions;
        } else {
          this.storedSubmissions = false;
          this.exams = [];
        }
      });
  }

  startExam(examIdSubmit: string) {
    const ex = this.exams.find(x => x.ExamId === examIdSubmit);
    if (ex) {
      const { ExamId } = ex
      this.startExamId = ExamId;
      if (environment.studentCmdUrl) {
        this.submitCode();
      } else {
        this.startSelectedExam();
      }
    }
  }

  startSelectedExam() {
    console.log('direct Start')
    this.writer.startExam(this.startExamId!).then(resp => this.startSucceeded(resp));
  }

  handleConfirmation(confirmed: PaymentConfirmationSubmission) {
    this.paymentVisible = false;
    this.submitCode(confirmed);
  }

  handleCancel(event: any) {
    this.paymentVisible = false;
  }

  startSucceeded(resp: any) {
    console.log(resp);
    this.startExamId = null;
    this.accessCode = null;
    this.errorMessage = null;
    this.publishableKey = null;
    if (resp && resp.SubmissionInProcess) {
      this.router.navigate([resp.SubmissionInProcess.ExamSubmissionId, 'question'])
    }
  }

  submitCode(confirmation: PaymentConfirmationSubmission | null = null) {
    console.log('---call with payment!', this.startExamId!, '[', confirmation, ']')
    this.writer.attemptToStartTheExam(this.startExamId!, confirmation)
      .then(resp => {
        console.log('received', resp);
        if (resp.PaymentRequired) {
          this.accessCode = confirmation?.AccessCode;
          this.errorMessage = resp.PaymentRequired.Message;
          this.publishableKey = resp.PaymentRequired.PublishableKey;
          this.paymentVisible = true;
        } else {
          this.startSucceeded(resp);
        }
      })
      .catch(err => {
        console.error(err)
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
