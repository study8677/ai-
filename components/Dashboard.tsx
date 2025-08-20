import React, { useState, useEffect } from 'react';
import Card from './common/Card';
import { View } from '../types';
import { getWordsDueForReview } from '../services/reviewService';

interface DashboardProps {
  onViewChange: (view: View) => void;
}

const FeatureCard: React.FC<{ title: string; description: string; icon: React.ReactNode; onClick: () => void; badge?: number; }> = ({ title, description, icon, onClick, badge }) => (
  <Card onClick={onClick} className="h-full relative">
    <div className="flex flex-col items-start h-full">
      <div className="bg-blue-100 text-blue-600 p-3 rounded-lg mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 flex-grow">{description}</p>
      {badge !== undefined && badge > 0 && (
        <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
          {badge}
        </div>
      )}
    </div>
  </Card>
);

const Dashboard: React.FC<DashboardProps> = ({ onViewChange }) => {
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    setReviewCount(getWordsDueForReview().length);
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-800 mb-2">欢迎使用您的雅思领航员</h2>
      <p className="text-slate-500 mb-8">让我们一起提高您的英语技能。请选择一个模块开始。</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FeatureCard
          title="词汇构建"
          description="学习与话题相关的高分雅思必备词汇。"
          icon={<VocabularyIcon />}
          onClick={() => onViewChange(View.Vocabulary)}
        />
        <FeatureCard
          title="词汇复习"
          description={reviewCount > 0 ? `今日有 ${reviewCount} 个词汇需要复习。` : "巩固已学词汇，加强长期记忆。"}
          icon={<ReviewIcon />}
          onClick={() => onViewChange(View.Review)}
          badge={reviewCount}
        />
        <FeatureCard
          title="语法修正"
          description="检查您的句子并获得即时的语法错误反馈。"
          icon={<GrammarIcon />}
          onClick={() => onViewChange(View.Grammar)}
        />
        <FeatureCard
          title="写作助手"
          description="根据雅思官方标准评估您的作文并获得提升建议。"
          icon={<WritingIcon />}
          onClick={() => onViewChange(View.Writing)}
        />
        <FeatureCard
          title="口语练习"
          description="通过AI生成的话题模拟雅思口语考试进行练习。"
          icon={<SpeakingIcon />}
          onClick={() => onViewChange(View.Speaking)}
        />
      </div>
    </div>
  );
};


const VocabularyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.494m-9-5.747h18M5.45 12a6.75 6.75 0 1113.1 0 6.75 6.75 0 01-13.1 0z" />
    </svg>
);
const ReviewIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const GrammarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);
const SpeakingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
);
const WritingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" />
    </svg>
);

export default Dashboard;