import { Component } from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {ExamType, Reader} from '../../../services/reader';
import {Exam} from '../exam/exam';
import {TitleEdit} from '../../write/title-edit/title-edit';

@Component({
  selector: 'app-examlist',
  imports: [
    Exam,
    TitleEdit
  ],
  template: `
    <ul>
      @for (ex of exams; track ex.examId) {
        <app-exam [exam]="ex"
                  (listNeedsUpdate)="handleListUpdate()"
                  (examTitleTriggerEdit)="handleExamTitleDoubleClick($event)"
                  [currentlyEditedTitleExamId]="editedExamId"
                  (discardTitleEdit)="handleDiscardTitleEdit()" />
      }
    </ul>
    <div class="flex flex-col p-8">
      @if (addExamMode) {
        <div class="flex flex-row justify-between w-11/12">
          <app-title-edit (discardCalled)="handleDiscardTitleEdit()" (submitSucceed)="handleListUpdate()"/>
        </div>
      } @else if (!editedExamId) {
        <button class="bg-indigo-200 hover:bg-indigo-400 flex-none shadow-xl" (click)="handleAddExamClick()">Add Exam</button>
      }
    </div>
  `
})
export class Examlist {
  private destroy$ = new Subject<void>();
  addExamMode: boolean = false;
  editedExamId: string|null = null;

  exams: ExamType[] = [];
  constructor(private reader: Reader) {
    this.handleListUpdate();
  }

  handleAddExamClick() {
    this.addExamMode = true;
  }

  handleDiscardTitleEdit() {
    this.addExamMode = false;
    this.editedExamId = null;
  }

  handleExamTitleDoubleClick(examId: string) {
    this.editedExamId = examId;
  }

  handleListUpdate() {
    this.reader.getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        console.log('received', data);
        this.exams = data.exams;
      });
    this.addExamMode = false;
    this.editedExamId = null;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
