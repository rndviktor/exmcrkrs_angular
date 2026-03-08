import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { Writer } from '../../../services/writer';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckIconComponent } from '../../common/iconed/check-button';
import { XButton } from '../../common/iconed/x-button';
import { AnswerType } from "../../../types";
import { TrashButton } from '../../common/iconed/trash-button';
import { Confirmation } from '../../common/confirmation/confirmation';
import { PencilButton } from '../../common/iconed/pencil-button';

@Component({
  selector: 'app-answer-edit',
  imports: [
    ReactiveFormsModule,
    CheckIconComponent,
    XButton,
    TrashButton,
    Confirmation,
    PencilButton
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-row flex-1">
      <div class="flex flex-row justify-between flex-1">
        <div class="flex flex-1 justify-items-start">
          <div class="flex items-center space-x-2 px-4">
            <input type="checkbox" id="IsCorrect" formControlName="IsCorrect"
                   class="w-5 h-5 border-gray-300 rounded focus:ring-2 disabled:text-gray-400 focus:ring-blue-500"/>
            <label for="IsCorrect" class="text-gray-600 select-none">
              Is Correct?
            </label>
          </div>
          <textarea class="flex-1 px-3 md:placeholder-gray-400 disabled:text-gray-400 wrap-break-word select-none"
                    #contentDiv id="contentEd" type="text" name="contentEd"
                    [style.height.px]="dynamicHeight" (input)="autoResize($event)"
                    formControlName="Content" placeholder="Content"> </textarea>
        </div>
        @if (isDisabled) {
          <app-pencil-button (click)="toggleMode()"/>
          <app-trash-button class="col-span-1" (click)="handleDeleteCall()"/>
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
  @ViewChild('contentDiv') contentDiv!: ElementRef<HTMLDivElement>;
  form: FormGroup;
  @Input() answer: AnswerType | null = null;
  @Input() questionId: string | null = null;
  @Input() examId: string | null = null;
  @Input() loadEnabled = false
  isDisabled: boolean = true;
  confirmVisible = false;
  dynamicHeight = 20;
  @Output() discardCalled = new EventEmitter<boolean>();

  constructor(private writer: Writer, private fb: FormBuilder) {
    this.form = this.fb.group({
      Content: [{ value: '', disabled: true }, Validators.required],
      IsCorrect: [{ value: false, disabled: true }, Validators.required],
    })
  }

  ngOnInit(): void {
    if (this.loadEnabled) {
      this.toggleMode();
    }
  }

  updateHeight() {
    if (this.contentDiv) {
      setTimeout(() => {
        this.dynamicHeight = this.contentDiv.nativeElement.scrollHeight;
      }, 0);
    }
  }

  handleDeleteCall() {
    this.confirmVisible = true;
  }

  async handleConfirmation(confirmed: boolean) {
    this.confirmVisible = false;
    if (confirmed) {
      await this.writer.removeAnswer(this.examId!, this.questionId!, this.answer!.AnswerId!);
    } else {
      // Cancelled
      console.log('Delete cancelled');
    }
  }

  toggleMode = () => {
    this.isDisabled = !this.isDisabled;
    this.isDisabled ? this.form.get('Content')?.disable() : this.form.get('Content')?.enable();
    this.isDisabled ? this.form.get('IsCorrect')?.disable() : this.form.get('IsCorrect')?.enable()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['answer'] && this.answer) {
      setTimeout(() => {
        this.form.patchValue({ ...this.answer });
        this.updateHeight();
      })
    }
  }

  onSubmit = async () => {
    let answer = this.form.value as AnswerType;

    if (this.answer?.AnswerId) {
      answer.AnswerId = this.answer.AnswerId;
      await this.writer.updateAnswer(this.examId!, this.questionId!, answer);
    } else {
      await this.writer.addAnswer(this.examId!, this.questionId!, answer);
    }

    this.handleDiscardCall();
  }

  handleDiscardCall() {
    this.toggleMode()
    this.discardCalled.emit(true);
  }

  autoResize(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto'; // reset height
    textarea.style.height = `${textarea.scrollHeight}px`; // set height based on scrollHeight
  }
}
