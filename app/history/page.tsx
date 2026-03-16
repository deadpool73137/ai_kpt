"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface SavedReport {
  id: string;
  quarter: string;
  kpt: { k: string; p: string; t: string };
  report: string;
  createdAt: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<SavedReport[]>([]);
  const [selected, setSelected] = useState<SavedReport | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('kpt_history');
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  const deleteItem = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    localStorage.setItem('kpt_history', JSON.stringify(updated));
    if (selected?.id === id) setSelected(null);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 상단 네비게이션 */}
      <header className="bg-black px-10 py-7 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/">
            <span className="text-white font-bold text-3xl tracking-tight font-[family-name:var(--font-sora)] cursor-pointer">KPT</span>
          </Link>
          <span className="text-gray-300 font-semibold text-3xl">Insight</span>
        </div>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-400 hover:text-white text-base transition-colors">회고 작성</Link>
            <Link href="/history" className="text-white text-base font-medium border-b border-white pb-0.5">이력</Link>
          </nav>
          <div className="flex items-center gap-2 text-sm bg-white/10 px-4 py-2 rounded-full">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-gray-300">Claude AI</span>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-10">

          {/* 페이지 타이틀 */}
          <div className="mb-8 pb-6 border-b border-gray-100">
            <h1 className="text-3xl font-bold text-gray-900 font-[family-name:var(--font-sora)]">분기별 리포트 이력</h1>
            <p className="text-gray-500 mt-2 text-sm">저장된 KPT 회고 분석 결과를 조회합니다</p>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-5xl mb-4">📭</p>
              <p className="text-gray-400 text-lg font-medium">저장된 이력이 없습니다</p>
              <p className="text-gray-300 text-sm mt-2">회고 작성 후 리포트를 저장해보세요</p>
              <Link href="/" className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
                회고 작성하러 가기
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-6">

              {/* 왼쪽: 이력 목록 */}
              <div className="lg:w-72 shrink-0 space-y-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                  {history.length}건의 저장된 이력
                </p>
                {history.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ x: 2 }}
                    onClick={() => setSelected(selected?.id === item.id ? null : item)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      selected?.id === item.id
                        ? 'border-blue-300 bg-blue-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-gray-800 text-base">{item.quarter}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(item.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(item.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }}
                        className="text-gray-300 hover:text-red-400 transition-colors text-xs px-2 py-1 rounded-lg hover:bg-red-50"
                      >
                        삭제
                      </button>
                    </div>
                    {/* KPT 미니 요약 */}
                    <div className="mt-3 flex gap-1.5">
                      {[
                        { label: 'K', color: 'bg-green-100 text-green-600' },
                        { label: 'P', color: 'bg-red-100 text-red-500' },
                        { label: 'T', color: 'bg-blue-100 text-blue-600' },
                      ].map((badge) => (
                        <span key={badge.label} className={`text-xs font-bold px-2 py-0.5 rounded-full ${badge.color}`}>
                          {badge.label}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* 오른쪽: 리포트 상세 */}
              <div className="flex-1 min-w-0">
                <AnimatePresence mode="wait">
                  {selected ? (
                    <motion.div
                      key={selected.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3 }}
                      className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm"
                    >
                      {/* 리포트 헤더 */}
                      <div className="px-8 py-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gray-50">
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">{selected.quarter} 분석 리포트</h2>
                          <p className="text-sm text-gray-400 mt-0.5">
                            저장일: {new Date(selected.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                        <Link
                          href="/"
                          onClick={() => localStorage.setItem('kpt_load', JSON.stringify(selected))}
                          className="text-sm bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-colors self-start"
                        >
                          이 회고로 재분석
                        </Link>
                      </div>

                      {/* KPT 원본 입력 */}
                      <div className="px-8 py-6 border-b border-gray-100">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">원본 KPT 입력</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {[
                            { label: 'Keep', value: selected.kpt.k, color: 'border-green-200 bg-green-50', labelColor: 'text-green-600' },
                            { label: 'Problem', value: selected.kpt.p, color: 'border-red-200 bg-red-50', labelColor: 'text-red-500' },
                            { label: 'Try', value: selected.kpt.t, color: 'border-blue-200 bg-blue-50', labelColor: 'text-blue-600' },
                          ].map((col) => (
                            <div key={col.label} className={`p-4 rounded-xl border ${col.color}`}>
                              <p className={`text-xs font-bold mb-2 ${col.labelColor}`}>{col.label}</p>
                              <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{col.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 리포트 본문 */}
                      <div className="px-8 py-8">
                        <div className="prose prose-blue max-w-none
                          prose-p:text-base prose-p:leading-relaxed prose-p:text-gray-600 prose-p:mb-6
                          prose-headings:text-gray-900 prose-headings:font-bold prose-headings:mt-10 prose-headings:mb-4
                          prose-li:text-gray-600 prose-li:mb-2
                          prose-strong:text-gray-900 prose-strong:font-semibold
                          prose-hr:my-8 prose-hr:border-gray-100
                          prose-blockquote:border-l-4 prose-blockquote:border-blue-400 prose-blockquote:bg-blue-50 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
                          prose-table:text-sm prose-th:bg-gray-50 prose-th:text-gray-700
                        ">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{selected.report}</ReactMarkdown>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-2xl text-gray-300"
                    >
                      <p className="text-4xl mb-3">👈</p>
                      <p className="text-sm font-medium">왼쪽에서 이력을 선택하세요</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          )}
        </div>
      </main>

      {/* 검은색 하단 푸터 */}
      <footer className="bg-black text-gray-400 mt-auto">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row justify-between gap-8 pb-8 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-white font-bold text-lg font-[family-name:var(--font-sora)]">KPT</span>
                <span className="text-gray-400 font-semibold text-lg">Insight</span>
              </div>
              <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                AI 기반 팀 회고 분석 서비스.<br />
                분기별 KPT 데이터로 팀의 성장을 이끕니다.
              </p>
            </div>
            <div className="flex gap-12">
              <div>
                <p className="text-white text-sm font-semibold mb-3">서비스</p>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/" className="hover:text-white transition-colors">회고 작성</Link></li>
                  <li><Link href="/history" className="hover:text-white transition-colors">이력 관리</Link></li>
                </ul>
              </div>
              <div>
                <p className="text-white text-sm font-semibold mb-3">기술 스택</p>
                <ul className="space-y-2 text-sm">
                  <li><span>Next.js 16</span></li>
                  <li><span>Claude AI</span></li>
                  <li><span>Supabase</span></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-600">
            <p>© 2026 KPT Insight. All rights reserved.</p>
            <p>Powered by <span className="text-gray-400">Claude 3.5 Sonnet</span> · Built with Next.js</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
