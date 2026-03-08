import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CheckIconComponent } from '../../common/iconed/check-button';
import { XButton } from '../../common/iconed/x-button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExamType } from '../../../types';
import { Writer } from '../../../services/writer';
import { PencilButton } from '../../common/iconed/pencil-button';

@Component({
  selector: 'app-access-code-edit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CheckIconComponent,
    XButton,
    FormsModule,
    ReactiveFormsModule,
    PencilButton
  ],
  template: `
    <div class="flex flex-row justify-between items-center w-full">
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-row justify-between">
        <input class="text-2xl disabled:text-indigo-500 font-light disabled:font-bold px-3 md:placeholder-gray-400 "
               id="codeEd" type="text" name="codeEd"
               formControlName="AccessCode"
               placeholder="Access Code"/>

        @if (!isDisabled) {
          <div>
            <app-check type="submit" [disabled]="form.pristine || form.invalid"/>
            <app-x-button class="col-span-1" (click)="toggleMode()"/>
          </div>
        }
      </form>
      @if (isDisabled) {
        <app-pencil-button class="col-span-1" (click)="toggleMode()"/>
      }
    </div>
  `
})
export class AccessCodeEdit implements OnChanges {
  form: FormGroup;
  @Input() exam: ExamType | null = null;


  isDisabled: boolean = true;
  toggleMode = () => {
    this.form.patchValue({ AccessCode: this.exam!.AccessCode });
    this.isDisabled = !this.isDisabled;
    this.isDisabled ? this.form.get('AccessCode')?.disable() : this.form.get('AccessCode')?.enable()
  }

  constructor(private writer: Writer, private fb: FormBuilder,) {
    this.form = this.fb.group({
      AccessCode: [{ value: '', disabled: true }, Validators.required]
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['exam'] && this.exam) {
      this.form.patchValue({ AccessCode: this.exam.AccessCode });
    }
  }

  onSubmit = async () => {
    let exam = this.form.value as ExamType;
    exam.ExamId = this.exam!.ExamId;
    await this.writer.assignAccessCode(exam);
    this.toggleMode();
  }
}
