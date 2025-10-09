import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Writer} from '../../../services/writer';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CheckIconComponent} from '../../common/iconed/check-button';
import {XButton} from '../../common/iconed/x-button';
import {AnswerType} from "../../../types";
import {ExamService} from '../../../services/exam-service';
import {TrashButton} from '../../common/iconed/trash-button';
import {Confirmation} from '../../common/confirmation/confirmation';

@Component({
  selector: 'app-answer-edit',
  imports: [
    ReactiveFormsModule,
    CheckIconComponent,
    XButton,
    TrashButton,
    Confirmation
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-row flex-1">
      <div class="flex flex-row justify-between flex-1">
        <div class="flex flex-1 justify-items-start" (dblclick)="toggleMode()">
          <div class="flex items-center space-x-2 px-4">
            <input type="checkbox" id="isCorrect" formControlName="isCorrect"
                   class="w-5 h-5 border-gray-300 rounded focus:ring-2 disabled:text-gray-400 focus:ring-blue-500"/>
            <label for="isCorrect" class="text-gray-600 select-none">
              Is Correct?
            </label>
          </div>
          <input class="px-3 md:placeholder-gray-400 disabled:text-gray-400" id="contentEd" type="text" name="contentEd"
                 formControlName="content" placeholder="Content"/>
        </div>
        @if (isDisabled) {
          <app-trash-button class="col-span-1" (click)="handleDeleteCall($event)"/>
        } @else {
          <div class="col-span-1">
            <app-check type="submit" [disabled]="form.pristine || form.invalid"/>
            <app-x-button class="col-span-1" (click)="handleDiscardCall()"/>
          </div>
        }
      </div>
    </form>
    <app-confirmation [visible]="confirmVisible" [message]="'Do you really want to delete this question?'"
                      (confirmed)="handleConfirmation($event)"/>
  `

})
export class AnswerEdit implements OnChanges, OnInit {
  form: FormGroup;
  @Input() answer: AnswerType | null = null;
  @Input() questionId: string | null = null;
  @Input() examId: string | null = null;
  @Input() loadEnabled = false
  isDisabled: boolean = true;
  confirmVisible = false;
  @Output() discardCalled = new EventEmitter<boolean>();

  constructor(private examService: ExamService, private writer: Writer, private fb: FormBuilder) {
    this.form = this.fb.group({
      content: [{value: '', disabled: true}, Validators.required],
      isCorrect: [{value: false, disabled: true}, Validators.required],
    })
  }

  ngOnInit(): void {
    if (this.loadEnabled) {
      this.toggleMode();
    }
  }

  handleDeleteCall(data: any) {
    this.confirmVisible = true;
  }

  async handleConfirmation(confirmed: boolean) {
    this.confirmVisible = false;
    if (confirmed) {
      await this.writer.removeAnswer(this.examId!, this.questionId!, this.answer!.answerId!);
      this.examService.deleteAnswerWithinQuestion(this.examId!, this.questionId!, this.answer!.answerId!)
    } else {
      // Cancelled
      console.log('Delete cancelled');
    }
  }

  toggleMode = () => {
    this.isDisabled = !this.isDisabled;
    this.isDisabled ? this.form.get('content')?.disable() : this.form.get('content')?.enable();
    this.isDisabled ? this.form.get('isCorrect')?.disable() : this.form.get('isCorrect')?.enable()
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
        this.examService.updateAnswerWithinQuestion(this.examId!, this.questionId!, answer);
      })
    } else {
      this.writer.addAnswer(this.examId!, this.questionId!, answer).then(response => {
        const {id: answerId} = response
        this.examService.addAnswerToQuestion(this.examId!, this.questionId!, {...answer, answerId});
      })
    }

    this.handleDiscardCall();
  }

  handleDiscardCall() {
    this.toggleMode()
    this.discardCalled.emit(true);
  }
}
