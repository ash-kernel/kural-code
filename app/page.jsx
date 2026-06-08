"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Key, Shield, ChevronRight, Terminal } from 'lucide-react';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Navigation */}
      <nav className="border-b border-panel-border bg-panel/50">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="Kural Code Logo" className="w-12 h-12 rounded-lg" />
            <div className="text-2xl font-bold tracking-tight text-white">
              Kural<span className="text-brand">Code</span>
            </div>
          </div>
          <div className="flex gap-6 items-center">
            <Link href="/docs" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Playground</Link>
            <Link href="/admin" className="text-sm font-medium bg-panel border border-panel-border hover:bg-panel-border px-4 py-2 rounded transition-colors text-white">Admin</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-32">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="text-center max-w-3xl mx-auto"
        >
          <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white">
            The Thirukkural API
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            A fast, reliable REST API providing access to all 1,330 couplets. Built for developers with a unified documentation and code playground.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/docs" className="flex items-center gap-2 bg-brand hover:bg-brand-hover text-white px-6 py-3 rounded font-medium transition-colors">
              <Terminal size={18} />
              Open API Playground
            </Link>
            <a href="https://discord.gg/NebR4K7F" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-panel hover:bg-panel-border border border-panel-border text-white px-6 py-3 rounded font-medium transition-colors">
              <Key size={18} />
              Request API Key
            </a>
          </motion.div>
        </motion.div>

        {/* Features / Pricing */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-24 grid md:grid-cols-2 gap-6 max-w-4xl mx-auto"
        >
          {/* Public Tier */}
          <div className="bg-panel border border-panel-border p-8 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="text-gray-400" size={24} />
              <h3 className="text-xl font-bold text-white">Public Access</h3>
            </div>
            <div className="text-gray-400 text-sm mb-6">Free for learning and hobby projects.</div>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-center gap-3"><ChevronRight size={14} className="text-brand"/> Full database access</li>
              <li className="flex items-center gap-3"><Shield size={14} className="text-gray-500"/> Rate limited: 30 req/hr</li>
              <li className="flex items-center gap-3"><Shield size={14} className="text-gray-500"/> 2-minute gap required</li>
            </ul>
          </div>

          {/* Paid Tier */}
          <div className="bg-panel border border-panel-border p-8 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <Key className="text-brand" size={24} />
              <h3 className="text-xl font-bold text-white">Premium Access</h3>
            </div>
            <div className="text-gray-400 text-sm mb-6">Unrestricted access via API Key.</div>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-center gap-3"><ChevronRight size={14} className="text-brand"/> Built for production</li>
              <li className="flex items-center gap-3"><ChevronRight size={14} className="text-brand"/> Bypasses all public limits</li>
              <li className="flex items-center gap-3"><ChevronRight size={14} className="text-brand"/> Join Discord to request a key</li>
            </ul>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
