import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {AnswerType} from '../../../services/reader';
import {Writer} from '../../../services/writer';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CheckIconComponent} from '../../common/iconed/check-button';
import {XButton} from '../../common/iconed/x-button';

@Component({
  selector: 'app-answer-edit',
  imports: [
    ReactiveFormsModule,
    CheckIconComponent,
    XButton
  ],
  template: `<form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-row justify-between w-11/12">
    <div class="flex flex-row justify-between items-center w-full">
      <label for="contentEd" class="hidden">Content:</label>
      <input class="px-3 md:placeholder-gray-400" id="contentEd" type="text" name="contentEd" formControlName="content" placeholder="Content" />
      <div class="flex items-center space-x-2">
        <input type="checkbox" id="isCorrect" formControlName="isCorrect" class="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"/>
        <label for="isCorrect" class="text-gray-900 select-none">
          Is Correct?
        </label>
      </div>
      <div class="col-span-1">
        <app-check type="submit" [disabled]="form.pristine || form.invalid"/>
        <app-x-button class="col-span-1" (click)="handleDiscardCall()"/>
      </div>
    </div>
  </form>`
})
export class AnswerEdit implements OnChanges {
  form: FormGroup;
  @Input() answer: AnswerType | null = null;
  @Input() questionId: string|null = null;
  @Input() examId: string|null = null;
  @Output() discardCalled = new EventEmitter<boolean>();
  @Output() submitSucceed = new EventEmitter<boolean>();

  constructor(private writer: Writer, private fb: FormBuilder) {
    this.form = this.fb.group({
      content: ['', Validators.required],
      isCorrect: [false, Validators.required],
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['answer'] && this.answer) {
      this.form.patchValue({...this.answer});
    }
  }

  onSubmit() {
    let answer = this.form.value as AnswerType;

    if (this.answer?.answerId) {
      answer.answerId = this.answer.answerId;
      this.writer.updateAnswer(this.examId!, this.questionId!, answer).then(response => {
        this.submitSucceed.emit(true);
      })
    } else {
      this.writer.addAnswer(this.examId!, this.questionId!, answer).then(response => {
        this.submitSucceed.emit(true)
      })
    }
  }

  handleDiscardCall() {
    this.discardCalled.emit(true);
  }

}
