import {Component} from '@angular/core';
import {Exam} from '../exam/exam';
import {TitleEdit} from '../../write/title-edit/title-edit';
import {ApiStatus} from '../api-status/api-status';
import {ExamService} from '../../../services/exam-service';

@Component({
  selector: 'app-examlist',
  imports: [
    Exam,
    TitleEdit,
    ApiStatus
  ],
  template: `
    <app-api-status (backendAvailable)="handleBackendAvailable($event)"
                    (publishAvailable)="handlePubslishAvailable($event)"/>
    <br/>
    @if (backendAvailable) {
      <ul>
        @for (ex of exams; track ex.examId) {
          <app-exam [exam]="ex"
                    (examTitleTriggerEdit)="handleExamTitleDoubleClick($event)"
                    [currentlyEditedTitleExamId]="editedExamId"
                    [publishAvailable]="publishAvailable"
                    (discardTitleEdit)="handleDiscardTitleEdit()"
                    (deleted)="deletionHandler()"
          />
        }
      </ul>
      <div class="flex flex-col p-8">
        @if (addExamMode) {
          <div class="flex flex-row justify-between w-11/12">
            <app-title-edit (discardCalled)="handleDiscardTitleEdit()"/>
          </div>
        } @else if (!editedExamId) {
          <button id="addExamButton" class="bg-indigo-200 hover:bg-indigo-400 flex-none shadow-xl"
                  (click)="handleAddExamClick()">Add Exam
          </button>
        }
      </div>
    }
  `
})
export class Examlist {
  addExamMode: boolean = false;
  editedExamId: string | null = null;
  backendAvailable: boolean = false;
  publishAvailable: boolean = false;

  get exams() {
    return this.examService.exams();
  }

  constructor(private examService: ExamService) {
    this.handleListUpdate();
  }

  handleBackendAvailable(available: boolean) {
    if (!this.backendAvailable && available) {
      this.examService.reload();
      this.handleListUpdate()
    }
    this.backendAvailable = available;
  }

  handlePubslishAvailable(available: boolean) {
    this.publishAvailable = available;
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

  deletionHandler() {
    this.handleListUpdate();
  }

  handleListUpdate() {
    this.addExamMode = false;
    this.editedExamId = null;
  }
}
