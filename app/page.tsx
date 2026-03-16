"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ScoreCards, type Scores } from '@/components/ScoreCards';
import { KptChart } from '@/components/KptChart';

// ─── 타입 ───────────────────────────────────────────────

interface SavedReport {
  id: string;
  quarter: string;
  kpt: { k: string; p: string; t: string };
  report: string;
  scores?: Scores;
  createdAt: string;
}

// ─── 분기 옵션 생성 ────────────────────────────────────
function generateQuarters(): string[] {
  const quarters: string[] = [];
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentQuarter = Math.ceil((now.getMonth() + 1) / 3);
  for (let y = currentYear; y >= currentYear - 2; y--) {
    for (let q = 4; q >= 1; q--) {
      if (y === currentYear && q > currentQuarter) continue;
      quarters.push(`${y}-Q${q}`);
    }
  }
  return quarters;
}

// ─── KPT 카드 설정 ─────────────────────────────────────
const CARDS = [
  { id: 'k', label: 'Keep', badge: 'K', badgeBg: 'bg-green-100', badgeText: 'text-green-600', description: '잘 되고 있어서 유지할 것', dot: 'bg-green-500', ring: 'focus:ring-blue-500', labelColor: 'text-green-600' },
  { id: 'p', label: 'Problem', badge: 'P', badgeBg: 'bg-red-100', badgeText: 'text-red-500', description: '개선이 필요한 문제점', dot: 'bg-red-500', ring: 'focus:ring-blue-500', labelColor: 'text-red-500' },
  { id: 't', label: 'Try', badge: 'T', badgeBg: 'bg-blue-100', badgeText: 'text-blue-600', description: '다음 분기에 시도할 것', dot: 'bg-blue-500', ring: 'focus:ring-blue-500', labelColor: 'text-blue-600' },
];

