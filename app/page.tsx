"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Home() {
  const [kpt, setKpt] = useState({ k: '', p: '', t: '' });
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!kpt.k || !kpt.p || !kpt.t) {
      alert("모든 항목을 입력해주세요!");
      return;
    }
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 pb-24">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-blue-900">KPT AI Analyzer</h1>
          <p className="text-slate-500 mt-2">팀의 성장을 위한 마법의 한 끝</p>
        </motion.header>

        {/* 입력 섹션: Stagger 애니메이션 적용 */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {[
            { id: 'k', label: 'Keep', color: 'border-green-500', bg: 'focus-within:ring-green-400' },
            { id: 'p', label: 'Problem', color: 'border-red-500', bg: 'focus-within:ring-red-400' },
            { id: 't', label: 'Try', color: 'border-blue-500', bg: 'focus-within:ring-blue-400' }
          ].map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className={`bg-white p-5 rounded-2xl shadow-sm border-t-4 ${item.color} transition-shadow hover:shadow-md`}
            >
              <h2 className="font-bold mb-3 text-slate-800 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${item.id === 'k' ? 'bg-green-500' : item.id === 'p' ? 'bg-red-500' : 'bg-blue-500'}`} />
                {item.label}
              </h2>
              <textarea
                className={`w-full h-48 p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 ${item.bg} transition-all duration-300 resize-none text-sm md:text-base`}
                value={kpt[item.id as keyof typeof kpt]}
                onChange={(e) => setKpt({ ...kpt, [item.id]: e.target.value })}
                placeholder={`${item.label} 내용을 입력하세요...`}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* 분석 버튼: 눌림 효과(Tap) 추가 */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleAnalyze}
          disabled={loading}
          className="relative w-full py-4 bg-slate-900 text-white rounded-2xl font-bold overflow-hidden shadow-lg disabled:bg-slate-400 transition-colors"
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-2"
              >
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                AI가 팀의 성장을 분석하고 있어요...
              </motion.div>
            ) : (
              <motion.span key="normal">AI 리포트 생성하기</motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* 결과 섹션: 부드러운 등장 효과 */}
        <AnimatePresence>
          {report && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-white p-8 rounded-3xl shadow-xl border border-blue-100"
            >
              <div className="flex items-center justify-between mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <span className="text-3xl">✨</span> AI 인사이트 리포트
                </h2>
                <span className="text-xs bg-blue-50 text-blue-600 font-semibold px-3 py-1 rounded-full uppercase">
                  Powered by Claude 3.5 Sonnet
                </span>
              </div>

              <div className="prose prose-blue max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 prose-li:text-slate-600">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {report}
                </ReactMarkdown>
              </div>

              <div className="mt-8 pt-6 border-t flex justify-center">
                <p className="text-sm text-slate-400">분석 결과를 바탕으로 다음 분기 Try를 실천해 보세요!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
