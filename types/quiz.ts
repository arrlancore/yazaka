// types/quiz.ts
export type QuestionType = "multiple-choice" | "text-input";

export interface Question {
  text: string;
  type: QuestionType;
  options?: string[];
  correctAnswer: string;
}

export interface QuizState {
  currentQuestionIndex: number;
  answers: string[];
  isCompleted: boolean;
}
