import React, { useState } from 'react';
import { Note, QuizQuestion, QuizDifficulty } from '../types';
import { generateQuiz } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface QuizViewProps {
  notes: Note[];
  onComplete: (score: number, total: number) => void;
}

const QuizView: React.FC<QuizViewProps> = ({ notes, onComplete }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  
  // Setup State
  const [questionCount, setQuestionCount] = useState<number>(20);
  const [difficulty, setDifficulty] = useState<QuizDifficulty>('Rigorous');
  const [isConfiguring, setIsConfiguring] = useState(true);

  const startQuiz = async () => {
    setIsConfiguring(false);
    setLoading(true);
    const qs = await generateQuiz(notes, questionCount, difficulty);
    setQuestions(qs);
    setCurrentIndex(0);
    setScore(0);
    setQuizComplete(false);
    setSelectedOption(null);
    setShowExplanation(false);
    setLoading(false);
  };

  const handleFinalize = () => {
    onComplete(score, questions.length);
    setQuizComplete(true);
  };

  const resetToSetup = () => {
    setQuestions([]);
    setIsConfiguring(true);
    setQuizComplete(false);
  };

  if (notes.length === 0) {
    return (
      <div className="bg-white dark:bg-[#1A1A1A] border border-[#E5E2D9] dark:border-[#262626] rounded-2xl p-20 text-center shadow-sm">
        <div className="w-24 h-24 bg-[#26BAA4]/10 rounded-full flex items-center justify-center mx-auto mb-10">
          <svg className="w-12 h-12 text-[#26BAA4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-[#2D2D2D] dark:text-[#E5E5E5] mb-4">Quiz Center Empty</h2>
        <p className="text-[#666] dark:text-[#AAA] mb-10 max-w-sm mx-auto leading-relaxed">Population of the notes repository is required to synthesize an IGCSE Grade 10 assessment.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#1A1A1A] border border-[#E5E2D9] dark:border-[#262626] rounded-2xl p-32 text-center shadow-sm flex flex-col items-center">
        <div className="relative w-24 h-24 mb-12">
          <div className="absolute inset-0 border-4 border-[#26BAA4]/10 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#26BAA4] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h3 className="text-2xl font-black text-[#2D2D2D] dark:text-[#E5E5E5] mb-4 animate-pulse uppercase">
          GENERATING {questionCount}-QUESTION IGCSE AUDIT
        </h3>
        <p className="text-[#666] dark:text-[#AAA] text-lg font-medium italic">
          Calibrating {difficulty} difficulty distractors and LaTeX schemas...
        </p>
      </div>
    );
  }

  if (isConfiguring) {
    return (
      <div className="bg-white dark:bg-[#1A1A1A] border border-[#E5E2D9] dark:border-[#262626] rounded-[2.5rem] p-16 shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
        <div className="flex items-center space-x-6 mb-16">
          <div className="w-20 h-20 bg-[#26BAA4] text-white rounded-3xl flex items-center justify-center shadow-xl shadow-[#26BAA4]/20">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <h2 className="text-4xl font-black text-[#2D2D2D] dark:text-[#E5E5E5] tracking-tight uppercase">QUIZ</h2>
            <p className="text-[#26BAA4] text-sm font-bold uppercase tracking-[0.3em] mt-1">Tailor your IGCSE Grade 10 assessment</p>
          </div>
        </div>

        <div className="space-y-16">
          <section>
            <h3 className="text-xs font-black text-[#666] dark:text-[#AAA] uppercase tracking-[0.4em] mb-6">Select Volume (Marks)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[10, 20, 30, 40].map(count => (
                <button
                  key={count}
                  onClick={() => setQuestionCount(count)}
                  className={`py-8 rounded-2xl border-2 font-black text-xl transition-all ${
                    questionCount === count 
                      ? 'bg-[#26BAA4] text-white border-[#26BAA4] shadow-2xl shadow-[#26BAA4]/30 scale-[1.05]' 
                      : 'bg-white dark:bg-[#222] border-[#E5E2D9] dark:border-[#333] text-[#666] dark:text-[#AAA] hover:border-[#26BAA4]/50'
                  }`}
                >
                  {count} Marks
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-black text-[#666] dark:text-[#AAA] uppercase tracking-[0.4em] mb-6">Set Cognitive Intensity</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(['Foundational', 'Standard', 'Rigorous', 'Elite'] as QuizDifficulty[]).map(diff => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`px-6 py-8 rounded-3xl border-2 text-left transition-all ${
                    difficulty === diff 
                      ? 'bg-[#2D2D2D] dark:bg-[#E5E5E5] text-white dark:text-[#0F0F0F] border-[#2D2D2D] dark:border-white shadow-2xl scale-[1.05]' 
                      : 'bg-white dark:bg-[#222] border-[#E5E2D9] dark:border-[#333] text-[#666] dark:text-[#AAA] hover:border-[#2D2D2D]/50 dark:hover:border-white/50'
                  }`}
                >
                  <div className="font-black text-sm uppercase tracking-widest mb-2">{diff}</div>
                  <div className="text-xs opacity-60 font-medium leading-relaxed">
                    {diff === 'Foundational' && 'Core concepts, definitions, and basic logic mapping.'}
                    {diff === 'Standard' && 'Standard exam style application and moderate recall.'}
                    {diff === 'Rigorous' && 'Tricky multi-step reasoning with complex distractors.'}
                    {diff === 'Elite' && 'Extreme master-level challenges for top percentile scores.'}
                  </div>
                </button>
              ))}
            </div>
          </section>

          <button
            onClick={startQuiz}
            className="w-full bg-[#26BAA4] text-white py-8 rounded-3xl font-black text-2xl hover:bg-[#219B88] hover:shadow-[0_20px_50px_rgba(38,186,164,0.3)] transition-all shadow-lg uppercase tracking-[0.3em] active:scale-[0.98] mt-8"
          >
            Initialize Assessment Session
          </button>
        </div>
      </div>
    );
  }

  if (quizComplete) {
    return (
      <div className="bg-white dark:bg-[#1A1A1A] border border-[#E5E2D9] dark:border-[#262626] rounded-[3rem] p-24 text-center shadow-2xl animate-in zoom-in-95 duration-500">
        <div className="w-32 h-32 bg-[#26BAA4] rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-[#26BAA4]/40 scale-110">
          <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-5xl font-black text-[#2D2D2D] dark:text-[#E5E5E5] mb-4 tracking-tighter uppercase">IGCSE Audit Complete</h2>
        <p className="text-[#26BAA4] mb-12 font-black text-sm uppercase tracking-[0.4em]">{difficulty} Difficulty • {questionCount} Total Marks</p>
        <div className="text-[12rem] font-black text-[#2D2D2D] dark:text-[#E5E5E5] mb-16 tabular-nums tracking-tighter leading-none">
          {score} <span className="text-5xl text-[#CCC] dark:text-[#444] font-medium align-middle ml-2">/ {questionCount}</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-8 justify-center">
          <button 
            onClick={startQuiz}
            className="bg-[#26BAA4] text-white px-14 py-6 rounded-[2rem] font-black text-lg hover:scale-105 transition-all shadow-2xl shadow-[#26BAA4]/30 uppercase tracking-[0.2em]"
          >
            Retry Same Setup
          </button>
          <button 
            onClick={resetToSetup}
            className="bg-[#2D2D2D] dark:bg-[#E5E5E5] text-white dark:text-[#0F0F0F] px-14 py-6 rounded-[2rem] font-black text-lg hover:scale-105 transition-all shadow-2xl uppercase tracking-[0.2em]"
          >
            New Configuration
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      handleFinalize();
    }
  };

  const handleSelect = (idx: number) => {
    if (showExplanation) return;
    setSelectedOption(idx);
    setShowExplanation(true);
    if (idx === currentQ.correctAnswer) {
      setScore(score + 1);
    }
  };

  return (
    <div className="bg-white dark:bg-[#1A1A1A] border border-[#E5E2D9] dark:border-[#262626] rounded-[3rem] p-16 shadow-2xl animate-in slide-in-from-right-12 duration-700 transition-colors">
      <div className="flex justify-between items-center mb-16">
        <div>
          <span className="text-[13px] font-black text-[#26BAA4] uppercase tracking-[0.4em] block mb-3">{difficulty} Assessment Mode</span>
          <span className="text-3xl font-black text-[#2D2D2D] dark:text-[#E5E5E5]">Question {currentIndex + 1} <span className="text-[#CCC] dark:text-[#444] font-medium text-lg ml-2">/ {questionCount}</span></span>
        </div>
        <div className="w-64 h-4 bg-[#FDFCF8] dark:bg-[#111] rounded-full overflow-hidden border border-[#E5E2D9] dark:border-[#262626] shadow-inner p-1">
          <div 
            className="h-full bg-gradient-to-r from-[#26BAA4] to-[#219B88] rounded-full transition-all duration-700 ease-out" 
            style={{ width: `${((currentIndex + 1) / questionCount) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-16 min-h-[120px]">
        <div className="text-3xl font-black text-[#2D2D2D] dark:text-[#E5E5E5] leading-[1.2] prose prose-stone dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{currentQ.question}</ReactMarkdown>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {currentQ.options.map((opt, i) => {
          let styles = "bg-[#FDFCF8] dark:bg-[#222] border-[#E5E2D9] dark:border-[#333] text-[#2D2D2D] dark:text-[#E5E5E5] hover:border-[#26BAA4] hover:bg-white dark:hover:bg-[#2A2A2A] hover:scale-[1.03] hover:shadow-xl";
          if (showExplanation) {
            if (i === currentQ.correctAnswer) styles = "bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400 font-black shadow-2xl shadow-green-100 dark:shadow-none ring-4 ring-green-200 dark:ring-green-800 scale-[1.03]";
            else if (i === selectedOption) styles = "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400 opacity-80 scale-[0.98]";
            else styles = "bg-[#FDFCF8] dark:bg-[#111] border-[#E5E2D9] dark:border-[#222] opacity-30 grayscale pointer-events-none scale-[0.98]";
          } else if (selectedOption === i) {
            styles = "bg-[#26BAA4]/10 border-[#26BAA4] text-[#26BAA4] font-black ring-8 ring-[#26BAA4]/10 scale-[1.03]";
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={showExplanation}
              className={`w-full text-left px-10 py-10 rounded-[2rem] border-2 transition-all flex items-center justify-between group ${styles}`}
            >
              <div className="prose prose-stone dark:prose-invert prose-xl font-bold overflow-hidden leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{opt}</ReactMarkdown>
              </div>
              {showExplanation && i === currentQ.correctAnswer && (
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shrink-0 ml-6 animate-in zoom-in-50 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7"/></svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {showExplanation && (
        <div className="bg-[#26BAA4]/5 border-2 border-[#26BAA4]/20 rounded-[2rem] p-12 mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-[#26BAA4] text-white rounded-2xl shadow-lg">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm 1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
            </div>
            <h4 className="text-sm font-black text-[#26BAA4] uppercase tracking-[0.3em]">IGCSE Strategy Feedback</h4>
          </div>
          <div className="text-xl text-[#444] dark:text-[#AAA] leading-relaxed italic prose prose-stone dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{currentQ.explanation}</ReactMarkdown>
          </div>
        </div>
      )}

      {showExplanation && (
        <button 
          onClick={handleNext}
          className="w-full bg-[#2D2D2D] dark:bg-[#E5E5E5] text-white dark:text-[#0F0F0F] py-10 rounded-[2.5rem] font-black text-2xl hover:bg-black dark:hover:bg-white transition-all shadow-2xl active:scale-[0.98] uppercase tracking-[0.4em] mt-4"
        >
          {currentIndex === questionCount - 1 ? 'FINALIZE AUDIT' : 'PROCEED TO NEXT PHASE'}
        </button>
      )}
    </div>
  );
};

export default QuizView;