import {ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {Subject, Subscription, takeUntil} from 'rxjs';
import {ExamType, Reader} from '../../../services/reader';
import {Exam} from '../exam/exam';
import {TitleEdit} from '../../write/title-edit/title-edit';
import {SseService} from '../../../services/sse-service';
import {ApiStatus} from '../api-status/api-status';

@Component({
  selector: 'app-examlist',
  imports: [
    Exam,
    TitleEdit,
    ApiStatus
  ],
  template: `
    <app-api-status />
    <br/>
    <ul>
      @for (ex of exams; track ex.examId) {
        <app-exam [exam]="ex"
                  (examTitleTriggerEdit)="handleExamTitleDoubleClick($event)"
                  [currentlyEditedTitleExamId]="editedExamId"
                  (discardTitleEdit)="handleDiscardTitleEdit()" />
      }
    </ul>
    <div class="flex flex-col p-8">
      @if (addExamMode) {
        <div class="flex flex-row justify-between w-11/12">
          <app-title-edit (discardCalled)="handleDiscardTitleEdit()" />
        </div>
      } @else if (!editedExamId) {
        <button class="bg-indigo-200 hover:bg-indigo-400 flex-none shadow-xl" (click)="handleAddExamClick()">Add Exam</button>
      }
    </div>
  `
})
export class Examlist implements OnDestroy {
  private destroy$ = new Subject<void>();
  addExamMode: boolean = false;
  editedExamId: string|null = null;
  private subscription?: Subscription;

  exams: ExamType[] = [];
  constructor(private reader: Reader, private sseService: SseService, private cdr: ChangeDetectorRef) {
    this.handleListUpdate();

    this.subscription = this.sseService
      .observeMessagesToAuthor()
      .subscribe(
        message => {
          console.log("sse message:", message);
          this.handleListUpdate();
        },
        err => console.error('SSE error', err)
      );
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
        console.log('received', data.exams);
        this.exams = data.exams;
        this.cdr.detectChanges();
      });
    this.addExamMode = false;
    this.editedExamId = null;
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
