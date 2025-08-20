import React, { useState, useEffect } from 'react';
import Card from './common/Card';
import LoadingSpinner from './common/LoadingSpinner';
import { WritingTask, WritingFeedback } from '../types';
import { generateWritingTask, analyzeWriting } from '../services/geminiService';

const WritingAssistant: React.FC = () => {
  const [task, setTask] = useState<WritingTask | null>(null);
  const [essay, setEssay] = useState<string>('');
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null);
  const [isLoadingTask, setIsLoadingTask] = useState<boolean>(true);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchTask = async () => {
    setIsLoadingTask(true);
    setIsAnalyzing(false);
    setError(null);
    setEssay('');
    setFeedback(null);
    try {
      const newTask = await generateWritingTask();
      setTask(newTask);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoadingTask(false);
    }
  };

  const handleAnalyze = async () => {
    if (!task || !essay.trim()) {
      setError('在分析前，请先撰写您的作文。');
      return;
    }
    setIsAnalyzing(true);
    setError(null);
    setFeedback(null);
    try {
      const result = await analyzeWriting(task.question, essay);
      setFeedback(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchTask();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-3xl font-bold text-slate-800">写作助手</h2>
        <button
            onClick={fetchTask}
            disabled={isLoadingTask || isAnalyzing}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition flex items-center"
        >
          换个题目
        </button>
      </div>
      <p className="text-slate-500 mb-8">获取一个雅思写作任务二的题目，并让AI评估您的作文。</p>
      
      {isLoadingTask && <LoadingSpinner />}
      {error && <p className="text-red-500 bg-red-100 p-3 rounded-lg text-center mb-8">{error}</p>}
      
      {task && !isLoadingTask && (
        <>
          <Card className="mb-8 bg-slate-50 border">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">雅思写作任务二</h3>
            <p className="text-slate-700 whitespace-pre-wrap">{task.question}</p>
            <p className="text-slate-500 mt-2 text-sm">{task.questionTranslation}</p>
            <p className="text-sm text-slate-500 mt-4">建议您用时约40分钟完成此项任务。字数不少于250词。</p>
          </Card>
          
          <Card className="mb-8">
            <textarea
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
              placeholder="在此撰写您的作文..."
              className="w-full h-80 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              disabled={isAnalyzing}
            />
          </Card>

          <div className="text-center">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !essay.trim()}
              className="px-8 py-4 bg-green-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-transform transform hover:scale-105"
            >
              {isAnalyzing ? '分析中...' : '分析我的作文'}
            </button>
          </div>
        </>
      )}

      {isAnalyzing && <LoadingSpinner />}
      
      {feedback && (
        <div className="mt-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">你的反馈报告</h2>
            <Card className="mb-6 bg-blue-50 border-blue-200">
                <p className="text-center">
                    <span className="text-lg font-medium text-slate-600">预估分数:</span>
                    <span className="ml-2 text-4xl font-bold text-blue-600">{feedback.bandScore}</span>
                </p>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card>
                    <h4 className="font-semibold text-slate-800 mb-2">任务回应</h4>
                    <p className="text-sm text-slate-600">{feedback.feedback.taskResponse}</p>
                </Card>
                 <Card>
                    <h4 className="font-semibold text-slate-800 mb-2">连贯与衔接</h4>
                    <p className="text-sm text-slate-600">{feedback.feedback.coherenceAndCohesion}</p>
                </Card>
                 <Card>
                    <h4 className="font-semibold text-slate-800 mb-2">词汇资源</h4>
                    <p className="text-sm text-slate-600">{feedback.feedback.lexicalResource}</p>
                </Card>
                 <Card>
                    <h4 className="font-semibold text-slate-800 mb-2">语法多样性及准确性</h4>
                    <p className="text-sm text-slate-600">{feedback.feedback.grammaticalRangeAndAccuracy}</p>
                </Card>
            </div>
            <Card>
                 <h3 className="text-xl font-bold text-slate-800 mb-4">更高分范文</h3>
                 <p className="text-slate-700 whitespace-pre-wrap p-4 bg-slate-50 rounded-lg border">{feedback.revisedEssay}</p>
            </Card>
        </div>
      )}
    </div>
  );
};

export default WritingAssistant;