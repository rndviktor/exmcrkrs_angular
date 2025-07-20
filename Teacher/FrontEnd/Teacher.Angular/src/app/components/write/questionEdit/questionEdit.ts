import {Component, inject, OnInit} from '@angular/core';
import {ContentEditorFormComponent} from './contentEditorForm';
import {Writer} from '../../../services/writer';
import {ActivatedRoute, Router} from '@angular/router';
import { switchMap } from 'rxjs/operators';
import {QuestionType, Reader} from '../../../services/reader';

@Component({
  selector: 'app-question',
  imports: [ContentEditorFormComponent],
  template: `<div class="flex flex-col p-8 ">
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
