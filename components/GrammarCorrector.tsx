import React, { useState } from 'react';
import Card from './common/Card';
import LoadingSpinner from './common/LoadingSpinner';
import type { GrammarCorrection } from '../types';
import { correctGrammar } from '../services/geminiService';

const GrammarCorrector: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [correction, setCorrection] = useState<GrammarCorrection | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async () => {
    if (!text.trim()) {
      setError('请输入文本进行检查。');
      return;
    }
    setIsLoading(true);
    setError(null);
    setCorrection(null);

    try {
      const result = await correctGrammar(text);
      setCorrection(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-800 mb-2">语法修正</h2>
      <p className="text-slate-500 mb-8">在下方粘贴您的文本，以获取语法修正和解析。</p>
      
      <Card className="mb-8">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="在此输入或粘贴您的文本..."
          className="w-full h-40 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          disabled={isLoading}
        />
        <button
          onClick={handleCheck}
          disabled={isLoading}
          className="mt-4 w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition"
        >
          {isLoading ? '检查中...' : '检查语法'}
        </button>
      </Card>

      {error && <p className="text-red-500 bg-red-100 p-3 rounded-lg text-center mb-8">{error}</p>}
      {isLoading && <LoadingSpinner />}
      
      {correction && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-slate-800 mb-2 border-b pb-2">您的原文</h3>
            <p className="text-slate-600 whitespace-pre-wrap">{correction.original}</p>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-green-700 mb-2 border-b pb-2">修正版本</h3>
            <p className="text-slate-800 whitespace-pre-wrap">{correction.corrected}</p>
          </Card>
          <div className="md:col-span-2">
            <Card>
              <h3 className="text-lg font-semibold text-blue-700 mb-2 border-b pb-2">错误解析</h3>
              <p className="text-slate-700 whitespace-pre-wrap">{correction.explanation}</p>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrammarCorrector;