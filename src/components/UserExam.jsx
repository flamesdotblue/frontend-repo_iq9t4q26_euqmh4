import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, Clock, Maximize, Shield, XCircle, Send } from 'lucide-react';

const fallbackQuestions = [
  {
    id: 'q1',
    type: 'mcq',
    question: 'Which HTTP status code indicates a successful request?',
    options: ['200 OK', '301 Moved Permanently', '404 Not Found', '500 Internal Server Error'],
    answer: 0,
    score: 2,
  },
  {
    id: 'q2',
    type: 'short',
    question: 'Name the CSS property used to make text bold.',
    answerText: 'font-weight',
    score: 3,
  },
  {
    id: 'q3',
    type: 'code',
    question: 'Write a JavaScript function named add that returns the sum of two numbers a and b.',
    starter: 'function add(a, b) {\n  // your code here\n}',
    test: (code) => {
      try {
        return code.includes('function add') && code.includes('a') && code.includes('b') && (code.includes('a + b') || code.includes('return a+b') || code.includes('return a + b'));
      } catch {
        return false;
      }
    },
    score: 5,
  },
];

export default function UserExam({ candidate, exam }) {
  const questions = useMemo(() => exam?.questions ?? fallbackQuestions, [exam]);
  const durationSec = useMemo(() => (exam?.duration ? Math.max(1, parseInt(exam.duration)) * 60 : 12 * 60), [exam]);
  const [started, setStarted] = useState(false);
  const [remaining, setRemaining] = useState(durationSec);
  const [warnings, setWarnings] = useState(0);
  const [blocked, setBlocked] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState({});
  const timerRef = useRef(null);

  useEffect(() => {
    setRemaining(durationSec);
  }, [durationSec]);

  const totalScore = useMemo(() => questions.reduce((a, q) => a + (q.score || 1), 0), [questions]);

  useEffect(() => {
    function onVisibility() {
      if (!started || submitted) return;
      if (document.hidden) handleViolation('Tab switched or window hidden');
    }
    function onBlur() {
      if (!started || submitted) return;
      handleViolation('Window focus lost');
    }
    function onFocus() {}
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
    };
  }, [started, submitted]);

  useEffect(() => {
    if (!started || submitted) return;
    if (remaining <= 0) {
      autoSubmit('Time expired');
      return;
    }
    timerRef.current = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [remaining, started, submitted]);

  function formatTime(s) {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }

  async function enterFullscreen() {
    const el = document.documentElement;
    if (el.requestFullscreen) await el.requestFullscreen();
  }

  function startExam() {
    setStarted(true);
    setRemaining(durationSec);
    enterFullscreen();
  }

  function handleViolation(reason) {
    setWarnings((w) => {
      const next = w + 1;
      if (next >= 3) {
        setBlocked(true);
        autoSubmit(`Blocked due to violations (${reason})`);
      }
      return next;
    });
  }

  function handleChange(id, value) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function computeScore() {
    let score = 0;
    for (const q of questions) {
      const a = answers[q.id];
      if (q.type === 'mcq' && typeof a === 'number' && a === q.answer) score += q.score;
      if (q.type === 'short' && typeof a === 'string' && a.trim().toLowerCase() === (q.answerText || '').toLowerCase()) score += q.score;
      if (q.type === 'code' && typeof a === 'string') {
        if (q.test && typeof q.test === 'function') {
          if (q.test(a)) score += q.score;
        } else {
          // Basic heuristic if no test provided
          if (a.trim().length > 0) score += Math.min(q.score, 1);
        }
      }
    }
    return score;
  }

  function autoSubmit(reason) {
    setSubmitted(true);
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen();
    }
    console.info('Auto-submitted:', { reason, answers, candidate, exam });
  }

  function submitNow() {
    autoSubmit('User submitted');
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b bg-slate-50">
            <div className="flex items-center gap-2">
              <Shield className="text-indigo-600" size={18} />
              <h2 className="font-semibold">{exam?.title || 'User Exam Mode'} {candidate?.name ? `• ${candidate.name}` : ''}</h2>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-slate-500" />
                <span className={`${remaining <= 60 ? 'text-red-600' : 'text-slate-800'} font-mono`}>{formatTime(remaining)}</span>
              </div>
              <button
                onClick={submitNow}
                disabled={!started || submitted}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md ${!started || submitted ? 'bg-slate-100 text-slate-400' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
              >
                <Send size={16}/> Submit
              </button>
            </div>
          </div>

          {!started && !submitted && (
            <div className="p-6">
              {exam?.instructions && (
                <div className="mb-4 text-sm text-slate-700">
                  <div className="font-medium">Instructions</div>
                  <p className="text-slate-600 mt-1">{exam.instructions}</p>
                </div>
              )}
              <div className="rounded-lg border border-dashed p-6 text-center">
                <p className="text-slate-700">This demo enforces full-screen and tracks tab switches and focus loss.</p>
                <p className="text-slate-500 text-sm mt-1">Two warnings; the third violation blocks and auto-submits.</p>
                <button
                  onClick={startExam}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  <Maximize size={16} /> Start in Full Screen
                </button>
              </div>
            </div>
          )}

          {started && !submitted && (
            <div className="p-6 space-y-6">
              {questions.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-lg border bg-white">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium text-slate-900">Q{idx + 1}. {q.question}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{q.type.toUpperCase()} • {q.score} pts</span>
                  </div>
                  <div className="mt-3">
                    {q.type === 'mcq' && (
                      <div className="grid gap-2">
                        {q.options.map((opt, i) => (
                          <label key={i} className={`flex items-center gap-2 p-2 rounded border cursor-pointer ${answers[q.id]===i ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                            <input
                              type="radio"
                              name={q.id}
                              checked={answers[q.id] === i}
                              onChange={() => handleChange(q.id, i)}
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    )}
                    {q.type === 'short' && (
                      <input
                        type="text"
                        className="w-full rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Type your answer"
                        value={answers[q.id] || ''}
                        onChange={(e) => handleChange(q.id, e.target.value)}
                      />
                    )}
                    {q.type === 'code' && (
                      <textarea
                        className="w-full h-40 font-mono text-sm rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
                        value={answers[q.id] ?? q.starter}
                        onChange={(e) => handleChange(q.id, e.target.value)}
                      />
                    )}
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">Total: <span className="font-semibold text-slate-900">{totalScore}</span> points</p>
                <button
                  onClick={submitNow}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  <CheckCircle2 size={16} /> Submit
                </button>
              </div>
            </div>
          )}

          {submitted && (
            <div className="p-6">
              <div className="p-6 border rounded-lg bg-emerald-50 border-emerald-200">
                <h3 className="font-semibold text-emerald-900 flex items-center gap-2"><CheckCircle2 /> Answers submitted</h3>
                <p className="text-emerald-800 text-sm mt-1">This demo would normally send your attempt to the server automatically on time-out or violations.</p>
                <p className="mt-2 text-slate-700">Your estimated score (local check): <span className="font-semibold">{computeScore()} / {totalScore}</span></p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-2 text-slate-700 font-medium"><AlertTriangle className="text-amber-500" size={18}/> Proctor Status</div>
            <div className="mt-3 grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-lg bg-slate-50">
                <div className="text-2xl font-bold text-slate-900">{warnings}</div>
                <div className="text-xs text-slate-500">Warnings</div>
              </div>
              <div className={`${blocked ? 'bg-red-50' : 'bg-slate-50'} p-3 rounded-lg`}>
                <div className={`text-2xl font-bold ${blocked ? 'text-red-600' : 'text-slate-900'}`}>{blocked ? 'Yes' : 'No'}</div>
                <div className="text-xs text-slate-500">Blocked</div>
              </div>
              <div className={`${submitted ? 'bg-emerald-50' : 'bg-slate-50'} p-3 rounded-lg`}>
                <div className={`text-2xl font-bold ${submitted ? 'text-emerald-700' : 'text-slate-900'}`}>{submitted ? 'Yes' : 'No'}</div>
                <div className="text-xs text-slate-500">Submitted</div>
              </div>
            </div>
            {!started && !submitted && (
              <p className="text-xs text-slate-500 mt-3">Start the exam to begin full-screen enforcement and monitoring.</p>
            )}
            {started && !submitted && (
              <div className="mt-3 text-xs text-slate-600 space-y-1">
                <p>• Switching tabs, minimizing, or losing focus will trigger warnings.</p>
                <p>• Third violation blocks and auto-submits.</p>
              </div>
            )}
          </div>

          {blocked && !submitted && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-red-700 font-medium"><XCircle size={18}/> You have been blocked</div>
              <p className="text-sm text-red-700 mt-1">Your exam will be auto-submitted for admin review.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
