import {Component} from '@angular/core';

@Component({
  selector: 'app-x-button',
  imports: [],
  template: `<button
    class="inline-flex items-center px-0.5 mx-0.5 py-1.5 bg-transparent disabled:bg-indigo-100 hover:text-red-600 text-gray-500 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    aria-label="Edit"
    type="button"
  >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>

  </button>
`
})
export class XButton {}
