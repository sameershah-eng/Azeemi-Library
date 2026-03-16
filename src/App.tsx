import React, { useState, useEffect } from 'react';
import { auth, signIn, signOut } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { 
  Library, 
  MessageSquare, 
  Activity, 
  Timer, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X,
  BookOpen,
  Sparkles,
  ChevronRight,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LibraryHome from './components/LibraryHome';
import ScholarChat from './components/ScholarChat';
import HealingLedger from './components/HealingLedger';
import MuraqabaSuite from './components/MuraqabaSuite';
import ReaderUI from './components/ReaderUI';
import AdminDashboard from './components/AdminDashboard';
import KnowledgeGraph from './components/KnowledgeGraph';
import { Book } from './types';

type View = 'home' | 'library' | 'scholar' | 'healing' | 'muraqaba' | 'reader' | 'admin';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    
    // Seed database on first load
    import('./services/seedService').then(m => m.seedDatabase());
    
    return () => unsubscribe();
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: Sparkles },
    { id: 'library', label: 'Library', icon: Library },
    { id: 'scholar', label: 'Qalandar AI', icon: MessageSquare },
    { id: 'healing', label: 'Healing', icon: Activity },
    { id: 'muraqaba', label: 'Muraqaba', icon: Timer },
    { id: 'admin', label: 'Admin', icon: Settings },
  ];

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
    setCurrentView('reader');
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <LibraryHome onSelectBook={handleBookSelect} onNavigate={setCurrentView} />;
      case 'library':
        return (
          <div className="p-8 max-w-7xl mx-auto space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-3xl font-bold mb-8">Spiritual Archive</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <LibraryHome onSelectBook={handleBookSelect} onNavigate={setCurrentView} />
                </div>
              </div>
              <div className="space-y-8">
                <KnowledgeGraph />
              </div>
            </div>
          </div>
        );
      case 'scholar':
        return <ScholarChat />;
      case 'healing':
        return <HealingLedger />;
      case 'muraqaba':
        return <MuraqabaSuite />;
      case 'admin':
        return <AdminDashboard />;
      case 'reader':
        return selectedBook ? (
          <ReaderUI book={selectedBook} onBack={() => setCurrentView('library')} />
        ) : (
          <div className="p-8">No book selected</div>
        );
      default:
        return <LibraryHome onSelectBook={handleBookSelect} onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-main text-text-main font-roboto">
      {/* Desktop Top Nav */}
      <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-surface border-b border-border-light sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('home')}>
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-text-main">Azeemia Spiritual Platform</h1>
        </div>

        <nav className="flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as View)}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                currentView === item.id ? 'text-primary' : 'text-text-muted hover:text-text-main'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <img src={user.photoURL || ''} alt="" className="w-8 h-8 rounded-full border border-border-light" />
              <button onClick={signOut} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-text-muted">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={signIn}
              className="px-6 py-2 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
            >
              Connect
            </button>
          )}
        </div>
      </header>

      {/* Mobile Top Bar */}
      <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-surface border-b border-border-light">
        <div className="flex items-center gap-2">
          <Sparkles className="text-primary w-6 h-6" />
          <span className="font-bold text-text-main">Azeemia</span>
        </div>
        {user ? (
          <img src={user.photoURL || ''} alt="" className="w-8 h-8 rounded-full" />
        ) : (
          <button onClick={signIn} className="text-sm font-bold text-primary">Connect</button>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 lg:pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border-light px-2 py-3 flex justify-around items-center z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id as View)}
            className={`flex flex-col items-center gap-1 p-1 transition-colors ${
              currentView === item.id ? 'text-primary' : 'text-text-muted'
            }`}
          >
            <item.icon size={22} />
            <span className="text-[10px] font-semibold">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
