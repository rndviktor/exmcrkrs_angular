import {Component} from '@angular/core';

@Component({
  selector: 'app-home-button',
  imports: [],
  template: `<button
    class="inline-flex items-center px-0.5 mx-0.5 py-1.5 bg-transparent hover:bg-indigo-400 text-gray-500 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    aria-label="Edit"
    type="button"
  >
    <svg xmlns="http://www.w3.org/2000/svg" fill-opacity="0" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>

  </button>
`
})
export class HomeButton {}
