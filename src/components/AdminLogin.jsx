import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, LogIn } from 'lucide-react';

export default function AdminLogin({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Enter email and password.');
      return;
    }
    // Mock auth: accept any, but show hint
    onSuccess({ email });
  }

  return (
    <div className="max-w-md mx-auto mt-8 bg-white border border-slate-200 rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-2 text-slate-700 font-semibold">
        <ShieldCheck size={18} /> Admin Login
      </div>
      <p className="text-sm text-slate-600 mt-1">Sign in to manage exams, monitor, and view results.</p>
      {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="mt-4 grid gap-3">
        <label className="text-sm">Email
          <div className="mt-1 flex items-center gap-2">
            <Mail size={16} className="text-slate-400" />
            <input type="email" className="flex-1 rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="admin@demo.com" />
          </div>
        </label>
        <label className="text-sm">Password
          <div className="mt-1 flex items-center gap-2">
            <Lock size={16} className="text-slate-400" />
            <input type="password" className="flex-1 rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" />
          </div>
        </label>
        <button type="submit" className="mt-2 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800">
          <LogIn size={16}/> Sign in
        </button>
      </form>
      <p className="text-xs text-slate-500 mt-3">Demo only. Any credentials will sign you in.</p>
    </div>
  );
}
