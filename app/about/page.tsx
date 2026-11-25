'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  HeartHandshake, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  XCircle,
  Lightbulb,
  Compass,
  Smile,
  Laptop
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CommunityBanner from '@/components/common/CommunityBanner';

export default function AboutPage() {
  const steps = [
    {
      level: 'LANGKAH 1',
      title: 'Pilih Mode Studio & Ide Bisnis',
      description: 'Mulai cepat menggunakan Mode Template siap pakai yang langsung menyusun halaman toko Anda, atau berkreasi bebas dari nol menggunakan Advance Designer Mode berbasis kanvas visual.',
      badge: 'Template & Kanvas Bebas',
      highlight: 'Draft website langsung terbentuk dalam hitungan detik'
    },
    {
      level: 'LANGKAH 2',
      title: 'Kustomisasi Bersama AI Copilot',
      description: 'Atur tata letak dengan drag & drop plus garis bantu Smart Snap, sunting judul, harga, dan deskripsi produk langsung di kartu, atau cukup ketik perintah ke AI dalam bahasa sehari-hari.',
      badge: 'Visual & AI Copilot',
      highlight: 'Semua perubahan tampil real-time di kanvas kerja Anda'
    },
    {
      level: 'LANGKAH 3',
      title: 'Pratinjau, Export ZIP & Terima Order',
      description: 'Uji tampilan dan navigasi melalui Pratinjau Live, unduh paket file website (Deploy ZIP) siap tayang, dan langsung terima pesanan pelanggan ke WhatsApp bisnis Anda.',
      badge: 'Siap Tayang & Jualan',
      highlight: '100% hasil penjualan masuk langsung ke rekening Anda'
    }
  ];

  const values = [
    {
      icon: HeartHandshake,
      title: 'Berpihak pada Pelaku UMKM',
      description: 'Kami merancang NexaWeb dari kebutuhan nyata pebisnis lokal Indonesia—baik yang baru mulai berjualan maupun yang ingin meningkatkan citra merek secara profesional.'
    },
    {
      icon: Smile,
      title: 'Mudah, Cepat & Intuitif',
      description: 'Antarmuka studio minimalis yang bersih, bebas istilah teknis yang membingungkan, serta dilengkapi asisten AI dan Smart Snap agar siapa pun bisa mendesain dengan percaya diri.'
    },
    {
      icon: Compass,
      title: 'Teknologi AI untuk Semua Skala',
      description: 'Kecanggihan AI dan editor desain modern tidak seharusnya hanya milik perusahaan besar. Setiap pelaku usaha kuliner, fashion, kriya, dan jasa lokal berhak memilikinya dengan biaya terjangkau.'
    }
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1">
        
        {/* Hero Header About */}
        <section className="pt-12 pb-16 sm:pt-20 sm:pb-24 bg-gradient-to-b from-blue-50/70 via-white to-slate-50 text-center relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs sm:text-sm font-bold mb-6">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Misi Transformasi Digital UMKM Indonesia</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
              Mendampingi UMKM Indonesia Tampil Kredibel{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Tanpa Hambatan Teknologi
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              NexaWeb hadir dari sebuah keyakinan sederhana: jutaan brand dan pelaku usaha lokal hebat di Indonesia berhak memiliki website toko profesional tanpa harus terhalang biaya agensi mahal, proses yang lama, ataupun kerumitan coding.
            </p>
          </div>
        </section>

        {/* Perbandingan Cara Lama vs Cara NexaWeb */}
        <section className="py-16 sm:py-20 bg-white border-y border-slate-200/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3.5 py-1.5 rounded-full">
                Cara Baru Membangun Website Bisnis
              </span>
              <h2 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900">
                Mengapa Semakin Banyak UMKM Beralih ke NexaWeb?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              
              {/* Cara Lama Tradisional */}
              <div className="bg-rose-50/50 rounded-3xl p-8 border border-rose-200/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-rose-700 font-bold text-sm mb-4">
                    <XCircle className="w-5 h-5 text-rose-600" />
                    <span>Cara Lama yang Menghambat Pertumbuhan:</span>
                  </div>
                  
                  <ul className="space-y-4 text-sm text-slate-700">
                    <li className="flex items-start gap-3">
                      <span className="text-rose-600 font-bold">✕</span>
                      <span><strong>Biaya Pembuatan Mahal:</strong> Jasa pembuatan website konvensional sering memakan Rp 3 juta hingga Rp 10 juta di awal.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-rose-600 font-bold">✕</span>
                      <span><strong>Proses Lama &amp; Kaku:</strong> Harus menunggu berminggu-minggu dan sulit direvisi ketika kebutuhan bisnis berubah cepat.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-rose-600 font-bold">✕</span>
                      <span><strong>Istilah Teknis Rumit:</strong> Dipaksa mengurus kode, server, dan konfigurasi teknis yang menyita waktu berjualan.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-rose-600 font-bold">✕</span>
                      <span><strong>Ketergantungan Maintenance:</strong> Sekadar ganti harga produk atau tambah promo musiman pun harus menunggu dan membayar biaya tambahan.</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-rose-200 text-xs font-semibold text-rose-800">
                  Akibatnya: Banyak bisnis menunda go-digital dan kehilangan kepercayaan calon pembeli online.
                </div>
              </div>

              {/* Solusi NexaWeb Berbasis AI */}
              <div className="bg-emerald-50/60 rounded-3xl p-8 border-2 border-emerald-300 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-4">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Solusi Modern NexaWeb Berbasis AI:</span>
                  </div>

                  <ul className="space-y-4 text-sm text-slate-800">
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span><strong>100% Tanpa Coding + AI Copilot:</strong> Cukup ketik perintah berbahasa Indonesia sehari-hari atau gunakan @mention untuk mengedit bagian website.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span><strong>2 Mode Studio Fleksibel:</strong> Pilih Mode Template untuk serba instan, atau Advance Designer Mode untuk kustomisasi bebas multi-kanvas.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span><strong>Kontrol Mandiri Seketika:</strong> Ubah judul, harga, deskripsi, foto produk, hingga warna tema sendiri kapan pun tanpa biaya tambahan.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span><strong>Order WhatsApp &amp; Export ZIP:</strong> Pesanan langsung masuk ke WhatsApp toko tanpa komisi, lengkap dengan ekspor website siap tayang.</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-emerald-200 text-xs font-extrabold text-emerald-800">
                  Hasilnya: Bisnis tampil jauh lebih kredibel, mudah ditemukan pelanggan, dan siap meningkatkan omzet.
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* Alur 3 Langkah Mudah */}
        <section className="py-16 sm:py-24 bg-slate-900 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-900/50 px-3.5 py-1.5 rounded-full border border-blue-700">
                Alur Kerja Praktis
              </span>
              <h2 className="mt-3 text-2xl sm:text-4xl font-black text-white tracking-tight">
                3 Langkah Cepat Menuju Website Toko Profesional Anda
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-300">
                Dirancang agar setiap pemilik usaha dapat berpindah dari ide bisnis ke website siap jualan dalam hitungan menit.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {steps.map((step, idx) => (
                <div
                  key={step.level}
                  className="bg-slate-800/90 rounded-3xl p-7 border border-slate-700 shadow-xl flex flex-col justify-between hover:border-blue-400 transition-all duration-300 group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-black px-3 py-1 rounded-lg bg-blue-600 text-white">
                        {step.level}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {step.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                      {step.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-700/80 text-xs font-semibold text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{step.highlight}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/studio"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all transform hover:-translate-y-0.5"
              >
                <Laptop className="w-4 h-4" />
                <span>Mulai Coba di NexaWeb Studio</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </section>

        {/* Profil & 3 Nilai Utama */}
        <section className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3.5 py-1.5 rounded-full">
                Nilai &amp; Komitmen Kami
              </span>
              <h2 className="mt-3 text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Tiga Nilai Utama yang Kami Junjung
              </h2>
              <p className="mt-3 text-base text-slate-600">
                Di balik setiap fitur NexaWeb, ada komitmen nyata untuk membantu UMKM Indonesia tumbuh lebih cepat di era digital.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((val) => {
                const Icon = val.icon;
                return (
                  <div
                    key={val.title}
                    className="p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:shadow-lg transition-all"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-5 shadow-md shadow-blue-500/20">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      {val.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {val.description}
                    </p>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* AC-A.5: CTA Komunitas UMKM */}
        <CommunityBanner />

      </main>

      <Footer />
    </div>
  );
}
