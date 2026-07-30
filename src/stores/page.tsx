'use client';

import { useState } from 'react';

export default function DiscoverPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const analyzeStore = async () => {
    if (!url) return;
    setLoading(true);
    setResult(null);
    
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: JSON.stringify({ url }),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert('Error analyzing store');
    }
    setLoading(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Store Intelligence</h1>
        <p className="text-gray-500 mb-8">Deep audit: social commerce, technical, UX & revenue impact</p>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shopify Store URL
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              onClick={analyzeStore}
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
        </div>

        {result && (
          <div className="space-y-6">
            {/* HEADER */}
            <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{result.name || 'Store'}</h2>
                <p className="text-sm text-gray-500 mt-1">Theme: {result.themeName} · Page Size: {result.pageSize}</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-bold ${result.isShopify ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {result.isShopify ? '✅ Shopify Detected' : '❌ Not Shopify'}
              </span>
            </div>

            {result.isShopify && (
              <>
                {/* SCORE & REVENUE IMPACT */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <p className="text-sm text-gray-500 uppercase tracking-wide">Store Score</p>
                    <p className={`text-4xl font-bold mt-2 ${getScoreColor(result.score)}`}>{result.score}/100</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <p className="text-sm text-gray-500 uppercase tracking-wide">Problems Found</p>
                    <p className="text-4xl font-bold mt-2 text-red-600">{result.problems?.length || 0}</p>
                  </div>
                  <div className="bg-red-50 p-6 rounded-xl shadow-sm border border-red-100">
                    <p className="text-sm text-red-600 uppercase tracking-wide font-medium">💰 Revenue at Risk</p>
                    <p className="text-2xl font-bold mt-2 text-red-700">{result.revenueImpact}</p>
                  </div>
                </div>

                {/* PRIORITY FIX */}
                <div className="bg-orange-50 p-6 rounded-xl shadow-sm border border-orange-200">
                  <h3 className="font-bold text-orange-800 mb-1">🚨 Priority Fix</h3>
                  <p className="text-orange-700">{result.priorityFix}</p>
                </div>

                {/* SOCIAL COMMERCE */}
                {result.socialCommerce && (
                  <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      📱 Social Commerce & Ads
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(result.socialCommerce).map(([key, value]: [string, any]) => (
                        <div key={key} className={`p-3 rounded-lg text-sm ${value ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>
                          <span className="font-medium">{key.replace(/has/g, '').replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className="block text-xs mt-1 opacity-75">{value ? '✅ Detected' : '❌ Missing'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TECHNICAL */}
                {result.technical && (
                  <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      ⚙️ Technical Health
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(result.technical).map(([key, value]: [string, any]) => (
                        <div key={key} className={`p-3 rounded-lg text-sm ${value ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>
                          <span className="font-medium">{key.replace(/has/g, '').replace(/is/g, '').replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className="block text-xs mt-1 opacity-75">{value ? '✅ Good' : '❌ Issue'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* UX / CONVERSION */}
                {result.uxConversion && (
                  <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      🛒 UX & Conversion
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(result.uxConversion).map(([key, value]: [string, any]) => (
                        <div key={key} className={`p-3 rounded-lg text-sm ${value ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>
                          <span className="font-medium">{key.replace(/has/g, '').replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className="block text-xs mt-1 opacity-75">{value ? '✅ Present' : '❌ Missing'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* PROBLEMS WITH REVENUE IMPACT */}
                {result.problems?.length > 0 && (
                  <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <h3 className="font-bold text-red-600 mb-4">💔 Problems & Revenue Impact</h3>
                    <div className="space-y-3">
                      {result.problems.map((p: string, i: number) => (
                        <div key={i} className="flex gap-4 p-3 bg-red-50 rounded-lg">
                          <span className="text-red-500 font-bold mt-0.5">{i + 1}</span>
                          <div>
                            <p className="font-medium text-gray-800">{p}</p>
                            {result.revenueKillers?.[i] && (
                              <p className="text-sm text-red-600 mt-1">→ {result.revenueKillers[i]}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI SALES OPPORTUNITY */}
                {result.opportunities && (
                  <div className="bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-200">
                    <h3 className="font-bold text-blue-800 mb-2">🎯 AI Sales Opportunity</h3>
                    <p className="text-gray-700 leading-relaxed">{result.opportunities}</p>
                  </div>
                )}

                {/* SERVICES */}
                {result.services && (
                  <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <h3 className="font-bold text-gray-800 mb-3">🛠️ Services to Offer</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.services.map((s: string, i: number) => (
                        <span key={i} className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* OUTREACH */}
                {result.outreach && (
                  <div className="bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-white">✉️ Generated Outreach</h3>
                      <button 
                        onClick={() => navigator.clipboard.writeText(result.outreach)}
                        className="text-xs bg-white text-gray-900 px-3 py-1 rounded hover:bg-gray-200 font-medium"
                      >
                        Copy
                      </button>
                    </div>
                    <p className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">{result.outreach}</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}