'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import {
  Rocket,
  Download,
  FileCode,
  FileText,
  CheckCircle2,
  X,
  ExternalLink,
  Globe,
  FolderArchive
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DeploySuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  onReDownload: () => void;
}

export function DeploySuccessModal({
  isOpen,
  onClose,
  fileName,
  onReDownload
}: DeploySuccessModalProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    if (isOpen) {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    }
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="deploy-modal-title"
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Visual */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-6 text-white text-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="w-14 h-14 bg-white/20 border border-white/30 rounded-2xl mx-auto flex items-center justify-center text-white mb-3 shadow-lg">
            <Rocket className="w-7 h-7 text-white animate-bounce" />
          </div>
          <h2 id="deploy-modal-title" className="text-xl font-extrabold tracking-tight">
            Website Siap Di-Deploy! 🎉
          </h2>
          <p className="text-xs text-blue-100 mt-1 max-w-sm mx-auto">
            File ZIP website toko Anda telah berhasil dirakit dan diunduh ke perangkat Anda.
          </p>

          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-slate-700 text-xs">
          
          {/* Card File Info */}
          <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/90 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <FolderArchive className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-slate-900 text-xs block">
                  {fileName || 'website-toko.zip'}
                </span>
                <span className="text-[10px] text-blue-700 font-semibold">
                  Format ZIP Siap Pakai (Stand-alone)
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onReDownload}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-blue-600 hover:text-white border border-blue-300 text-blue-800 text-[11px] font-bold transition flex items-center gap-1 shadow-2xs"
              title="Unduh Ulang"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Ulang</span>
            </button>
          </div>

          {/* Isi Struktur File dalam ZIP */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider block">
              Isi File Setelah Diekstrak:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="overflow-hidden">
                  <div className="font-bold text-slate-900 truncate">index.html</div>
                  <div className="text-[10px] text-slate-500">Halaman web utama</div>
                </div>
              </div>
              <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-blue-600 shrink-0" />
                <div className="overflow-hidden">
                  <div className="font-bold text-slate-900 truncate">style.css</div>
                  <div className="text-[10px] text-slate-500">Desain & warna tema</div>
                </div>
              </div>
            </div>
          </div>

          {/* Petunjuk Penggunaan Cepat */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-[11px] font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              Panduan Menjalankan Website:
            </span>
            <ol className="space-y-2 text-slate-600 pl-4 list-decimal text-[11px] leading-relaxed">
              <li>
                <strong>Buka di Laptop/HP:</strong> Ekstrak file zip, lalu klik 2x berkas <code>index.html</code>. Website langsung terbuka di browser tanpa perlu install aplikasi apapun.
              </li>
              <li>
                <strong>Online-kan Gratis (Netlify Drop):</strong> Buka link <a href="https://app.netlify.com/drop" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold underline inline-flex items-center gap-0.5">app.netlify.com/drop <ExternalLink className="w-2.5 h-2.5" /></a> dan seret folder hasil ekstrak. Website Anda langsung live di internet dengan URL aktif dalam 5 detik!
              </li>
              <li>
                <strong>Siap Jualan:</strong> Seluruh tombol pemesanan WhatsApp sudah otomatis terkoneksi ke nomor toko dan pesan pesanan menu Anda.
              </li>
            </ol>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition"
          >
            Selesai & Tutup
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
