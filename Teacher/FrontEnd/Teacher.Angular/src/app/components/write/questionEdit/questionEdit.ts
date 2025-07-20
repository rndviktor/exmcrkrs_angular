import {Component, inject, OnInit} from '@angular/core';
import {ContentEditorFormComponent} from './contentEditorForm';
import {Writer} from '../../../services/writer';
import {ActivatedRoute, Router} from '@angular/router';
import { switchMap } from 'rxjs/operators';
import {QuestionType, Reader} from '../../../services/reader';
import {HomeButton} from '../../common/iconed/home-button';

@Component({
  selector: 'app-question',
  imports: [ContentEditorFormComponent, HomeButton],
  template: `<div class="flex flex-col p-8 ">
    <div class="flex flex-row">
      <app-home-button (click)="routeHome()" />
    </div>
    <app-content-editor-form (submitForm)="handleContentSubmit($event)" [content]="question?.content" [isEditMode]="editMode"/>
  </div>`,
})
export class QuestionEdit implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  editMode: boolean = false;
  question: QuestionType | null = null;

  constructor(private writer: Writer, private reader: Reader, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const questionId = params.get('questionId');
        this.editMode = !!questionId;
        if (this.editMode) {
          return this.reader.getQuestionById(questionId!);
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

  routeHome() {
    this.router.navigate(['/']);
  }

  handleContentSubmit(data: {content: string|null}) {
    const { content } = data;
    const examId = this.activatedRoute.snapshot.paramMap.get('examId');
    if (this.editMode) {
      this.writer.updateQuestionContent(examId!, { questionId: this.question?.questionId, content: content });
    } else {
      this.writer.postQuestion(examId!, { content: content! }).then(response => {
        const { id } = response;
        this.router.navigate(['exam', examId, 'editQuestion', id]);
      });
    }
  }
}
