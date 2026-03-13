"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const CARDS = [
  {
    id: 'k',
    label: 'Keep',
    emoji: '✅',
    description: '잘 되고 있어서 유지할 것',
    accent: 'from-emerald-400 to-teal-400',
    iconBg: 'bg-emerald-50',
    iconText: 'text-emerald-500',
    ring: 'focus-within:ring-emerald-300',
    border: 'border-emerald-200',
    labelColor: 'text-emerald-600',
    textareaBg: 'bg-emerald-50/50',
  },
  {
    id: 'p',
    label: 'Problem',
    emoji: '⚠️',
    description: '개선이 필요한 문제점',
    accent: 'from-teal-400 to-cyan-400',
    iconBg: 'bg-teal-50',
    iconText: 'text-teal-500',
    ring: 'focus-within:ring-teal-300',
    border: 'border-teal-200',
    labelColor: 'text-teal-600',
    textareaBg: 'bg-teal-50/50',
  },
  {
    id: 't',
    label: 'Try',
    emoji: '🚀',
    description: '다음 분기에 시도할 것',
    accent: 'from-cyan-400 to-sky-400',
    iconBg: 'bg-cyan-50',
    iconText: 'text-cyan-500',
    ring: 'focus-within:ring-cyan-300',
    border: 'border-cyan-200',
    labelColor: 'text-cyan-600',
    textareaBg: 'bg-cyan-50/50',
  },
];

