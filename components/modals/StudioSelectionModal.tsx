'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  Check,
  ArrowRight,
  ArrowLeft,
  Sliders,
  Store,
  Lock,
  Clock,
  HelpCircle,
  Zap,
  CheckCircle2,
  Layers,
  LayoutTemplate
} from 'lucide-react';
import { NexaWebMark } from '@/components/common/NexaWebLogo';

interface StudioSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface BusinessTemplateSetup {
  businessType: string;
  customBusinessType?: string;
  description: string;
  features: {
    userAuth: boolean;
    productCrud: boolean;
    whatsappOrder: boolean;
    cartEngine: boolean;
    contactHours: boolean;
  };
}

export default function StudioSelectionModal({ isOpen, onClose }: StudioSelectionModalProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Navigasi Langkah Wizard: 'select' (Pilih Kartu Mode) -> 'form' (Form Detail Template)
  const [wizardStep, setWizardStep] = useState<'select' | 'form'>('select');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset langkah kembali ke pemilihan kartu setiap kali modal dibuka
  useEffect(() => {
    if (isOpen) {
      setWizardStep('select');
    }
  }, [isOpen]);

  // Form State Card 1 (Template Mode)
  const [businessType, setBusinessType] = useState<string>('Makanan & Minuman (Kuliner)');
  const [customBusinessType, setCustomBusinessType] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [features, setFeatures] = useState({
    userAuth: true,
    productCrud: true,
    whatsappOrder: true,
    cartEngine: true,
    contactHours: true
  });

  const toggleFeature = (key: keyof typeof features) => {
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmitTemplateMode = (e: React.FormEvent) => {
    e.preventDefault();

    const setupData: BusinessTemplateSetup = {
      businessType: businessType === 'Lainnya (Tulis Sendiri)' ? customBusinessType.trim() || 'Usaha Mandiri' : businessType,
      customBusinessType: customBusinessType.trim(),
      description: description.trim(),
      features
    };

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('nexaweb_wizard_setup', JSON.stringify(setupData));
    }

    onClose();
    router.push('/studio?wizard=true');
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        
        {/* Backdrop dengan Efek Blur (AC-NAV-3) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
        />

        {/* Kontainer Utama Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ type: 'spring', duration: 0.35, bounce: 0.05 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[92vh] z-10 my-auto"
        >
          {/* Header Modal Dinamis Sesuai Langkah */}
          <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-3">
              {wizardStep === 'form' ? (
                <button
                  type="button"
                  onClick={() => setWizardStep('select')}
                  className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition shadow-2xs"
                  title="Kembali ke Pilihan Mode"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              ) : (
                <NexaWebMark size={40} className="rounded-xl shadow-md shadow-blue-500/20" />
              )}

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight">
                    {wizardStep === 'select' ? 'Studio Selection & Setup Wizard' : 'Setup Website Toko (Mode Template)'}
                  </h2>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                    {wizardStep === 'select' ? 'Langkah 1 dari 2' : 'Langkah 2 dari 2'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {wizardStep === 'select'
                    ? 'Pilih salah satu mode pembuatan toko di bawah ini untuk memulai'
                    : 'Tentukan jenis usaha dan centang fitur toko yang ingin Anda aktifkan'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition"
              aria-label="Tutup jendela"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Modal: Dua Tampilan Bergantian Menggunakan AnimatePresence */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6">
            
            {/* ========================================================================= */}
            {/* LANGKAH 1: PILIHAN MODE (CARD TEMPLATE VS CARD ADVANCE)                   */}
            {/* ========================================================================= */}
            {wizardStep === 'select' ? (
              <motion.div
                key="step-select"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch"
              >
                
                {/* ----------------------------------------------------------------------- */}
                {/* KARTU 1: MODE TEMPLATE (PRAKTIS & INSTAN) - KLIK UNTUK MEMBUKA FORM     */}
                {/* ----------------------------------------------------------------------- */}
                <div
                  onClick={() => setWizardStep('form')}
                  className="group bg-white rounded-2xl border-2 border-blue-600/90 hover:border-blue-700 p-6 shadow-md hover:shadow-xl ring-4 ring-blue-500/10 hover:ring-blue-500/20 transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden transform hover:-translate-y-0.5"
                >
                  <div>
                    {/* Lencana Rekomendasi Utama */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-blue-600 text-white shadow-xs">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Rekomendasi Utama UMKM
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Siap Pakai
                      </span>
                    </div>

                    {/* Identitas Card 1 */}
                    <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200/80 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                      <LayoutTemplate className="w-6 h-6" />
                    </div>

                    <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                      Mode Template (Praktis & Instan)
                    </h3>
                    
                    <p className="text-xs text-slate-600 leading-relaxed font-medium mt-2">
                      Pilih jenis usaha Anda dan centang fitur yang dibutuhkan. AI kami akan langsung merakitkan website toko yang siap pakai tanpa perlu utak-atik desain dari nol.
                    </p>

                    {/* Poin Keunggulan Utama */}
                    <div className="mt-5 space-y-2 bg-blue-50/50 p-3.5 rounded-xl border border-blue-100">
                      <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Selesai dalam 1 menit tanpa koding</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Preset siap pakai untuk Kuliner, Fashion, Jasa, Kriya, dll.</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Otomatis terhubung ke WhatsApp Toko & Katalog Menu</span>
                      </div>
                    </div>
                  </div>

                  {/* Tombol Aksi Membuka Form */}
                  <div className="pt-6">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setWizardStep('form');
                      }}
                      className="w-full py-3 rounded-xl bg-blue-600 group-hover:bg-blue-700 text-white font-extrabold text-sm shadow-md group-hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <span>Pilih Mode Template & Lanjut</span>
                      <ArrowRight className="w-4 h-4 text-blue-200 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="text-[10px] text-center text-slate-500 mt-2 font-medium">
                      ✓ Klik untuk mengisi detail usaha dan fitur toko
                    </p>
                  </div>
                </div>

                {/* ----------------------------------------------------------------------- */}
                {/* KARTU 2: MODE KUSTOM BEBAS (ADVANCE DESIGNER MODE - CANVA-LIKE)          */}
                {/* ----------------------------------------------------------------------- */}
                <div
                  onClick={() => {
                    onClose();
                    router.push('/studio/advance');
                  }}
                  className="group bg-white rounded-2xl border-2 border-blue-500/80 hover:border-blue-600 p-6 shadow-md hover:shadow-xl ring-4 ring-blue-500/10 hover:ring-blue-500/20 transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden transform hover:-translate-y-0.5"
                >
                  <div>
                    {/* Lencana Fitur Advance */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Free-Form Canvas (Canva-like)
                      </span>
                      <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                        Advance Mode
                      </span>
                    </div>

                    {/* Identitas Card 2 */}
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-100 to-indigo-100 text-blue-700 border border-blue-200 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                      <Layers className="w-6 h-6" />
                    </div>

                    <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                      Mode Kustom Bebas (Advance Designer)
                    </h3>
                    
                    <p className="text-xs text-slate-600 leading-relaxed font-medium mt-2">
                      Rancang tata letak website secara bebas berbasis kanvas visual seperti Canva. Seret & letakkan teks, gambar, tombol, kartu produk, dan navigasi tanpa batasan grid kaku.
                    </p>

                    {/* Poin Keunggulan Utama */}
                    <div className="mt-5 space-y-2 bg-blue-50/50 p-3.5 rounded-xl border border-blue-100">
                      <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
                        <Check className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>Kanvas Bebas: Drag & drop koordinat X & Y tanpa batas</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
                        <Check className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>Multi-Kanvas: Tambah halaman bertingkat & tautan navbar</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
                        <Check className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>Asisten AI Gemini Flash & Riwayat Undo/Redo penuh</span>
                      </div>
                    </div>
                  </div>

                  {/* Tombol Aksi Membuka Advance Studio */}
                  <div className="pt-6">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                        router.push('/studio/advance');
                      }}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:from-blue-700 group-hover:to-indigo-700 text-white font-extrabold text-sm shadow-md group-hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <span>Buka Advance Designer Mode</span>
                      <ArrowRight className="w-4 h-4 text-blue-200 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="text-[10px] text-center text-slate-500 mt-2 font-medium">
                      ✓ Langsung mulai dengan kanvas kosong siap desain
                    </p>
                  </div>
                </div>

              </motion.div>
            ) : (
              /* ========================================================================= */
              /* LANGKAH 2: FORM PENGISIAN DETAIL USAHA (CARD 1 SETUP FORM)                */
              /* ========================================================================= */
              <motion.div
                key="step-form"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
                className="max-w-2xl mx-auto space-y-5"
              >
                {/* Banner Info Mode Template Terpilih */}
                <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <LayoutTemplate className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-blue-900 block">
                        Mode Terpilih: Mode Template (Praktis & Instan)
                      </span>
                      <span className="text-[11px] text-blue-700">
                        Isi form ringkas di bawah ini, lalu klik tombol untuk langsung merakit website Anda.
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWizardStep('select')}
                    className="text-xs font-bold text-blue-700 hover:text-blue-900 px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-100 transition whitespace-nowrap shrink-0"
                  >
                    Ganti Mode
                  </button>
                </div>

                {/* Form Setup Card 1 */}
                <form onSubmit={handleSubmitTemplateMode} className="space-y-4">
                  
                  {/* C02: Form Pilihan Jenis Usaha (Single Dropdown) */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-extrabold text-slate-800">
                      Jenis Usaha Toko Anda <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/60 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                    >
                      <option value="Makanan & Minuman (Kuliner)">Makanan & Minuman (Kuliner)</option>
                      <option value="Usaha Pakaian / Fashion">Usaha Pakaian / Fashion</option>
                      <option value="Jasa / Layanan">Jasa / Layanan</option>
                      <option value="Kerajinan Tangan / Kriya">Kerajinan Tangan / Kriya</option>
                      <option value="Lainnya (Tulis Sendiri)">Lainnya (Tulis Sendiri)...</option>
                    </select>

                    {/* Input Tambahan jika "Lainnya (Tulis Sendiri)" dipilih */}
                    {businessType === 'Lainnya (Tulis Sendiri)' && (
                      <div className="pt-1.5">
                        <input
                          type="text"
                          value={customBusinessType}
                          onChange={(e) => setCustomBusinessType(e.target.value)}
                          placeholder="Tuliskan jenis usaha Anda (misal: Toko Bahan Kue, Bengkel Sepeda...)"
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-blue-300 bg-blue-50/40 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
                          required
                        />
                      </div>
                    )}
                  </div>

                  {/* C03: Deskripsi Singkat Usaha (Short Story Input) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-extrabold text-slate-800">
                        Deskripsi Singkat Usaha (Cerita Toko)
                      </label>
                      <span className="text-[10px] text-slate-500 font-semibold">Bahasa Santai</span>
                    </div>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Contoh: Toko Keripik Singkong Mbak Sri di Surabaya, menjual keripik renyah rasa balado dan keju tanpa bahan pengawet."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/60 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition leading-relaxed"
                    />
                  </div>

                  {/* C04: Checklist Fitur Toko (Bahasa Non-Teknis Ramah Awam) */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-extrabold text-slate-800">
                        Centang Fitur Toko yang Dibutuhkan:
                      </label>
                      <span className="text-[10px] text-blue-600 font-bold">Semua Siap Otomatis</span>
                    </div>

                    <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                      
                      {/* Fitur 1: Akun Pelanggan */}
                      <label className="flex items-start gap-2.5 cursor-pointer p-1.5 rounded-xl hover:bg-white transition">
                        <input
                          type="checkbox"
                          checked={features.userAuth}
                          onChange={() => toggleFeature('userAuth')}
                          className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-slate-900 block">Akun Pelanggan</span>
                          <span className="text-[11px] text-slate-500">
                            Fitur login & profil agar pembeli dapat menyimpan riwayat belanja.
                          </span>
                        </div>
                      </label>

                      {/* Fitur 2: Katalog & Tambah Produk */}
                      <label className="flex items-start gap-2.5 cursor-pointer p-1.5 rounded-xl hover:bg-white transition">
                        <input
                          type="checkbox"
                          checked={features.productCrud}
                          onChange={() => toggleFeature('productCrud')}
                          className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-slate-900 block">Katalog & Tambah Produk</span>
                          <span className="text-[11px] text-slate-500">
                            Pajang foto menu/produk, deskripsi, harga, dan atur ketersediaan stok.
                          </span>
                        </div>
                      </label>

                      {/* Fitur 3: Pesan Instan via WhatsApp */}
                      <label className="flex items-start gap-2.5 cursor-pointer p-1.5 rounded-xl hover:bg-white transition">
                        <input
                          type="checkbox"
                          checked={features.whatsappOrder}
                          onChange={() => toggleFeature('whatsappOrder')}
                          className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                            <span>Pesan Instan via WhatsApp</span>
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.2 rounded">Populer</span>
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Pesanan pembeli langsung masuk ke WhatsApp Anda dengan format rapi.
                          </span>
                        </div>
                      </label>

                      {/* Fitur 4: Keranjang Belanja & Hitung Total */}
                      <label className="flex items-start gap-2.5 cursor-pointer p-1.5 rounded-xl hover:bg-white transition">
                        <input
                          type="checkbox"
                          checked={features.cartEngine}
                          onChange={() => toggleFeature('cartEngine')}
                          className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-slate-900 block">Keranjang Belanja & Hitung Total</span>
                          <span className="text-[11px] text-slate-500">
                            Pembeli bisa memilih banyak barang sekaligus dan total belanja dihitung otomatis.
                          </span>
                        </div>
                      </label>

                      {/* Fitur 5: Tampilan Lokasi & Jam Buka Toko */}
                      <label className="flex items-start gap-2.5 cursor-pointer p-1.5 rounded-xl hover:bg-white transition">
                        <input
                          type="checkbox"
                          checked={features.contactHours}
                          onChange={() => toggleFeature('contactHours')}
                          className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-slate-900 block">Tampilan Lokasi & Jam Buka Toko</span>
                          <span className="text-[11px] text-slate-500">
                            Peta alamat toko fisik, nomor telepon, dan jam operasional buka.
                          </span>
                        </div>
                      </label>

                    </div>
                  </div>

                  {/* Tombol Eksekusi Submit Card 1 */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 transform active:scale-[0.99]"
                    >
                      <span>Mulai Buat Websiteku</span>
                      <ArrowRight className="w-4 h-4 text-blue-400" />
                    </button>
                    <p className="text-[10px] text-center text-slate-500 mt-2 font-medium">
                      ✓ Tanpa koding • Langsung dapat preview toko • Bisa diedit kapan saja di Studio Kanvas
                    </p>
                  </div>

                </form>
              </motion.div>
            )}

          </div>

          {/* Footer Modal Info */}
          <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 px-6 shrink-0">
            <span>Ditenagai oleh AI NexaWeb Copilot</span>
            <div className="flex items-center gap-4">
              {wizardStep === 'form' && (
                <button
                  type="button"
                  onClick={() => setWizardStep('select')}
                  className="text-slate-600 hover:text-slate-900 font-bold"
                >
                  Kembali ke Pilihan Mode
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="text-slate-500 hover:text-slate-800 font-semibold"
              >
                Batal & Tutup
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
