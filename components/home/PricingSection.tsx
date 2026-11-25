'use client';

import React from 'react';
import Link from 'next/link';
import { Check, Crown, ArrowRight, ShieldCheck } from 'lucide-react';

export default function PricingSection() {
  const plans = [
    {
      name: 'Starter Gratis',
      tagline: 'Coba seluruh kekuatan studio builder tanpa biaya',
      price: 'Rp 0',
      period: 'Gratis selamanya tanpa kartu kredit',
      highlight: false,
      ctaText: 'Coba Studio Gratis',
      features: [
        'Akses Mode Template Instan & Advance Designer Mode',
        'Asisten AI Copilot (Gemini Flash) berbahasa Indonesia',
        'Smart Alignment Guides, Auto-Snap & Edit Inline',
        'Pratinjau live interaktif & Export ZIP (HTML + CSS)',
        'Akses grup Komunitas UMKM NexaWeb'
      ]
    },
    {
      name: 'Pro',
      tagline: 'Pilihan terbaik untuk bisnis yang siap tumbuh online',
      price: 'Rp 49.000',
      period: 'per bulan (hemat Rp 390rb/tahun)',
      highlight: true,
      badge: 'Paling Populer',
      ctaText: 'Mulai Sekarang',
      features: [
        'Semua fitur lengkap di paket Starter Gratis',
        'Nama domain bisnis profesional (.com / .id) + SSL',
        'Multi-kanvas & menu navigasi halaman tanpa batas',
        'Integrasi tombol order WhatsApp bisnis (0% komisi)',
        'Bebas update katalog, foto & harga kapan saja',
        'Dukungan prioritas via WhatsApp Helpdesk'
      ]
    },
    {
      name: 'Bisnis Terima Beres',
      tagline: 'Dibantu tim desain NexaWeb sampai website siap jualan',
      price: 'Rp 299.000',
      period: 'Sekali bayar untuk 1 tahun penuh',
      highlight: false,
      ctaText: 'Konsultasi Tim NexaWeb',
      features: [
        'Semua fasilitas paket UMKM Pro selama 1 Tahun',
        'Bantuan input foto, deskripsi & katalog produk awal',
        'Sesi panduan privat 1-on-1 bersama tim kami',
        'Desain banner promo & identitas visual halaman utama',
        'Pendampingan penuh sampai website online & siap order'
      ]
    }
  ];

  return (
    <section id="harga" className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200/80 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
            Harga Transparan &amp; Fleksibel
          </span>
          <h2 className="mt-3 text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Investasi Ringan untuk Website Profesional, 0% Potongan Penjualan
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Mulai dari gratis hingga paket terima beres—jauh lebih hemat dibanding jasa agensi jutaan rupiah, dan 100% hasil penjualan tetap milik Anda.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`rounded-3xl p-8 transition-all duration-300 flex flex-col justify-between ${
                p.highlight
                  ? 'bg-slate-900 text-white shadow-2xl ring-4 ring-blue-500/30 scale-105 relative'
                  : 'bg-white text-slate-900 border border-slate-200 shadow-sm hover:shadow-lg'
              }`}
            >
              {p.highlight && p.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-600 text-white shadow-md flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                    {p.badge}
                  </span>
                </div>
              )}

              <div>
                <h3 className={`text-xl font-black ${p.highlight ? 'text-white' : 'text-slate-900'}`}>
                  {p.name}
                </h3>
                <p className={`text-xs mt-1 ${p.highlight ? 'text-slate-300' : 'text-slate-500'}`}>
                  {p.tagline}
                </p>

                <div className="mt-6 mb-6 pb-6 border-b border-slate-200/20">
                  <span className={`text-4xl font-black ${p.highlight ? 'text-white' : 'text-slate-900'}`}>
                    {p.price}
                  </span>
                  <span className={`text-xs block mt-1 ${p.highlight ? 'text-slate-400' : 'text-slate-500'}`}>
                    {p.period}
                  </span>
                </div>

                <div className="space-y-3">
                  {p.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-2.5 text-xs font-semibold">
                      <Check className={`w-4 h-4 shrink-0 mt-0.5 ${p.highlight ? 'text-blue-400' : 'text-emerald-600'}`} />
                      <span className={p.highlight ? 'text-slate-200' : 'text-slate-700'}>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4">
                <Link
                  href="/studio"
                  className={`w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm shadow transition-all ${
                    p.highlight
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/40'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <span>{p.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Garansi Aman */}
        <div className="mt-12 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Garansi Uang Kembali 14 Hari tanpa pertanyaan jika Anda merasa kurang puas.</span>
        </div>

      </div>
    </section>
  );
}
