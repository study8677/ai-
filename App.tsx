import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import VocabularyBuilder from './components/VocabularyBuilder';
import GrammarCorrector from './components/GrammarCorrector';
import SpeakingPractice from './components/SpeakingPractice';
import WritingAssistant from './components/WritingAssistant';
import VocabularyReview from './components/VocabularyReview';
import { View } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Dashboard);

  const renderView = () => {
    switch (currentView) {
      case View.Dashboard:
        return <Dashboard onViewChange={setCurrentView} />;
      case View.Vocabulary:
        return <VocabularyBuilder />;
      case View.Grammar:
        return <GrammarCorrector />;
      case View.Speaking:
        return <SpeakingPractice />;
      case View.Writing:
        return <WritingAssistant />;
      case View.Review:
        return <VocabularyReview />;
      default:
        return <Dashboard onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="flex min-h-screen font-sans">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 p-6 md:p-10 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;