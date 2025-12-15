import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {Confirmation} from '../confirmation/confirmation';
import {Writer} from '../../../services/writer';
import {TrashButton} from '../iconed/trash-button';
import {TitleEdit} from '../../write/title-edit/title-edit';
import {Publisher} from '../../../services/publisher';
import {Subscription} from 'rxjs';
import {ExamType} from "../../../types";
import {AccessCodeEdit} from '../../write/access-code-edit/access-code-edit';
import {Question} from '../question-show/question-show';

@Component({
  selector: 'app-exam',
  imports: [
    Question,
    CommonModule,
    Confirmation,
    TrashButton,
    TitleEdit,
    AccessCodeEdit,
  ],
  template: `
    <div class="flex flex-col p-4 ">
      <div class="flex flex-row">
        <div class="flex flex-col w-full">
          <div class="flex flex-row">
            <app-title-edit class="flex-1" [exam]="exam"/>
            <app-trash-button class="col-span-1" (click)="handleDeleteCall()"/>
          </div>
          <div class="flex flex-row justify-between bg-indigo-200">
            @if (!publishingVersion) {
              <button id="publishExam" class="bg-indigo-200 hover:bg-indigo-400 flex-none shadow-xl m-2"
                      (click)="handlePublishClick()"> Publish exam [{{ exam.examId }} v{{ exam.version }}] to
                students
              </button>
            } @else {
              <div id="publishingMessaging" class="bg-gray-800 m-2 flex-1 p-1"
                   [ngClass]="[isPublishError ? 'text-red-500' : 'text-green-500']">
                {{ publishingMessage }}
              </div>
            }
          </div>
        </div>
      </div>
      @if (exam && exam.questions && exam.questions.length) {
        <div class="flex flex-row justify-between bg-indigo-200">
          <app-access-code-edit [exam]="exam"/>
        </div>
      }
      <ul>
        @for (question of exam.questions; track question.questionId) {
          <li>
            <app-question-show [question]="question" [examId]="exam.examId" (deleted)="onDeleted()"/>
          </li>
        }
      </ul>
      <button id="addQuestionButton" class="bg-indigo-200 hover:bg-indigo-400 flex-none shadow-xl"
              (click)="addQuestionRoute()">Add Question
      </button>
    </div>
    <app-confirmation [visible]="confirmMainVisible" [message]="'Do you really want to delete this exam!'"
                      (confirmed)="handleConfirmation($event)"/>
  `
})
export class Exam implements OnDestroy, OnChanges {
  private subscription?: Subscription;

  constructor(private router: Router, private writer: Writer, private publisher: Publisher, private cdr: ChangeDetectorRef) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['exam'] && this.exam && this.publishingVersion) {
      if (this.publishingVersion !== changes['exam'].currentValue.version) {
        this.publishingVersion = null;
        this.cdr.detectChanges();
      }
    }
  }

  @Input() exam!: ExamType;
  @Output() deleted = new EventEmitter<boolean>();

  confirmMainVisible: boolean = false;
  publishingVersion: number | null = null;
  isPublishError: boolean = false;
  publishingMessage: string = ""

  addQuestionRoute = async () => {
    await this.router.navigate(['exam', this.exam.examId, 'addQuestion']);
  }

  async handlePublishClick() {
    this.publishingVersion = this.exam.version!;
    this.isPublishError = false;
    await this.publisher.publishExam(this.exam.examId!)

    this.subscription = this.publisher
      .observePublishingMessages(this.exam.examId!)
      .subscribe({
        next: message => {
          this.publishingMessage = message;
          this.isPublishError = message.startsWith("Err:")
          this.cdr.detectChanges();
        },
        error: message => {console.error('publish SSE error', message)}
      });
  }

  onDeleted() {
    this.deleted.emit(true);
  }

  handleDeleteCall() {
    this.confirmMainVisible = true;
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

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
