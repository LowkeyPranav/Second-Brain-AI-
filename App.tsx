import { supabase } from './supabase';
import React, { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import Header from './components/Header';
import Dropzone from './components/Dropzone';
import ChatPanel from './components/ChatPanel';

import { Note, ChatMessage } from './types';
import { extractTextFromPDF, readFileAsText, generateId } from './utils/fileHelpers';
import { summarizeNote, answerQuestion } from './services/geminiService';

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isAssistantThinking, setIsAssistantThinking] = useState(false);

import QuizView from './components/QuizView';
import ProgressView from './components/ProgressView';
import LessonsView from './components/LessonsView';
import { Note, ChatMessage, AppView, ProgressAnalysis, QuizResult } from './types';
import { extractTextFromPDF, readFileAsText, generateId } from './utils/fileHelpers';
import { summarizeNote, answerQuestion, analyzeProgress } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('repository');
  const [notes, setNotes] = useState<Note[]>([]);
  const [quizHistory, setQuizHistory] = useState<QuizResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isAssistantThinking, setIsAssistantThinking] = useState(false);
  const [progress, setProgress] = useState<ProgressAnalysis | null>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#0F0F0F';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#FDFCF8';
    }
  }, [isDark]);

  useEffect(() => {
    if (notes.length > 0) {
      const updateAnalysis = async () => {
        const analysis = await analyzeProgress(notes, quizHistory);
        setProgress(analysis);
      };
      updateAnalysis();
    }
  }, [notes, quizHistory]);


  const handleFilesSelected = useCallback(async (files: File[]) => {
    setIsProcessing(true);
    const newNotes: Note[] = [];

    for (const file of files) {
      try {
        let content = "";
        const type = file.type === 'application/pdf' ? 'pdf' : 'text';
        
        if (type === 'pdf') {
          content = await extractTextFromPDF(file);
        } else {
          content = await readFileAsText(file);
        }

        const note: Note = {
          id: generateId(),
          name: file.name,
          content,
          type,
          timestamp: Date.now(),
        };

        const summaryData = await summarizeNote(note);
        note.summary = summaryData.summary;
        note.keyTakeaways = summaryData.keyTakeaways;

        newNotes.push(note);
      } catch (error) {
        console.error(`Failed to process ${file.name}`, error);
      }
    }

    setNotes(prev => [...prev, ...newNotes]);
    setIsProcessing(false);
  }, []);

  const handleSendMessage = async (content: string) => {
    const userMsg: ChatMessage = { role: 'user', content, timestamp: Date.now() };
    setChatMessages(prev => [...prev, userMsg]);
    setIsAssistantThinking(true);

    try {
      const { text, sources } = await answerQuestion(content, notes, chatMessages);
      const assistantMsg: ChatMessage = { 
        role: 'assistant', 
        content: text, 
        timestamp: Date.now(),
        sources: sources.length > 0 ? sources : undefined
      };
      setChatMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error("AI Error:", error);
      const errorMsg: ChatMessage = { 
        role: 'assistant', 
        content: "An interruption occurred in the strategy engine. Please retry your inquiry.", 
        timestamp: Date.now() 
      };
      setChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsAssistantThinking(false);
    }
  };


  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCF8] text-[#2D2D2D]">
      <Header />
      
      <main className="flex-1 max-w-[1440px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 p-8">
        
        <div className="lg:col-span-7 flex flex-col space-y-8">
          
          <section className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-extrabold text-[#2D2D2D] tracking-tight">Active Repository</h2>
                <p className="text-[#666] text-sm mt-2 font-medium">Map notes to syllabus and exam patterns.</p>
              </div>
              <div className="flex items-center space-x-2 text-[10px] text-[#26BAA4] font-bold uppercase tracking-widest border border-[#26BAA4]/20 px-3 py-1 rounded-full bg-white shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#26BAA4] animate-pulse"></span>
                <span>{notes.length} Active Records</span>
              </div>
            </div>
            
            <Dropzone 
              onFilesSelected={handleFilesSelected} 
              isLoading={isProcessing} 
            />
          </section>

          <section className="flex-1 overflow-y-auto space-y-6 pr-2">
            {notes.length === 0 ? (
              <div className="border border-[#E5E2D9] rounded-xl p-12 bg-white text-center shadow-sm">
                <p className="text-[#AAA] text-sm italic font-medium">Your library is empty. Upload materials to begin strategic learning.</p>
              </div>
            ) : (
              notes.map(note => (
                <div key={note.id} className="bg-white border border-[#E5E2D9] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="px-6 py-4 border-b border-[#E5E2D9] flex justify-between items-center bg-[#FDFCF8]/50">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white border border-[#E5E2D9] rounded shadow-xs">
                        {note.type === 'pdf' ? (
                          <svg className="w-4 h-4 text-[#26BAA4]" fill="currentColor" viewBox="0 0 24 24"><path d="M7 2a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V8l-6-6H7zm5 7V3.5L17.5 9H12z"/></svg>
                        ) : (
                          <svg className="w-4 h-4 text-[#26BAA4]" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM13 9V3.5L18.5 9H13z"/></svg>
                        )}
                      </div>
                      <span className="font-bold text-sm text-[#2D2D2D] truncate max-w-[250px] tracking-tight">{note.name}</span>
                    </div>
                    <span className="text-[9px] uppercase font-black text-[#26BAA4] tracking-tighter">Verified Content</span>
                  </div>
                  <div className="p-6 space-y-6">
                    <div>
                      <h4 className="text-[9px] uppercase font-black text-[#26BAA4] mb-3 tracking-[0.2em]">Abstract</h4>
                      <div className="text-sm text-[#444] leading-relaxed italic border-l-3 border-[#26BAA4]/40 pl-5 prose prose-stone prose-sm max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                          {note.summary || ""}
                        </ReactMarkdown>
                      </div>
                    </div>
                    {note.keyTakeaways && note.keyTakeaways.length > 0 && (
                      <div>
                        <h4 className="text-[9px] uppercase font-black text-[#26BAA4] mb-3 tracking-[0.2em]">Structural Insights</h4>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {note.keyTakeaways.map((k, i) => (
                            <li key={i} className="flex items-start space-x-3 text-xs text-[#666] bg-[#FDFCF8]/80 p-3 rounded-lg border border-[#E5E2D9]/50">
                              <span className="mt-1 w-1.5 h-1.5 bg-[#26BAA4] rounded-full shrink-0"></span>
                              <div className="prose prose-stone prose-xs font-medium">
                                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                  {k}
                                </ReactMarkdown>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </section>
        </div>

        <div className="lg:col-span-5 flex flex-col sticky top-[120px] h-[calc(100vh-160px)]">
          <ChatPanel 
            messages={chatMessages} 
            onSendMessage={handleSendMessage} 
            isThinking={isAssistantThinking}
            disabled={notes.length === 0}
          />
        </div>

      </main>

      <footer className="py-10 border-t border-[#E5E2D9] text-center bg-white">
        <p className="text-[#26BAA4] text-[10px] font-black uppercase tracking-[0.3em]">The Architecture of Thought</p>
        <p className="text-[#666] text-[9px] mt-2 font-medium opacity-60">© Second Brain Intelligence Suite</p>

  const handleQuizComplete = (score: number, total: number) => {
    const result: QuizResult = { score, total, timestamp: Date.now() };
    setQuizHistory(prev => [...prev, result]);
  };

  const renderMainContent = () => {
    switch (view) {
      case 'quiz':
        return <QuizView notes={notes} onComplete={handleQuizComplete} />;
      case 'progress':
        return <ProgressView progress={progress} notes={notes} quizHistory={quizHistory} />;
      case 'lessons':
        return <LessonsView notes={notes} progress={progress} />;
      default:
        return (
          <div className="flex flex-col space-y-8">
            <section className="space-y-4">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-3xl font-extrabold text-[#2D2D2D] dark:text-[#E5E5E5] tracking-tight">Active Repository</h2>
                  <p className="text-[#666] dark:text-[#AAA] text-sm mt-2 font-medium">Map notes to syllabus and exam patterns.</p>
                </div>
                <div className="flex items-center space-x-2 text-[10px] text-[#26BAA4] font-bold uppercase tracking-widest border border-[#26BAA4]/20 px-3 py-1 rounded-full bg-white dark:bg-[#1A1A1A] shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#26BAA4] animate-pulse"></span>
                  <span>{notes.length} Active Records</span>
                </div>
              </div>
              <Dropzone onFilesSelected={handleFilesSelected} isLoading={isProcessing} />
            </section>

            <section className="flex-1 overflow-y-auto space-y-6 pr-2">
              {notes.length === 0 ? (
                <div className="border border-[#E5E2D9] dark:border-[#262626] rounded-xl p-12 bg-white dark:bg-[#1A1A1A] text-center shadow-sm">
                  <p className="text-[#AAA] text-sm italic font-medium">Your library is empty. Upload materials to begin strategic learning.</p>
                </div>
              ) : (
                notes.map(note => (
                  <div key={note.id} className="bg-white dark:bg-[#1A1A1A] border border-[#E5E2D9] dark:border-[#262626] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="px-6 py-4 border-b border-[#E5E2D9] dark:border-[#262626] flex justify-between items-center bg-[#FDFCF8]/50 dark:bg-[#111]/50">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white dark:bg-[#2D2D2D] border border-[#E5E2D9] dark:border-[#262626] rounded shadow-xs">
                          {note.type === 'pdf' ? (
                            <svg className="w-4 h-4 text-[#26BAA4]" fill="currentColor" viewBox="0 0 24 24"><path d="M7 2a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V8l-6-6H7zm5 7V3.5L17.5 9H12z"/></svg>
                          ) : (
                            <svg className="w-4 h-4 text-[#26BAA4]" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM13 9V3.5L18.5 9H13z"/></svg>
                          )}
                        </div>
                        <span className="font-bold text-sm text-[#2D2D2D] dark:text-[#E5E5E5] truncate max-w-[250px] tracking-tight">{note.name}</span>
                      </div>
                    </div>
                    <div className="p-6 space-y-6">
                      <div>
                        <h4 className="text-[9px] uppercase font-black text-[#26BAA4] mb-3 tracking-[0.2em]">Abstract</h4>
                        <div className="text-sm text-[#444] dark:text-[#CCC] leading-relaxed italic border-l-3 border-[#26BAA4]/40 pl-5 prose prose-stone dark:prose-invert prose-sm max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{note.summary || ""}</ReactMarkdown>
                        </div>
                      </div>
                      {note.keyTakeaways && note.keyTakeaways.length > 0 && (
                        <div>
                          <h4 className="text-[9px] uppercase font-black text-[#26BAA4] mb-3 tracking-[0.2em]">Structural Insights</h4>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {note.keyTakeaways.map((k, i) => (
                              <li key={i} className="flex items-start space-x-3 text-xs text-[#666] dark:text-[#AAA] bg-[#FDFCF8]/80 dark:bg-[#111]/80 p-3 rounded-lg border border-[#E5E2D9]/50 dark:border-[#262626]/50">
                                <span className="mt-1 w-1.5 h-1.5 bg-[#26BAA4] rounded-full shrink-0"></span>
                                <div className="prose prose-stone dark:prose-invert prose-xs font-medium">
                                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{k}</ReactMarkdown>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </section>
          </div>
        );
    }
  };

  const isQuizView = view === 'quiz';

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDark ? 'bg-[#0F0F0F] text-[#E5E5E5]' : 'bg-[#FDFCF8] text-[#2D2D2D]'}`}>
      <Header 
        currentView={view} 
        onViewChange={setView} 
        isDark={isDark} 
        onToggleTheme={() => setIsDark(!isDark)} 
      />
      
      <main className={`flex-1 max-w-[1440px] mx-auto w-full grid grid-cols-1 ${isQuizView ? 'lg:grid-cols-1' : 'lg:grid-cols-12'} gap-8 p-8`}>
        <div className={isQuizView ? 'lg:col-span-1 max-w-6xl mx-auto w-full' : 'lg:col-span-7'}>
          {renderMainContent()}
        </div>

        {!isQuizView && (
          <div className="lg:col-span-5 flex flex-col sticky top-[120px] h-[calc(100vh-160px)]">
            <ChatPanel 
              messages={chatMessages} 
              onSendMessage={handleSendMessage} 
              isThinking={isAssistantThinking}
              disabled={notes.length === 0}
            />
          </div>
        )}
      </main>

      <footer className="py-10 border-t border-[#E5E2D9] dark:border-[#262626] text-center bg-white dark:bg-[#1A1A1A] transition-colors duration-300">
        <p className="text-[#26BAA4] text-[10px] font-black uppercase tracking-[0.3em]">The Architecture of Thought</p>
        <p className="text-[#666] dark:text-[#AAA] text-[9px] mt-2 font-medium opacity-60">© Second Brain Intelligence Suite</p>

      </footer>
    </div>
  );
};


export default App;

