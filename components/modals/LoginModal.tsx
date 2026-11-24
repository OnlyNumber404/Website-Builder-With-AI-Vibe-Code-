'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogIn, Sparkles, UserPlus, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import Link from 'next/link';
import { NexaWebMark } from '@/components/common/NexaWebLogo';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenStudioWizard?: () => void;
}

export default function LoginModal({ isOpen, onClose, onOpenStudioWizard }: LoginModalProps) {
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        
        {/* Backdrop dengan Blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', duration: 0.3, bounce: 0.05 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden z-10 my-auto"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <NexaWebMark size={38} className="rounded-xl shadow-sm" />
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {tab === 'login' ? 'Masuk ke Akun Toko' : 'Daftar Akun NexaWeb'}
                </h3>
                <p className="text-[11px] text-slate-500">Khusus pemilik usaha & pengelola website</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Selector */}
          <div className="px-6 pt-4">
            <div className="flex items-center p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setTab('login')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                  tab === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Masuk
              </button>
              <button
                type="button"
                onClick={() => setTab('register')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                  tab === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Daftar Baru
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email atau No. WhatsApp
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="misal: 081234567890 atau toko@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">Kata Sandi</label>
                {tab === 'login' && (
                  <button
                    type="button"
                    onClick={() => alert('Fitur pemulihan kata sandi via WhatsApp akan dikirimkan ke nomor Anda.')}
                    className="text-[10px] text-blue-600 hover:underline font-semibold"
                  >
                    Lupa Sandi?
                  </button>
                )}
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi akun Anda"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSuccess}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
            >
              {isSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Berhasil Masuk! Membuka...</span>
                </>
              ) : (
                <>
                  <span>{tab === 'login' ? 'Masuk Sekarang' : 'Daftar Akun Toko'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            {/* Quick Demo Option */}
            <div className="pt-2 text-center border-t border-slate-100 space-y-2">
              <span className="text-[11px] text-slate-500 block">Belum punya akun atau ingin langsung mencoba?</span>
              <div className="flex items-center gap-2">
                <Link
                  href="/studio"
                  onClick={onClose}
                  className="flex-1 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Coba Demo Bebas</span>
                </Link>

                {onOpenStudioWizard && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenStudioWizard();
                    }}
                    className="flex-1 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition"
                  >
                    Buka Wizard Setup
                  </button>
                )}
              </div>
            </div>

          </form>

        </motion.div>
      </div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
