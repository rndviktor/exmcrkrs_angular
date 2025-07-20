import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ExamType} from '../../../services/reader';
import {Question} from '../question/question';
import {Router} from '@angular/router';

@Component({
  selector: 'app-exam',
  imports: [
    Question,
    CommonModule,
  ],
  template: `<div class="flex flex-col p-8 ">
    <h3 class="text-3xl font-bold">{{exam.title}}</h3>
    <ul>
      @for (question of exam.questions; track question.questionId) {
        <li><app-question [question]="question" [examId]="exam.examId"/></li>
      }
    </ul>
    <button class="bg-indigo-200 hover:bg-indigo-400 flex-none shadow-xl" (click)="addQuestionRoute()">Add Question</button>
  </div>`
})
export class Exam {
  constructor(private router: Router) {
  }

  @Input() exam!: ExamType;

  addQuestionRoute() {
    this.router.navigate(['exam', this.exam.examId, 'addQuestion']);
  }
}
