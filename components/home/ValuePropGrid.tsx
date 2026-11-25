'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquareText, Layers, Smartphone, Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ValuePropGrid() {
  const cards = [
    {
      icon: MessageSquareText,
      badge: 'AI Copilot (Gemini Flash)',
      title: 'Instan Tanpa Coding',
      headline: 'Edit Website Semudah Chatting Sehari-hari',
      description: 'Cukup ketik instruksi dalam Bahasa Indonesia—seperti tambah menu baru, ganti warna tema, atau targetkan bagian tertentu dengan @Hero dan @Katalog. AI langsung mengeksekusinya di kanvas.',
      features: [
        'Asisten AI Copilot siap bantu 24/7',
        'Fitur @mention untuk edit bagian spesifik',
        'Rakit teks, produk & tampilan dalam hitungan detik'
      ],
      href: '/studio',
      cta: 'Coba AI Copilot di Studio'
    },
    {
      icon: Layers,
      badge: '2 Mode Editor Studio',
      title: 'Template & Kanvas Bebas',
      headline: 'Mau Cepat atau Kustom Bebas di Kanvas Visual, Bisa!',
      description: 'Gunakan Mode Template untuk langsung siap jualan, atau buka Advance Designer Mode untuk merancang tata letak bebas multi-kanvas lengkap dengan garis bantu Smart Snap dan toolbar tipografi modern.',
      features: [
        'Drag & drop bebas + Smart Alignment & Resize Snap',
        'Edit judul, harga & deskripsi produk langsung di kartu',
        'Riwayat Undo/Redo penuh & multi-halaman navigasi'
      ],
      href: '/studio/advance',
      cta: 'Coba Advance Designer Mode'
    },
    {
      icon: Smartphone,
      badge: 'Siap Jualan & Export',
      title: 'WhatsApp & Deploy ZIP',
      headline: 'Terima Pesanan Langsung Tanpa Potongan Komisi',
      description: 'Setiap produk dan tombol aksi bisa langsung terhubung ke WhatsApp bisnis Anda. Lihat pratinjau interaktif secara live lalu unduh paket website lengkap (ZIP) yang siap langsung tayang.',
      features: [
        '100% omzet masuk ke rekening bisnis Anda (0% komisi)',
        'Pratinjau live interaktif untuk cek tombol & navigasi',
        'Export paket file website statis (index.html & CSS)'
      ],
      href: '/studio',
      cta: 'Mulai Bangun Website Anda'
    }
  ];

  return (
    <section id="fitur" className="py-16 sm:py-24 bg-white border-t border-slate-100 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
            Fitur Unggulan NexaWeb
          </span>
          <h2 className="mt-3 text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Semua Alat yang UMKM Butuhkan untuk Tampil Profesional Online
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Dari AI Copilot yang mengerti bahasa sehari-hari, dua mode desain fleksibel, hingga ekspor website siap jualan—semuanya dalam satu studio modern.
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
                    href={card.href}
                    className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 group-hover:text-blue-700 transition"
                  >
                    <span>{card.cta}</span>
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
