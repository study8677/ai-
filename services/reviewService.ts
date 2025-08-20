import type { VocabularyWord, ReviewWord } from '../types';

const REVIEW_KEY = 'ielts-copilot-review-words';
// Spacing intervals in days based on spaced repetition principle
const intervals: number[] = [1, 3, 7, 14, 30, 90, 180];

const getTodayIsoString = (): string => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.toISOString().split('T')[0];
};

const addDays = (date: string, days: number): string => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().split('T')[0];
};

export const getAllReviewWords = (): ReviewWord[] => {
    try {
        const wordsJson = localStorage.getItem(REVIEW_KEY);
        return wordsJson ? JSON.parse(wordsJson) : [];
    } catch (error) {
        console.error("Failed to parse review words from localStorage", error);
        return [];
    }
};

const saveReviewWords = (words: ReviewWord[]): void => {
    localStorage.setItem(REVIEW_KEY, JSON.stringify(words));
};

export const addWordsToReview = (newWords: VocabularyWord[]): void => {
    const existingWords = getAllReviewWords();
    const existingWordSet = new Set(existingWords.map(w => w.word.toLowerCase()));

    const wordsToAdd = newWords
        .filter(nw => !existingWordSet.has(nw.word.toLowerCase()))
        .map((word): ReviewWord => ({
            ...word,
            level: 0,
            nextReviewDate: addDays(getTodayIsoString(), 1), // First review is tomorrow
        }));

    if (wordsToAdd.length > 0) {
        saveReviewWords([...existingWords, ...wordsToAdd]);
    }
};

export const getWordsDueForReview = (): ReviewWord[] => {
    const allWords = getAllReviewWords();
    const today = getTodayIsoString();
    return allWords.filter(word => word.nextReviewDate <= today);
};

export const updateReviewWord = (wordToUpdate: ReviewWord, performance: 'hard' | 'good' | 'easy'): void => {
    const allWords = getAllReviewWords();
    const wordIndex = allWords.findIndex(w => w.word.toLowerCase() === wordToUpdate.word.toLowerCase());

    if (wordIndex === -1) return;

    const word = allWords[wordIndex];
    let newLevel = word.level;

    switch (performance) {
        case 'hard':
            newLevel = Math.max(0, newLevel - 1);
            break;
        case 'good':
            newLevel = newLevel + 1;
            break;
        case 'easy':
            newLevel = newLevel + 2;
            break;
    }

    newLevel = Math.min(newLevel, intervals.length - 1);
    
    const nextInterval = intervals[newLevel];
    word.level = newLevel;
    word.nextReviewDate = addDays(getTodayIsoString(), nextInterval);

    allWords[wordIndex] = word;
    saveReviewWords(allWords);
};
