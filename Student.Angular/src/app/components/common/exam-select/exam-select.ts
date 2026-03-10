import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ExamType } from '../../../types';

@Component({
  selector: 'app-exam-select',
  imports: [],
  template: `
    <div class="p-4 bg-indigo-100">
      <div class="grid gap-4">
        @if (exams && exams.length > 0) {
          <ul>
            @for (ex of exams; track ex.ComposeKey) {
              <li class="flex flex-row justify-between bg-gray-200">
                <button class="text-gray-700 text-center bg-indigo-400 disabled:bg-indigo-50 px-4 py-2 m-2"
                        (click)="startExam(ex.ExamId)"> Start
                </button>
                <div class="px-4 py-2 m-2">{{ ex.Title }}</div>
                <div class="px-4 py-2 m-2">v{{ ex.Version }}</div>
              </li>
            }
          </ul>
        } @else {
          <div>No exams available</div>
        }
      </div>
    </div>
  `
})
export class ExamSelect {
  @Input() exams: ExamType[] = [];
  @Output() examSelected: EventEmitter<string> = new EventEmitter();

  startExam(examIdSubmit: string) {
    this.examSelected.emit(examIdSubmit);
  }
}
