export default function Footer() {
  return (
    <footer className="border-t border-slate-800/60 bg-slate-950 py-8">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white">EcomFind</span>
          <span className="text-xs text-slate-600">© 2026</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="/privacy" className="text-xs text-slate-500 hover:text-white transition-colors">Privacy Policy</a>
          <a href="/terms" className="text-xs text-slate-500 hover:text-white transition-colors">Terms of Service</a>
          <a href="/about" className="text-xs text-slate-500 hover:text-white transition-colors">About</a>
          <a href="/founder" className="text-xs text-slate-500 hover:text-white transition-colors">Founder</a>
        </div>
      </div>
    </footer>
  );
}