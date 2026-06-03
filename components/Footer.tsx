export default function Footer() {
  return (
    <footer className="mt-20 pb-8">
      <div className="mb-6 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="font-semibold text-slate-700">AI 每日早报</span>
          <span className="text-slate-300">·</span>
          <span>由 Vercel 驱动</span>
        </div>
        <p className="text-xs text-slate-400">
          每天清晨 · 为你精选 AI 世界最新动态
        </p>
      </div>
    </footer>
  )
}
