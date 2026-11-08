'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HeartHandshake, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AboutIntroSection() {
  return (
    <section id="tentang" className="py-16 sm:py-20 bg-white border-y border-slate-200/80 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Kolom Kiri: Visual Card Inspiratif */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[380px]"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/40 text-blue-300 flex items-center justify-center mb-6">
                <HeartHandshake className="w-6 h-6" />
              </div>

              <span className="text-xs font-bold uppercase tracking-widest text-blue-300 block mb-2">
                Filosofi & Misi Kami
              </span>

              <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                Teknologi yang Ramah, Bukan yang Menakutkan
              </h3>

              <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Kami membangun NexaWeb untuk para pejuang UMKM yang selama ini merasa minder dengan istilah komputer. Setiap fitur dirancang agar orang tua kita pun bisa memakainya sendiri tanpa rasa bingung.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-800 flex items-center gap-3 text-xs text-blue-300 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Didukung Komunitas 3.800+ Pelaku Usaha Lokal</span>
            </div>
          </motion.div>

          {/* Kolom Kanan: Narasi & 3 Nilai Utama */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Tentang NexaWeb.ai</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-snug">
                Lahir dari Kerinduan Melihat UMKM Berani Tampil Mandiri
              </h2>
              <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
                Banyak pemilik usaha usia 40–50 tahun menganggap memiliki website resmi itu harus bayar jutaan rupiah dan pusing mengurus server. NexaWeb hadir memangkas semua itu: cukup gunakan bahasa Indonesia sehari-hari, AI yang menyusunkan toko Anda secara instan.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span className="whitespace-nowrap">Bahasa Sehari&#8209;hari</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Tidak ada koding atau istilah rumit. Ketik seperti mengirim pesan biasa.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Pesanan Masuk WhatsApp</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Semua transaksi langsung masuk ke nomor WhatsApp toko Anda tanpa potongan.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 group transition"
              >
                <span>Pelajari Cerita & Nilai Kami Lebih Lengkap di Halaman Tentang</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
