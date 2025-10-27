import React, { useState } from 'react';
import { User, KeyRound, LogIn } from 'lucide-react';

export default function UserLogin({ onSuccess }) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmedName = name.trim();
    const normalized = code.trim().toUpperCase();
    if (!trimmedName || !normalized) {
      setError('Please enter your name and access code.');
      return;
    }
    try {
      const raw = localStorage.getItem(`exam:${normalized}`);
      if (!raw) {
        setError('Invalid access code. Please check with the exam administrator.');
        return;
      }
      const exam = JSON.parse(raw);
      onSuccess({ name: trimmedName, code: normalized, exam });
    } catch (err) {
      console.error(err);
      setError('Could not read exam for this code.');
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 bg-white border border-slate-200 rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-2 text-slate-700 font-semibold">
        <User size={18} /> Candidate Login
      </div>
      <p className="text-sm text-slate-600 mt-1">Enter your details and the exam code provided by your instructor.</p>
      {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="mt-4 grid gap-3">
        <label className="text-sm">Full Name
          <input className="mt-1 w-full rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Jane Doe" />
        </label>
        <label className="text-sm">Exam Code
          <div className="mt-1 flex items-center gap-2">
            <KeyRound size={16} className="text-slate-400" />
            <input className="flex-1 rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 uppercase tracking-wider" value={code} onChange={(e)=>setCode(e.target.value)} placeholder="EXAM-ABCD" />
          </div>
        </label>
        <button type="submit" className="mt-2 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
          <LogIn size={16}/> Continue
        </button>
      </form>
      <p className="text-xs text-slate-500 mt-3">Demo: After an admin assigns an exam, use the shown code here to join.</p>
    </div>
  );
}
