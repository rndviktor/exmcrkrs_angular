import {Component, OnInit} from '@angular/core';
import {ContentEditorFormComponent} from './contentEditorForm';
import {Writer} from '../../../services/writer';
import {ActivatedRoute, Router} from '@angular/router';
import { switchMap } from 'rxjs/operators';
import {QuestionType, Reader} from '../../../services/reader';
import {HomeButton} from '../../common/iconed/home-button';
import {Confirmation} from '../../common/confirmation/confirmation';
import {XButton} from '../../common/iconed/x-button';
import {Answer} from '../../common/answer/answer';

@Component({
  selector: 'app-question',
  imports: [ContentEditorFormComponent, HomeButton, Confirmation, XButton, Answer],
  template: `
    <div class="flex flex-col p-8 ">
      <div class="flex flex-row justify-between">
        <app-home-button (click)="routeHome()"/>
        <app-x-button (click)="showConfirm(true)"/>
      </div>
      <app-content-editor-form (submitForm)="handleContentSubmit($event)" [content]="question?.content"
                               [isEditMode]="editMode"/>
      @if (question?.answers?.length) {
        <ul>
          @for (ans of question?.answers; track ans.answerId) {
            <li><app-answer [answer]="ans" [examId]="examId!" [questionId]="question?.questionId!" (questionNeedsUpdate)="answerDeleted()"/></li>
          }
        </ul>
      }
    </div>
    <app-confirmation [visible]="confirmVisible" [message]="'Do you really want to delete this question?'"
                      (confirmed)="handleConfirmation($event)"/>
  `,
})
export class QuestionEdit implements OnInit {
  editMode: boolean = false;
  question: QuestionType | null = null;
  examId: string|null = null;
  questionId: string | null = null;

  confirmVisible = false;

  constructor(private writer: Writer, private reader: Reader, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        this.questionId = params.get('questionId');
        this.examId = params.get('examId');
        this.editMode = !!this.questionId;
        if (this.editMode) {
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

  answerDeleted() {
    this.refreshData()
  }

  routeHome() {
    this.router.navigate(['/']);
  }

  showConfirm(visible: boolean) {
    this.confirmVisible = visible;
  }

  handleConfirmation(confirmed: boolean) {
    this.confirmVisible = false;
    if (confirmed) {
      this.writer.removeQuestion(this.examId!, this.question?.questionId!).then(response => {
        console.log('got response', response);
        this.refreshData();
      })
    }
  }

  handleContentSubmit(data: {content: string|null}) {
    const { content } = data;
    if (this.editMode) {
      this.writer.updateQuestionContent(this.examId!, { questionId: this.question?.questionId, content: content });
    } else {
      this.writer.postQuestion(this.examId!, { content: content! }).then(response => {
        const { id } = response;
        this.router.navigate(['exam', this.examId, 'editQuestion', id]);
      });
    }
  }
}
