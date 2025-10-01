import {
  Component,
  EventEmitter,
  Input,
  OnChanges, OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Writer} from '../../../services/writer';
import {CheckIconComponent} from '../../common/iconed/check-button';
import {XButton} from '../../common/iconed/x-button';
import {ExamType} from "../../../types";
import {ExamService} from '../../../services/exam-service';

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
      <input class="text-3xl disabled:text-indigo-500 font-bold px-3 md:placeholder-gray-400 flex-1"
             id="titleEd" name="titleEd"
             #inputElement
             type="text"
             formControlName="title"
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

  constructor(private writer: Writer, private fb: FormBuilder, private examService: ExamService) {
    this.form = this.fb.group({
      title: [{value: '', disabled: true}, Validators.required]
    })
  }

  ngOnInit(): void {
    if (!this.exam?.examId) {
      this.toggleMode();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['exam'] && this.exam) {
      this.form.patchValue({title: this.exam.title});
    }
  }

  toggleMode = () => {
    this.isDisabled = !this.isDisabled;
    this.isDisabled ? this.form.get('title')?.disable() : this.form.get('title')?.enable()
  }

  onSubmit() {
    let exam = this.form.value as ExamType;

    if (this.exam?.examId) {
      exam.examId = this.exam.examId;
      this.writer.updateExamTitle(exam).then(resp => {
        console.log('got response to update request', resp);
        this.examService.updateExamTitle(exam);
        this.toggleMode()
      })
    } else {
      this.writer.createExam(exam).then(response => {
        console.log('got b/e resp:', response);
        const {id: examId} = response;
        this.examService.addExam({...exam, examId})
        this.addFinish.emit(true);
      })
    }
  }
}
