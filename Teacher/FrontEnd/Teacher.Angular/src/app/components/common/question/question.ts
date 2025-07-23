import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {QuestionType} from '../../../services/reader';
import {CommonModule} from '@angular/common';
import {Answer} from '../answer/answer';
import {PencilButton} from '../iconed/pencil-button';
import {Router} from '@angular/router';
import {Confirmation} from '../confirmation/confirmation';
import {Writer} from '../../../services/writer';
import {TrashButton} from '../iconed/trash-button';

@Component({
  selector: 'app-question',
  imports: [
    CommonModule,
    Answer,
    PencilButton,
    Confirmation,
    TrashButton
  ],
  template: `
    <div class="p-4 bg-indigo-100">
      <div class="grid grid-cols-12 gap-4">
        <div #contentDiv class="whitespace-pre-wrap col-span-10 outline bg-white" [style.height.px]="dynamicHeight">{{question.content}}</div>
        <app-pencil-button class="col-span-1" (click)="editQuestionRoute()"/>
        <app-trash-button class="col-span-1" (click)="handleDeleteCall()"/>
      </div>
      <ul>
        @for (ans of question.answers; track ans.answerId) {
          <li><app-answer [answer]="ans" [examId]="examId!" [questionId]="question.questionId!" (questionNeedsUpdate)="handleNeedUpdate()"/></li>
        }
      </ul>
    </div>
    <app-confirmation [visible]="confirmQuestionVisible" [message]="'Do you really want to delete this question?'" (confirmed)="handleConfirmation($event)" />
  `,
})
export class Question implements AfterViewInit {
  @ViewChild('contentDiv') contentDiv!: ElementRef<HTMLDivElement>;
  @Input() question!: QuestionType;

  dynamicHeight = 0;

  ngAfterViewInit() {
    this.updateHeight();
  }

  updateHeight() {
    if (this.contentDiv) {
      setTimeout(() => {
        this.dynamicHeight = this.contentDiv.nativeElement.scrollHeight;
      }, 0);
    }
  }

  @Input() examId: string | null = null;

  @Output() examNeedsUpdate = new EventEmitter<boolean>();

  confirmQuestionVisible = false;

  constructor(private router: Router, private writer: Writer) {
  }

  handleDeleteCall() {
    this.confirmQuestionVisible = true;
  }

  handleNeedUpdate() {
    this.examNeedsUpdate.emit(true);
  }

  handleConfirmation(confirmed: boolean) {
    this.confirmQuestionVisible = false;
    if (confirmed) {
      this.writer.removeQuestion(this.examId!, this.question.questionId!).then(response => {
        console.log('got question deletion resp:', response);
        this.handleNeedUpdate();
      })
    } else {
      // Cancelled
      console.log('Delete question cancelled');
    }
  }

  editQuestionRoute() {
    this.router.navigate(['exam', this.examId, 'editQuestion', this.question.questionId]);
  }
}
