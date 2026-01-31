
export interface Note {
  id: string;
  name: string;
  content: string;
  type: 'pdf' | 'text';
  timestamp: number;
  summary?: string;
  keyTakeaways?: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  sources?: { uri: string; title: string }[];
}

export interface SummaryResponse {
  summary: string;
  keyTakeaways: string[];
}

export type QuizDifficulty = 'Foundational' | 'Standard' | 'Rigorous' | 'Elite';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizResult {
  score: number;
  total: number;
  timestamp: number;
}

export interface LessonDrill {
  conceptExplanation: string;
  exampleProblem: string;
  exampleSolution: string;
  practiceQuestion: string;
  practiceAnswer: string;
  practiceExplanation: string;
}

export interface ProgressAnalysis {
  overallMastery: number;
  studyTimeEstimate: string;
  streakCount: number;
  subjects: {
    name: string;
    strength: string[];
    weakness: string[];
    masteryScore: number;
    completionPercentage: number;
    highYieldTopics: string[];
  }[];
}

export type PlanType = 'Basic' | 'Brain Plus+' | 'Brain Ultra';

export type AppView = 'repository' | 'quiz' | 'progress' | 'lessons';
