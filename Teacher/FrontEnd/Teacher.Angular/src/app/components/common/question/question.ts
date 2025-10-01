import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Answer} from '../answer/answer';
import {PencilButton} from '../iconed/pencil-button';
import {Router} from '@angular/router';
import {Confirmation} from '../confirmation/confirmation';
import {Writer} from '../../../services/writer';
import {TrashButton} from '../iconed/trash-button';
import {QuestionType} from "../../../types";
import {ExamService} from '../../../services/exam-service';

@Component({
  selector: 'app-question',
  imports: [
    CommonModule,
    Answer,
    PencilButton,
    Confirmation,
    TrashButton
  ],
  template: `
    <div class="p-4 bg-indigo-100">
      <div class="flex flex-row">
        <div class="flex-1 text-gray-400 text-sm">{{ question.questionId }}</div>
        <div>
          <app-pencil-button class="col-span-1 p-8" (click)="editQuestionRoute()"/>
          <app-trash-button class="col-span-1" (click)="handleDeleteCall()"/>
        </div>
      </div>
      <div class="flex flex-row">
        <div class="whitespace-pre-line flex-1 bg-white">{{ question.content }}</div>
      </div>
      <ul>
        @for (ans of question.answers; track ans.answerId) {
          <li>
            <app-answer [answer]="ans" [editable]=false [examId]="examId!" [questionId]="question.questionId!"/>
          </li>
        }
      </ul>
    </div>
    <app-confirmation [visible]="confirmQuestionVisible" [message]="'Do you really want to delete this question?'"
                      (confirmed)="handleConfirmation($event)"/>
  `,
})
export class Question {
  @Input() question!: QuestionType;
  @Input() examId: string | null = null;
  @Output() deleted = new EventEmitter<boolean>();

  onDeleted() {
    this.deleted.emit(true);
  }

  confirmQuestionVisible = false;

  constructor(private router: Router, private writer: Writer, private examService: ExamService) {
  }

  handleDeleteCall() {
    this.confirmQuestionVisible = true;
  }

  async handleConfirmation(confirmed: boolean) {
    this.confirmQuestionVisible = false;
    if (confirmed) {
      await this.writer.removeQuestion(this.examId!, this.question.questionId!);
      this.examService.deleteQuestion(this.examId!, this.question.questionId!)
      this.onDeleted();
    } else {
      // Cancelled
      console.log('Delete question cancelled');
    }
  }

  editQuestionRoute() {
    this.router.navigate(['exam', this.examId, 'editQuestion', this.question.questionId]);
  }
}
