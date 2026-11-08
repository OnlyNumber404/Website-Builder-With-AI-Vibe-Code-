'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, CheckCircle } from 'lucide-react';
import { TESTIMONIALS } from '@/lib/defaultData';

export default function Testimonials() {
  return (
    <section className="py-16 sm:py-24 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Kisah Sukses UMKM Usia 40–50 Tahun (AC-H.6)
          </span>
          <h2 className="mt-3 text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            &quot;Kalau Saya yang Gaptek Saja Bisa, Anda Pasti Lebih Bisa!&quot;
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Cerita tulus dari para pemilik usaha yang membuktikan bahwa membuat website toko tidak lagi rumit ataupun mahal.
          </p>
        </div>

        {/* Grid Testimoni */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="bg-slate-50/70 rounded-3xl p-7 border border-slate-200/80 hover:border-slate-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Rating Bintang 5 */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-2">5.0 / 5.0</span>
                </div>

                <div className="mb-4">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-900">
                    {t.highlight}
                  </span>
                </div>

                {/* Kutipan Pengalaman */}
                <p className="text-sm text-slate-700 leading-relaxed italic mb-6">
                  &quot;{t.quote}&quot;
                </p>
              </div>

              {/* Profil Pemilik Usaha */}
              <div className="pt-4 border-t border-slate-200/70 flex items-center gap-3.5">
                <img
                  src={t.photo}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-slate-900">{t.name}</h4>
                    <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <p className="text-xs text-slate-500 font-semibold">{t.age}</p>
                  <p className="text-xs text-slate-600 font-medium">{t.business}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
