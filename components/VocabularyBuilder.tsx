import React, { useState } from 'react';
import Card from './common/Card';
import LoadingSpinner from './common/LoadingSpinner';
import type { VocabularyWord } from '../types';
import { generateVocabulary, generateRandomIeltsTopic } from '../services/geminiService';
import { addWordsToReview } from '../services/reviewService';

const SpeakerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5 5 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
  </svg>
);


const VocabularyBuilder: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [wordsAdded, setWordsAdded] = useState<boolean>(false);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('请输入一个主题。');
      return;
    }
    setIsLoading(true);
    setError(null);
    setWords([]);
    setWordsAdded(false);
    try {
      const result = await generateVocabulary(topic);
      setWords(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRandomGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setWords([]);
    setWordsAdded(false);
    try {
      const randomTopic = await generateRandomIeltsTopic();
      setTopic(randomTopic);
      const result = await generateVocabulary(randomTopic);
      setWords(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    setError(null);
    try {
      const existingWordStrings = words.map(w => w.word);
      const result = await generateVocabulary(topic, existingWordStrings);
      setWords(prevWords => [...prevWords, ...result]);
      setWordsAdded(false); // Allow adding the new words to review
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleAddToReview = () => {
      addWordsToReview(words);
      setWordsAdded(true);
  };

  const speakWord = (englishWord: string, chineseTranslation: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any previous speech

      const englishUtterance = new SpeechSynthesisUtterance(englishWord);
      englishUtterance.lang = 'en-US';

      const chineseUtterance = new SpeechSynthesisUtterance(chineseTranslation);
      chineseUtterance.lang = 'zh-CN';

      // Speak English first, then Chinese
      englishUtterance.onend = () => {
        window.speechSynthesis.speak(chineseUtterance);
      };
      
      window.speechSynthesis.speak(englishUtterance);
    } else {
      alert('抱歉，您的浏览器不支持语音播报功能。');
    }
  };


  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-800 mb-2">词汇构建</h2>
      <p className="text-slate-500 mb-8">输入一个主题，生成与雅思相关的词汇列表。</p>
      
      <div className="flex items-center space-x-2 mb-8">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="例如：环境、科技、健康"
          className="flex-grow p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          disabled={isLoading}
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition"
        >
          {isLoading ? '生成中...' : '生成'}
        </button>
        <button
          onClick={handleRandomGenerate}
          disabled={isLoading}
          className="px-5 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition"
        >
          随机主题
        </button>
      </div>

      {error && <p className="text-red-500 bg-red-100 p-3 rounded-lg text-center">{error}</p>}
      
      {isLoading && <LoadingSpinner />}
      
      {words.length > 0 && (
        <>
          <div className="text-center mb-6">
              <button 
                  onClick={handleAddToReview}
                  disabled={wordsAdded}
                  className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed transition"
                  >
                  {wordsAdded ? '已添加' : '添加到复习计划'}
              </button>
          </div>
          <div className="space-y-4">
            {words.map((word, index) => (
              <Card key={index}>
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                      <h3 className="text-xl font-semibold text-slate-900">{word.word}</h3>
                      <span className="text-slate-500 font-medium">{word.translation}</span>
                  </div>
                  <button
                    onClick={() => speakWord(word.word, word.translation)}
                    className="p-1 rounded-full text-slate-500 hover:bg-slate-200 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex-shrink-0 ml-4"
                    aria-label={`收听 ${word.word} 的发音`}
                  >
                    <SpeakerIcon />
                  </button>
                </div>
                <p className="text-slate-500 italic mt-1 mb-2">{word.pronunciation}</p>
                <p className="text-slate-700 mb-2">{word.definition}</p>
                <p className="text-sm text-slate-500 bg-slate-100 p-2 rounded">
                  <span className="font-semibold">示例：</span> "{word.example}"
                </p>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore || isLoading}
              className="px-6 py-3 bg-slate-600 text-white font-semibold rounded-lg shadow-md hover:bg-slate-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition"
            >
              {isLoadingMore ? '加载中...' : '加载更多'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default VocabularyBuilder;