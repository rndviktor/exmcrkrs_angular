import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ContentEditorFormComponent} from './contentEditorForm';
import {Writer} from '../../../services/writer';
import {ActivatedRoute, Router} from '@angular/router';
import { switchMap } from 'rxjs/operators';
import {QuestionType, Reader} from '../../../services/reader';
import {HomeButton} from '../../common/iconed/home-button';
import {Confirmation} from '../../common/confirmation/confirmation';
import {Answer} from '../../common/answer/answer';
import {AnswerEdit} from '../answer-edit/answer-edit';
import {TrashButton} from '../../common/iconed/trash-button';
import {SseService} from '../../../services/sse-service';
import {Subscription} from 'rxjs';
import {ApiStatus} from '../../common/api-status/api-status';

@Component({
  selector: 'app-question',
  imports: [ContentEditorFormComponent, HomeButton, Confirmation, Answer, AnswerEdit, TrashButton, ApiStatus],
  template: `
    <app-api-status (backendAvailable)="handleBackendAvailable($event)"/>
    <br/>
    <div class="flex flex-col p-8 ">
      <div class="flex flex-row justify-between">
        <app-home-button (click)="routeHome()"/>
        <app-trash-button (click)="showConfirm(true)"/>
      </div>
      <app-content-editor-form (submitForm)="handleContentSubmit($event)" [content]="question?.content"
                               [isEditMode]="editMode"/>
      @if (question?.answers?.length) {
        <ul>
          @for (ans of question?.answers; track ans.answerId) {
            <li>
              @if (editedAnswerId !== ans.answerId) {
                <app-answer
                  [answer]="ans"
                  [examId]="examId!"
                  [disableDeletion]="addAnswerMode || (!!editedAnswerId && editedAnswerId !== ans.answerId)"
                  [questionId]="question?.questionId!"
                  (questionTriggerEdit)="handleAnswerDoubleClick($event)"/>
              } @else {
                <app-answer-edit [answer]="ans" [questionId]="questionId!" [examId]="examId!" (discardCalled)="handleDiscardCalled()"/>
              }
            </li>
          }
        </ul>
      }
      @if (addAnswerMode) {
        <app-answer-edit [questionId]="questionId!" [examId]="examId!" (discardCalled)="handleDiscardCalled()"/>
      } @else if (!editedAnswerId && !!questionId) {
        <button id="addAnswerButton" class="bg-indigo-200 hover:bg-indigo-400 flex-none shadow-xl" (click)="handleAddAnswerPressed()">Add
          Answer
        </button>
      }
    </div>
    <app-confirmation [visible]="confirmVisible" [message]="'Do you really want to delete this question?'"
                      (confirmed)="handleConfirmation($event)"/>
  `,
})
export class QuestionEdit implements OnInit, OnDestroy {
  editMode: boolean = false;
  question: QuestionType | null = null;
  examId: string|null = null;
  questionId: string | null = null;
  addAnswerMode: boolean = false;
  editedAnswerId: string|null = null;
  subscription?: Subscription;
  confirmVisible = false;
  backendAvailable: boolean = false;

  constructor(private writer: Writer, private reader: Reader, private route: ActivatedRoute, private router: Router, private sseService: SseService, private cdr: ChangeDetectorRef) {
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  handleBackendAvailable(available: boolean) {
    if (this.backendAvailable && !available) {
      this.routeHome();
    }
    this.backendAvailable = available;
  }

  handleAddAnswerPressed() {
    this.addAnswerMode = true;
    this.cdr.detectChanges();
  }

  handleAnswerDoubleClick(data: any) {
    this.editedAnswerId = data;
    this.cdr.detectChanges();
  }

  handleDiscardCalled() {
    this.addAnswerMode = false;
    this.editedAnswerId = null;
    setTimeout(() => this.cdr.detectChanges(), 50);
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        this.questionId = params.get('questionId');
        this.examId = params.get('examId');
        this.editMode = !!this.questionId;
        if (this.editMode) {
          this.subscription?.unsubscribe();
          this.subscription = this.sseService
            .observeMessagesToObject(this.questionId!)
            .subscribe(
              message => {
                console.log("Q SSE message:", message);
                if (message === 'QuestionRemovedEvent') {
                  this.routeHome();
                } else {
                  this.answersListUpdated();
                }
              },
              err => console.error('Q SSE error', err)
            );
          console.log('subscr', this.questionId)
          return this.reader.getQuestionById(this.questionId!);
        } else {
          return [];
        }
      })
    ).subscribe({
      next: (item: any) => {
        if (this.editMode && item) {
          this.question = item.question;
        }
      }
    });
  }

  refreshData(): void {
    this.reader.getQuestionById(this.questionId!).subscribe({
      next: (item: any) => {
        if (this.editMode && item) {
          this.question = item.question;
        }
      }
    })
  }

  answersListUpdated() {
    this.refreshData()
    this.handleDiscardCalled();
  }

  routeHome() {
    this.router.navigate(['/']);
  }

  showConfirm(visible: boolean) {
    this.confirmVisible = visible;
    this.cdr.detectChanges();
  }

  handleConfirmation(confirmed: boolean) {
    this.confirmVisible = false;
    if (confirmed) {
      this.writer.removeQuestion(this.examId!, this.question?.questionId!).then(response => {
        this.routeHome();
      })
    }
  }

  async handleContentSubmit(data: {content: string|null}) {
    const { content } = data;
    if (this.editMode) {
      await this.writer.updateQuestionContent(this.examId!, { questionId: this.question?.questionId, content: content })
    } else {
      await this.writer.postQuestion(this.examId!, { content: content! }).then(response => {
        const { id } = response;
        this.router.navigate(['exam', this.examId, 'editQuestion', id]);
      });
    }
  }
}
