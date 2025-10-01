import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Confirmation} from '../confirmation/confirmation';
import {Writer} from '../../../services/writer';
import {CheckboxComponent} from '../iconed/checkbox';
import {TrashButton} from '../iconed/trash-button';
import {AnswerType} from "../../../types";
import {ExamService} from '../../../services/exam-service';

@Component({
  selector: 'app-answer',
  imports: [
    Confirmation,
    CheckboxComponent,
    TrashButton
  ],
  template: `
    <div class="flex flex-row">
      <div class="flex flex-row justify-between items-center flex-1" (dblclick)="handleDoubleClick()">
        <div class="px-3">{{ answer.content }}</div>
        <app-checkbox [id]="answer.answerId" [disabled]="true" [checked]="answer.isCorrect"/>
      </div>
      @if (editable) {
        <app-trash-button [disabled]="disableDeletion" class="col-span-1" (click)="handleDeleteCall($event)"/>
      }
    </div>

    <app-confirmation [visible]="confirmAnswerVisible" [message]="'Do you really want to delete this answer?'"
                      (confirmed)="handleConfirmation($event)"/>
  `
})
export class Answer {
  @Input() examId!: string;
  @Input() questionId!: string;
  @Input() answer!: AnswerType;
  @Input() editable = true;
  @Input() disableDeletion = false;
  @Output() questionTriggerEdit = new EventEmitter<string>();
  @Output() deleted = new EventEmitter<boolean>();

  confirmAnswerVisible = false;

  constructor(private writer: Writer, private examService: ExamService) {
  }

  handleDeleteCall(data: any) {
    this.confirmAnswerVisible = true;
  }

  handleDoubleClick(): void {
    console.log('clicked twice');
    this.questionTriggerEdit.emit(this.answer.answerId!);
  }

  async handleConfirmation(confirmed: boolean) {
    this.confirmAnswerVisible = false;
    if (confirmed) {
      await this.writer.removeAnswer(this.examId!, this.questionId!, this.answer.answerId!);
      this.examService.deleteAnswerWithinQuestion(this.examId!, this.questionId!, this.answer.answerId!)
      this.deleted.emit(true);
    } else {
      // Cancelled
      console.log('Delete cancelled');
    }
  }
}
