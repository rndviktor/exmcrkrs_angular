import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-content-editor-form',
  imports: [ReactiveFormsModule, FormsModule],
  template: `<div class="flex flex-col p-8 ">
    <form class="flex flex-col" [formGroup]="form" (ngSubmit)="onSubmit()" >
      <label for="content">Content:</label>
      <textarea id="content" type="text" formControlName="content"></textarea>
      <button type="submit" [disabled]="form.pristine || form.invalid" class="bg-indigo-200 hover:bg-indigo-400 disabled:bg-indigo-50 flex-none shadow-xl" >Submit</button>
    </form>
  </div>`,
})
export class ContentEditorFormComponent implements OnChanges{
  form: FormGroup;
  @Input() content: any;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      content: ['', Validators.required],
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['content'] && this.content) {
      this.form.patchValue({content: this.content});
    }
  }

  @Output() submitForm = new EventEmitter<{ content: string|null }>();

  onSubmit() {
    this.submitForm.emit({ content: this.form.value.content });
  }
}