// ─── 이력 패널 ─────────────────────────────────────────
function HistoryPanel({ history, onLoad, onDelete }: {
  history: SavedReport[];
  onLoad: (item: SavedReport) => void;
  onDelete: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  if (history.length === 0) return null;

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">📋</span>
          <span className="font-semibold text-gray-700 text-sm">분기별 리포트 이력</span>
          <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full">{history.length}건</span>
        </div>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-gray-400 text-sm">▼</motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden border-t border-gray-100">
            <div className="p-4 space-y-2">
              {history.map((item) => (
                <div key={item.id}>
                  <div
                    onClick={() => setSelected(selected === item.id ? null : item.id)}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${selected === item.id ? 'border-blue-300 bg-blue-50' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm">📅</div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{item.quarter}</p>
                        <p className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={(e) => { e.stopPropagation(); onLoad(item); }} className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors">불러오기</button>
                      <button onClick={(e) => { e.stopPropagation(); onDelete(item.id); }} className="text-xs text-gray-400 px-3 py-1.5 rounded-lg font-semibold hover:bg-red-50 hover:text-red-400 transition-colors">삭제</button>
                    </div>
                  </div>
                  <AnimatePresence>
                    {selected === item.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                        <div className="mt-1 p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-600 max-h-48 overflow-y-auto leading-relaxed">
                          <p className="whitespace-pre-wrap">{item.report.slice(0, 400)}...</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── 애니메이션 ────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { y: 16, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.35 } },
};

// ─── 메인 컴포넌트 ─────────────────────────────────────
export default function Home() {
  const [kpt, setKpt] = useState({ k: '', p: '', t: '' });
  const [quarter, setQuarter] = useState('2026-Q1');
  const [report, setReport] = useState('');
  const [scores, setScores] = useState<Scores | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<SavedReport[]>([]);
  const [saved, setSaved] = useState(false);

  const QUARTERS = generateQuarters();

  const PREVIEW_REPORT = `## 📊 종합 분석 요약


팀이 **코드 리뷰 문화**와 **애자일 스프린트 운영**에서 긍정적인 성과를 보이고 있습니다.


다만 커뮤니케이션 지연과 기술 부채 누적이 반복 문제로 확인되어, 다음 분기에는 이 두 영역에 집중적인 개선이 필요합니다.


---


## 📈 KPT 점수 요약


| 항목 | 점수 | 평가 |
|------|------|------|
| ✅ Keep — Strengths Score | 7 / 10 | 명확한 프로세스 장점, 수치 근거 보완 필요 |
| ⚠️ Problem — Risk Score | 8 / 10 | 반복적 구조 문제로 생산성 저해, 즉각 개선 필요 |
| 🚀 Try — Actionability Score | 6 / 10 | 방향성은 좋으나 실행 주체·일정 명확화 필요 |


---


## ✅ Keep — 잘 되고 있는 것


**Strengths Score: 7 / 10**


- **코드 리뷰 프로세스**가 안정적으로 정착되어 버그 감소에 기여하고 있습니다.

- 주간 스프린트 회고를 통해 팀원 간 **심리적 안전감**이 높아졌습니다.

- **문서화 습관**이 개선되어 신규 합류자의 온보딩 시간이 단축되었습니다.


---


## ⚠️ Problem — 반복되는 문제점


**Risk Score: 8 / 10**


1. **커뮤니케이션 지연**: Slack 응답 지연으로 의사결정이 느려지는 패턴이 반복됩니다.

2. **기술 부채 누적**: 빠른 배포 우선순위로 인해 리팩토링이 계속 밀리고 있습니다.

3. **일정 추정 오류**: 예상보다 2~3배 오래 걸리는 태스크가 매 스프린트마다 발생합니다.


---


## 🚀 Try — 다음 분기 실행 제안


**Actionability Score: 6 / 10**


| 제안 | 기대 효과 | 우선순위 |
|------|-----------|----------|
| 응답 SLA 설정 (2시간 이내) | 의사결정 속도 향상 | 🔴 높음 |
| 스프린트 20% 기술 부채 할당 | 코드 품질 안정화 | 🟡 중간 |
| 태스크 분해 워크샵 도입 | 일정 예측 정확도 향상 | 🟡 중간 |


---


> 💡 **코치 한마디**: 팀의 가장 큰 자산은 이미 갖춰진 리뷰 문화입니다. 이 기반 위에 커뮤니케이션 속도만 개선된다면 다음 분기는 눈에 띄는 도약이 가능합니다.`;

  useEffect(() => {
    const stored = localStorage.getItem('kpt_history');
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  const saveToHistory = () => {
    const newItem: SavedReport = { id: Date.now().toString(), quarter, kpt, report, scores: scores ?? undefined, createdAt: new Date().toISOString() };
    const updated = [newItem, ...history.filter((h) => h.quarter !== quarter)];
    setHistory(updated);
    localStorage.setItem('kpt_history', JSON.stringify(updated));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const loadFromHistory = (item: SavedReport) => {
    setKpt(item.kpt);
    setQuarter(item.quarter);
    setReport(item.report);
    setScores(item.scores ?? null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteFromHistory = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    localStorage.setItem('kpt_history', JSON.stringify(updated));
  };

  const handleAnalyze = async () => {
    if (!kpt.k || !kpt.p || !kpt.t) {
      alert("모든 항목을 입력해주세요!");
      return;
    }
    setLoading(true);
    setSaved(false);
    try {
      const res = await fetch('/api/analyze', { method: 'POST', body: JSON.stringify(kpt) });
      const data = await res.json();
      setReport(data.result);
      if (data.scores) setScores(data.scores);
    } catch {
      alert("분석에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 검은색 상단 네비게이션 */}
      <header className="bg-black px-6 md:px-10 py-5 md:py-7">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-2xl md:text-3xl tracking-tight font-[family-name:var(--font-sora)]">KPT</span>
            <span className="text-gray-300 font-semibold text-2xl md:text-3xl">Insight</span>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <nav className="flex items-center gap-4 md:gap-8">
              <Link href="/" className="text-white text-sm md:text-base font-medium border-b border-white pb-0.5">회고 작성</Link>
              <Link href="/history" className="text-gray-400 hover:text-white text-sm md:text-base transition-colors">이력</Link>
            </nav>
            <div className="hidden md:flex items-center gap-2 text-sm bg-white/10 px-4 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-gray-300">Claude AI</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">

        {/* 헤더 */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-center py-8 border-b border-gray-100 mb-2">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight font-[family-name:var(--font-sora)]">
            KPT AI <span className="text-blue-600">Analyzer</span>
          </h1>
          <p className="text-gray-500 mt-3 text-base">팀의 회고를 입력하면 AI가 성장 인사이트를 분석해드립니다</p>
        </motion.div>

        {/* 분기 선택 */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex items-center gap-3 p-4 border border-gray-200 rounded-2xl bg-gray-50">
          <span className="text-sm font-medium text-gray-600">분기 선택</span>
          <select
            value={quarter}
            onChange={(e) => setQuarter(e.target.value)}
            className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
          >
            {QUARTERS.map((q) => <option key={q} value={q}>{q}</option>)}
          </select>
          {history.some((h) => h.quarter === quarter) && (
            <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full font-medium">저장된 이력 있음</span>
          )}
        </motion.div>

        {/* KPT 입력 카드 */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CARDS.map((card) => (
            <motion.div key={card.id} variants={itemVariants} className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
              <div className="px-5 pt-5 pb-3 flex items-center gap-3 border-b-2 border-gray-100">
                <span className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg ${card.badgeBg} ${card.badgeText}`}>{card.badge}</span>
                <div>
                  <h2 className={`font-bold text-sm ${card.labelColor}`}>{card.label}</h2>
                  <p className="text-xs text-gray-400">{card.description}</p>
                </div>
              </div>
              <div className="p-3">
                <textarea
                  className="w-full h-48 p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-200 resize-none text-sm text-gray-700 placeholder:text-gray-300 leading-relaxed border border-transparent focus:border-blue-200"
                  value={kpt[card.id as keyof typeof kpt]}
                  onChange={(e) => setKpt({ ...kpt, [card.id]: e.target.value })}
                  placeholder={`${card.label} 내용을 입력하세요...`}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* 미리보기 */}
        <div className="flex justify-end">
          <button onClick={() => { if (report) { setReport(''); setScores(null); } else { setReport(PREVIEW_REPORT); setScores({ strengths: 7, risks: 8, actionability: 6 }); } }} className="text-xs text-gray-400 hover:text-blue-500 transition-colors underline underline-offset-2">
            {report ? '미리보기 닫기' : '🔍 리포트 미리보기'}
          </button>
        </div>

        {/* 분석 버튼 */}
        <motion.button
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full py-4 rounded-xl font-semibold text-base text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 shadow-sm transition-colors duration-200"
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-3">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                AI가 팀의 회고를 분석하고 있어요...
              </motion.div>
            ) : (
              <motion.span key="normal">AI 인사이트 리포트 생성하기</motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* 결과 리포트 */}
        <AnimatePresence>
          {report && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm"
            >
              {/* 리포트 헤더 */}
              <div className="px-8 py-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">AI 분석 리포트</h2>
                  <p className="text-sm text-gray-400 mt-0.5">{quarter} · Powered by Claude AI</p>
                </div>
                <span className="text-xs text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full font-semibold self-start md:self-auto">Claude 3.5 Sonnet</span>
              </div>

              {/* 정량적 진단 점수 */}
              <div className="px-8 pt-6">
                {scores && <ScoreCards scores={scores} />}
              </div>

              {/* KPT 차트 */}
              <div className="px-8">
                <KptChart kpt={kpt} />
              </div>

              {/* 마크다운 본문 */}
              <div className="px-8 pb-8">
                <div className="prose prose-blue max-w-none
                  prose-p:leading-[2] prose-p:mb-10 prose-p:text-base prose-p:text-gray-600
                  prose-li:mb-4 prose-li:text-gray-600
                  prose-headings:mt-14 prose-headings:mb-6 prose-headings:text-gray-900 prose-headings:font-bold
                  prose-strong:text-gray-900 prose-strong:font-semibold
                  prose-hr:my-8 prose-hr:border-gray-100
                  prose-blockquote:border-l-4 prose-blockquote:border-blue-400 prose-blockquote:bg-blue-50 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
                  prose-table:text-sm prose-th:bg-gray-50 prose-th:text-gray-700
                ">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{report}</ReactMarkdown>
                </div>
              </div>

              {/* 저장 버튼 */}
              <div className="px-8 pb-6">
                <button
                  onClick={saveToHistory}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 border ${
                    saved
                      ? 'bg-green-50 text-green-600 border-green-200'
                      : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'
                  }`}
                >
                  {saved ? '✅ 이력에 저장됐습니다!' : `💾 ${quarter} 리포트 저장하기`}
                </button>
              </div>

              {/* 피드백 */}
              <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex flex-col items-center gap-3">
                <p className="text-sm text-gray-400">이 분석 결과가 도움이 되었나요?</p>
                <div className="flex gap-2">
                  {['😍', '👍', '🤔'].map((emoji) => (
                    <motion.button key={emoji} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} className="text-xl bg-white border border-gray-200 w-12 h-12 rounded-xl flex items-center justify-center hover:shadow-sm transition-all">
                      {emoji}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 이력 바로가기 */}
        {history.length > 0 && (
          <div className="text-center pb-4">
            <Link href="/history" className="text-sm text-blue-600 hover:underline">
              📋 저장된 이력 {history.length}건 보기 →
            </Link>
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
                  <li><a href="#" className="hover:text-white transition-colors">회고 작성</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">이력 관리</a></li>
                </ul>
              </div>
              <div>
                <p className="text-white text-sm font-semibold mb-3">기술 스택</p>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Next.js 16</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Claude AI</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Supabase</a></li>
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
