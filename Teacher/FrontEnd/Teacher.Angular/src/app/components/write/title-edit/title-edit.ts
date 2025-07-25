import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {ExamType} from '../../../services/reader';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Writer} from '../../../services/writer';
import {CheckIconComponent} from '../../common/iconed/check-button';
import {XButton} from '../../common/iconed/x-button';

@Component({
  selector: 'app-title-edit',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CheckIconComponent,
    XButton
  ],
  template: `
      <form [formGroup]="form" (ngSubmit)="onSubmit()"  class="flex flex-row justify-between items-center w-full">
        <label for="titleEd" class="hidden">Content:</label>
        <input class="text-3xl font-bold px-3 md:placeholder-gray-400 " id="titleEd" type="text" name="titleEd" formControlName="title"
               placeholder="Title"/>
        <div class="col-span-1">
          <app-check type="submit" [disabled]="form.pristine || form.invalid"/>
          <app-x-button class="col-span-1" (click)="handleDiscardCall()"/>
        </div>
    </form>`
})
export class TitleEdit implements OnChanges {
  form: FormGroup;
  @Input() exam: ExamType | null = null;
  @Output() discardCalled = new EventEmitter<boolean>();

  constructor(private writer: Writer, private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', Validators.required]
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['exam'] && this.exam) {
      this.form.patchValue({title: this.exam.title});
    }
  }

  onSubmit() {
    let exam = this.form.value as ExamType;

    if (this.exam?.examId) {
      exam.examId = this.exam.examId;
      this.writer.updateExamTitle(exam).then(resp => {
        console.log('got response to update request', resp);
      })
    } else {
      this.writer.createExam(exam).then(response => {
        console.log('got b/e resp:', response);
      })
    }
  }

  handleDiscardCall() {
    this.discardCalled.emit(true);
  }
}
