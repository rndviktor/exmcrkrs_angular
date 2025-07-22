import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-check',
  template: `<button
    class="inline-flex items-center px-0.5 mx-0.5 py-1.5 bg-indigo-200 disabled:bg-indigo-100  hover:bg-indigo-400 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    aria-label="Edit"
    [disabled]="disabled"
    type="submit"
  >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  </button>`
})
export class CheckIconComponent {
  @Input() disabled: boolean = false
}
