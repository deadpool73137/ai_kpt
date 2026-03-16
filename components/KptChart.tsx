"use client";

import { motion } from 'framer-motion';

export function KptChart({ kpt }: { kpt: { k: string; p: string; t: string } }) {
  const countLines = (text: string) => text.split('\n').filter((l) => l.trim().length > 0).length || 1;
  const counts = { k: countLines(kpt.k), p: countLines(kpt.p), t: countLines(kpt.t) };
  const total = counts.k + counts.p + counts.t;
  const pct = (n: number) => Math.round((n / total) * 100);
  const bars = [
    { label: 'Keep', value: counts.k, pct: pct(counts.k), bar: 'bg-green-500', light: 'bg-green-50', text: 'text-green-600' },
    { label: 'Problem', value: counts.p, pct: pct(counts.p), bar: 'bg-red-400', light: 'bg-red-50', text: 'text-red-500' },
    { label: 'Try', value: counts.t, pct: pct(counts.t), bar: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-600' },
  ];
  return (
    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 mb-8">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">KPT 항목 분포</p>
      <div className="flex rounded-full overflow-hidden h-3 mb-6 gap-0.5">
        {bars.map((b) => (
          <motion.div key={b.label} initial={{ width: 0 }} animate={{ width: `${b.pct}%` }} transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }} className={`${b.bar} h-full`} title={`${b.label}: ${b.pct}%`} />
        ))}
      </div>
      <div className="space-y-3">
        {bars.map((b, i) => (
          <div key={b.label} className="flex items-center gap-3">
            <span className={`text-xs font-semibold w-14 ${b.text}`}>{b.label}</span>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${b.pct}%` }} transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 * i + 0.3 }} className={`h-full rounded-full ${b.bar}`} />
            </div>
            <span className="text-xs text-gray-400 w-8 text-right">{b.pct}%</span>
            <span className={`text-xs font-semibold ${b.text} ${b.light} px-2 py-0.5 rounded-full`}>{b.value}항목</span>
          </div>
        ))}
      </div>
    </div>
  );
}
