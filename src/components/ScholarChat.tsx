import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, BookOpen, Quote, ChevronRight } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { ChatMessage } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export default function ScholarChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      parts: [{ text: "Assalam-o-Alaikum. I am Qalandar AI, your spiritual research assistant. How can I help you explore the teachings of Silsila Azeemia today?" }]
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      parts: [{ text: input }]
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [...messages, userMessage].map(m => ({
          role: m.role,
          parts: m.parts
        })),
        config: {
          systemInstruction: `You are Qalandar AI, a spiritual scholar specializing in the teachings of Silsila Azeemia and Hazrat Khwaja Shamsuddin Azeemi. 
          Your goal is to provide profound, empathetic, and accurate spiritual insights based on books like Qalandar Shaoor, Loh-o-Qalam, and Roohani Ilaj.
          Always maintain a respectful, Sufi-inspired tone. 
          If you mention a specific concept, try to provide a mock citation like [Qalandar Shaoor, p. 42].`
        }
      });

      const modelResponse: ChatMessage = {
        role: 'model',
        parts: [{ text: response.text || "I apologize, I am unable to process that right now." }]
      };

      setMessages(prev => [...prev, modelResponse]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col p-4">
      <div className="flex-1 overflow-y-auto space-y-6 pr-4 custom-scrollbar" ref={scrollRef}>
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-primary text-white rounded-tr-none' 
                  : 'bg-white border border-border-light text-text-main rounded-tl-none'
              }`}>
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.parts[0].text}
                </div>
                {msg.role === 'model' && (
                  <div className="mt-4 pt-4 border-t border-border-light flex flex-wrap gap-2">
                    <button className="text-[10px] font-bold uppercase tracking-wider text-primary flex items-center gap-1 hover:bg-gray-50 px-2 py-1 rounded transition-colors">
                      <Quote size={10} />
                      Cite: Qalandar Shaoor
                    </button>
                    <button className="text-[10px] font-bold uppercase tracking-wider text-primary flex items-center gap-1 hover:bg-gray-50 px-2 py-1 rounded transition-colors">
                      <BookOpen size={10} />
                      Jump to Page 42
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-border-light p-4 rounded-2xl rounded-tl-none flex items-center gap-2 shadow-sm">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about Muraqaba, The Soul, or Roohani Ilaj..."
          className="w-full bg-white border border-border-light rounded-2xl py-4 pl-6 pr-16 focus:outline-none focus:border-primary transition-colors shadow-sm"
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="absolute right-2 top-2 bottom-2 px-4 bg-primary text-white rounded-xl flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 shadow-md"
        >
          <Send size={20} />
        </button>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {['What is Muraqaba?', 'Explain "The Soul"', 'Spiritual cure for anxiety'].map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => setInput(suggestion)}
            className="whitespace-nowrap px-4 py-2 bg-white border border-border-light rounded-full text-xs font-medium text-text-muted hover:bg-gray-50 transition-colors shadow-sm"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
