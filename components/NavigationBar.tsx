'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function NavigationBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-indigo-600">KPT</span>
            <span className="text-xl font-semibold text-gray-800">Insight</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/kpt" className="text-gray-600 hover:text-indigo-600 transition-colors text-sm font-medium">
              회고 작성
            </Link>
            <Link href="/reports" className="text-gray-600 hover:text-indigo-600 transition-colors text-sm font-medium">
              분석 리포트
            </Link>
            <Link
              href="/login"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              시작하기
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-indigo-600"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="메뉴 열기"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-3">
            <Link href="/kpt" className="text-gray-600 hover:text-indigo-600 text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>
              회고 작성
            </Link>
            <Link href="/reports" className="text-gray-600 hover:text-indigo-600 text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>
              분석 리포트
            </Link>
            <Link
              href="/login"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium text-center hover:bg-indigo-700 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              시작하기
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
