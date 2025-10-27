import React, { useState } from 'react';
import Header from './components/Header.jsx';
import UserExam from './components/UserExam.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import Footer from './components/Footer.jsx';
import UserLogin from './components/UserLogin.jsx';
import AdminLogin from './components/AdminLogin.jsx';

function App() {
  const [mode, setMode] = useState('user');
  const [userSession, setUserSession] = useState(null); // { name, code, exam }
  const [adminSession, setAdminSession] = useState(null); // { email }

  const isUserAuthed = !!userSession;
  const isAdminAuthed = !!adminSession;

  const handleLogout = () => {
    if (mode === 'user') setUserSession(null);
    if (mode === 'admin') setAdminSession(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50 text-slate-900">
      <Header mode={mode} setMode={setMode} isUserAuthed={isUserAuthed} isAdminAuthed={isAdminAuthed} onLogout={handleLogout} userName={userSession?.name} adminEmail={adminSession?.email} />

      <main className="pt-4">
        <section className="max-w-6xl mx-auto px-4">
          <div className="rounded-xl p-4 md:p-6 bg-white/70 backdrop-blur border border-black/5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">{mode === 'user' ? 'User Mode' : 'Admin Mode'}</h2>
                <p className="text-sm text-slate-600">{mode === 'user' ? (isUserAuthed ? `Joined exam ${userSession?.exam?.code || ''}` : 'Sign in with the exam code shared by your instructor.') : (isAdminAuthed ? 'You are signed in to manage exams.' : 'Please sign in to access admin controls.')}</p>
              </div>
              <div className="hidden sm:flex gap-2">
                <span className="px-2 py-1 rounded-full text-xs bg-slate-100">Full-screen Enforcement</span>
                <span className="px-2 py-1 rounded-full text-xs bg-slate-100">Warnings & Blocking</span>
                <span className="px-2 py-1 rounded-full text-xs bg-slate-100">Google Form Import</span>
                <span className="px-2 py-1 rounded-full text-xs bg-slate-100">Results & Export</span>
              </div>
            </div>
          </div>
        </section>

        {mode === 'user' ? (
          isUserAuthed ? <UserExam candidate={userSession} exam={userSession.exam} /> : <UserLogin onSuccess={setUserSession} />
        ) : (
          isAdminAuthed ? <AdminPanel admin={adminSession} /> : <AdminLogin onSuccess={setAdminSession} />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
