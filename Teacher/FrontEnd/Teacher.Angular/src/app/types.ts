export interface AnswerType {
  answerId: string | null;
  content: string;
  isCorrect: boolean;
}

export interface QuestionType {
  questionId: string | null | undefined;
  content: string | null;
  answers?: AnswerType[];
}

export interface ExamType {
  examId: string | null;
  version: number | null | undefined;
  title: string;
  accessCode?: string;
  questions: QuestionType[];
}
