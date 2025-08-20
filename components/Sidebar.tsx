import React from 'react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const NavItem: React.FC<{
  view: View;
  currentView: View;
  onViewChange: (view: View) => void;
  icon: React.ReactNode;
  label: string;
}> = ({ view, currentView, onViewChange, icon, label }) => {
  const isActive = view === currentView;
  const activeClasses = 'bg-blue-100 text-blue-700';
  const inactiveClasses = 'text-slate-600 hover:bg-slate-100 hover:text-slate-900';

  return (
    <li>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onViewChange(view);
        }}
        className={`flex items-center p-3 rounded-lg font-medium text-sm transition-colors duration-200 ${isActive ? activeClasses : inactiveClasses}`}
      >
        <span className="mr-3">{icon}</span>
        {label}
      </a>
    </li>
  );
};


const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  return (
    <aside className="w-64 bg-white shadow-sm flex-shrink-0 h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center space-x-3">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m-9-5.747h18M5.45 12a6.75 6.75 0 1113.1 0 6.75 6.75 0 01-13.1 0z"></path></svg>
            <h1 className="text-xl font-bold text-slate-800">雅思领航员</h1>
        </div>
      </div>
      <nav className="px-4">
        <ul className="space-y-2">
          <NavItem
            view={View.Dashboard}
            currentView={currentView}
            onViewChange={onViewChange}
            icon={<DashboardIcon />}
            label="仪表盘"
          />
          <NavItem
            view={View.Vocabulary}
            currentView={currentView}
            onViewChange={onViewChange}
            icon={<VocabularyIcon />}
            label="词汇构建"
          />
          <NavItem
            view={View.Review}
            currentView={currentView}
            onViewChange={onViewChange}
            icon={<ReviewIcon />}
            label="词汇复习"
          />
          <NavItem
            view={View.Grammar}
            currentView={currentView}
            onViewChange={onViewChange}
            icon={<GrammarIcon />}
            label="语法修正"
          />
          <NavItem
            view={View.Speaking}
            currentView={currentView}
            onViewChange={onViewChange}
            icon={<SpeakingIcon />}
            label="口语练习"
          />
          <NavItem
            view={View.Writing}
            currentView={currentView}
            onViewChange={onViewChange}
            icon={<WritingIcon />}
            label="写作助手"
          />
        </ul>
      </nav>
    </aside>
  );
};

const DashboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
);
const VocabularyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.494m-9-5.747h18M5.45 12a6.75 6.75 0 1113.1 0 6.75 6.75 0 01-13.1 0z" />
    </svg>
);
const ReviewIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const GrammarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);
const SpeakingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
);
const WritingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" />
    </svg>
);


export default Sidebar;