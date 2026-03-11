import { Component, Input } from '@angular/core';
import { CheckboxComponent } from '../iconed/checkbox';
import { AnswerType } from "../../../types";

@Component({
  selector: 'app-answer',
  imports: [
    CheckboxComponent
  ],
  template: `
    <div class="flex flex-row">
      <div class="flex flex-row justify-items-start flex-1 text-gray-600">
        <app-checkbox class="flex justify-baseline" [id]="answer.AnswerId" [disabled]="true"
                      [checked]="answer.IsCorrect"/>
        <div class="px-3 flex-1 whitespace-pre-wrap ">{{ answer.Content }}</div>
      </div>
    </div>
  `
})
export class Answer {
  @Input() examId!: string;
  @Input() questionId!: string;
  @Input() answer!: AnswerType;
}
