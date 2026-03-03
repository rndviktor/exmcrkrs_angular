import {computed, Injectable, signal} from '@angular/core';
import {AnswerType, ExamType, QuestionType} from '../types';
import {Reader} from './reader';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private examSignal = signal<ExamType[]>([]);
  private isLoaded = false;

  constructor(private reader: Reader) {
  }

  loadExams() {
    if (!this.isLoaded) {
      this.reader.getData().subscribe((data) => {
        this.examSignal.set(data?.Exams || [])
        this.isLoaded = true;
      })
    }
  }

  reload() {
    this.isLoaded = false;
    this.loadExams();
  }

  get exams() {
    return this.examSignal;
  }

  questionSignal(examId: string, questionId: string) {
    return computed(() => this.examSignal().find(ex => ex.ExamId === examId)?.Questions.find(q => q.QuestionId === questionId));
  }

  addExam(exam: ExamType) {
    exam.Version = 1;
    this.exams.update(x => [...x, exam]);
  }

  resetAccessCode(examId: string) {
    if (examId) {
      this.exams.update(x => x.map(ex => (ex.ExamId === examId ? {...ex, AccessCode: undefined} : ex)));
    }
  }

  updateExamAccessCode(updateExam: ExamType) {
    this.exams.update(x => x.map(ex => (ex.ExamId === updateExam.ExamId ? {...ex, AccessCode: updateExam.AccessCode} : ex)));
  }

  updateExamTitle(updateExam: ExamType) {
    this.exams.update(x => x.map(ex => (ex.ExamId === updateExam.ExamId ? {...ex, Title: updateExam.Title} : ex)));
  }

  deleteExam(examId: string) {
    this.exams.update(exams => exams.filter(x => x.ExamId !== examId));
  }

  addQuestionToExam(examId: string, question: QuestionType) {
    this.exams.update(exams =>
      exams.map(exam => (exam.ExamId === examId ? {
        ...exam,
        Questions: exam.Questions?.length ? [...exam.Questions, question] : [question]
      } : exam))
    );
  }

  updateQuestionContentAtExam(examId: string, question: QuestionType) {
    this.exams.update(exams =>
      exams.map(exam => (exam.ExamId === examId ? {
        ...exam,
        Questions: exam.Questions.map(q => (q.QuestionId === question.QuestionId ? {
          ...q,
          Content: question.Content
        } : q))
      } : exam))
    );
  }

  deleteQuestion(examId: string, questionId: string) {
    this.exams.update(exams =>
      exams.map(exam => (exam.ExamId === examId ? {
        ...exam,
        Questions: exam.Questions.filter(q => q.QuestionId !== questionId)
      } : exam))
    );
  }

  addAnswerToQuestion(examId: string, questionId: string, answer: AnswerType) {
    this.exams.update(exams =>
      exams.map(exam => (exam.ExamId === examId ? {
        ...exam,
        Questions: exam.Questions.map(q => (q.QuestionId === questionId ? {
          ...q,
          Answers: [...(q.Answers || []), answer]
        } : q))
      } : exam))
    );
  }

  updateAnswerWithinQuestion(examId: string, questionId: string, answer: AnswerType) {
    this.exams.update(exams =>
      exams.map(exam => (exam.ExamId === examId ? {
        ...exam,
        Questions: exam.Questions.map(q => (q.QuestionId === questionId ? {
          ...q,
          Answers: q.Answers != undefined ? q.Answers.map(a => (a.AnswerId === answer.AnswerId ? answer : a)) : undefined
        } : q))
      } : exam))
    );
  }

  deleteAnswerWithinQuestion(examId: string, questionId: string, answerId: string) {
    this.exams.update(exams =>
      exams.map(exam => (exam.ExamId === examId ? {
        ...exam,
        Questions: exam.Questions.map(q => (q.QuestionId === questionId ? {
          ...q,
          Answers: q.Answers != undefined ? q.Answers.filter(a => a.AnswerId != answerId) : undefined
        } : q))
      } : exam))
    );
  }
}
