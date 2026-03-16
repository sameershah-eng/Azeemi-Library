import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  Search, 
  Highlighter, 
  MessageSquare, 
  BookMarked, 
  Layout,
  FileText,
  Zap,
  Sparkles
} from 'lucide-react';
import { Book } from '../types';

interface Props {
  book: Book;
  onBack: () => void;
}

export default function ReaderUI({ book, onBack }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedText, setSelectedText] = useState('');

  const handleTextHighlight = () => {
    const text = window.getSelection()?.toString();
    if (text) setSelectedText(text);
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col lg:flex-row overflow-hidden">
      {/* Reader Main Area */}
      <div className="flex-1 flex flex-col bg-white text-text-main overflow-hidden">
        <div className="h-14 flex items-center justify-between px-4 bg-surface border-b border-border-light shadow-sm">
          <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-primary">
            <ChevronLeft size={18} />
            Back to Library
          </button>
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-text-muted">{book.title} - Page 1 of 240</span>
            <div className="flex items-center gap-2">
              <button className="p-1.5 hover:bg-gray-100 rounded text-text-muted"><Search size={16} /></button>
              <button className="p-1.5 hover:bg-gray-100 rounded text-text-muted"><Layout size={16} /></button>
            </div>
          </div>
        </div>

        <div 
          className="flex-1 overflow-y-auto p-8 lg:p-16 bg-bg-main custom-scrollbar"
          onMouseUp={handleTextHighlight}
        >
          <div className="max-w-3xl mx-auto space-y-8 font-serif text-lg leading-relaxed text-text-main">
            <h1 className="text-4xl font-bold mb-12 text-center">{book.title}</h1>
            <p>
              The path of the Qalandar is not merely a journey of the mind, but a profound awakening of the soul. 
              In the teachings of Silsila Azeemia, we learn that the human consciousness is a reflection of the Divine Light.
            </p>
            <p className="bg-primary/5 p-4 border-l-4 border-primary italic text-primary">
              "To know oneself is to know the Creator. The veil between the seen and the unseen is thinner than a breath."
            </p>
            <p>
              Muraqaba, the art of spiritual meditation, serves as the primary tool for this exploration. 
              By quieting the external senses, one begins to perceive the internal realities that govern our existence.
            </p>
            <p>
              As Hazrat Khwaja Shamsuddin Azeemi explains, the colors we perceive in our spiritual visions are not mere hallucinations, 
              but the frequencies of the soul's energy. Each color corresponds to a specific state of being and a level of celestial awareness.
            </p>
            {/* Mock PDF Content */}
            <div className="h-96 bg-white border border-border-light rounded-lg shadow-sm flex items-center justify-center text-text-muted italic">
              [Simulated PDF Content Page 2]
            </div>
          </div>
        </div>
      </div>

      {/* AI Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? '380px' : '0px' }}
        className="bg-surface border-l border-border-light flex flex-col overflow-hidden relative shadow-xl"
      >
        <div className="p-6 space-y-8 min-w-[380px]">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2 text-text-main">
              <Sparkles className="text-primary" size={20} />
              AI Scholar Sidebar
            </h3>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-text-muted">
              <ChevronLeft size={20} />
            </button>
          </div>

          {selectedText && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-primary/20 p-4 space-y-4 rounded-2xl shadow-sm"
            >
              <div className="flex items-center gap-2 text-primary text-[10px] font-bold uppercase tracking-wider">
                <Highlighter size={12} />
                Selected Insight
              </div>
              <p className="text-sm italic text-text-main line-clamp-3">"{selectedText}"</p>
              <div className="flex gap-2">
                <button className="flex-1 py-2 bg-primary text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-sm">
                  <Zap size={14} />
                  Explain
                </button>
                <button className="flex-1 py-2 bg-white border border-border-light rounded-lg text-xs font-bold flex items-center justify-center gap-2 text-text-main hover:bg-gray-50">
                  <BookMarked size={14} />
                  Save Note
                </button>
              </div>
            </motion.div>
          )}

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted">Real-time Summary</h4>
            <div className="bg-gray-50 border border-border-light p-4 text-sm text-text-main leading-relaxed rounded-xl">
              This chapter explores the foundational principles of Sufi metaphysics, 
              focusing on the relationship between human perception and Divine reality. 
              Key concepts include the "Color of the Soul" and the "Breath of Life."
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted">Actionable Lessons</h4>
            <ul className="space-y-3">
              {[
                'Practice 15 mins of Blue Light Muraqaba daily.',
                'Observe the transition between wakefulness and sleep.',
                'Maintain a journal of spiritual colors perceived.'
              ].map((lesson, i) => (
                <li key={i} className="flex gap-3 text-sm text-text-main">
                  <span className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                    {i + 1}
                  </span>
                  {lesson}
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-8">
            <button className="w-full py-4 bg-white border border-primary/20 text-primary font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors shadow-sm">
              <MessageSquare size={18} />
              Ask Scholar about this Page
            </button>
          </div>
        </div>
      </motion.aside>
    </div>
  );
}
