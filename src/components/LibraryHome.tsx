import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { Book } from '../types';

interface Props {
  onSelectBook: (book: Book) => void;
  onNavigate: (view: any) => void;
}

const DUMMY_BOOKS: Book[] = [
  {
    id: '1',
    title: 'Qalandar Shaoor',
    author: 'Hazrat Khwaja Shamsuddin Azeemi',
    coverUrl: 'https://picsum.photos/seed/qalandar/400/600',
    description: 'A masterpiece on spiritual consciousness and the path of the Qalandar.',
    category: 'Philosophy',
    pdfUrl: '#',
    tags: ['Sufism', 'Consciousness']
  },
  {
    id: '2',
    title: 'Loh-o-Qalam',
    author: 'Hazrat Khwaja Shamsuddin Azeemi',
    coverUrl: 'https://picsum.photos/seed/loh/400/600',
    description: 'Exploring the divine pen and the secrets of creation.',
    category: 'Metaphysics',
    pdfUrl: '#',
    tags: ['Creation', 'Divine']
  },
  {
    id: '3',
    title: 'Roohani Ilaj',
    author: 'Hazrat Khwaja Shamsuddin Azeemi',
    coverUrl: 'https://picsum.photos/seed/healing/400/600',
    description: 'A comprehensive guide to spiritual healing and remedies.',
    category: 'Healing',
    pdfUrl: '#',
    tags: ['Healing', 'Remedies']
  }
];

export default function LibraryHome({ onSelectBook, onNavigate }: Props) {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      {/* Hero Section */}
      <section className="py-12 lg:py-24 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 text-primary text-sm font-bold"
          >
            <Sparkles size={16} />
            <span>The Digital Soul of Silsila Azeemia</span>
          </motion.div>
          
          <h2 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight text-text-main">
            Unlock the <span className="text-primary">Celestial</span> <br />
            Knowledge of Sufism
          </h2>
          
          <p className="text-lg text-text-muted max-w-xl leading-relaxed">
            Immerse yourself in the profound teachings of Hazrat Khwaja Shamsuddin Azeemi. 
            Our AI-powered platform bridges ancient wisdom with modern research tools.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => onNavigate('scholar')}
              className="px-8 py-4 bg-primary text-white rounded-xl font-bold flex items-center gap-2 shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
            >
              Ask Qalandar AI
              <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => onNavigate('library')}
              className="px-8 py-4 bg-white border border-border-light rounded-xl font-bold text-text-main hover:bg-gray-50 transition-colors"
            >
              Explore Library
            </button>
          </div>
        </div>

        <div className="flex-1 relative">
          <div className="absolute -inset-4 bg-primary/5 blur-3xl rounded-full" />
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative glass-panel p-8 aspect-square flex items-center justify-center bg-white"
          >
            <div className="text-center space-y-4">
              <div className="w-32 h-32 mx-auto bg-primary/5 rounded-full flex items-center justify-center border border-primary/10">
                <BookOpen size={64} className="text-primary" />
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-text-main">1,200+ Pages</p>
                <p className="text-text-muted text-sm uppercase tracking-widest">Digitized Wisdom</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-12 space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-3xl font-bold text-text-main">Paths of Learning</h3>
          <button className="text-primary font-bold flex items-center gap-1 hover:underline">
            View All <ChevronRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DUMMY_BOOKS.map((book) => (
            <motion.div
              key={book.id}
              whileHover={{ y: -8 }}
              className="glass-panel overflow-hidden group cursor-pointer bg-white border border-border-light"
              onClick={() => onSelectBook(book)}
            >
              <div className="aspect-[3/4] overflow-hidden relative">
                <img 
                  src={book.coverUrl} 
                  alt={book.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="px-3 py-1 bg-primary text-white rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {book.category}
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-2">
                <h4 className="text-xl font-bold text-text-main group-hover:text-primary transition-colors">{book.title}</h4>
                <p className="text-sm text-text-muted line-clamp-2">{book.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
