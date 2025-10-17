import {Component, Input} from '@angular/core';
import {CheckboxComponent} from '../iconed/checkbox';
import {AnswerType} from "../../../types";

@Component({
  selector: 'app-answer',
  imports: [
    CheckboxComponent
  ],
  template: `
    <div class="flex flex-row">
      <div class="flex flex-row justify-items-start flex-1 text-gray-600">
        <app-checkbox class="flex justify-baseline" [id]="answer.answerId" [disabled]="true"
                      [checked]="answer.isCorrect"/>
        <div class="px-3 flex-1 whitespace-pre-wrap ">{{ answer.content }}</div>
      </div>
    </div>
  `
})
export class Answer {
  @Input() examId!: string;
  @Input() questionId!: string;
  @Input() answer!: AnswerType;
}
