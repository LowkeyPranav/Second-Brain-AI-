
import React from 'react';
import { Note, ProgressAnalysis, QuizResult } from '../types';

interface ProgressViewProps {
  progress: ProgressAnalysis | null;
  notes: Note[];
  quizHistory: QuizResult[];
}

const ProgressView: React.FC<ProgressViewProps> = ({ progress, notes, quizHistory }) => {
  // Now tracks progress after just 1 quiz attempt
  const DATA_THRESHOLD = 1;
  const hasEnoughData = quizHistory.length >= DATA_THRESHOLD;

  if (notes.length === 0) {
    return (
      <div className="bg-white border border-[#E5E2D9] rounded-2xl p-20 text-center shadow-sm">
        <div className="w-24 h-24 bg-[#26BAA4]/10 rounded-full flex items-center justify-center mx-auto mb-10 animate-pulse">
          <svg className="w-12 h-12 text-[#26BAA4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <h2 className="text-3xl font-black text-[#2D2D2D] mb-4 tracking-tight">Intelligence Engine Inactive</h2>
        <p className="text-[#666] max-w-md mx-auto leading-relaxed text-lg">Upload your curriculum and complete quizzes to initialize real-time mastery tracking.</p>
      </div>
    );
  }

  if (!hasEnoughData) {
    return (
      <div className="bg-white border border-[#E5E2D9] rounded-2xl p-20 text-center shadow-sm flex flex-col items-center">
        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-10">
          <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-3xl font-black text-[#2D2D2D] mb-4 tracking-tighter">Initial Analysis Pending</h2>
        <p className="text-[#666] max-w-md mx-auto leading-relaxed text-lg font-medium mb-4">
          Complete your first quiz to generate your <span className="text-[#26BAA4]">Strategic Mastery Profile</span>.
        </p>
        <p className="text-[#AAA] text-sm italic">One assessment is all it takes to begin neural knowledge mapping.</p>
      </div>
    );
  }

  // Calculate real metrics from history
  const totalCorrect = quizHistory.reduce((sum, q) => sum + q.score, 0);
  const totalQuestions = quizHistory.reduce((sum, q) => sum + q.total, 0);
  const realMastery = Math.round((totalCorrect / totalQuestions) * 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      {/* Executive Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-2 bg-white border border-[#E5E2D9] rounded-3xl p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#26BAA4]/5 rounded-full -mr-16 -mt-16"></div>
          <div>
            <span className="text-[10px] font-black text-[#26BAA4] uppercase tracking-[0.2em] mb-4 block">Performance-Grounded Mastery</span>
            <div className="text-6xl font-black text-[#2D2D2D] tracking-tighter tabular-nums">{realMastery}%</div>
          </div>
          <div className="mt-8">
            <div className="flex justify-between text-[10px] font-black uppercase mb-2">
              <span className="text-[#666]">Based on {quizHistory.length} Sessions</span>
              <span className="text-[#26BAA4]">{realMastery}%</span>
            </div>
            <div className="h-3 bg-[#FDFCF8] rounded-full border border-[#E5E2D9] overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#26BAA4] to-[#219B88] shadow-[0_0_15px_rgba(38,186,164,0.4)] transition-all duration-1000" style={{ width: `${realMastery}%` }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#E5E2D9] rounded-3xl p-8 shadow-sm flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 mb-4 shadow-sm">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/></svg>
          </div>
          <div className="text-3xl font-black text-[#2D2D2D]">{quizHistory.length}</div>
          <span className="text-[9px] font-black text-[#AAA] uppercase tracking-widest">Completed Sessions</span>
        </div>

        <div className="bg-white border border-[#E5E2D9] rounded-3xl p-8 shadow-sm flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mb-4 shadow-sm">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm.5 11H7v-2h5.5V7H14v6l5.25 3.15-.75-1.23-4.5-2.67z"/></svg>
          </div>
          <div className="text-3xl font-black text-[#2D2D2D]">{realMastery > 70 ? 'High' : 'Moderate'}</div>
          <span className="text-[9px] font-black text-[#AAA] uppercase tracking-widest">Learning Stability</span>
        </div>
      </div>

      {/* Actual Subject Performance - only showing if progress exists */}
      {progress && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-[#26BAA4] uppercase tracking-[0.3em]">Knowledge Gaps (Weak Spots)</h3>
              <span className="text-[10px] font-bold text-[#AAA] italic">Dynamic update from test history</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {progress.subjects.map((subj, idx) => (
                <div key={idx} className="bg-white border border-[#E5E2D9] rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="font-black text-xl text-[#2D2D2D]">{subj.name}</h4>
                      <span className="text-[10px] font-bold text-[#AAA]">{subj.completionPercentage}% Syllabus Integrated</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <span className="text-[9px] font-black uppercase text-red-500 tracking-widest mb-2 block">Critical Weaknesses</span>
                      <div className="flex flex-wrap gap-1.5">
                        {subj.weakness.length > 0 ? subj.weakness.map((w, i) => (
                          <span key={i} className="text-[9px] font-bold bg-red-50 text-red-600 px-2 py-1 rounded border border-red-200">#{w}</span>
                        )) : (
                          <span className="text-[9px] font-bold text-[#AAA] italic">No critical gaps detected</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase text-[#26BAA4] tracking-widest mb-2 block">Strong Proficiency</span>
                      <div className="flex flex-wrap gap-1.5">
                        {subj.strength.slice(0, 3).map((t, i) => (
                          <span key={i} className="text-[9px] font-bold bg-green-50 text-green-600 px-2 py-1 rounded border border-green-200">#{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-sm font-black text-[#26BAA4] uppercase tracking-[0.3em]">Performance History</h3>
            <div className="bg-white border border-[#E5E2D9] rounded-3xl p-6 shadow-sm space-y-4">
              {quizHistory.slice(-5).reverse().map((res, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-[#FDFCF8] rounded-xl border border-[#E5E2D9]/50">
                  <span className="text-[11px] font-bold text-[#2D2D2D]">Attempt {quizHistory.length - i}</span>
                  <div className="flex items-center space-x-3">
                    <span className={`text-[11px] font-black ${res.score / res.total > 0.7 ? 'text-[#26BAA4]' : 'text-orange-400'}`}>
                      {res.score}/{res.total}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressView;
