import React, { useState, useEffect, useMemo } from 'react';
import Card from './common/Card';
import { getWordsDueForReview, updateReviewWord } from '../services/reviewService';
import type { ReviewWord } from '../types';

const VocabularyReview: React.FC = () => {
    const [reviewDeck, setReviewDeck] = useState<ReviewWord[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [sessionComplete, setSessionComplete] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const shuffledDeck = useMemo(() => {
        // Shuffle the deck once when the component loads
        const wordsToReview = getWordsDueForReview();
        return wordsToReview.sort(() => Math.random() - 0.5);
    }, []);

    useEffect(() => {
        setReviewDeck(shuffledDeck);
        if (shuffledDeck.length === 0) {
            setSessionComplete(true);
        }
        setIsLoading(false);
    }, [shuffledDeck]);

    const handleFlip = () => {
        setIsFlipped(true);
    };

    const handlePerformance = (performance: 'hard' | 'good' | 'easy') => {
        if (currentCardIndex < reviewDeck.length) {
            const currentWord = reviewDeck[currentCardIndex];
            updateReviewWord(currentWord, performance);
        }

        setIsFlipped(false);

        if (currentCardIndex + 1 >= reviewDeck.length) {
            setSessionComplete(true);
        } else {
            setCurrentCardIndex(currentCardIndex + 1);
        }
    };

    if (isLoading) {
        return null; // or a loading spinner
    }
    
    const currentCard = reviewDeck[currentCardIndex];

    return (
        <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">词汇复习</h2>
            <p className="text-slate-500 mb-8">使用间隔重复法来巩固您的记忆。</p>
            
            {sessionComplete ? (
                 <Card>
                    <div className="text-center py-12">
                         <h3 className="text-2xl font-bold text-green-600 mb-4">太棒了！</h3>
                         <p className="text-slate-600">
                           {reviewDeck.length > 0
                                ? '您已完成今天的复习任务。'
                                : '今天没有需要复习的词汇。去学习一些新单词吧！'}
                         </p>
                    </div>
                </Card>
            ) : (
                <div className="space-y-6">
                    <div className="text-center text-sm font-semibold text-slate-500">
                        {`进度: ${currentCardIndex + 1} / ${reviewDeck.length}`}
                    </div>
                    {/* Flashcard */}
                    <div style={{ perspective: '1000px' }}>
                        <div 
                            className={`transition-transform duration-700 w-full h-80 relative ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
                            style={{ transformStyle: 'preserve-3d' }}
                            >
                            {/* Front of card */}
                            <div className="absolute inset-0 w-full h-full bg-white rounded-xl shadow-lg flex flex-col items-center justify-center p-6 [backface-visibility:hidden]">
                                <p className="text-slate-500 text-sm mb-4">中文翻译</p>
                                <h3 className="text-4xl font-bold text-slate-800 text-center">{currentCard.translation}</h3>
                            </div>
                             {/* Back of card */}
                            <div className="absolute inset-0 w-full h-full bg-white rounded-xl shadow-lg p-6 flex flex-col justify-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
                               <div className="text-center">
                                    <h3 className="text-3xl font-bold text-slate-900">{currentCard.word}</h3>
                                    <p className="text-slate-500 italic mt-1 mb-3">{currentCard.pronunciation}</p>
                                    <p className="text-slate-700 text-sm mb-3">{currentCard.definition}</p>
                                     <p className="text-xs text-slate-500 bg-slate-100 p-2 rounded">
                                        <span className="font-semibold">示例：</span> "{currentCard.example}"
                                    </p>
                               </div>
                            </div>
                        </div>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex justify-center items-center">
                    {!isFlipped ? (
                        <button 
                            onClick={handleFlip} 
                            className="w-1/2 px-6 py-4 bg-blue-600 text-white font-bold text-lg rounded-lg shadow-md hover:bg-blue-700 transition"
                        >
                            显示答案
                        </button>
                    ) : (
                        <div className="grid grid-cols-3 gap-4 w-full">
                            <button onClick={() => handlePerformance('hard')} className="px-4 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-sm hover:bg-red-600 transition">不记得</button>
                            <button onClick={() => handlePerformance('good')} className="px-4 py-3 bg-yellow-500 text-white font-semibold rounded-lg shadow-sm hover:bg-yellow-600 transition">记住了</button>
                            <button onClick={() => handlePerformance('easy')} className="px-4 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-sm hover:bg-green-600 transition">很简单</button>
                        </div>
                    )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VocabularyReview;
