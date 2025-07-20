import {Component, Input} from '@angular/core';
import {QuestionType} from '../../../services/reader';
import {CommonModule} from '@angular/common';
import {Answer} from '../answer/answer';
import {PencilButton} from '../iconed/pencil-button';
import {XButton} from '../iconed/x-button';
import {Router} from '@angular/router';

@Component({
  selector: 'app-question',
  imports: [
    CommonModule,
    Answer,
    PencilButton,
    XButton
  ],
  template: `
    <div class="p-4 bg-indigo-100">
      <div class="grid grid-cols-12 gap-4">
        <h2 class="col-span-10 text-3xl outline bg-white">{{question.content}}</h2>
        <app-pencil-button class="col-span-1" (click)="editQuestionRoute()"/>
        <app-x-button class="col-span-1"/>
      </div>
      <ul>
        @for (ans of question.answers; track ans.answerId) {
          <li><app-answer [answer]="ans" /></li>
        }
      </ul>
    </div>
  `,
})
export class Question {
  @Input() question!: QuestionType;

  @Input() examId: string | null = null;

  constructor(private router: Router) {
  }

  editQuestionRoute() {
    this.router.navigate(['exam', this.examId, 'editQuestion', this.question.questionId]);
  }
}