function KptChart({ kpt }: { kpt: { k: string; p: string; t: string } }) {
  const countLines = (text: string) =>
    text.split('\n').filter((l) => l.trim().length > 0).length || 1;

  const counts = {
    k: countLines(kpt.k),
    p: countLines(kpt.p),
    t: countLines(kpt.t),
  };
  const total = counts.k + counts.p + counts.t;
  const pct = (n: number) => Math.round((n / total) * 100);

  const bars = [
    { label: 'Keep', value: counts.k, pct: pct(counts.k), color: 'from-emerald-400 to-teal-400', bg: 'bg-emerald-50', text: 'text-emerald-600' },
    { label: 'Problem', value: counts.p, pct: pct(counts.p), color: 'from-teal-400 to-cyan-400', bg: 'bg-teal-50', text: 'text-teal-600' },
    { label: 'Try', value: counts.t, pct: pct(counts.t), color: 'from-cyan-400 to-sky-400', bg: 'bg-cyan-50', text: 'text-cyan-600' },
  ];

  return (
    <div className="mx-8 my-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-5">KPT 항목 분포</p>

      {/* 가로 누적 바 */}
      <div className="flex rounded-full overflow-hidden h-4 mb-6 gap-0.5">
        {bars.map((b) => (
          <motion.div
            key={b.label}
            initial={{ width: 0 }}
            animate={{ width: `${b.pct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className={`bg-gradient-to-r ${b.color} h-full`}
            title={`${b.label}: ${b.pct}%`}
          />
        ))}
      </div>

      {/* 개별 막대 + 라벨 */}
      <div className="space-y-3">
        {bars.map((b, i) => (
          <div key={b.label} className="flex items-center gap-3">
            <span className={`text-xs font-bold w-14 ${b.text}`}>{b.label}</span>
            <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${b.pct}%` }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 * i + 0.3 }}
                className={`h-full rounded-full bg-gradient-to-r ${b.color}`}
              />
            </div>
            <span className="text-xs text-slate-400 w-10 text-right">{b.pct}%</span>
            <span className={`text-xs font-semibold ${b.text} ${b.bg} px-2 py-0.5 rounded-full`}>
              {b.value}항목
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { y: 24, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function Home() {
  const [kpt, setKpt] = useState({ k: '', p: '', t: '' });
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(false);

  const PREVIEW_REPORT = `## 📊 종합 분석 요약\n\n팀이 **코드 리뷰 문화**와 **애자일 스프린트 운영**에서 긍정적인 성과를 보이고 있습니다. 다만 커뮤니케이션 지연과 기술 부채 누적이 반복 문제로 확인되어, 다음 분기에는 이 두 영역에 집중적인 개선이 필요합니다.\n\n---\n\n## ✅ Keep — 잘 되고 있는 것\n\n- **코드 리뷰 프로세스**가 안정적으로 정착되어 버그 감소에 기여하고 있습니다.\n- 주간 스프린트 회고를 통해 팀원 간 **심리적 안전감**이 높아졌습니다.\n- **문서화 습관**이 개선되어 신규 합류자의 온보딩 시간이 단축되었습니다.\n\n---\n\n## ⚠️ Problem — 반복되는 문제점\n\n1. **커뮤니케이션 지연**: Slack 응답 지연으로 의사결정이 느려지는 패턴이 반복됩니다.\n2. **기술 부채 누적**: 빠른 배포 우선순위로 인해 리팩토링이 계속 밀리고 있습니다.\n3. **일정 추정 오류**: 예상보다 2~3배 오래 걸리는 태스크가 매 스프린트마다 발생합니다.\n\n---\n\n## 🚀 Try — 다음 분기 실행 제안\n\n| 제안 | 기대 효과 | 우선순위 |\n|------|-----------|----------|\n| 응답 SLA 설정 (2시간 이내) | 의사결정 속도 향상 | 🔴 높음 |\n| 스프린트 20% 기술 부채 할당 | 코드 품질 안정화 | 🟡 중간 |\n| 태스크 분해 워크샵 도입 | 일정 예측 정확도 향상 | 🟡 중간 |\n\n---\n\n> 💡 **코치 한마디**: 팀의 가장 큰 자산은 이미 갖춰진 리뷰 문화입니다. 이 기반 위에 커뮤니케이션 속도만 개선된다면 다음 분기는 눈에 띄는 도약이 가능합니다.`;

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
    } catch {
      alert("분석에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f9fc] p-4 md:p-10 pb-28">
      <div className="max-w-5xl mx-auto space-y-12">

        {/* 헤더 */}
        <motion.header
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center pt-8"
        >
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-1.5 text-xs font-semibold text-slate-500 mb-5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Claude 3.5 Sonnet 연동
          </div>
          <h1 className="font-[family-name:var(--font-sora)] text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
              KPT AI Analyzer
            </span>
          </h1>
          <p className="text-slate-400 mt-3 text-base md:text-lg">
            팀의 회고를 입력하면 AI가 성장 인사이트를 분석해드립니다
          </p>
        </motion.header>

        {/* KPT 입력 카드 */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
        >
          {CARDS.map((card) => (
            <motion.div
              key={card.id}
              variants={itemVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className={`relative bg-white rounded-2xl shadow-sm border ${card.border} overflow-hidden`}
            >
              {/* 왼쪽 세로 컬러 바 */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${card.accent}`} />

              <div className="p-6 pl-7">
                {/* 아이콘 + 라벨 */}
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center text-lg shadow-sm`}>
                    {card.emoji}
                  </div>
                  <div>
                    <h2 className={`font-extrabold text-base ${card.labelColor} font-[family-name:var(--font-sora)]`}>
                      {card.label}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">{card.description}</p>
                  </div>
                </div>

                {/* 텍스트에리어 */}
                <textarea
                  className={`w-full h-52 p-4 ${card.textareaBg} rounded-xl outline-none focus:ring-2 ${card.ring} transition-all duration-300 resize-none text-sm text-slate-700 placeholder:text-slate-300 leading-relaxed border border-transparent`}
                  value={kpt[card.id as keyof typeof kpt]}
                  onChange={(e) => setKpt({ ...kpt, [card.id]: e.target.value })}
                  placeholder={`${card.label} 내용을 입력하세요...`}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* 미리보기 버튼 */}
        <div className="flex justify-end">
          <button
            onClick={() => setReport(report ? '' : PREVIEW_REPORT)}
            className="text-xs text-slate-400 hover:text-violet-500 underline underline-offset-2 transition-colors"
          >
            {report ? '미리보기 닫기' : '🔍 리포트 미리보기'}
          </button>
        </div>

        {/* 분석 버튼 */}
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full py-5 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-500 disabled:from-slate-300 disabled:to-slate-300 shadow-lg shadow-teal-100 transition-all duration-300"
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-3"
              >
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                AI가 팀의 회고를 분석하고 있어요...
              </motion.div>
            ) : (
              <motion.span key="normal" className="flex items-center justify-center gap-2">
                ✨ AI 인사이트 리포트 생성하기
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* 결과 리포트 */}
        <AnimatePresence>
          {report && (
            <motion.div
              initial={{ opacity: 0, y: 32, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="bg-white rounded-3xl shadow-md border border-slate-100 overflow-hidden"
            >
              {/* 리포트 헤더 */}
              <div className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 px-8 py-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    ✨ AI 인사이트 리포트
                  </h2>
                  <span className="text-xs bg-white/20 text-white font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
                    Claude 3.5 Sonnet
                  </span>
                </div>
              </div>

              {/* KPT 시각화 차트 */}
              <KptChart kpt={kpt} />

              {/* 리포트 본문 */}
              <div className="px-8 py-8">
                <div className="prose prose-blue max-w-none
                  prose-p:my-6
                  prose-p:leading-[4]
                  prose-headings:mt-8
                  prose-headings:mb-4
                  prose-headings:font-bold
                  prose-headings:text-slate-900
                  prose-li:my-2
                  prose-li:leading-[3]
                  prose-p:text-slate-600
                  prose-ul:my-4 prose-ol:my-4
                  prose-strong:text-slate-800
                  prose-hr:my-16
                  prose-blockquote:border-l-4 prose-blockquote:border-teal-400 prose-blockquote:bg-teal-50/50 prose-blockquote:rounded-r-xl prose-blockquote:py-1
                  prose-table:text-sm prose-th:bg-slate-50 prose-th:text-slate-700
                ">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {report}
                  </ReactMarkdown>
                </div>
              </div>

              {/* 리포트 푸터 */}
              <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-center">
                <p className="text-sm text-slate-400">분석 결과를 바탕으로 다음 분기 Try를 실천해 보세요 🙌</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}
