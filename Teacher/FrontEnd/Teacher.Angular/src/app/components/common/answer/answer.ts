import {Component, EventEmitter, Input, Output} from '@angular/core';
import { AnswerType } from 'src/app/services/reader';
import {XButton} from '../iconed/x-button';
import {Confirmation} from '../confirmation/confirmation';
import {Writer} from '../../../services/writer';

@Component({
  selector: 'app-answer',
  imports: [
    XButton,
    Confirmation
  ],
  template: `
    <div class="flex flex-row justify-between">
      <div class="flex flex-row"><div>{{answer.content}}</div><br/><div>___IsCorrect={{answer.isCorrect}}</div></div>
      <app-x-button class="col-span-1" (click)="handleDeleteCall($event)"/>
    </div>

    <app-confirmation [visible]="confirmAnswerVisible" [message]="'Do you really want to delete this answer?'" (confirmed)="handleConfirmation($event)" />
  `
})
export class Answer {
  @Input() examId!: string;
  @Input() questionId!: string;
  @Input() answer!: AnswerType;
  @Output() questionNeedsUpdate = new EventEmitter<boolean>();

  confirmAnswerVisible = false;

  constructor(private writer: Writer) {
  }
  handleDeleteCall(data: any) {
    this.confirmAnswerVisible = true;
  }
  handleConfirmation(confirmed: boolean) {
    this.confirmAnswerVisible = false;
    if (confirmed) {
      this.writer.removeAnswer(this.examId!, this.questionId!, this.answer.answerId!).then(response => {
        console.log('got response', response);
        this.questionNeedsUpdate.emit(true);
      })
    } else {
      // Cancelled
      console.log('Delete cancelled');
    }
  }
}
