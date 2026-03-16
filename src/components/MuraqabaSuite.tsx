import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Timer, Play, Pause, RotateCcw, Volume2, Sparkles } from 'lucide-react';

export default function MuraqabaSuite() {
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  const [isActive, setIsActive] = useState(false);
  const [ambientSound, setAmbientSound] = useState('Celestial Silence');

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (900 - timeLeft) / 900;

  return (
    <div className="max-w-4xl mx-auto p-8 flex flex-col items-center justify-center min-h-[calc(100vh-12rem)]">
      <div className="text-center space-y-4 mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 text-primary text-sm font-bold"
        >
          <Sparkles size={16} />
          <span>AI-Guided Meditation</span>
        </motion.div>
        <h2 className="text-4xl font-bold text-text-main">Muraqaba Suite</h2>
        <p className="text-text-muted">Focus your consciousness on the Divine Light.</p>
      </div>

      <div className="relative w-64 h-64 lg:w-80 lg:h-80 flex items-center justify-center">
        {/* Gradient Stroke Circle */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="48%"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-gray-100"
          />
          <motion.circle
            cx="50%"
            cy="50%"
            r="48%"
            fill="none"
            stroke="url(#timerGradient)"
            strokeWidth="8"
            strokeDasharray="100"
            strokeDashoffset={100 - (progress * 100)}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#D4AF37" />
            </linearGradient>
          </defs>
        </svg>

        <div className="text-center z-10">
          <span className="text-6xl lg:text-7xl font-bold font-mono tracking-tighter text-text-main">
            {formatTime(timeLeft)}
          </span>
          <p className="text-text-muted text-xs uppercase tracking-widest mt-2">Remaining</p>
        </div>
      </div>

      <div className="mt-12 flex items-center gap-6">
        <button
          onClick={() => setTimeLeft(900)}
          className="p-4 bg-white border border-border-light rounded-2xl hover:bg-gray-50 transition-colors shadow-sm"
        >
          <RotateCcw size={24} className="text-text-muted" />
        </button>
        <button
          onClick={() => setIsActive(!isActive)}
          className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-2xl shadow-primary/40 hover:scale-105 transition-transform"
        >
          {isActive ? <Pause size={32} fill="white" className="text-white" /> : <Play size={32} fill="white" className="ml-1 text-white" />}
        </button>
        <button className="p-4 bg-white border border-border-light rounded-2xl hover:bg-gray-50 transition-colors shadow-sm">
          <Volume2 size={24} className="text-text-muted" />
        </button>
      </div>

      <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-2xl">
        {['Celestial Silence', 'Divine Echo', 'Ethereal Light', 'Cosmic Breath'].map((sound) => (
          <button
            key={sound}
            onClick={() => setAmbientSound(sound)}
            className={`p-4 rounded-xl border transition-all text-sm font-medium shadow-sm ${
              ambientSound === sound 
                ? 'bg-primary/10 border-primary text-primary' 
                : 'bg-white border-border-light text-text-muted hover:bg-gray-50'
            }`}
          >
            {sound}
          </button>
        ))}
      </div>
    </div>
  );
}
