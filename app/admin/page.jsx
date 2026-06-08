"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Copy, LogOut, KeyRound } from 'lucide-react';

export default function Dashboard() {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newOwner, setNewOwner] = useState('');
  const [duration, setDuration] = useState('forever');
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState(null);
  const router = useRouter();

  useEffect(() => {
    checkAuthAndFetchKeys();
  }, []);

  const checkAuthAndFetchKeys = async () => {
    try {
      const authRes = await fetch('/api/admin/auth-check');
      if (!authRes.ok) {
        router.push('/admin/login');
        return;
      }
      
      const res = await fetch('/api/admin/keys');
      if (res.ok) {
        const data = await res.json();
        setKeys(data);
      } else {
        showToast('Failed to fetch keys', 'error');
      }
    } catch (err) {
      showToast('Network error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch('/api/admin/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newOwner, duration })
      });
      if (res.ok) {
        const newKey = await res.json();
        setKeys([newKey, ...keys]);
        setShowModal(false);
        setNewOwner('');
        showToast('API Key generated successfully');
      } else {
        showToast('Failed to create key', 'error');
      }
    } catch (err) {
      showToast('Network error', 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleRevoke = async (id) => {
    if (!confirm('Are you sure you want to revoke this key?')) return;
    try {
      await fetch(`/api/admin/keys/${id}`, { method: 'DELETE' });
      setKeys(keys.filter(k => k._id !== id));
      showToast('Key revoked successfully');
    } catch (err) {
      showToast('Failed to revoke key', 'error');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!');
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="max-w-5xl mx-auto py-8 px-4"
    >
      <nav className="flex justify-between items-center mb-12 p-4 rounded-xl bg-panel/60 backdrop-blur-md border border-panel-border">
        <div className="text-2xl font-bold flex items-center gap-4">
          <img src="/logo.png" alt="Logo" className="w-12 h-12 rounded-lg" />
          <div>
            Kural<span className="text-brand">Code</span>
            <span className="text-[10px] uppercase bg-brand/20 text-brand px-2 py-0.5 rounded ml-3 align-middle">Admin</span>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
        >
          <LogOut size={16} /> Log Out
        </button>
      </nav>

      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">API Keys</h1>
          <p className="text-gray-400 text-sm">Manage access to your Thirukkural API</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-brand hover:bg-brand-hover text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all shadow-[0_4px_14px_rgba(99,102,241,0.4)]"
        >
          <Plus size={18} /> Generate Key
        </button>
      </header>

      <div className="bg-panel/60 backdrop-blur-xl border border-panel-border rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-panel-border text-xs uppercase tracking-wider text-gray-400">
                <th className="p-4 font-medium">Key</th>
                <th className="p-4 font-medium">Owner</th>
                <th className="p-4 font-medium">Created At</th>
                <th className="p-4 font-medium">Expires On</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {keys.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-12 text-center text-gray-500 flex flex-col items-center">
                    <KeyRound size={48} className="mb-4 opacity-20" />
                    <p>No API keys found. Generate one to get started.</p>
                  </td>
                </tr>
              ) : (
                keys.map((key) => (
                  <tr key={key._id} className="border-b border-panel-border/50 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <button 
                        onClick={() => copyToClipboard(key.key)}
                        className="flex items-center gap-2 font-mono text-sm bg-black/30 px-3 py-1.5 rounded text-indigo-200 hover:text-indigo-100 hover:bg-black/50 transition-all group"
                      >
                        {key.key}
                        <Copy size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    </td>
                    <td className="p-4 font-medium">{key.name || key.owner}</td>
                    <td className="p-4 text-sm text-gray-400">
                      {new Date(key.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-sm">
                      {!key.expiresAt ? (
                        <span className="text-gray-500">Never</span>
                      ) : new Date(key.expiresAt) < new Date() ? (
                        <span className="bg-danger/20 text-danger px-2 py-0.5 rounded text-xs font-bold">EXPIRED</span>
                      ) : (
                        <span className="text-emerald-400">{new Date(key.expiresAt).toLocaleDateString()}</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleRevoke(key._id)}
                        className="text-gray-400 hover:text-danger p-2 rounded-lg hover:bg-danger/10 transition-colors"
                        title="Revoke Key"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => { if(e.target === e.currentTarget) setShowModal(false) }}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -10 }}
              className="bg-panel/90 backdrop-blur-2xl border border-panel-border p-6 rounded-2xl w-full max-w-md shadow-2xl"
            >
              <h2 className="text-xl font-bold mb-1">Generate API Key</h2>
              <p className="text-sm text-gray-400 mb-6">Create a new access key for a user or project.</p>
              
              <form onSubmit={handleCreate}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Owner Name / Project</label>
                  <input 
                    type="text" 
                    required
                    autoFocus
                    value={newOwner}
                    onChange={(e) => setNewOwner(e.target.value)}
                    placeholder="e.g. Mobile App"
                    className="w-full px-4 py-3 rounded-lg bg-black/30 border border-panel-border text-white focus:outline-none focus:border-brand transition-colors mb-4"
                  />
                  <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-black/30 border border-panel-border text-white focus:outline-none focus:border-brand transition-colors"
                  >
                    <option value="forever">Never Expires (Forever)</option>
                    <option value="30">1 Month</option>
                    <option value="90">3 Months</option>
                    <option value="180">6 Months</option>
                    <option value="365">1 Year</option>
                  </select>
                </div>
                <div className="flex gap-3 justify-end">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={creating}
                    className="px-5 py-2 rounded-lg text-sm font-medium bg-brand text-white hover:bg-brand-hover transition-colors shadow-lg disabled:opacity-70"
                  >
                    {creating ? 'Generating...' : 'Generate'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-2xl font-medium text-sm border ${
              toast.type === 'error' 
                ? 'bg-danger/20 border-danger/30 text-red-200' 
                : 'bg-success/20 border-success/30 text-emerald-200'
            }`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
