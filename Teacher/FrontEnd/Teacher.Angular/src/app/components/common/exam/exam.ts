import {Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ExamType} from '../../../services/reader';
import {Question} from '../question/question';
import {Router} from '@angular/router';
import {Confirmation} from '../confirmation/confirmation';
import {Writer} from '../../../services/writer';
import {TrashButton} from '../iconed/trash-button';
import {TitleEdit} from '../../write/title-edit/title-edit';

@Component({
  selector: 'app-exam',
  imports: [
    Question,
    CommonModule,
    Confirmation,
    TrashButton,
    TitleEdit,
  ],
  template: `<div class="flex flex-col p-8 ">
    <div class="flex flex-row justify-between">
      @if (this.exam.examId !== currentlyEditedTitleExamId) {
        <h3 class="text-3xl font-bold" (dblclick)="handleDoubleClick()">{{exam.title}}</h3>
        <app-trash-button class="col-span-1" (click)="handleDeleteCall()"/>
      } @else {
        <app-title-edit [exam]="exam"  (discardCalled)="handleDiscardTitleEdit()" />
      }
    </div>
    <ul>
      @for (question of exam.questions; track question.questionId) {
        <li><app-question [question]="question" [examId]="exam.examId" (deleted)="onDeleted()" /></li>
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
  @Input() currentlyEditedTitleExamId: string|null = null;
  @Output() examTitleTriggerEdit = new EventEmitter<string>();
  @Output() discardTitleEdit = new EventEmitter<boolean>();
  @Output() deleted = new EventEmitter<boolean>();

  confirmMainVisible = false;
  addQuestionRoute() {
    this.router.navigate(['exam', this.exam.examId, 'addQuestion']);
  }

  onDeleted() {
    this.deleted.emit(true);
  }

  handleDeleteCall() {
    this.confirmMainVisible = true;
  }

  handleDoubleClick(): void {
    console.log('clicked twice exam');
    this.examTitleTriggerEdit.emit(this.exam.examId!);
  }

  handleDiscardTitleEdit(): void {
    this.discardTitleEdit.emit(true);
  }

  async handleConfirmation(confirmed: boolean) {
    this.confirmMainVisible = false;
    if (confirmed) {
      await this.writer.deleteExam(this.exam.examId!);
      this.onDeleted();
    } else {
      // Cancelled
      console.log('Delete exam cancelled');
    }
  }
}
