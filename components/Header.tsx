
import React from 'react';
import { AppView } from '../types';

interface HeaderProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange, isDark, onToggleTheme }) => {
  return (
    <header className="border-b border-[#E5E2D9] dark:border-[#262626] py-6 px-8 flex justify-between items-center bg-white dark:bg-[#1A1A1A] sticky top-0 z-50 shadow-sm transition-colors duration-300">
      <div className="flex items-center space-x-3">
        <div 
          className="w-10 h-10 bg-[#26BAA4] rounded-xl flex items-center justify-center shadow-lg shadow-[#26BAA4]/20 overflow-hidden cursor-pointer hover:scale-105 transition-transform" 
          onClick={() => onViewChange('repository')}
          title="Return to Dashboard"
        >
          <svg viewBox="0 0 100 100" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="25" y="20" width="16" height="42" fill="white" rx="2" />
            <rect x="25" y="68" width="16" height="12" fill="white" rx="2" />
            <rect x="59" y="20" width="16" height="42" fill="white" rx="2" />
            <rect x="59" y="68" width="16" height="12" fill="white" rx="2" />
          </svg>
        </div>
        <div className="cursor-pointer" onClick={() => onViewChange('repository')}>
          <h1 className="text-xl font-bold text-[#2D2D2D] dark:text-[#E5E5E5] tracking-tight">Second Brain</h1>
          <p className="text-xs text-[#26BAA4] font-medium">Elevated learning experience.</p>
        </div>
      </div>
      <nav className="flex items-center space-x-6">
        <button 
          onClick={() => onViewChange('repository')}
          className={`text-sm font-medium transition-colors ${currentView === 'repository' ? 'text-[#26BAA4] border-b-2 border-[#26BAA4]' : 'text-[#666] dark:text-[#AAA] hover:text-[#26BAA4]'}`}
        >
          Dashboard
        </button>
        <button 
          onClick={() => onViewChange('quiz')}
          className={`text-sm font-medium transition-colors ${currentView === 'quiz' ? 'text-[#26BAA4] border-b-2 border-[#26BAA4]' : 'text-[#666] dark:text-[#AAA] hover:text-[#26BAA4]'}`}
        >
          Quiz Center
        </button>
        <button 
          onClick={() => onViewChange('progress')}
          className={`text-sm font-medium transition-colors ${currentView === 'progress' ? 'text-[#26BAA4] border-b-2 border-[#26BAA4]' : 'text-[#666] dark:text-[#AAA] hover:text-[#26BAA4]'}`}
        >
          Progress Track
        </button>
        <button 
          onClick={() => onViewChange('lessons')}
          className={`text-sm font-medium transition-colors ${currentView === 'lessons' ? 'text-[#26BAA4] border-b-2 border-[#26BAA4]' : 'text-[#666] dark:text-[#AAA] hover:text-[#26BAA4]'}`}
        >
          Lessons
        </button>
        
        <div className="h-6 w-[1px] bg-[#E5E2D9] dark:bg-[#262626] mx-2"></div>
        
        <button 
          onClick={onToggleTheme}
          className="p-2 rounded-full hover:bg-[#FDFCF8] dark:hover:bg-[#2D2D2D] transition-all text-[#666] dark:text-[#AAA]"
          aria-label="Toggle Theme"
        >
          {isDark ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          )}
        </button>
      </nav>
    </header>
  );
};

export default Header;
