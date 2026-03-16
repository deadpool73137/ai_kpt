"use client";

import { motion } from 'framer-motion';

export interface Scores {
  strengths: number;
  risks: number;
  actionability: number;
}

export function ScoreCards({ scores }: { scores: Scores }) {
  const items = [
    { label: '팀 강점 점수', key: 'strengths' as const, desc: 'Strengths Score', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', bar: 'bg-green-500' },
    { label: '위험도 점수', key: 'risks' as const, desc: 'Risk Score', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200', bar: 'bg-red-400' },
    { label: '실행 가능성 점수', key: 'actionability' as const, desc: 'Actionability Score', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', bar: 'bg-blue-500' },
  ];

  return (
    <div className="mb-8">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">📊 정량적 진단 점수</p>
      <div className="grid grid-cols-3 gap-4">
        {items.map((item) => {
          const score = scores[item.key];
          const pct = score * 10;
          return (
            <div key={item.key} className={`p-5 rounded-2xl border ${item.border} ${item.bg}`}>
              <p className="text-xs text-gray-500 mb-1">{item.desc}</p>
              <p className={`text-3xl font-black ${item.color} mb-1`}>
                {score}<span className="text-base font-semibold text-gray-300"> / 10</span>
              </p>
              <p className="text-xs font-semibold text-gray-600 mb-3">{item.label}</p>
              <div className="h-1.5 bg-white rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                  className={`h-full rounded-full ${item.bar}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
