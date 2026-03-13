export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-indigo-600">KPT</span>
            <span className="text-lg font-semibold text-gray-800">Insight</span>
          </div>
          <p className="text-sm text-gray-500">
            © 2025 KPT Insight. AI 기반 팀 회고 분석 서비스.
          </p>
        </div>
      </div>
    </footer>
  );
}
