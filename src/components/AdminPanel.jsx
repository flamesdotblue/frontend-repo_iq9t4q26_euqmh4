import React, { useMemo, useState } from 'react';
import { FileInput, FileSpreadsheet, ListChecks, Upload, Users, Eye, AlertTriangle, Download } from 'lucide-react';

const sampleResults = [
  { id: 'u1', name: 'Ava Patel', score: 9, total: 10, status: 'Submitted' },
  { id: 'u2', name: 'Liam Chen', score: 7, total: 10, status: 'Submitted' },
  { id: 'u3', name: 'Noah Smith', score: 0, total: 10, status: 'Blocked' },
  { id: 'u4', name: 'Mia Garcia', score: 8, total: 10, status: 'Submitted' },
];

const importedMock = {
  title: 'Web Fundamentals Quiz',
  instructions: 'Answer all questions. Do not switch tabs during the exam.',
  questions: [
    { id: 'g1', type: 'mcq', question: 'HTML stands for?', options: ['Hyper Text Markup Language', 'HighText Machine Language', 'Hyper Tool Multi Language'], answer: 0, score: 2 },
    { id: 'g2', type: 'short', question: 'CSS property to change text color?', answerText: 'color', score: 2 },
    { id: 'g3', type: 'code', question: 'Write a function to return true if n is even.', starter: 'function isEven(n){\n  // code\n}', score: 6 },
  ],
};

