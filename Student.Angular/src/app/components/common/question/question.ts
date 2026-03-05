import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Reader} from '../../../services/reader';
import {ActivatedRoute, Router} from '@angular/router';
import {switchMap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {extractBodyContent, QuestionSubmissionSelection, QuestionViewModel} from '../../../types';
import {Answer} from '../answer/answer';
import {SelectionChangedEvent} from '../checkbox/checkbox';
import {Writer} from '../../../services/writer';

@Component({
  selector: 'app-question',
  imports: [
    Answer
  ],
  template: `
    <div class="p-4 bg-indigo-100">
      <div class="grid gap-4">
        <div class="whitespace-pre-line col-span-10 bg-white" [innerHTML]="content"></div>
      </div>
      @if (data) {
        <ul class="bg-transparent">
          @for (ans of data.Question.Answers; track ans.AnswerId; let even = $even) {
            <li [class.bg-indigo-200]="even" [class.bg-indigo-100]="!even">
              <app-answer [answer]="ans" [checked]="isChecked(ans.AnswerId)"
                          (checkedChange)="updateAnswersSelection($event)"/>
            </li>
          }
        </ul>
      }
      <div class="flex flex-row justify-between bg-gray-200">
        <button [disabled]="data?.Question?.PrevQuestionId == null"
                class="text-gray-700 text-center bg-indigo-400 disabled:bg-indigo-50 px-4 py-2 m-2"
                (click)="navigatePrevQuestion()">Prev
        </button>
        <button id="nextButton" [disabled]="!nextAvailable()"
                class="text-gray-700 text-center bg-indigo-400 disabled:bg-indigo-50 px-4 py-2 m-2"
                (click)="navigateNextQuestion()">{{ data?.Question?.NextQuestionId != null ? "Next" : "Finish" }}
        </button>
      </div>
    </div>
  `
})
export class Question implements OnInit {
  @ViewChild('contentDiv') contentDiv!: ElementRef<HTMLDivElement>;
  submissionId: string | null = null;
  questionId: string | null = null;
  data: QuestionViewModel | null = null;
  content: string | null = null;

  storedAnswers: Set<string> = new Set();
  editedAnswers: Set<string> = new Set();

  constructor(private reader: Reader, private route: ActivatedRoute, private router: Router, private http: HttpClient, private writer: Writer) {
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        this.submissionId = params.get('submissionId');
        this.questionId = params.get('questionId');
        return this.reader.getQuestion(this.submissionId!, this.questionId!);
      })
    ).subscribe({
      next: (item: any) => {
        console.log('item', item);
        this.data = item;
        if (item.QuestionSubmission?.SelectedAnswers) {
          this.storedAnswers = new Set(item.QuestionSubmission.SelectedAnswers);
          this.editedAnswers = new Set(item.QuestionSubmission.SelectedAnswers);
        } else {
          this.storedAnswers = new Set();
          this.editedAnswers = new Set();
        }
        this.http.get(`http://localhost:8080/assets/${item.Question.ContentUrl}`,
          {responseType: 'text'}).subscribe(
          dat => {
            this.content = extractBodyContent(dat)
          }
        )
      }
    });
  }

  async submitAnswersSelection() {
    const selection = {
      QuestionId: this.questionId!,
      SelectedAnswers: Array.from(this.editedAnswers)
    } as QuestionSubmissionSelection;
    if (this.storedAnswers.size > 0) {
      await this.writer.updateAnswersSelection(this.submissionId!, selection);
      this.storedAnswers = new Set(this.editedAnswers);
    } else {
      if (!this.data?.Question.NextQuestionId) {
        await this.writer.finishExam(this.submissionId!, selection);
      } else {
        await this.writer.createAnswersSelection(this.submissionId!, selection)
      }
      this.storedAnswers = new Set(this.editedAnswers);
    }
  }

  isChecked(answerId: string): boolean {
    return this.data?.QuestionSubmission?.SelectedAnswers.find(x => x === answerId) != null;
  }

  async syncWithBackEndAnswersSelection() {
    if (this.answersWereUpdated()) {
      await this.submitAnswersSelection();
    }
  }

  async navigateNextQuestion() {
    await this.syncWithBackEndAnswersSelection();
    if (!this.data?.Question.NextQuestionId) {
      await this.router.navigate(['/']);
    } else {
      await this.router.navigate([this.submissionId, 'question', this.data?.Question.NextQuestionId!]);
    }
  }

  async navigatePrevQuestion() {
    await this.router.navigate([this.submissionId, 'question', this.data?.Question.PrevQuestionId!]);
  }

  updateAnswersSelection(check: SelectionChangedEvent): void {
    if (check.checked) {
      this.editedAnswers?.add(check.id);
    } else {
      this.editedAnswers?.delete(check.id);
    }
  }

  answersWereUpdated(): boolean {
    if (this.editedAnswers?.size && this.storedAnswers?.size !== this.editedAnswers?.size) return true;

    if (this.storedAnswers) {
      for (const item of this.storedAnswers) {
        if (!this.editedAnswers?.has(item)) return true;
      }
    }
    return false;
  }

  nextAvailable(): boolean {
    return this.editedAnswers.size !== 0;
  }
}
