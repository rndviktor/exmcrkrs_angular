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
    <app-api-status (backendAvailable)="handleBackendAvailable($event)" (publishAvailable)="handlePubslishAvailable($event)"/>
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
            <app-title-edit (discardCalled)="handleDiscardTitleEdit()" />
          </div>
        } @else if (!editedExamId) {
          <button class="bg-indigo-200 hover:bg-indigo-400 flex-none shadow-xl" (click)="handleAddExamClick()">Add Exam</button>
        }
      </div>
    }
  `
})
export class Examlist implements OnDestroy {
  private destroy$ = new Subject<void>();
  addExamMode: boolean = false;
  editedExamId: string|null = null;
  private subscription?: Subscription;
  backendAvailable: boolean = false;
  publishAvailable: boolean = false;

  exams: ExamType[] = [];
  constructor(private reader: Reader, private sseService: SseService, private cdr: ChangeDetectorRef) {
    this.handleListUpdate();

    this.subscription = this.sseService
      .observeMessagesToAuthor()
      .subscribe(
        () => {
          this.handleListUpdate();
        },
        err => console.error('SSE error', err)
      );
  }

  handleBackendAvailable(available: boolean) {
    if (!this.backendAvailable && available) {
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
    this.reader.getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        console.log('received', data?.exams);
        this.exams = data?.exams ? data.exams : null;
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
