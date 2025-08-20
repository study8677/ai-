import React, { useState, useEffect } from 'react';
import Card from './common/Card';
import LoadingSpinner from './common/LoadingSpinner';
import type { SpeakingTopic } from '../types';
import { generateSpeakingTopic } from '../services/geminiService';

const SpeakingPractice: React.FC = () => {
  const [topic, setTopic] = useState<SpeakingTopic | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTopic = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const newTopic = await generateSpeakingTopic();
      setTopic(newTopic);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchTopic();
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-800 mb-2">口语练习</h2>
      <p className="text-slate-500 mb-8">练习雅思口语第二部分。获取一个话题并准备您的回答。</p>
      
      <div className="flex justify-end mb-4">
        <button
          onClick={fetchTopic}
          disabled={isLoading}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5" />
          </svg>
          换个话题
        </button>
      </div>

      {error && <p className="text-red-500 bg-red-100 p-3 rounded-lg text-center mb-8">{error}</p>}
      
      {isLoading ? (
        <LoadingSpinner />
      ) : topic ? (
        <Card className="bg-slate-50 border border-slate-200">
          <h3 className="text-xl font-semibold text-slate-800">{topic.topic}</h3>
          <p className="text-slate-500 mb-4">{topic.topicTranslation}</p>
          <div className="space-y-2">
            <p className="text-slate-600 font-medium">您应该谈及：</p>
            <ul className="list-disc list-inside text-slate-600 space-y-1 pl-4">
              {topic.cues.map((cue, index) => (
                <li key={index}>{cue}</li>
              ))}
            </ul>
          </div>
          <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
            <p className="text-sm text-blue-700">
              <span className="font-semibold">提示：</span> 您有1分钟的时间准备笔记，正式回答应持续1-2分钟。
            </p>
          </div>
        </Card>
      ) : (
        !error && <p className="text-center text-slate-500">点击“换个话题”来开始。</p>
      )}
    </div>
  );
};

export default SpeakingPractice;