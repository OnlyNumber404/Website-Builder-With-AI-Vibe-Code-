'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquareText, Sliders, Smartphone, Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ValuePropGrid() {
  const cards = [
    {
      icon: MessageSquareText,
      badge: 'Bebas Koding 100%',
      title: 'Instan Tanpa Coding',
      headline: 'Tinggal Ketik Seperti Chat WhatsApp',
      description: 'Lupakan istilah rumit seperti domain, hosting, DNS, atau HTML. Anda cukup mengobrol santai dalam Bahasa Indonesia dengan asisten AI kami untuk merakit dan mengubah website.',
      features: [
        'Tidak perlu belajar bahasa pemrograman',
        'Bisa lewat HP maupun komputer meja',
        'AI memahami logat & bahasa sehari-hari'
      ],
      color: 'blue'
    },
    {
      icon: Sliders,
      badge: 'Bebas Ketergantungan',
      title: 'Kontrol Mandiri 100%',
      headline: 'Bebas dari Biaya Jasa Developer Mahal',
      description: 'Mau ganti harga menu soto? Tambah produk baru? Atau ubah jam operasional saat libur lebaran? Semua bisa Anda edit sendiri dalam hitungan detik tanpa perlu bayar orang lain lagi.',
      features: [
        'Hemat jutaan rupiah biaya jasa agensi',
        'Ubah harga & foto menu kapan saja seketika',
        'Kanvas drag & drop super gampang'
      ],
      color: 'emerald'
    },
    {
      icon: Smartphone,
      badge: 'Langsung Jualan',
      title: 'Siap Terima Order',
      headline: 'Terintegrasi Tombol Pesanan WhatsApp',
      description: 'Website toko Anda langsung dilengkapi tombol pesanan WhatsApp pintar. Begitu pembeli mengklik menu yang diinginkan, pesan pesanan rapi otomatis terisi di chat WhatsApp Anda.',
      features: [
        'Uang masuk 100% langsung ke rekening Anda',
        'Tanpa potongan komisi aplikasi yang mencekik',
        'Format pesan WhatsApp bisa dikustomisasi'
      ],
      color: 'amber'
    }
  ];

  return (
    <section id="fitur" className="py-16 sm:py-24 bg-white border-t border-slate-100 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Nilai Keunggulan NexaWeb (AC-H.4)
          </span>
          <h2 className="mt-3 text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Dirancang Nyaman untuk Pemilik Usaha, Bukan untuk Ahli Komputer
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Tiga pilar kemudahan yang membebaskan pemilik usaha dari rasa takut pada teknologi.
          </p>
        </div>

        {/* Grid 3 Kartu */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="bg-slate-50/70 hover:bg-white rounded-3xl p-8 border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                      <Icon className="w-7 h-7 text-blue-400" />
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100/80 text-blue-800">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    {card.title}
                  </h3>
                  <h4 className="text-xl font-black text-slate-900 mb-3 leading-snug">
                    {card.headline}
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {card.description}
                  </p>

                  <div className="space-y-2.5 pt-4 border-t border-slate-200/80">
                    {card.features.map((feat) => (
                      <div key={feat} className="flex items-start gap-2.5 text-xs font-semibold text-slate-700">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4">
                  <Link
                    href="/studio"
                    className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 group-hover:text-blue-700 transition"
                  >
                    <span>Coba fiturnya sekarang</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
