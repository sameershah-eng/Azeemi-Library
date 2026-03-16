import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, CheckCircle2, AlertCircle, Plus, Search } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { HealingRequest } from '../types';

export default function HealingLedger() {
  const [requests, setRequests] = useState<HealingRequest[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({ patientName: '', issue: '' });

  useEffect(() => {
    const q = query(collection(db, 'healing_ledger'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HealingRequest));
      setRequests(data);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    try {
      await addDoc(collection(db, 'healing_ledger'), {
        userId: auth.currentUser.uid,
        patientName: newRequest.patientName,
        issue: newRequest.issue,
        status: 'Received',
        createdAt: serverTimestamp()
      });
      setIsModalOpen(false);
      setNewRequest({ patientName: '', issue: '' });
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle2 className="text-emerald-500" size={18} />;
      case 'Processing': return <Clock className="text-amber-500" size={18} />;
      default: return <AlertCircle className="text-primary" size={18} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold flex items-center gap-3 text-text-main">
            <Activity className="text-primary" />
            Roohani Healing Ledger
          </h2>
          <p className="text-text-muted">Track spiritual healing requests and their progress.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-primary text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
        >
          <Plus size={20} />
          New Healing Request
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stats */}
        <div className="bg-white border border-border-light p-6 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-primary">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-text-main">{requests.filter(r => r.status === 'Received').length}</p>
            <p className="text-xs text-text-muted uppercase tracking-widest font-bold">Received</p>
          </div>
        </div>
        <div className="bg-white border border-border-light p-6 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-500">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-text-main">{requests.filter(r => r.status === 'Processing').length}</p>
            <p className="text-xs text-text-muted uppercase tracking-widest font-bold">Processing</p>
          </div>
        </div>
        <div className="bg-white border border-border-light p-6 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-text-main">{requests.filter(r => r.status === 'Completed').length}</p>
            <p className="text-xs text-text-muted uppercase tracking-widest font-bold">Completed</p>
          </div>
        </div>
      </div>

      {/* Timeline / List */}
      <div className="bg-white border border-border-light rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border-light flex items-center justify-between bg-gray-50/50">
          <h3 className="font-bold text-text-main">Recent Requests</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <input 
              type="text" 
              placeholder="Search patients..." 
              className="bg-white border border-border-light rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
        <div className="divide-y divide-border-light">
          {requests.map((req) => (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={req.id}
              className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                  <Activity size={20} className="text-text-muted" />
                </div>
                <div>
                  <h4 className="font-bold text-text-main">{req.patientName}</h4>
                  <p className="text-sm text-text-muted">{req.issue}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right hidden lg:block">
                  <p className="text-xs text-text-muted uppercase tracking-widest font-bold">Submitted</p>
                  <p className="text-sm font-medium text-text-main">
                    {req.createdAt?.toDate ? req.createdAt.toDate().toLocaleDateString() : 'Just now'}
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-full border flex items-center gap-2 text-sm font-bold ${
                  req.status === 'Completed' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                  req.status === 'Processing' ? 'bg-amber-50 border-amber-100 text-amber-600' :
                  'bg-blue-50 border-blue-100 text-primary'
                }`}>
                  {getStatusIcon(req.status)}
                  {req.status}
                </div>
              </div>
            </motion.div>
          ))}
          {requests.length === 0 && (
            <div className="p-12 text-center text-text-muted italic">
              No healing requests found.
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white border border-border-light w-full max-w-lg p-8 rounded-2xl shadow-2xl space-y-6"
          >
            <h3 className="text-2xl font-bold text-text-main">New Healing Request</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Patient Name</label>
                <input
                  required
                  type="text"
                  value={newRequest.patientName}
                  onChange={(e) => setNewRequest({ ...newRequest, patientName: e.target.value })}
                  className="w-full bg-gray-50 border border-border-light rounded-xl p-4 focus:outline-none focus:border-primary transition-colors"
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Spiritual/Physical Issue</label>
                <textarea
                  required
                  value={newRequest.issue}
                  onChange={(e) => setNewRequest({ ...newRequest, issue: e.target.value })}
                  className="w-full bg-gray-50 border border-border-light rounded-xl p-4 h-32 focus:outline-none focus:border-primary transition-colors"
                  placeholder="Describe the issue in detail..."
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 bg-white border border-border-light rounded-xl font-bold text-text-main hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
