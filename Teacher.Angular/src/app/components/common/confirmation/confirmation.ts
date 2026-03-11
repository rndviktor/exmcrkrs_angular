import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation',
  imports: [],
  template: `
    @if (visible) {
      <div
        class="fixed inset-0 flex items-center justify-center bg-teal-600/80 z-50"
      >
        <div class="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
          <p class="text-lg mb-6">{{ message }}</p>
          <div class="flex justify-end space-x-4">
            <button
              (click)="onCancel()"
              class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              No
            </button>
            <button
              (click)="onConfirm()"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class Confirmation {
  @Input() visible = false;
  @Input() message = 'Are you sure?';
  @Output() confirmed = new EventEmitter<boolean>();

  onConfirm() {
    this.confirmed.emit(true);
    this.visible = false;
  }

  onCancel() {
    this.confirmed.emit(false);
    this.visible = false;
  }
}
