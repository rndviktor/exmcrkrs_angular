import {ChangeDetectorRef, Component, OnDestroy, OnInit, Signal} from '@angular/core';
import {ContentEditorFormComponent} from './contentEditorForm';
import {Writer} from '../../../services/writer';
import {ActivatedRoute, Router} from '@angular/router';
import {HomeButton} from '../../common/iconed/home-button';
import {Confirmation} from '../../common/confirmation/confirmation';
import {AnswerEdit} from '../answer-edit/answer-edit';
import {TrashButton} from '../../common/iconed/trash-button';
import {Subscription} from 'rxjs';
import {QuestionType} from "../../../types";
import {ExamService} from '../../../services/exam-service';

@Component({
  selector: 'app-question',
  imports: [ContentEditorFormComponent, HomeButton, Confirmation, AnswerEdit, TrashButton],
  template: `
    <div class="flex flex-col p-8 ">
      <div class="flex flex-row justify-between">
        <app-home-button (click)="routeHome()"/>
        <app-trash-button (click)="showConfirm(true)"/>
      </div>
      <app-content-editor-form (submitForm)="handleContentSubmit($event)" [content]="content"
                               [isEditMode]="editMode"/>
      @if (answers?.length) {
        <ul>
          @for (ans of answers; track ans.answerId; let even = $even) {
            <li [class.bg-gray-100]="even" [class.bg-gray-200]="!even">
              <app-answer-edit [answer]="ans" [questionId]="questionId!" [examId]="examId!"
                               (discardCalled)="handleDiscardCalled()"/>
            </li>
          }
        </ul>
      }
      @if (addAnswerMode) {
        <app-answer-edit [questionId]="questionId!" [loadEnabled]="true" [examId]="examId!"
                         (discardCalled)="handleDiscardCalled()"/>
      } @else if (!!questionId) {
        <button id="addAnswerButton" class="bg-indigo-200 hover:bg-indigo-400 flex-none shadow-xl"
                (click)="handleAddAnswerPressed()">Add
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
  question$: Signal<QuestionType | undefined> | null = null;
  examId: string | null = null;
  questionId: string | null = null;
  addAnswerMode: boolean = false;
  subscription?: Subscription;
  confirmVisible = false;
  backendAvailable: boolean = false;

  get question() {
    return this.question$;
  }

  get answers() {
    return this.question$ != null ? this.question$()?.answers : null;
  }

  get content() {
    return this.question$ != null ? this.question$()?.content : null;
  }

  constructor(private examService: ExamService, private writer: Writer, private route: ActivatedRoute, private router: Router, private cdr: ChangeDetectorRef) {
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  handleAddAnswerPressed() {
    this.addAnswerMode = true;
    this.cdr.detectChanges();
  }

  handleDiscardCalled() {
    this.addAnswerMode = false;
    setTimeout(() => this.cdr.detectChanges(), 50);
  }

  ngOnInit(): void {
    this.examService.loadExams();
    this.route.params.subscribe(params => {
      this.questionId = params['questionId'];
      this.examId = params['examId'];
      this.editMode = !!this.questionId;
      if (this.editMode) {
        this.question$ = this.examService.questionSignal(this.examId!, this.questionId!);
      }
    })
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
      this.writer.removeQuestion(this.examId!, this.questionId!).then(response => {
        this.examService.deleteQuestion(this.examId!, this.questionId!);
        this.routeHome();
      })
    }
  }

  async handleContentSubmit(data: { content: string | null }) {
    const {content} = data;
    if (this.editMode) {
      const question = {questionId: this.questionId, content: content};
      await this.writer.updateQuestionContent(this.examId!, question)
      this.examService.updateQuestionContentAtExam(this.examId!, question)
    } else {
      await this.writer.postQuestion(this.examId!, {content: content!}).then(response => {
        const {id} = response;
        this.examService.addQuestionToExam(this.examId!, {questionId: id, content: content});
        this.router.navigate(['exam', this.examId, 'editQuestion', id]);
      });
    }
  }
}
