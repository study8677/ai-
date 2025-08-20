export enum View {
  Dashboard = 'DASHBOARD',
  Vocabulary = 'VOCABULARY',
  Grammar = 'GRAMMAR',
  Speaking = 'SPEAKING',
  Writing = 'WRITING',
  Review = 'REVIEW',
}

export interface VocabularyWord {
  word: string;
  translation: string;
  definition: string;
  example: string;
  pronunciation: string;
}

export interface ReviewWord extends VocabularyWord {
  nextReviewDate: string; // YYYY-MM-DD
  level: number;
}

export interface GrammarCorrection {
  original: string;
  corrected: string;
  explanation: string;
}

export interface SpeakingTopic {
  topic: string;
  topicTranslation: string;
  cues: string[];
}

export interface WritingTask {
    question: string;
    questionTranslation: string;
    type: 'Task 1' | 'Task 2';
}

export interface WritingFeedback {
  bandScore: number;
  feedback: {
    taskResponse: string;
    coherenceAndCohesion: string;
    lexicalResource: string;
    grammaticalRangeAndAccuracy: string;
  };
  revisedEssay: string;
}