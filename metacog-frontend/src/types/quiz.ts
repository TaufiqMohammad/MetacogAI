export type ConfidenceLevel = 'certain' | 'doubtful' | 'guessing';

export interface Question {
  id: string;
  topic: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  socraticHint: string;
}

export interface QuizResponse {
  questionId: string;
  selectedAnswerIndex: number;
  confidenceLevel: ConfidenceLevel;
  isCorrect: boolean;
}
