import {
  Component,
  EventEmitter,
  Input,
  OnChanges, OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Writer } from '../../../services/writer';
import { CheckIconComponent } from '../../common/iconed/check-button';
import { XButton } from '../../common/iconed/x-button';
import { ExamType } from "../../../types";

@Component({
  selector: 'app-title-edit',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CheckIconComponent,
    XButton
  ],
  template: `
    <form [formGroup]="form" style="position: relative;" (ngSubmit)="onSubmit()"
          class="flex flex-1 items-center">
      <input class="text-3xl disabled:text-indigo-400 font-bold px-3 md:placeholder-gray-400 flex-1"
             id="titleEd" name="titleEd"
             type="text"
             formControlName="Title"
             placeholder="Title"/>
      @if (isDisabled) {
        <div
          (dblclick)="toggleMode()"
          style="position: absolute; top: 0; left: 0; right: 0; bottom: 0"
        >
        </div>
      } @else {
        <div class="col-span-1">
          <app-check type="submit" [disabled]="form.pristine || form.invalid"/>
          <app-x-button class="col-span-1" (click)="toggleMode()"/>
        </div>
      }
    </form>`
})
export class TitleEdit implements OnChanges, OnInit {
  form: FormGroup;
  @Input() exam: ExamType | null = null;
  @Output() addFinish = new EventEmitter<boolean>();
  isDisabled: boolean = true;

  constructor(private writer: Writer, private fb: FormBuilder) {
    this.form = this.fb.group({
      Title: [{ value: '', disabled: true }, Validators.required]
    })
  }

  ngOnInit(): void {
    if (!this.exam?.ExamId) {
      this.toggleMode();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['exam'] && this.exam) {
      this.form.patchValue({ Title: this.exam.Title });
    }
  }

  toggleMode = () => {
    this.isDisabled = !this.isDisabled;
    this.isDisabled ? this.form.get('Title')?.disable() : this.form.get('Title')?.enable()
  }

  async onSubmit() {
    let exam = this.form.value as ExamType;

    if (this.exam?.ExamId) {
      exam.ExamId = this.exam.ExamId;
      await this.writer.updateExamTitle(exam);
      this.toggleMode()
    } else {
      await this.writer.createExam(exam);
      this.addFinish.emit(true);
    }
  }
}
