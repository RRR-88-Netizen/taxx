
import type { Timestamp } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface Comment {
  id:string;
  text: string;
  userId: string;
  userName: string;
  userAvatar?: string | null;
  createdAt: Timestamp | Date; // Allow Date for client-side creation before Firestore conversion
}

export interface LinkItem {
  name: string;
  url: string;
}

export interface AccordionSection {
  id: string;
  title: string;
  description?: string;
  links: LinkItem[];
}

export interface AccordionContentData {
  type: 'accordion';
  items: AccordionSection[];
}

export interface FinancialGameContentData {
  type: 'financial_game';
  // Future game-specific static config can go here if needed
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  type: 'single-choice' | 'multiple-choice';
  options: QuizOption[];
  correctOptionIds: string[]; // Array of correct option IDs
  points: number;
  explanation?: string; // Optional explanation for the answer
}

export interface QuizContentData {
  type: 'quiz';
  title: string;
  questions: QuizQuestion[];
}

// For displaying individual question records within a quiz attempt
export interface QuizQuestionAttemptRecord {
  questionId: string;
  questionText: string;
  options: QuizOption[];
  selectedOptionIds: string[];
  correctOptionIds: string[];
  isCorrect: boolean;
  pointsEarned: number;
  pointsPossible: number;
  explanation?: string;
}

// For displaying a single quiz attempt record
export interface QuizAttemptRecord {
  id: string; // Firestore document ID or unique identifier for the attempt
  quizTitle: string;
  userId: string;
  timestamp: Timestamp | Date;
  score: number;
  totalPossibleScore: number;
  questionsAttempted: QuizQuestionAttemptRecord[];
  accuracy: number; // Calculated: score / totalPossibleScore
}

// For displaying a single game record
export interface GameRecord {
  id: string; // Firestore document ID
  userId: string;
  timestamp: Timestamp | Date;
  finalBalance: number;
  roundsCompleted: number;
  finalGrade?: string;
  totalCorrectQuizAnswers?: number; // Added
  totalQuizQuestions?: number;    // Added
  // Potentially more details like game log, significant choices etc.
}

export interface RecordsDashboardContentData {
  type: 'records_dashboard';
}

export type LearningModuleContent =
  | string
  | AccordionContentData
  | FinancialGameContentData
  | QuizContentData
  | RecordsDashboardContentData;

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  introductionText?: string;
  content: LearningModuleContent;
  imageUrl?: string;
  aiHint?: string;
}

export interface UserProgress {
  userId: string;
  completedModules: string[];
}
