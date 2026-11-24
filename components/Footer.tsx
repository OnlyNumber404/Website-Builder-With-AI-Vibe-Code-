import React from 'react';
import Link from 'next/link';
import { MessageCircle, MapPin, Mail, ShieldCheck, Heart } from 'lucide-react';
import { NexaWebMark } from '@/components/common/NexaWebLogo';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Kolom 1: Profil Brand */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <NexaWebMark size={42} className="rounded-xl shadow-md shadow-blue-500/20" />
              <span className="font-extrabold text-2xl tracking-tight text-white">
                NexaWeb<span className="text-blue-400">.ai</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Platform pembuat website modern berbasis AI untuk seluruh pelaku UMKM Indonesia. Bangun website toko profesional secara mandiri—lewat Mode Template Instan atau Advance Designer Mode bergaya Canva—tanpa coding.
            </p>
            <div className="pt-2">
              <a
                href="https://wa.me/6281234567890?text=Halo%20NexaWeb%20Support%2C%20saya%20pemilik%20usaha%20ingin%20konsultasi%20bikin%20website"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all duration-200"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Bantuan WhatsApp Helpdesk (0812-3456-7890)</span>
              </a>
            </div>
          </div>

          {/* Kolom 2: Navigasi Cepat */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">Navigasi Halaman</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/" className="hover:text-blue-400 transition-colors">
                  Beranda Utama
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-400 transition-colors">
                  Tentang NexaWeb & Misi UMKM
                </Link>
              </li>
              <li>
                <Link href="/studio" className="hover:text-blue-400 transition-colors text-blue-400 font-semibold">
                  Mode Template Studio (Instan)
                </Link>
              </li>
              <li>
                <Link href="/studio/advance" className="hover:text-blue-400 transition-colors text-blue-300 font-semibold">
                  Advance Designer Mode (Ala Canva)
                </Link>
              </li>
              <li>
                <Link href="/#fitur" className="hover:text-blue-400 transition-colors">
                  Fitur Unggulan
                </Link>
              </li>
              <li>
                <Link href="/#showcase" className="hover:text-blue-400 transition-colors">
                  Galeri Inspirasi UMKM
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Kontak & Kantor */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">Kantor & Layanan Pelanggan</h4>
            <div className="space-y-2.5 text-xs text-slate-400 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Gedung Nexa Center, Jl. TB Simatupang Kav. 88, Pasar Minggu, Jakarta Selatan, DKI Jakarta 12520</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>halo@nexaweb.ai (Buka Setiap Hari: 08.00 - 21.00 WIB)</span>
              </div>
              <div className="flex items-center gap-2.5 text-emerald-400 font-semibold pt-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Data Usaha & Kontak WhatsApp Anda 100% Terlindungi</span>
              </div>
            </div>
          </div>

        </div>

        {/* Garis Pemisah & Hak Cipta */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 NexaWeb.ai. Seluruh hak cipta dilindungi undang-undang.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>untuk memajukan UMKM Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
