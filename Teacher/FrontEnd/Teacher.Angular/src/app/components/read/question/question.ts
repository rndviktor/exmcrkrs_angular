import {Component, Input} from '@angular/core';
import {QuestionType} from '../../../services/reader';
import {CommonModule} from '@angular/common';
import {Answer} from '../answer/answer';

@Component({
  selector: 'app-question',
  imports: [
    CommonModule,
    Answer
  ],
  template: `
    <div class="p-4 bg-indigo-100">
      <h2 class="text-3xl outline bg-white">{{question.content}}</h2>
      <ul>
        @for (ans of question.answers; track ans.id) {
          <li><app-answer [answer]="ans" /></li>
        }
      </ul>
    </div>
  `,
})
export class Question {
  @Input() question!: QuestionType;
}
