import {Component, Input, input, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ExamType} from '../../../services/reader';
import {Question} from '../question/question';

@Component({
  selector: 'app-exam',
  imports: [
    Question,
    CommonModule,
  ],
  template: `<div class="flex flex-col p-8 ">
    <h3 class="text-3xl font-bold">{{exam.title}}</h3>
    <ul>
      @for (question of exam.questions; track question.id) {
        <li><app-question [question]="question" /></li>
      }
    </ul>
    <button class="bg-indigo-200 hover:bg-indigo-400 flex-none shadow-xl">Add Question</button>
  </div>`
})
export class Exam {
  @Input() exam!: ExamType;


}
