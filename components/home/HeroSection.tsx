'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Play, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export default function HeroSection() {
  return (
    <section id="hero" className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-20 bg-gradient-to-b from-blue-50/50 via-white to-slate-50 scroll-mt-20">
      
      {/* Background Decorative Blur */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-200/40 to-indigo-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Lencana Inspirasi AI Ramah Pemula */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs sm:text-sm font-bold shadow-sm mb-6"
        >
          <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
          <span>Platform Pembuat Website Berbasis AI #1 Khusus Pemilik Usaha Indonesia</span>
        </motion.div>

        {/* Judul Utama Ramah 40-50 Tahun (AC-H.2) */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight max-w-5xl mx-auto text-balance"
        >
          Bikin Website Toko Sendiri <br className="hidden sm:inline" />
          Cukup Pakai{' '}
          <span className="inline-block whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Bahasa Sehari&#8209;hari
          </span>
        </motion.h1>

        {/* Sub-Headline Ramah Pemula & Non-Tech */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal"
        >
          Khusus untuk pemilik UMKM yang tidak paham koding dan lelah bayar mahal ke jasa developer. Cukup ketik nama usaha & produk Anda, website toko langsung siap terima pesanan via WhatsApp.
        </motion.p>

        {/* Tombol Aksi Utama (CTA) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/studio"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base sm:text-lg shadow-xl shadow-blue-500/25 transition-all duration-200 transform hover:-translate-y-1 active:translate-y-0"
          >
            <span>Mulai Buat Website Now</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <a
            href="#simulator"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-300 shadow-sm transition-all duration-200"
          >
            <Play className="w-4 h-4 text-blue-600 fill-blue-600" />
            <span>Lihat Contoh Simulator</span>
          </a>
        </motion.div>

        {/* Poin Kepercayaan & Nilai Utama */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10 sm:mt-12 pt-8 border-t border-slate-200/80 max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-semibold text-slate-600"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>100% Bebas Koding</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Selesai dalam 5 Menit</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Langsung Konek WhatsApp Toko</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
