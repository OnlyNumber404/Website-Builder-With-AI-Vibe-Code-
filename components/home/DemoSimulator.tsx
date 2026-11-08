'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageSquare, ArrowRight, Check, ShoppingBag, Phone, Store } from 'lucide-react';
import { SIMULATOR_PROMPTS } from '@/lib/defaultData';

export default function DemoSimulator() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const activePrompt = SIMULATOR_PROMPTS[selectedIdx];

  // Efek mesin tik (Typewriter Effect)
  useEffect(() => {
    setIsTyping(true);
    setDisplayText('');
    let currentIdx = 0;
    const fullText = activePrompt.prompt;

    const interval = setInterval(() => {
      if (currentIdx <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIdx));
        currentIdx++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 28);

    return () => clearInterval(interval);
  }, [selectedIdx]);

  return (
    <section id="simulator" className="py-16 sm:py-20 bg-slate-900 text-white relative overflow-hidden">
      
      {/* Decorative Glow Elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Bagian */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulator AI Interaktif (AC-H.3)</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Lihat Keajaiban AI Merakit Toko Anda
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            Cukup klik salah satu contoh ide bisnis di bawah ini, atau perhatikan bagaimana AI langsung mengubah teks biasa menjadi tampilan toko siap jualan.
          </p>

          {/* Chips Pilihan Prompt */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {SIMULATOR_PROMPTS.map((item, idx) => {
              const active = idx === selectedIdx;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedIdx(idx)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                    active
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                  }`}
                >
                  <span>{item.label}</span>
                  {active && <Check className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Kotak Interaktif Simulator 2 Kolom */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Kolom Kiri: Simulasi Input Perintah AI */}
          <div className="lg:col-span-5 bg-slate-800/90 rounded-2xl p-6 border border-slate-700 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-700 mb-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>AI Copilot NexaWeb Siap Menerima Perintah</span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 font-mono">
                  Gemini Flash
                </span>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                  <span>Perintah Bahasa Sehari-hari:</span>
                </label>
                <div className="min-h-[120px] bg-slate-900/80 rounded-xl p-4 border border-slate-700/80 text-sm text-slate-100 font-sans leading-relaxed relative">
                  <span>{displayText}</span>
                  {isTyping && (
                    <span className="inline-block w-1.5 h-4 ml-1 bg-blue-400 animate-pulse align-middle" />
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-700/60 space-y-3">
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  {isTyping ? 'Sedang mengetik & menganalisis kebutuhan toko...' : 'Toko berhasil dirakit instan oleh AI!'}
                </span>
              </div>
              
              <Link
                href="/studio"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
              >
                <span>Buka & Edit Sendiri di Studio Builder</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Kolom Kanan: Pratinjau Visual Toko Instan */}
          <div className="lg:col-span-7 bg-white text-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-300 flex flex-col">
            
            {/* Browser Mockup Top Bar */}
            <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <div className="text-[11px] font-mono text-slate-600 bg-white px-4 py-1 rounded-md border border-slate-200 flex items-center gap-1.5">
                <span>https://toko-anda.nexaweb.ai</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                ● Live Website
              </span>
            </div>

            {/* Konten Toko Hasil Generate */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
              
              {/* Header Toko */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePrompt.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2 border-b border-slate-100 pb-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
                      {activePrompt.result.badge}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                      <Store className="w-3.5 h-3.5 text-slate-400" /> Toko Resmi Terverifikasi
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    {activePrompt.result.brand}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {activePrompt.result.tagline}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Daftar Menu Hasil Generate */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />
                  Katalog Unggulan Toko:
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {activePrompt.result.items.map((prod, pIdx) => (
                    <motion.div
                      key={pIdx}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: pIdx * 0.1 }}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-400 transition shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                          {prod.tag}
                        </span>
                        <h4 className="text-xs font-bold text-slate-800 mt-1 line-clamp-2">
                          {prod.name}
                        </h4>
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-200 text-xs font-extrabold text-blue-700">
                        {prod.price}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Tombol Pemesanan WhatsApp Toko */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-emerald-50/80 p-3.5 rounded-xl border border-emerald-200">
                <div className="flex items-center gap-2.5 text-left">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow">
                    <Phone className="w-4 h-4 fill-white" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-emerald-900">Tombol Pesan Otomatis WhatsApp</h5>
                    <p className="text-[11px] text-emerald-700">Pelanggan langsung kirim pesan format order</p>
                  </div>
                </div>

                <a
                  href={`https://wa.me/62${activePrompt.result.whatsapp}?text=Halo%20${encodeURIComponent(activePrompt.result.brand)}%2C%20saya%20mau%20pesan`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition whitespace-nowrap"
                >
                  Pesan via WhatsApp
                </a>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
