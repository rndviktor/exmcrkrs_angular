import {Component, Input} from '@angular/core';
import { AnswerType } from 'src/app/services/reader';

@Component({
  selector: 'app-answer',
  imports: [],
  template: `
    <div>{{answer.content}}: IsCorrect={{answer.isCorrect}}</div>
  `
})
export class Answer {
  @Input() answer!: AnswerType;
}
