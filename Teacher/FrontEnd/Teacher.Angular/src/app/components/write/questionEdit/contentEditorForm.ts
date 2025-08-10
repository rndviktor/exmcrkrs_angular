import {
  Component, ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-content-editor-form',
  imports: [ReactiveFormsModule, FormsModule],
  template: `<div class="flex flex-col p-8 ">
    <form class="flex flex-col" [formGroup]="form" (ngSubmit)="onSubmit()" >
      <label for="content">Content:</label>
      <textarea class="whitespace-pre-line col-span-10 bg-white outline-gray-400 outline-2" #contentDiv (input)="autoResize($event)" id="content" type="text" formControlName="content" [style.height.px]="dynamicHeight"></textarea>
      <button type="submit" [disabled]="form.pristine || form.invalid" class="bg-indigo-200 hover:bg-indigo-400 disabled:bg-indigo-50 flex-none shadow-xl" >{{this.isEditMode ? 'Update' : 'Create'}}</button>
    </form>
  </div>`,
})
export class ContentEditorFormComponent implements OnChanges {
  @ViewChild('contentDiv') contentDiv!: ElementRef<HTMLDivElement>;
  form: FormGroup;
  @Input() content: any;
  @Input() isEditMode = false;
  dynamicHeight = 0;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      content: ['', Validators.required],
    });
    this.dynamicHeight = 50;
  }

  updateHeight() {
    if (this.contentDiv) {
      setTimeout(() => {
        this.dynamicHeight = this.contentDiv.nativeElement.scrollHeight;
        console.log('init', this.dynamicHeight);
      }, 0);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['content'] && this.content) {
      this.form.patchValue({content: this.content});
      this.updateHeight();
    }
  }

  @Output() submitForm = new EventEmitter<{ content: string|null }>();

  onSubmit() {
    this.submitForm.emit({ content: this.form.value.content });
  }

  autoResize(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto'; // reset height
    textarea.style.height = `${textarea.scrollHeight}px`; // set height based on scrollHeight
  }
}
