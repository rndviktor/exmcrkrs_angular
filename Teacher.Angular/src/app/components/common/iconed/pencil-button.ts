import { Component } from '@angular/core';

@Component({
  selector: 'app-pencil-button',
  imports: [],
  template: `<button
    class="inline-flex items-center px-0.5 mx-0.5 py-1.5 bg-transparent hover:bg-indigo-400 text-gray-500 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    aria-label="Edit"
    type="button"
  >
    <svg xmlns="http://www.w3.org/2000/svg" fill-opacity="0" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
</svg>
    </button>
`
})
export class PencilButton { }
