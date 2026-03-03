import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AnswerType} from '../../../types';
import {Checkbox, SelectionChangedEvent} from '../checkbox/checkbox';

@Component({
  selector: 'app-answer',
  imports: [
    Checkbox
  ],
  template: `
    <div class="flex flex-row justify-between flex-1">
      <div class="flex flex-row items-center flex-1">
        <app-checkbox class="px-5" [id]="answer.AnswerId" [checked]="checked" (checkedChange)="change($event)"/>
        <div class="p-0.5 flex-1 whitespace-pre-wrap">{{ answer.Content }}</div>
      </div>
    </div>
  `
})
export class Answer {
  @Input() answer!: AnswerType;
  @Input() checked = false;

  @Output() checkedChange: EventEmitter<SelectionChangedEvent> = new EventEmitter<SelectionChangedEvent>();

  change(value: SelectionChangedEvent) {
    this.checkedChange.emit(value);
  }
}
