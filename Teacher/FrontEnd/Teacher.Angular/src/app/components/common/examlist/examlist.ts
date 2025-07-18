import { Component } from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {ExamType, Reader} from '../../../services/reader';
import {Exam} from '../exam/exam';

@Component({
  selector: 'app-examlist',
  imports: [
    Exam
  ],
  template: `
    <ul>
      @for (ex of exams; track ex.examId) {
        <app-exam [exam]="ex" />
      }
    </ul>
  `
})
export class Examlist {
  private destroy$ = new Subject<void>();

  exams: ExamType[] = [];
  constructor(private reader: Reader) {
    this.reader.getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        console.log('received', data);
        this.exams = data.exams;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
