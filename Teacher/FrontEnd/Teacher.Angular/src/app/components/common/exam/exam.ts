import {Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ExamType} from '../../../services/reader';
import {Question} from '../question/question';
import {Router} from '@angular/router';
import {Confirmation} from '../confirmation/confirmation';
import {XButton} from '../iconed/x-button';
import {Writer} from '../../../services/writer';

@Component({
  selector: 'app-exam',
  imports: [
    Question,
    CommonModule,
    Confirmation,
    XButton,
  ],
  template: `<div class="flex flex-col p-8 ">
    <div class="flex flex-row justify-between">
      <h3 class="text-3xl font-bold">{{exam.title}}</h3>
      <app-x-button class="col-span-1" (click)="handleDeleteCall()"/>
    </div>
    <ul>
      @for (question of exam.questions; track question.questionId) {
        <li><app-question [question]="question" [examId]="exam.examId" (examNeedsUpdate)="handleNeedUpdate()" /></li>
      }
    </ul>
    <button class="bg-indigo-200 hover:bg-indigo-400 flex-none shadow-xl" (click)="addQuestionRoute()">Add Question</button>
  </div>
  <app-confirmation [visible]="confirmMainVisible" [message]="'Do you really want to delete this exam!'" (confirmed)="handleConfirmation($event)" />
  `
})
export class Exam {
  constructor(private router: Router, private writer: Writer) {
  }

  @Input() exam!: ExamType;
  @Output() listNeedsUpdate = new EventEmitter<boolean>();

  confirmMainVisible = false;
  addQuestionRoute() {
    this.router.navigate(['exam', this.exam.examId, 'addQuestion']);
  }

  handleDeleteCall() {
    this.confirmMainVisible = true;
  }

  handleNeedUpdate() {
    this.listNeedsUpdate.emit(true);
  }

  handleConfirmation(confirmed: boolean) {
    this.confirmMainVisible = false;
    if (confirmed) {
      this.writer.deleteExam(this.exam.examId!).then(resp => {
        console.log('got exam deletion resp:', resp);
        this.handleNeedUpdate();
      })
    } else {
      // Cancelled
      console.log('Delete exam cancelled');
    }
  }
}
