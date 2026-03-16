import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, BarChart3, Users, Settings, Zap, CheckCircle2, Loader2 } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const DATA = [
  { name: 'Muraqaba', value: 450 },
  { name: 'Healing', value: 300 },
  { name: 'Soul', value: 200 },
  { name: 'Divine', value: 150 },
  { name: 'Qalandar', value: 100 },
];

const COLORS = ['#2563EB', '#3B82F6', '#D4AF37', '#1E40AF', '#111827'];

export default function AdminDashboard() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const simulateUpload = () => {
    setIsUploading(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setUploadProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => setIsUploading(false), 1000);
      }
    }, 300);
  };

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold flex items-center gap-3 text-text-main">
          <Settings className="text-primary" />
          Librarian Command Center
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* PDF Drop Zone */}
        <div className="lg:col-span-2 bg-white border border-border-light p-8 space-y-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-text-main">Agentic Ingestion</h3>
            <span className="text-xs font-bold text-primary uppercase tracking-widest">AI-Powered</span>
          </div>
          
          <div 
            className="border-2 border-dashed border-gray-200 rounded-2xl p-12 flex flex-col items-center justify-center space-y-4 hover:border-primary/50 transition-colors cursor-pointer bg-gray-50/50"
            onClick={simulateUpload}
          >
            {isUploading ? (
              <div className="text-center space-y-4 w-full max-w-xs">
                <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
                <div className="space-y-2">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-xs font-bold text-text-muted uppercase tracking-widest">
                    {uploadProgress < 30 ? 'Splitting PDF...' : 
                     uploadProgress < 60 ? 'Vectorizing Text...' : 
                     uploadProgress < 90 ? 'Extracting Metadata...' : 'Finalizing...'}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <Upload size={32} />
                </div>
                <div className="text-center">
                  <p className="font-bold text-text-main">Drop PDF here or click to upload</p>
                  <p className="text-sm text-text-muted">Automatic metadata extraction & vectorization</p>
                </div>
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl border border-border-light flex items-center gap-3">
              <CheckCircle2 className="text-emerald-500" size={20} />
              <div>
                <p className="text-sm font-bold text-text-main">Auto-Tagging</p>
                <p className="text-[10px] text-text-muted uppercase">Enabled</p>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-border-light flex items-center gap-3">
              <Zap className="text-amber-500" size={20} />
              <div>
                <p className="text-sm font-bold text-text-main">Vector Sync</p>
                <p className="text-[10px] text-text-muted uppercase">Real-time</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-8">
          <div className="bg-white border border-border-light p-6 space-y-6 rounded-2xl shadow-sm">
            <h3 className="font-bold flex items-center gap-2 text-text-main">
              <BarChart3 size={18} className="text-primary" />
              Research Trends
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DATA}>
                  <Bar dataKey="value" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#111827' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-text-muted text-center uppercase tracking-widest">Most Researched Concepts</p>
          </div>

          <div className="bg-white border border-border-light p-6 space-y-4 rounded-2xl shadow-sm">
            <h3 className="font-bold flex items-center gap-2 text-text-main">
              <Users size={18} className="text-primary" />
              Active Researchers
            </h3>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-full" />
                    <span className="text-text-main">Researcher #{i}</span>
                  </div>
                  <span className="text-emerald-500 text-xs font-bold">Online</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
