import { GoogleGenAI, Type } from "@google/genai";
import type { GrammarCorrection, SpeakingTopic, VocabularyWord, WritingFeedback, WritingTask } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = 'gemini-2.5-flash';

export const generateVocabulary = async (topic: string, existingWords: string[] = []): Promise<VocabularyWord[]> => {
  const prompt = `Generate a list of 10 advanced, IELTS-relevant vocabulary words related to the topic: "${topic}". ${existingWords.length > 0 ? `Do not include any of the following words: ${existingWords.join(', ')}.` : ''} For each word, provide its Chinese translation, its phonetic pronunciation, a clear definition in both Chinese and English (e.g., "Definition: [English] / [Chinese]"), and an example sentence in English.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING, description: 'The vocabulary word.' },
            translation: { type: Type.STRING, description: 'The Chinese translation of the word.' },
            pronunciation: { type: Type.STRING, description: 'The phonetic pronunciation of the word.' },
            definition: { type: Type.STRING, description: 'A clear definition of the word in both English and Chinese.' },
            example: { type: Type.STRING, description: 'An example sentence using the word.' },
          },
          required: ['word', 'translation', 'pronunciation', 'definition', 'example'],
        },
      },
    },
  });

  try {
    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as VocabularyWord[];
  } catch (e) {
    console.error("Failed to parse vocabulary JSON:", e);
    throw new Error("Received invalid data from the AI. Please try again.");
  }
};

export const generateRandomIeltsTopic = async (): Promise<string> => {
    const response = await ai.models.generateContent({
        model,
        contents: `Generate a single common IELTS topic suitable for vocabulary building. Examples: Environment, Technology, Health, Education, Globalization. Return only the topic name as a single string, without any extra text or quotation marks.`,
    });
    return response.text.trim();
};

export const correctGrammar = async (text: string): Promise<GrammarCorrection> => {
    const response = await ai.models.generateContent({
        model,
        contents: `I am a native Chinese speaker preparing for IELTS. Please correct the grammar in the following English text. Provide the corrected version and a simple, clear explanation of the key mistakes in Chinese.
        Original Text: "${text}"`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    original: { type: Type.STRING, description: 'The original text provided by the user.'},
                    corrected: { type: Type.STRING, description: 'The grammatically corrected version of the text.' },
                    explanation: { type: Type.STRING, description: 'A brief explanation in Chinese of the major errors that were fixed.' },
                },
                required: ['original', 'corrected', 'explanation'],
            }
        }
    });

    try {
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as GrammarCorrection;
    } catch(e) {
        console.error("Failed to parse grammar correction JSON:", e);
        throw new Error("Received invalid data from the AI. Please try again.");
    }
};

export const generateSpeakingTopic = async (): Promise<SpeakingTopic> => {
    const response = await ai.models.generateContent({
        model,
        contents: `Generate a random IELTS Speaking Part 2 topic card. Provide the main topic in English, a Chinese translation for the topic, and three "You should say" bullet points in English.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    topic: { type: Type.STRING, description: 'The main speaking topic, e.g., "Describe a book you have recently read."' },
                    topicTranslation: { type: Type.STRING, description: 'The Chinese translation of the main topic.' },
                    cues: { 
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: 'An array of three strings, each being a "You should say" cue.'
                    },
                },
                required: ['topic', 'topicTranslation', 'cues'],
            }
        }
    });

    try {
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as SpeakingTopic;
    } catch(e) {
        console.error("Failed to parse speaking topic JSON:", e);
        throw new Error("Received invalid data from the AI. Please try again.");
    }
};

export const generateWritingTask = async (): Promise<WritingTask> => {
    const response = await ai.models.generateContent({
        model,
        contents: `Generate a random IELTS Writing Task 2 question. Provide the question in English and also a Chinese translation of the question.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: 'The full text of the IELTS Writing Task 2 question.' },
                    questionTranslation: { type: Type.STRING, description: 'The Chinese translation of the question.' },
                    type: { type: Type.STRING, description: 'Always "Task 2"' },
                },
                required: ['question', 'questionTranslation', 'type'],
            }
        }
    });

    try {
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as WritingTask;
    } catch(e) {
        console.error("Failed to parse writing task JSON:", e);
        throw new Error("Received invalid data from the AI. Please try again.");
    }
}

export const analyzeWriting = async (question: string, essay: string): Promise<WritingFeedback> => {
    const prompt = `As an expert IELTS examiner, please evaluate the following essay written for the question: "${question}". The student is a native Chinese speaker.
    
    Essay:
    "${essay}"

    Please provide your feedback entirely in Chinese to help the student understand better. Your feedback should cover:
    1. A detailed evaluation based on the official IELTS criteria (Task Response, Coherence and Cohesion, Lexical Resource, Grammatical Range and Accuracy).
    2. An estimated overall band score.
    3. A revised version of the essay in English that would score higher.`;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    bandScore: { type: Type.NUMBER, description: 'The estimated overall band score, e.g., 6.5.' },
                    feedback: {
                        type: Type.OBJECT,
                        properties: {
                            taskResponse: { type: Type.STRING, description: 'Feedback on task response, in Chinese.'},
                            coherenceAndCohesion: { type: Type.STRING, description: 'Feedback on coherence and cohesion, in Chinese.'},
                            lexicalResource: { type: Type.STRING, description: 'Feedback on lexical resource, in Chinese.'},
                            grammaticalRangeAndAccuracy: { type: Type.STRING, description: 'Feedback on grammatical range and accuracy, in Chinese.'},
                        },
                         required: ['taskResponse', 'coherenceAndCohesion', 'lexicalResource', 'grammaticalRangeAndAccuracy'],
                    },
                    revisedEssay: { type: Type.STRING, description: 'A revised, improved version of the essay in English.'},
                },
                required: ['bandScore', 'feedback', 'revisedEssay'],
            }
        }
    });

     try {
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as WritingFeedback;
    } catch(e) {
        console.error("Failed to parse writing feedback JSON:", e);
        throw new Error("Received invalid data from the AI. Please try again.");
    }
}