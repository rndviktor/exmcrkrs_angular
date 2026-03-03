export interface AnswerType {
  AnswerId: string | null;
  Content: string;
  IsCorrect: boolean;
}

export interface QuestionType {
  QuestionId: string | null | undefined;
  Content: string | null;
  Answers?: AnswerType[];
}

export interface ExamType {
  ExamId: string | null;
  Version: number | null | undefined;
  Title: string;
  AccessCode?: string;
  Questions: QuestionType[];
}
