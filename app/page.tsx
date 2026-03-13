"use client";

import React, { useState } from 'react';

export default function Home() {
  const [kpt, setKpt] = useState({ k: '', p: '', t: '' });
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: JSON.stringify(kpt),
      });
      const data = await res.json();
      setReport(data.result);
    } catch (error) {
      alert("분석에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-blue-900">KPT AI Analyzer</h1>
          <p className="text-slate-500 mt-2">팀의 회고를 입력하고 성장을 위한 인사이트를 얻으세요.</p>
        </header>

        {/* 입력 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['k', 'p', 't'].map((type) => (
            <div key={type} className="bg-white p-4 rounded-xl shadow-sm border">
              <h2 className="font-bold mb-2 uppercase text-blue-600">
                {type === 'k' ? 'Keep' : type === 'p' ? 'Problem' : 'Try'}
              </h2>
              <textarea
                className="w-full h-48 p-2 bg-slate-50 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
                value={kpt[type as keyof typeof kpt]}
                onChange={(e) => setKpt({ ...kpt, [type]: e.target.value })}
                placeholder="내용을 입력하세요..."
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:bg-slate-400 transition"
        >
          {loading ? "AI가 분석 중입니다..." : "AI 리포트 생성하기"}
        </button>

        {/* 결과 섹션 */}
        {report && (
          <div className="bg-white p-6 rounded-xl shadow-md border-2 border-blue-100 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              ✨ AI 분석 리포트
            </h2>
            <div className="prose prose-blue max-w-none whitespace-pre-wrap text-slate-700">
              {report}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
