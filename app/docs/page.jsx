"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Play, ArrowLeft } from 'lucide-react';

export default function ApiPlayground() {
  const [activeLang, setActiveLang] = useState('curl');
  const [activeEndpoint, setActiveEndpoint] = useState('/api/public/kurals');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const endpoints = [
    {
      id: 'get-all',
      method: 'GET',
      path: '/api/public/kurals',
      description: 'Fetch a paginated list of Kurals (Free/Public).',
      params: '?page=1&limit=5',
      snippet: {
        curl: 'curl -X GET "http://localhost:3000/api/public/kurals?page=1&limit=5"',
        js: 'fetch("http://localhost:3000/api/public/kurals?page=1&limit=5")\n  .then(res => res.json())\n  .then(data => console.log(data));',
        python: 'import requests\n\nres = requests.get("http://localhost:3000/api/public/kurals?page=1&limit=5")\nprint(res.json())'
      }
    },
    {
      id: 'get-random',
      method: 'GET',
      path: '/api/public/kurals/random',
      description: 'Fetch a completely random Kural (Free/Public).',
      params: '',
      snippet: {
        curl: 'curl -X GET "http://localhost:3000/api/public/kurals/random"',
        js: 'fetch("http://localhost:3000/api/public/kurals/random")\n  .then(res => res.json())\n  .then(data => console.log(data));',
        python: 'import requests\n\nres = requests.get("http://localhost:3000/api/public/kurals/random")\nprint(res.json())'
      }
    },
    {
      id: 'get-paid-random',
      method: 'GET',
      path: '/api/paid/kurals/random',
      description: 'Fetch a random Kural (Premium/Paid). Bypass limits.',
      params: '',
      snippet: {
        curl: 'curl -X GET "http://localhost:3000/api/paid/kurals/random" -H "x-api-key: YOUR_API_KEY"',
        js: 'fetch("http://localhost:3000/api/paid/kurals/random", { headers: { "x-api-key": "YOUR_API_KEY" } })\n  .then(res => res.json())\n  .then(data => console.log(data));',
        python: 'import requests\n\nheaders = { "x-api-key": "YOUR_API_KEY" }\nres = requests.get("http://localhost:3000/api/paid/kurals/random", headers=headers)\nprint(res.json())'
      }
    }
  ];

  const activeData = endpoints.find(e => e.path === activeEndpoint);

  const handleRun = async () => {
    setLoading(true);
    setResponse(null);
    try {
      const url = activeData.path + activeData.params;
      const headers = {};
      if (activeData.path.includes('/paid/')) {
        if (!apiKey) {
          setResponse({ error: "API Key required for Paid routes. Enter it below." });
          setLoading(false);
          return;
        }
        headers['x-api-key'] = apiKey;
      }

      const res = await fetch(url, { headers });
      const data = await res.json();
      setResponse({ status: res.status, data });
    } catch (err) {
      setResponse({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-gray-200 font-sans">
      <nav className="border-b border-panel-border bg-panel/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center gap-4">
              <img src="/logo.png" alt="KuralAPI Logo" className="w-12 h-12 rounded-lg" />
              <div className="text-2xl font-bold tracking-tight text-white">
                API Playground
              </div>
            </div>
          </div>
          <Link href="/admin" className="text-sm font-medium border border-panel-border hover:bg-panel-border px-4 py-2 rounded transition-colors">
            Admin Panel
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Endpoints</h2>
          {endpoints.map(endpoint => {
            const isActive = activeEndpoint === endpoint.path;
            const btnClass = "w-full text-left p-4 rounded-lg border transition-colors flex items-start gap-3 " + (isActive ? "bg-panel border-brand/50" : "bg-transparent border-panel-border hover:bg-panel/50");
            const badgeClass = "text-xs font-bold px-2 py-1 rounded mt-0.5 " + (endpoint.method === 'GET' ? "bg-blue-900/50 text-blue-400" : "");
            
            return (
              <button
                key={endpoint.id}
                onClick={() => { setActiveEndpoint(endpoint.path); setResponse(null); }}
                className={btnClass}
              >
                <span className={badgeClass}>{endpoint.method}</span>
                <div>
                  <div className="font-mono text-sm text-gray-300 mb-1">{endpoint.path}</div>
                  <div className="text-xs text-gray-500">{endpoint.description}</div>
                </div>
              </button>
            );
          })}
          
          <div className="mt-8 pt-8 border-t border-panel-border">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Auth Settings</h2>
            <p className="text-xs text-gray-500 mb-4">Don't have a key? <a href="https://discord.gg/NebR4K7F" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">Join our Discord</a> to get one.</p>
            <label className="block text-xs text-gray-400 mb-2">API Key (For Premium Endpoints)</label>
            <input 
              type="text" 
              placeholder="Enter your api key here..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-panel border border-panel-border p-3 rounded text-sm text-white focus:outline-none focus:border-brand"
            />
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="bg-panel border border-panel-border rounded-xl overflow-hidden shadow-lg">
            <div className="flex items-center justify-between bg-panel-border/30 border-b border-panel-border px-4">
              <div className="flex">
                <button onClick={() => setActiveLang('curl')} className={"px-4 py-3 text-sm font-medium border-b-2 transition-colors " + (activeLang === 'curl' ? "border-brand text-white" : "border-transparent text-gray-400 hover:text-white")}>cURL</button>
                <button onClick={() => setActiveLang('js')} className={"px-4 py-3 text-sm font-medium border-b-2 transition-colors " + (activeLang === 'js' ? "border-brand text-white" : "border-transparent text-gray-400 hover:text-white")}>JavaScript</button>
                <button onClick={() => setActiveLang('python')} className={"px-4 py-3 text-sm font-medium border-b-2 transition-colors " + (activeLang === 'python' ? "border-brand text-white" : "border-transparent text-gray-400 hover:text-white")}>Python</button>
              </div>
              <button 
                onClick={handleRun}
                disabled={loading}
                className="flex items-center gap-2 bg-brand hover:bg-brand-hover text-white text-sm font-bold px-4 py-2 rounded disabled:opacity-50 transition-colors"
              >
                {loading ? <Play size={14} className="animate-pulse" /> : <Play size={14} />}
                {loading ? 'Running...' : 'Run Request'}
              </button>
            </div>

            <div className="p-6 bg-[#0a0f18]">
              <pre className="font-mono text-sm text-gray-300 overflow-x-auto">
                <code>{activeData.snippet[activeLang]}</code>
              </pre>
            </div>
            
            {(response || loading) && (
              <div className="border-t border-panel-border">
                <div className="px-4 py-2 bg-panel-border/30 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Live Response</span>
                  {response && response.status && (
                    <span className={"text-xs font-bold px-2 py-0.5 rounded " + (response.status === 200 ? "bg-emerald-900/50 text-emerald-400" : "bg-red-900/50 text-red-400")}>
                      HTTP {response.status}
                    </span>
                  )}
                </div>
                <div className="p-6 bg-[#0a0f18] min-h-[150px]">
                  {loading ? (
                    <div className="flex items-center gap-2 text-gray-500 font-mono text-sm">
                      <div className="w-2 h-2 rounded-full bg-brand animate-ping"></div> Awaiting response...
                    </div>
                  ) : (
                    <pre className="font-mono text-sm overflow-x-auto text-gray-300">
                      <code>{JSON.stringify(response.data || response.error, null, 2)}</code>
                    </pre>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
