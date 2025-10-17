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
        this.examSignal.set(data?.exams || [])
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
    return computed(() => this.examSignal().find(ex => ex.examId === examId)?.questions.find(q => q.questionId === questionId));
  }

  addExam(exam: ExamType) {
    exam.version = 1;
    this.exams.update(x => [...x, exam]);
  }

  resetAccessCode(exam: ExamType) {
    if (exam) {
      exam.accessCode = undefined;
      this.exams.update(x => x.map(ex => (ex.examId === exam.examId ? {...exam} : ex)));
    }
  }

  updateExamAccessCode(updateExam: ExamType) {
    this.exams.update(x => x.map(ex => (ex.examId === updateExam.examId ? {...ex, accessCode: updateExam.accessCode} : ex)));
  }

  updateExamTitle(updateExam: ExamType) {
    this.exams.update(x => x.map(ex => (ex.examId === updateExam.examId ? {...ex, title: updateExam.title} : ex)));
  }

  deleteExam(examId: string) {
    this.exams.update(exams => exams.filter(x => x.examId !== examId));
  }

  addQuestionToExam(examId: string, question: QuestionType) {
    this.exams.update(exams =>
      exams.map(exam => (exam.examId === examId ? {
        ...exam,
        questions: exam.questions?.length ? [...exam.questions, question] : [question]
      } : exam))
    );
  }

  updateQuestionContentAtExam(examId: string, question: QuestionType) {
    this.exams.update(exams =>
      exams.map(exam => (exam.examId === examId ? {
        ...exam,
        questions: exam.questions.map(q => (q.questionId === question.questionId ? {
          ...q,
          content: question.content
        } : q))
      } : exam))
    );
  }

  deleteQuestion(examId: string, questionId: string) {
    this.exams.update(exams =>
      exams.map(exam => (exam.examId === examId ? {
        ...exam,
        questions: exam.questions.filter(q => q.questionId !== questionId)
      } : exam))
    );
  }

  addAnswerToQuestion(examId: string, questionId: string, answer: AnswerType) {
    this.exams.update(exams =>
      exams.map(exam => (exam.examId === examId ? {
        ...exam,
        questions: exam.questions.map(q => (q.questionId === questionId ? {
          ...q,
          answers: [...(q.answers || []), answer]
        } : q))
      } : exam))
    );
  }

  updateAnswerWithinQuestion(examId: string, questionId: string, answer: AnswerType) {
    this.exams.update(exams =>
      exams.map(exam => (exam.examId === examId ? {
        ...exam,
        questions: exam.questions.map(q => (q.questionId === questionId ? {
          ...q,
          answers: q.answers != undefined ? q.answers.map(a => (a.answerId === answer.answerId ? answer : a)) : undefined
        } : q))
      } : exam))
    );
  }

  deleteAnswerWithinQuestion(examId: string, questionId: string, answerId: string) {
    this.exams.update(exams =>
      exams.map(exam => (exam.examId === examId ? {
        ...exam,
        questions: exam.questions.map(q => (q.questionId === questionId ? {
          ...q,
          answers: q.answers != undefined ? q.answers.filter(a => a.answerId != answerId) : undefined
        } : q))
      } : exam))
    );
  }
}
