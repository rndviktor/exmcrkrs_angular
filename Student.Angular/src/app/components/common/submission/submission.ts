import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import {
  ExamSubmissionsViewModel,
  extractBodyContent, QuestionCorrectness,
  QuestionSubmissionSelection,
  QuestionType,
  QuestionViewModel
} from '../../../types';
import { QuestionSubmissionView } from '../question-submission-view/question-submission-view';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-submission',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    QuestionSubmissionView
  ],
  template: `
    <div class="divide-y divide-gray-200">
      @for (question of submission.Exam.Questions; track question.QuestionId) {
        <button
          class="w-full flex justify-between items-center p-4 text-left focus:outline-none"
          (click)="toggle(question.QuestionId!)"
          [attr.aria-expanded]="isOpen(question.QuestionId!)"
          [class]="isOpen(question.QuestionId!) ? 'bg-gray-100' : 'bg-white'"
        >
          <span>{{ question.QuestionId }} -- {{ getScoreString(question.QuestionId) }} </span>
          <svg
            class="w-5 h-5 transition-transform duration-300"
            [class.rotate-180]="isOpen(question.QuestionId!)"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>
        <div
          [class.hidden]="!isOpen(question.QuestionId!)"
          class="p-4 bg-gray-50 text-gray-700 transition-all duration-300"
        >
          @if (openedIndex) {
            <app-question-submission-view [question]="getQuestion()" [selection]="getSelection()" [content]="content"
                                          [questionCorrectness]="getQuestionCorrectness()"/>
          }
        </div>
      }
    </div>
  `
})
export class Submission {
  @Input() submission!: ExamSubmissionsViewModel;
  @Input() question?: QuestionViewModel;
  content: string | null = null;

  openedIndex: string | null = null;

  constructor(private http: HttpClient) {
  }

  toggle(index: string) {
    this.openedIndex = this.openedIndex === index ? null : index;
    this.getStaticContent().then(content => this.content = content);
  }

  getScoreString(questionId: string): string | undefined {
    return this.question?.Submissions.find(x => x.QuestionId == questionId)?.ScoreString
  }

  async getStaticContent() {
    if (this.openedIndex != null) {
      const res = await this.http.get(`http://localhost:8080/assets/${this.submission.Exam.Questions?.find(x => x.QuestionId === this.openedIndex)?.ContentUrl}`,
        { responseType: 'text' }
      ).toPromise().then()
      return res ? extractBodyContent(res) : null;
    }

    return null;
  }

  getQuestion(): QuestionType | undefined {
    return this.openedIndex !== null ? this.submission.Exam.Questions?.find(x => x.QuestionId === this.openedIndex) : undefined;
  }

  getSelection(): QuestionSubmissionSelection | undefined {
    return this.openedIndex !== null ? this.submission.ExamSubmission.QuestionsSubmissions?.find(x => x.QuestionId === this.openedIndex) : undefined;
  }

  getQuestionCorrectness(): QuestionCorrectness | undefined {
    return this.openedIndex !== null ? this.question?.Questions.find(x => x.QuestionId == this.openedIndex) : undefined;
  }

  isOpen(index: string): boolean {
    return this.openedIndex === index;
  }
}
