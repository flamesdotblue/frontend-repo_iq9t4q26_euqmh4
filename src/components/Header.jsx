import React from 'react';
import { GraduationCap, ShieldCheck, User, Settings } from 'lucide-react';

export default function Header({ mode, setMode }) {
  return (
    <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/60 border-b border-black/5">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-600 text-white"><GraduationCap size={20} /></div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-slate-900">Smart Exam & Proctor</h1>
            <p className="text-xs text-slate-500 -mt-0.5 flex items-center gap-1">
              <ShieldCheck size={14} className="text-emerald-600" /> Secure | Real-time | Analytics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 rounded-full p-1">
          <button
            onClick={() => setMode('user')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full transition ${mode==='user' ? 'bg-white shadow text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
            aria-label="Switch to user mode"
          >
            <User size={16} /> User Mode
          </button>
          <button
            onClick={() => setMode('admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full transition ${mode==='admin' ? 'bg-white shadow text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
            aria-label="Switch to admin mode"
          >
            <Settings size={16} /> Admin Mode
          </button>
        </div>
      </div>
    </header>
  );
}
