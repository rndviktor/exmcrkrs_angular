import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {QuestionType} from '../../../services/reader';
import {CommonModule} from '@angular/common';
import {Answer} from '../answer/answer';
import {PencilButton} from '../iconed/pencil-button';
import {Router} from '@angular/router';
import {Confirmation} from '../confirmation/confirmation';
import {Writer} from '../../../services/writer';
import {TrashButton} from '../iconed/trash-button';

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
      <div class="w-full text-gray-400 text-sm">{{question.questionId}}</div>
      <div class="grid grid-cols-12 gap-4">
        <div class="whitespace-pre-line col-span-10 bg-white">{{question.content}}</div>
        <app-pencil-button class="col-span-1" (click)="editQuestionRoute()"/>
        <app-trash-button class="col-span-1" (click)="handleDeleteCall()"/>
      </div>
      <ul>
        @for (ans of question.answers; track ans.answerId) {
          <li><app-answer [answer]="ans" [examId]="examId!" [questionId]="question.questionId!" (deleted)="onDeleted()"/></li>
        }
      </ul>
    </div>
    <app-confirmation [visible]="confirmQuestionVisible" [message]="'Do you really want to delete this question?'" (confirmed)="handleConfirmation($event)" />
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

  constructor(private router: Router, private writer: Writer) {
  }

  handleDeleteCall() {
    this.confirmQuestionVisible = true;
  }

  async handleConfirmation(confirmed: boolean) {
    this.confirmQuestionVisible = false;
    if (confirmed) {
      await this.writer.removeQuestion(this.examId!, this.question.questionId!);
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
