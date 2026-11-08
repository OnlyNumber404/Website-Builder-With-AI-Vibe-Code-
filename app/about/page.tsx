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
      level: 'LEVEL 1',
      title: 'Ketik Keinginan Anda',
      description: 'Ceritakan nama toko, menu/produk yang Anda jual, dan nomor WhatsApp usaha Anda dalam bahasa santai seperti sedang mengobrol dengan kawan.',
      badge: 'Tanpa Rumus Coding',
      highlight: 'AI langsung menyusun draft website dalam hitungan detik'
    },
    {
      level: 'LEVEL 2',
      title: 'Pilih & Personalisasi Tampilan',
      description: 'Tarik dan lepas menu favorit, pilih gaya warna yang paling pas dengan karakter usaha (misal: warna rempah tradisional atau kafe kekinian).',
      badge: 'Visual Drag & Drop',
      highlight: 'Semua perubahan tampil langsung di depan mata Anda'
    },
    {
      level: 'LEVEL 3',
      title: 'Siap Dipublikasikan & Terima Order',
      description: 'Website toko resmi Anda siap dibagikan ke pelanggan di grup arisan, WhatsApp status, atau media sosial. Pesanan langsung masuk ke nomor WhatsApp toko.',
      badge: 'Langsung Menghasilkan',
      highlight: '100% uang pembayaran masuk ke rekening pribadi Anda'
    }
  ];

  const values = [
    {
      icon: HeartHandshake,
      title: 'Empati yang Mendalam',
      description: 'Kami sadar banyak pemilik usaha merasa minder saat berhadapan dengan teknologi. NexaWeb didesain dari kacamata mereka yang belum pernah membuat website seumur hidupnya.'
    },
    {
      icon: Smile,
      title: 'Kemudahan Tanpa Syarat',
      description: 'Teks berukuran besar dan jelas, kontras warna yang nyaman untuk mata usia 40 tahun ke atas, dan bebas dari istilah bahasa Inggris yang membingungkan.'
    },
    {
      icon: Compass,
      title: 'Aksesibilitas Merata',
      description: 'Teknologi AI tercanggih seharusnya tidak hanya dinikmati perusahaan besar. Pedagang soto, penjahit batik, dan toko kelontong juga berhak memilikinya dengan biaya sangat terjangkau.'
    }
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1">
        
        {/* AC-A.1: Hero Header About */}
        <section className="pt-12 pb-16 sm:pt-20 sm:pb-24 bg-gradient-to-b from-blue-50/70 via-white to-slate-50 text-center relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs sm:text-sm font-bold mb-6">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Misi Edukasi & Transformasi Digital UMKM (AC-A.1)</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
              Mendampingi UMKM Indonesia Berdaya Secara Digital{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Tanpa Hambatan Teknologi
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              NexaWeb lahir dari sebuah keprihatinan: jutaan pengusaha lokal hebat di Indonesia tertinggal di era digital hanya karena pembuatan website tradisional terlalu mahal, berbelit-belit, dan dipenuhi istilah teknis yang menakutkan.
            </p>
          </div>
        </section>

        {/* AC-A.2: Misi & Digital Skill Gap (Perbandingan Cara Lama vs Cara NexaWeb) */}
        <section className="py-16 sm:py-20 bg-white border-y border-slate-200/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                Menutup Kesenjangan Digital (AC-A.2)
              </span>
              <h2 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900">
                Mengapa NexaWeb Mengubah Segalanya?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              
              {/* Cara Lama Tradisional */}
              <div className="bg-rose-50/50 rounded-3xl p-8 border border-rose-200/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-rose-700 font-bold text-sm mb-4">
                    <XCircle className="w-5 h-5 text-rose-600" />
                    <span>Cara Lama yang Bikin Frustrasi:</span>
                  </div>
                  
                  <ul className="space-y-4 text-sm text-slate-700">
                    <li className="flex items-start gap-3">
                      <span className="text-rose-600 font-bold">✕</span>
                      <span><strong>Biaya Developer Mahal:</strong> Menghabiskan Rp 3 juta hingga Rp 10 juta yang sangat memberatkan modal usaha kecil.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-rose-600 font-bold">✕</span>
                      <span><strong>Waktu Tunggu Berminggu-minggu:</strong> Pengerjaan berbelit-belit dan sering tidak sesuai keinginan pemilik usaha.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-rose-600 font-bold">✕</span>
                      <span><strong>Istilah Bikin Bingung:</strong> Dipaksa memahami DNS, cPanel, SSL, database, dan hosting yang memusingkan.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-rose-600 font-bold">✕</span>
                      <span><strong>Ketergantungan Total:</strong> Mau ganti harga menu soto naik Rp 1.000 saja harus panggil orang dan bayar lagi.</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-rose-200 text-xs font-semibold text-rose-800">
                  Akibatnya: Banyak UMKM akhirnya menyerah dan tidak punya website resmi.
                </div>
              </div>

              {/* Solusi NexaWeb Berbasis AI */}
              <div className="bg-emerald-50/60 rounded-3xl p-8 border-2 border-emerald-300 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-4">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Revolusi NexaWeb Berbasis AI:</span>
                  </div>

                  <ul className="space-y-4 text-sm text-slate-800">
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span><strong>100% Zero-Code:</strong> Ketik perintah memakai bahasa sehari-hari seperti kirim pesan ke keluarga di WhatsApp.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span><strong>Jadi dalam Hitungan Menit:</strong> AI langsung menyusun desain, kartu menu, dan alamat dalam sekejap.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span><strong>Kontrol Penuh di Tangan Anda:</strong> Ubah harga, tambah produk, atau ganti warna kapan pun Anda mau tanpa biaya.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span><strong>Pesanan Langsung Masuk WhatsApp:</strong> Pembeli klik menu, chat langsung masuk ke WhatsApp kasir toko.</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-emerald-200 text-xs font-extrabold text-emerald-800">
                  Hasilnya: Toko Anda tampil kredibel, dipercaya pelanggan, dan omzet meningkat.
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* AC-A.3: Pilar Kemudahan (Learning Path Style ala Ailene.id) */}
        <section className="py-16 sm:py-24 bg-slate-900 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-900/50 px-3.5 py-1.5 rounded-full border border-blue-700">
                Alur Berjenjang (Level-Style ala Ailene.id) (AC-A.3)
              </span>
              <h2 className="mt-3 text-2xl sm:text-4xl font-black text-white tracking-tight">
                3 Langkah Mudah Menuju Toko Online Anda
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-300">
                Tidak ada kurva belajar yang curam. Pengalaman belajar dirancang bertahap layaknya menaiki anak tangga santai.
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
                <span>Coba Alur 3 Langkah Ini di Studio</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </section>

        {/* AC-A.4: Profil Tim & 3 Nilai Utama */}
        <section className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                Fondasi Budaya & Nilai (AC-A.4)
              </span>
              <h2 className="mt-3 text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Tiga Nilai Utama yang Kami Junjung
              </h2>
              <p className="mt-3 text-base text-slate-600">
                Di balik setiap baris kode NexaWeb, ada komitmen tulus untuk mempermudah hidup para pejuang UMKM.
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
