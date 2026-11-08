'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, MapPin, User, ArrowUpRight, Sparkles } from 'lucide-react';
import { SHOWCASE_ITEMS } from '@/lib/defaultData';

export default function ShowcaseCatalog() {
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const categories = ['Semua', 'Kuliner', 'Fashion', 'Jasa Lokal', 'Kriya'];

  const filteredItems = selectedCategory === 'Semua'
    ? SHOWCASE_ITEMS
    : SHOWCASE_ITEMS.filter((item) => item.category === selectedCategory);

  // Varian animasi container untuk efek staggered satu-satu dari bawah ke atas
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.09,
        delayChildren: 0.04
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 35,
      scale: 0.94
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 22,
        mass: 0.8
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.94,
      transition: {
        duration: 0.15
      }
    }
  };

  return (
    <section id="showcase" className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200/80 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Showcase Galeri Toko UMKM (AC-H.5)</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Contoh Website Toko Nyata yang Siap Pakai
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Dibuat khusus untuk beragam bidang usaha di Indonesia. Anda bisa langsung mengambil inspirasi dan mengeditnya di studio.
          </p>

          {/* Tab Filter Kategori dengan Animated Sliding Pill */}
          <div className="mt-8 flex justify-center">
            <div className="inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-slate-200/70 backdrop-blur-md rounded-2xl border border-slate-300/60 shadow-inner">
              {categories.map((cat) => {
                const active = cat === selectedCategory;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors duration-200 z-10 ${
                      active ? 'text-white' : 'text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="activeCategoryPill"
                        className="absolute inset-0 bg-slate-900 rounded-xl shadow-md -z-10"
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 30
                        }}
                      />
                    )}
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Galeri Grid dengan Transisi Halus Staggered */}
        <div className="min-h-[460px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {filteredItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  variants={cardVariants}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Gambar Cover Toko */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase bg-white/95 backdrop-blur-md text-slate-900 shadow-sm border border-slate-100">
                          {item.badge}
                        </span>
                      </div>
                    </div>

                    {/* Isi Kartu */}
                    <div className="p-6 space-y-3">
                      <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      
                      <div className="space-y-1 text-xs text-slate-500 font-medium">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>Pemilik: <strong className="text-slate-700">{item.owner}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.location}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Footer Kartu & Tombol Studio */}
                  <div className="p-6 pt-0">
                    <Link
                      href="/studio"
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-700 font-bold text-xs border border-slate-200 transition-all duration-200 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600"
                    >
                      <span>Coba Template di Studio</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
