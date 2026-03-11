import { Component, OnDestroy } from '@angular/core';
import { Reader } from '../../../services/reader';
import { Subject, takeUntil } from 'rxjs';
import { ExamSubmissionsViewModel, ExamSubmissionType, formatDateTime, QuestionViewModel } from '../../../types';
import { Submission } from '../submission/submission';
import { Evaluator } from '../../../services/evaluator';

const scorePercentString = (score: number) => {
  const percent = score * 100;
  const scoreNumb = Number.isInteger(percent) ? percent : percent.toFixed(1);
  return `${scoreNumb}%`;
}

@Component({
  selector: 'app-submissions-view',
  imports: [
    Submission
  ],
  template: `
    <div class="divide-y divide-gray-200">
      @for (submission of submissions; track submission.ExamSubmission.ExamSubmissionId) {
        <button
          class="w-full flex justify-between items-center p-4 text-left focus:outline-none"
          (click)="toggle(submission.ExamSubmission.ExamSubmissionId!)"
          [attr.aria-expanded]="isOpen(submission.ExamSubmission.ExamSubmissionId!)"
          [class]="isOpen(submission.ExamSubmission.ExamSubmissionId!) ? 'bg-gray-100' : 'bg-white'"
        >
          <span>{{ submission.Exam.Title + ' v' + submission.Exam.Version }} {{ formatDateTime(submission.ExamSubmission.EndDate!) }}
            -- {{ submission.ExamSubmission.ScoreString }}</span>
          <div>
            <svg [id]="getSvgId(submission.ExamSubmission.ExamSubmissionId!)"
                 class="w-5 h-5 transition-transform duration-300"
                 [class.rotate-180]="isOpen(submission.ExamSubmission.ExamSubmissionId!)"
                 fill="none"
                 stroke='currentColor'
                 viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </div>
        </button>
        <div
          [class.hidden]="!isOpen(submission.ExamSubmission.ExamSubmissionId!)"
          class="p-4 bg-gray-50 text-gray-700 transition-all duration-300"
        >
          <app-submission [submission]="submission" [question]="questions"/>
        </div>
      }
    </div>
  `
})
export class SubmissionsView implements OnDestroy {
  private destroy$ = new Subject<void>();

  submissions: ExamSubmissionsViewModel[] = []
  questions?: QuestionViewModel;

  openedIndex: string | null = null;

  toggle(index: string) {
    this.openedIndex = this.openedIndex === index ? null : index;
    this.changeStroke(index, false);
    this.handleSubmissionToggle();
  }

  handleSubmissionToggle() {
    if (this.openedIndex) {
      this.evaluator.getSubmission(this.openedIndex)
        .subscribe((data: QuestionViewModel) => {
          data.Submissions.map(s => {
            s.ScoreString = scorePercentString(s.Score);
          })
          this.questions = data;
        })
    }
  }

  isOpen(index: string): boolean {
    return this.openedIndex === index;
  }

  getSvgId(index: string): string {
    return `SVG_${index}`;
  }

  changeStroke(submId: string, toRed: boolean) {
    const svg = document.getElementById(this.getSvgId(submId));
    if (toRed) {
      svg!.setAttribute('stroke', 'red');
    } else {
      svg!.setAttribute('stroke', 'currentColor');
    }
  }

  constructor(private reader: Reader, private evaluator: Evaluator) {
    this.reader.getSubmissions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.submissions = data.map((x: ExamSubmissionsViewModel) => {
          x.ExamSubmission.EndDate = new Date(x.ExamSubmission.FinishDate!);
          return x;
        })

        this.evaluator.getData()
          .pipe(takeUntil(this.destroy$))
          .subscribe(data => {
            data.map((item: ExamSubmissionType) => {
              const submission = this.submissions.find(x => x.ExamSubmission.ExamSubmissionId === item.ExamSubmissionId);
              if (submission) {
                submission.ExamSubmission.Score = item.Score;
                submission.ExamSubmission.ScoreString = scorePercentString(item.Score!)
                submission.ExamSubmission.IsShown = item.IsShown;
                this.changeStroke(submission.ExamSubmission.ExamSubmissionId!, !item.IsShown);
              }
            })
            console.log('received', this.submissions)
          });
      });


  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected readonly formatDateTime = formatDateTime;
}
