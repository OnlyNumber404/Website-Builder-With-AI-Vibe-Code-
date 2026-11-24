'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Menu, X, Laptop, LogIn, Store } from 'lucide-react';
import StudioSelectionModal from './modals/StudioSelectionModal';
import LoginModal from './modals/LoginModal';
import { NexaWebMark } from '@/components/common/NexaWebLogo';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isStudioModalOpen, setIsStudioModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { id: 'hero', label: 'Beranda', href: '/#hero' },
    { id: 'tentang', label: 'Tentang Kami', href: '/#tentang' },
    { id: 'fitur', label: 'Fitur Unggulan', href: '/#fitur' },
    { id: 'showcase', label: 'Galeri UMKM', href: '/#showcase' },
    { id: 'harga', label: 'Harga', href: '/#harga' },
  ];

  // ScrollSpy: Deteksi posisi scroll secara presisi & otomatis pindah penanda aktif
  useEffect(() => {
    // Jika berada di halaman /about, otomatis tandai "Tentang Kami"
    if (pathname === '/about') {
      setActiveSection('tentang');
      return;
    }

    if (pathname !== '/') {
      setActiveSection('');
      return;
    }

    const sectionIds = ['hero', 'tentang', 'fitur', 'showcase', 'harga'];

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // 1. Jika di paling atas (Beranda)
      if (scrollY < 120) {
        setActiveSection('hero');
        return;
      }

      // 2. Jika sudah scroll sampai paling bawah halaman (Harga / Footer)
      if (scrollY + windowHeight >= documentHeight - 80) {
        setActiveSection('harga');
        return;
      }

      // 3. Hitung posisi tengah viewport untuk menentukan bagian mana yang sedang dilihat
      const viewportCenter = scrollY + 220; // 80px navbar + offset fokus mata

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (viewportCenter >= top) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    // Jalankan sekali saat mount dan pasang event listener
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]);

  // Handler klik navigasi untuk scroll halus tanpa lompatan kasar
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string, href: string) => {
    if (pathname === '/') {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        const offset = 80; // tinggi navbar sticky
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = el.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        setActiveSection(id);
        window.history.pushState(null, '', `#${id}`);
      }
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 glass-nav border-b border-slate-200/80 transition-all">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4 xl:gap-8">
          
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <NexaWebMark
              size={44}
              className="rounded-xl shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200"
            />
            <div className="flex flex-col shrink-0">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 flex items-center">
                NexaWeb<span className="text-blue-600">.ai</span>
              </span>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Website Builder UMKM
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links dengan Smooth Sliding Active Indicator (Anti-Wrap & Lega) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 p-1.5 bg-slate-100/70 rounded-2xl border border-slate-200/70 shrink-0">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.id, link.href)}
                  className={`relative px-3.5 xl:px-4 py-2 text-xs xl:text-sm font-bold transition-colors duration-200 rounded-xl z-10 whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-blue-600 font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 bg-white rounded-xl shadow-sm border border-slate-200 -z-10"
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 30
                      }}
                    />
                  )}
                  <span className="whitespace-nowrap">{link.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Action CTA (AC-NAV-1, AC-NAV-2, AC-NAV-3) */}
          <div className="hidden lg:flex items-center gap-2.5 xl:gap-3 shrink-0">
            {/* Tombol Utama: Coba Demo Gratis */}
            <Link
              href="/studio"
              className="hidden xl:inline-flex items-center gap-2 px-3.5 xl:px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs xl:text-sm transition-all duration-200 shadow-2xs hover:shadow-xs transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap shrink-0"
            >
              <Laptop className="w-4 h-4 text-slate-500 shrink-0" />
              <span>Coba Demo Gratis</span>
            </Link>

            {/* AC-NAV-1: Tombol "Studio" membuka Studio Selection Wizard */}
            <button
              type="button"
              onClick={() => setIsStudioModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 xl:px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs xl:text-sm shadow-md shadow-blue-500/25 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-4 h-4 text-blue-200 shrink-0" />
              <span>Studio</span>
            </button>

            {/* AC-NAV-2: Tombol "Masuk / Login" di sebelah kanan tombol Studio */}
            <button
              type="button"
              onClick={() => setIsLoginModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 xl:px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs xl:text-sm shadow-sm transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap shrink-0"
            >
              <LogIn className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Masuk / Login</span>
            </button>
          </div>

          {/* Mobile & Tablet (< lg) Menu Button */}
          <div className="lg:hidden flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsStudioModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-xs whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-200 shrink-0" />
              <span>Studio</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu (< lg) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2.5 shadow-xl">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.id, link.href)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{link.label}</span>
                {isActive && <span className="w-2 h-2 rounded-full bg-blue-600" />}
              </a>
            );
          })}
          
          <div className="pt-3 space-y-2 border-t border-slate-100">
            {/* Tombol Studio di Mobile */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setIsStudioModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 text-white font-extrabold text-sm shadow-md"
            >
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span>Buka Studio Selection Wizard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Tombol Coba Demo Gratis di Mobile */}
            <Link
              href="/studio"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs"
            >
              <Laptop className="w-4 h-4 text-slate-500" />
              <span>Coba Demo Bebas Langsung</span>
            </Link>

            {/* Tombol Masuk / Login di Mobile */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setIsLoginModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              <LogIn className="w-4 h-4 text-blue-400" />
              <span>Masuk / Login Akun</span>
            </button>
          </div>
        </div>
      )}
      </header>

      {/* Modals: Studio Selection & Setup Wizard + Login (Berada di luar header agar tidak terhalang stacking context) */}
      <StudioSelectionModal
        isOpen={isStudioModalOpen}
        onClose={() => setIsStudioModalOpen(false)}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onOpenStudioWizard={() => setIsStudioModalOpen(true)}
      />
    </>
  );
}