function downloadCSV(rows, filename = 'results.csv') {
  const header = Object.keys(rows[0] || {}).join(',');
  const body = rows.map(r => Object.values(r).map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const csv = `${header}\n${body}`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function AdminPanel() {
  const [tab, setTab] = useState('create');
  const [title, setTitle] = useState('New Exam');
  const [duration, setDuration] = useState(12);
  const [maxScore, setMaxScore] = useState(10);
  const [formLink, setFormLink] = useState('');
  const [questions, setQuestions] = useState([
    { id: 'q1', type: 'mcq', question: '2 + 2 = ?', options: ['3', '4', '5'], answer: 1, score: 2 },
  ]);
  const [instructions, setInstructions] = useState('Stay focused. Full-screen enforced.');

  function addQuestion(type) {
    const id = `q${Math.random().toString(36).slice(2,7)}`;
    if (type === 'mcq') setQuestions(q => [...q, { id, type, question: 'New MCQ', options: ['A', 'B', 'C'], answer: 0, score: 1 }]);
    if (type === 'short') setQuestions(q => [...q, { id, type, question: 'Short answer', answerText: '', score: 1 }]);
    if (type === 'code') setQuestions(q => [...q, { id, type, question: 'Coding prompt', starter: '// write code', score: 2 }]);
  }

  function importFromGoogleForm() {
    // Demo importer: if link matches docs.google.com/forms, we load a mocked set
    if (formLink.includes('docs.google.com/forms')) {
      setTitle(importedMock.title);
      setInstructions(importedMock.instructions);
      setQuestions(importedMock.questions);
    } else {
      // For non-matching links, still demonstrate parsing by applying mock
      setTitle(importedMock.title + ' (Imported)');
      setQuestions(importedMock.questions);
    }
  }

  function updateQuestion(id, patch) {
    setQuestions(qs => qs.map(q => q.id === id ? { ...q, ...patch } : q));
  }

  const analytics = useMemo(() => {
    const scores = sampleResults.map(r => r.score);
    const avg = (scores.reduce((a, b) => a + b, 0) / scores.length) || 0;
    const max = Math.max(...scores);
    const pass = sampleResults.filter(r => r.score >= 5).length;
    const fail = sampleResults.length - pass;
    return { avg, max, pass, fail };
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-4 pb-12">
      <div className="mt-2 mb-4 flex items-center gap-2 text-slate-700">
        <ListChecks size={18}/> <h2 className="font-semibold">Admin Control Center</h2>
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={() => setTab('create')} className={`px-3 py-1.5 rounded-md text-sm ${tab==='create' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}>Create Exam</button>
        <button onClick={() => setTab('monitor')} className={`px-3 py-1.5 rounded-md text-sm ${tab==='monitor' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}>Monitoring</button>
        <button onClick={() => setTab('results')} className={`px-3 py-1.5 rounded-md text-sm ${tab==='results' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}>Results</button>
      </div>

      {tab === 'create' && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <label className="text-sm">Title
                  <input className="mt-1 w-full rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500" value={title} onChange={e=>setTitle(e.target.value)} />
                </label>
                <label className="text-sm">Duration (mins)
                  <input type="number" className="mt-1 w-full rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500" value={duration} onChange={e=>setDuration(parseInt(e.target.value||'0'))} />
                </label>
                <label className="text-sm">Max Score
                  <input type="number" className="mt-1 w-full rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500" value={maxScore} onChange={e=>setMaxScore(parseInt(e.target.value||'0'))} />
                </label>
                <label className="text-sm">Instructions
                  <textarea className="mt-1 w-full rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500" value={instructions} onChange={e=>setInstructions(e.target.value)} />
                </label>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-slate-700 font-medium"><FileInput size={18}/> Questions</div>
              <div className="mt-3 space-y-4">
                {questions.map((q, idx) => (
                  <div key={q.id} className="p-3 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Q{idx+1} • {q.type.toUpperCase()}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100">{q.score} pts</span>
                    </div>
                    <input className="mt-2 w-full rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500" value={q.question} onChange={e=>updateQuestion(q.id,{question:e.target.value})} />
                    {q.type==='mcq' && (
                      <div className="mt-2 grid gap-2">
                        {q.options.map((opt,i)=> (
                          <div key={i} className="flex items-center gap-2">
                            <input className="w-full rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500" value={opt} onChange={e=>{
                              const opts=[...q.options]; opts[i]=e.target.value; updateQuestion(q.id,{options:opts});
                            }} />
                            <input type="radio" name={`ans-${q.id}`} checked={q.answer===i} onChange={()=>updateQuestion(q.id,{answer:i})} />
                          </div>
                        ))}
                        <button onClick={()=>updateQuestion(q.id,{options:[...q.options,'Option']})} className="text-xs text-indigo-600">+ Add option</button>
                      </div>
                    )}
                    {q.type==='short' && (
                      <input className="mt-2 w-full rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500" placeholder="Correct answer (for auto marking)" value={q.answerText||''} onChange={e=>updateQuestion(q.id,{answerText:e.target.value})} />
                    )}
                    {q.type==='code' && (
                      <textarea className="mt-2 w-full font-mono text-sm rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500" placeholder="Starter code" value={q.starter||''} onChange={e=>updateQuestion(q.id,{starter:e.target.value})} />
                    )}
                    <div className="mt-2 flex items-center gap-2">
                      <label className="text-xs text-slate-600">Score</label>
                      <input type="number" className="w-20 rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500" value={q.score} onChange={e=>updateQuestion(q.id,{score:parseInt(e.target.value||'0')})}/>
                    </div>
                  </div>
                ))}
                <div className="flex flex-wrap gap-2">
                  <button onClick={()=>addQuestion('mcq')} className="px-3 py-1.5 rounded-md bg-slate-100 text-slate-800">+ MCQ</button>
                  <button onClick={()=>addQuestion('short')} className="px-3 py-1.5 rounded-md bg-slate-100 text-slate-800">+ Short</button>
                  <button onClick={()=>addQuestion('code')} className="px-3 py-1.5 rounded-md bg-slate-100 text-slate-800">+ Coding</button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-slate-700 font-medium"><Upload size={18}/> Import from Google Form</div>
              <p className="text-xs text-slate-500 mt-1">Paste a public Google Form link to auto-import title, instructions, and questions. You can edit after importing.</p>
              <input className="mt-3 w-full rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500" placeholder="https://docs.google.com/forms/..." value={formLink} onChange={e=>setFormLink(e.target.value)} />
              <button onClick={importFromGoogleForm} className="mt-3 w-full px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">Import</button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-700 font-medium"><Eye size={18}/> Preview</div>
                <span className="text-xs text-slate-500">{questions.length} questions</span>
              </div>
              <div className="mt-3 text-sm text-slate-700">
                <p className="font-semibold">{title}</p>
                <p className="text-slate-500 text-xs mt-1">{instructions}</p>
              </div>
              <button className="mt-4 w-full px-3 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700">Assign Exam</button>
            </div>
          </div>
        </div>
      )}

      {tab === 'monitor' && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-700 font-medium"><Users size={18}/> Live Activity</div>
            <div className="mt-4 grid sm:grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-lg bg-slate-50">
                <div className="text-2xl font-bold text-slate-900">12</div>
                <div className="text-xs text-slate-500">Active</div>
              </div>
              <div className="p-3 rounded-lg bg-amber-50">
                <div className="text-2xl font-bold text-amber-700">3</div>
                <div className="text-xs text-amber-700">Warned</div>
              </div>
              <div className="p-3 rounded-lg bg-red-50">
                <div className="text-2xl font-bold text-red-600">1</div>
                <div className="text-xs text-red-700">Blocked</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-2 text-slate-700 font-medium"><AlertTriangle size={18}/> Violations</div>
              <ul className="mt-2 divide-y text-sm">
                <li className="py-2 flex items-center justify-between"><span>U18 • Focus lost x3</span><span className="text-red-600 text-xs">Blocked</span></li>
                <li className="py-2 flex items-center justify-between"><span>U07 • Visibility change</span><button className="text-xs text-emerald-700">Resume</button></li>
                <li className="py-2 flex items-center justify-between"><span>U22 • Tab switch</span><button className="text-xs text-red-700">Block</button></li>
              </ul>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-700 font-medium"><FileSpreadsheet size={18}/> Quick Actions</div>
            <div className="mt-3 grid gap-2">
              <button className="px-3 py-2 rounded-md bg-slate-100">Pause Exam</button>
              <button className="px-3 py-2 rounded-md bg-slate-100">Resume Selected</button>
              <button className="px-3 py-2 rounded-md bg-red-600 text-white">Block Selected</button>
            </div>
          </div>
        </div>
      )}

      {tab === 'results' && (
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-700 font-medium"><FileSpreadsheet size={18}/> Results & Reports</div>
            <div className="flex items-center gap-2">
              <button onClick={() => downloadCSV(sampleResults, 'exam-results.csv')} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-100 text-slate-800"><Download size={16}/> CSV</button>
              <button onClick={() => window.print()} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-100 text-slate-800"><Download size={16}/> Print/PDF</button>
            </div>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-3 py-2">Student</th>
                  <th className="text-left px-3 py-2">Score</th>
                  <th className="text-left px-3 py-2">Total</th>
                  <th className="text-left px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {sampleResults.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2">{r.name}</td>
                    <td className="px-3 py-2 font-medium">{r.score}</td>
                    <td className="px-3 py-2">{r.total}</td>
                    <td className="px-3 py-2">{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 grid sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-lg bg-slate-50">
              <div className="text-xs text-slate-500">Average</div>
              <div className="text-xl font-semibold">{(analytics.avg).toFixed(1)}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50">
              <div className="text-xs text-slate-500">Highest</div>
              <div className="text-xl font-semibold">{analytics.max}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50">
              <div className="text-xs text-slate-500">Pass</div>
              <div className="text-xl font-semibold text-emerald-700">{analytics.pass}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50">
              <div className="text-xs text-slate-500">Fail</div>
              <div className="text-xl font-semibold text-red-600">{analytics.fail}</div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
