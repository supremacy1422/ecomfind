import Link from 'next/link';
import Navbar from './components/Navbar';

const features = [
  { icon: '🔍', title: 'AI Store Audit', desc: 'Deep technical, UX & revenue analysis in seconds.' },
  { icon: '📧', title: 'Email Discovery', desc: 'OSINT-powered owner email finder with confidence scoring.' },
  { icon: '📤', title: 'Gmail Outreach', desc: 'Send personalized emails directly from your Gmail account.' },
  { icon: '📊', title: 'Sales Pipeline', desc: 'Kanban CRM to track every lead from contact to close.' },
  { icon: '🤖', title: 'AI Templates', desc: 'Save and reuse winning outreach templates.' },
  { icon: '📈', title: 'Bulk Actions', desc: 'Export, import, and email hundreds of leads at once.' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      
      {/* Hero */}
      <section className="relative pt-16 pb-24 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-slate-950 to-slate-950 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-medium text-slate-400 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Now with AI-powered audits
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Find Shopify Stores.</span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Close More Deals.</span>
          </h1>
          
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed px-4">
            The intelligence platform for agencies and freelancers who sell to e-commerce brands. Audit, discover, and outreach — all in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register" className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-xl px-8 py-3.5 transition-all shadow-lg shadow-violet-900/25 text-center">
              Start Free →
            </Link>
            <Link href="/discover" className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium rounded-xl px-8 py-3.5 transition-all text-center">
              Try Audit
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="pb-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Everything you need to scale
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
              A complete toolkit for finding, analyzing, and converting Shopify store owners into clients.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all duration-300 group">
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300 inline-block">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2 text-slate-100">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-[10px]">E</span>
            </div>
            <span className="font-semibold text-slate-300">EcomFind</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 EcomFind. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}