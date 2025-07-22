import {Component, EventEmitter, Input, Output} from '@angular/core';
import { AnswerType } from 'src/app/services/reader';
import {Confirmation} from '../confirmation/confirmation';
import {Writer} from '../../../services/writer';
import {CheckboxComponent} from '../iconed/checkbox';
import {TrashButton} from '../iconed/trash-button';

@Component({
  selector: 'app-answer',
  imports: [
    Confirmation,
    CheckboxComponent,
    TrashButton
  ],
  template: `
    <div class="flex flex-row justify-between w-11/12">
        <div class="flex flex-row justify-between items-center w-11/12" (dblclick)="handleDoubleClick()" >
          <div class="px-3">{{answer.content}}</div>
          <app-checkbox [id]="answer.answerId" [disabled]="true"  [checked]="answer.isCorrect"/>
        </div>
      <app-trash-button [disabled]="disableDeletion" class="col-span-1" (click)="handleDeleteCall($event)"/>
    </div>

    <app-confirmation [visible]="confirmAnswerVisible" [message]="'Do you really want to delete this answer?'" (confirmed)="handleConfirmation($event)" />
  `
})
export class Answer {
  @Input() examId!: string;
  @Input() questionId!: string;
  @Input() answer!: AnswerType;
  @Input() disableDeletion = false;
  @Output() questionNeedsUpdate = new EventEmitter<boolean>();
  @Output() questionTriggerEdit = new EventEmitter<string>();

  confirmAnswerVisible = false;

  constructor(private writer: Writer) {
  }
  handleDeleteCall(data: any) {
    this.confirmAnswerVisible = true;
  }

  handleDoubleClick(): void {
    console.log('clicked twice');
    this.questionTriggerEdit.emit(this.answer.answerId!);
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
