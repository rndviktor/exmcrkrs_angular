import {Component} from '@angular/core';
import {Exam} from '../exam/exam';
import {TitleEdit} from '../../write/title-edit/title-edit';
import {ExamService} from '../../../services/exam-service';

@Component({
  selector: 'app-examlist',
  imports: [
    Exam,
    TitleEdit,
  ],
  template: `
    <ul>
      @for (ex of exams; track ex.examId) {
        <app-exam [exam]="ex"
                  (deleted)="deletionHandler()"
        />
      }
    </ul>
    <div class="flex flex-col p-8">
      @if (addExamMode) {
        <div class="flex flex-row">
          <app-title-edit class="flex-1" (addFinish)="handleDiscardTitleEdit()"/>
        </div>
      } @else {
        <button id="addExamButton" class="bg-indigo-200 hover:bg-indigo-400 flex-none shadow-xl"
                (click)="handleAddExamClick()">Add Exam
        </button>
      }
    </div>
  `
})
export class Examlist {
  addExamMode: boolean = false;

  get exams() {
    return this.examService.exams();
  }

  constructor(private examService: ExamService) {
    this.examService.reload();
    this.handleListUpdate();
  }

  handleAddExamClick() {
    this.addExamMode = true;
  }

  handleDiscardTitleEdit() {
    this.addExamMode = false;
  }

  deletionHandler() {
    this.handleListUpdate();
  }

  handleListUpdate() {
    this.addExamMode = false;
    // this.editedExamId = null;
  }
}
