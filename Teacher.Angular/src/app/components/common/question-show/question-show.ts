import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Answer } from '../answer/answer';
import { PencilButton } from '../iconed/pencil-button';
import { Router } from '@angular/router';
import { Confirmation } from '../confirmation/confirmation';
import { Writer } from '../../../services/writer';
import { TrashButton } from '../iconed/trash-button';
import { QuestionType } from "../../../types";

@Component({
  selector: 'app-question-show',
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
        <div class="flex-1 text-gray-400 text-sm">{{ question.QuestionId }}</div>
        <div>
          <app-pencil-button class="col-span-1 p-8" (click)="editQuestionRoute()"/>
          <app-trash-button class="col-span-1" (click)="handleDeleteCall()"/>
        </div>
      </div>
      <div class="flex flex-row">
        <div class="whitespace-pre-line flex-1 bg-white question-content" [innerHTML]="question.Content"></div>
      </div>
      <ul>
        @for (ans of question.Answers; track ans.AnswerId; let even = $even) {
          <li [class.bg-indigo-100]="even" [class.bg-indigo-200]="!even">
            <app-answer [answer]="ans" [examId]="examId!" [questionId]="question.QuestionId!"/>
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

  constructor(private router: Router, private writer: Writer) {
  }

  handleDeleteCall() {
    this.confirmQuestionVisible = true;
  }

  async handleConfirmation(confirmed: boolean) {
    this.confirmQuestionVisible = false;
    if (confirmed) {
      await this.writer.removeQuestion(this.examId!, this.question.QuestionId!);
      this.onDeleted();
    } else {
      // Cancelled
      console.log('Delete question cancelled');
    }
  }

  editQuestionRoute = async () => {
    await this.router.navigate(['exam', this.examId, 'editQuestion', this.question.QuestionId]);
  }
}
