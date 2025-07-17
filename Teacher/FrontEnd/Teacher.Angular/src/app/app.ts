import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ExamType, Reader} from './services/reader';
import {Subject, takeUntil} from 'rxjs';
import {Exam} from './components/read/exam/exam';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  hostDirectives: [],
  template: `
    <h2>Teacher Angular</h2>
    <br/>

    <ul>
      @for (ex of exams; track ex.id) {
        <app-exam [exam]="ex" />
      }
    </ul>
  `,
  imports: [
    Exam,
    CommonModule,
  ],
  styleUrl: './app.css'
})
export class App {
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

  count = signal(0)
  increment = () => {}
  protected readonly title = signal('Teacher.Angular');
}
