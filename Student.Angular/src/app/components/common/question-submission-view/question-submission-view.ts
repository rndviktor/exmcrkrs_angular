import { Component, Input } from '@angular/core';
import { QuestionCorrectness, QuestionSubmissionSelection, QuestionType } from '../../../types';

@Component({
  selector: 'app-question-submission-view',
  imports: [],
  template: `
    @if (content) {
      <div class="grid gap-4">
        <div class="whitespace-pre-line col-span-10 bg-white border question-content" [innerHTML]="content"></div>
      </div>
    }
    <div class="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Answer
            Content
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Checked
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Is
            Correct
          </th>
        </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          @for (answer of question?.Answers; track answer.AnswerId) {
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ answer.Content }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"> {{ isChecked(answer.AnswerId) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ isCorrect(answer.AnswerId) }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class QuestionSubmissionView {
  @Input() question?: QuestionType;
  @Input() selection?: QuestionSubmissionSelection;
  @Input() content: string | null = null;
  @Input() questionCorrectness?: QuestionCorrectness;

  isChecked(answerId: string) {
    return this.selection?.SelectedAnswers.find(x => x == answerId) != null ? 'True' : '';
  }

  isCorrect(answerId: string) {
    return this.questionCorrectness?.Answers.find(x => x.AnswerId == answerId)?.IsCorrect ? 'True' : '';
  }
}
