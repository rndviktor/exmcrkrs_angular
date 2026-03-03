export interface AnswerType {
  AnswerId: string;
  Content: string;
}

export interface PaymentConfirmationSubmission {
  AccessCode: string;
  PaymentMethodId: string;
}

export interface QuestionType {
  QuestionId: string;
  ExamId: string;
  ContentUrl: string;
  NextQuestionId?: string;
  PrevQuestionId?: string;
  Answers: AnswerType[];
}

export interface QuestionSubmissionType {
  QuestionSubmissionId: string;
  QuestionId: string;
  SelectedAnswers: string[],
  ExamSubmissionId: string;
  Score?: number;
  LastUpdated: Date;
}

export interface QuestionSubmissionSelection {
  StudentId: string;
  QuestionId: string;
  Score?: number;
  ScoreString?: string;
  SelectedAnswers: string[],
}

export interface QuestionViewModel {
  Question: QuestionType;
  QuestionSubmission: QuestionSubmissionType;
  CountQuestions: number;
  CountSubmittedQuestions: number;
}

export interface ExamType {
  ExamId: string;
  AuthorId: string;
  Title: string;
  Version: number;
  ComposeKey: string;
  Questions?: QuestionType[]
}

export interface ExamSubmissionType {
  ExamId?: string;
  ExamSubmissionId?: string;
  ExamVersion?: number;
  FinishDate?: string;
  QuestionsSubmissions?: QuestionSubmissionSelection[];
  EndDate?: Date
  IsShown?: boolean;
  Score?: number;
  ScoreString?: string;
}

export interface ExamSubmissionsViewModel {
  Exam: ExamType;
  ExamSubmission: ExamSubmissionType;
}

export interface QuestionScore {
  QuestionId: string;
  Score: number;
  ScoreString?: string;
}

export interface AnswerCorrectness {
  AnswerId: string;
  IsCorrect: boolean;
}

export interface QuestionCorrectness {
  QuestionId: string;
  Answers: AnswerCorrectness[];
}

export interface QuestionViewModel {
  Questions: QuestionCorrectness[],
  Submissions: QuestionScore[]
}

export const formatDateTime = (date: Date)=> {
  const pad = (num: number) => num.toString().padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export const extractBodyContent = (html: string): string => {
  const bodyMatch = html.match(/<body[^>]*>((.|[\n\r])*)<\/body>/im);
  return bodyMatch ? bodyMatch[1] : html; // fallback to full html if no body found
}
