import React from 'react';
import { MessageCircle, Users, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export default function CommunityBanner() {
  return (
    <section className="py-14 sm:py-16 bg-gradient-to-tr from-slate-900 via-blue-950 to-slate-900 text-white relative overflow-hidden">
      
      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-slate-800/80 backdrop-blur-md rounded-3xl p-8 sm:p-12 border border-slate-700/80 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          
          <div className="max-w-2xl space-y-3 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
              <Users className="w-3.5 h-3.5" />
              <span>Komunitas Belajar AI UMKM Indonesia</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              Belajar Bersama 3.800+ Pemilik Usaha Tanpa Takut Teknologi
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed">
              Bergabunglah secara gratis di grup WhatsApp Komunitas NexaWeb. Saling berbagi tips promosi online, panduan perintah AI untuk jualan, dan tanya jawab santai sesama pelaku usaha.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Bebas Spam & Promosi Liar
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" /> Sesi Tanya Jawab Rutin Mingguan
              </span>
            </div>
          </div>

          <div className="shrink-0 w-full sm:w-auto">
            <a
              href="https://wa.me/6281234567890?text=Halo%20Admin%20NexaWeb%2C%20saya%20ingin%20bergabung%20ke%20Grup%20Komunitas%20WhatsApp%20UMKM%20Belajar%20AI"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-emerald-900/40 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>Gabung Grup WhatsApp Gratis</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
