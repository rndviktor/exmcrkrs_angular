import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';

export interface SelectionChangedEvent {
  id: string;
  checked: boolean;
}
@Component({
  selector: 'app-checkbox',
  imports: [
    FormsModule
  ],
  template: `<div class="flex items-center space-x-2">
    <input id="{{id || 'chbId'}}"
           type="checkbox"
           [(ngModel)]="checked"
           [disabled]="disabled"
           (ngModelChange)="change($event)"
           class="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
    />
  </div>`
})
export class Checkbox {
  @Input() checked: boolean = false;
  @Input() disabled: boolean = false;
  @Input() id!: string;

  @Output() checkedChange: EventEmitter<SelectionChangedEvent> = new EventEmitter<SelectionChangedEvent>();

  change(value: any) {
    this.checkedChange.emit({id: this.id, checked: value});
  }
}
