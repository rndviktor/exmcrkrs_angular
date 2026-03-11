import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  imports: [
    FormsModule
  ],
  template: `
    <div class="flex items-center space-x-2">
      <input id="{{id || 'chbId'}}"
        type="checkbox"
        [(ngModel)]="checked"
        [disabled]="disabled"
        class="w-5 h-5 text-blue-600 bg-transparent border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
      />
      <label for="{{id || 'chbId'}}" class="text-gray-600 select-none">
        Is Correct?
      </label>
    </div>`
})
export class CheckboxComponent {
  @Input() checked: boolean = false;
  @Input() disabled: boolean = false;
  @Input() id: string | number | null | undefined;
}
