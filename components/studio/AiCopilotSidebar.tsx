'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, RotateCcw, ShieldCheck, KeyRound, Check } from 'lucide-react';
import { ChatMessage } from '@/lib/types';
import { processAiPrompt } from '@/lib/gemini';

interface AiCopilotSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApiKeyModal: () => void;
  hasApiKey: boolean;
  onExecuteAiAction: (action: any) => void;
  currentContext: {
    sections: any[];
    products: any[];
    activeThemeId: string;
  };
}

const getInitialWelcomeMessage = (): ChatMessage => ({
  id: 'msg-welcome-init',
  sender: 'assistant',
  text: `Halo! 👋 Saya **Asisten AI NexaWeb**, copilot dengan hak akses penuh untuk mengedit seluruh kanvas website toko Anda tanpa perlu koding.

✨ **Hal-hal yang bisa saya lakukan otomatis untuk Anda:**
1. ✏️ **Ubah Judul & Nama Toko** *(misal: "Ubah Judul Hero jadi Nasi Padang Pak Udin")*
2. 📱 **Ubah Nomor WhatsApp & Kontak** *(misal: "Ubah nomor WA jadi 0812-9999-8888")*
3. 📝 **Ganti Isi Konten & Cerita** *(misal: "gantikan about jadi Cerita Dapoer Pak Udin")*
4. 🍽️ **Tambah / Hapus Menu Produk** *(misal: "Tambah menu Rendang Sapi harga 35000")*
5. 🧭 **Edit Tautan Menu Navigasi** *(misal: "Edit navigasi tambahkan Promo Spesial")*
6. 🎨 **Ganti Gaya Desain & Warna** *(misal: "Ganti tema jadi kopi tradisional hangat")*
7. 🔄 **Kembalikan ke Awal** *(misal: "Kembalikan ke awal" untuk mereset susunan toko)*

Klik salah satu contoh cepat di bawah atau langsung ketik instruksi Anda! 👇`,
  timestamp: 'Otomatis',
  isWelcome: true,
  quickActions: [
    'Ubah Judul Hero jadi Nasi Padang Pak Udin',
    'Ubah nomor WA jadi 0812-9999-8888',
    'gantikan about jadi Cerita Dapoer Pak Udin',
    'Tambah menu Rendang Sapi harga 35000',
    'Edit navigasi tambahkan Promo Spesial',
    'Kembalikan ke awal'
  ]
});

export default function AiCopilotSidebar({
  isOpen,
  onClose,
  onOpenApiKeyModal,
  hasApiKey,
  onExecuteAiAction,
  currentContext
}: AiCopilotSidebarProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([getInitialWelcomeMessage()]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll saat ada pesan baru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputPrompt).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const res = await processAiPrompt(query, currentContext);
      
      const aiMsg: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'assistant',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);

      if (res.action) {
        onExecuteAiAction(res.action);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'msg-' + (Date.now() + 1),
          sender: 'assistant',
          text: 'Maaf, terjadi kendala saat memproses perintah AI. Silakan coba sesaat lagi.',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <aside className="w-80 sm:w-96 h-full shrink-0 bg-white border-l border-slate-200/90 flex flex-col overflow-hidden shadow-xl z-20">
      
      {/* Header Panel AI */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-black text-slate-900">Asisten Gemini AI</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[10px] text-slate-500 font-medium">Copilot Pembuat Website Praktis</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMessages([getInitialWelcomeMessage()])}
            title="Muat Ulang Panduan AI"
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onClose}
            title="Tutup Panel AI"
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Area Chat & Riwayat Pesan */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line ${
                  m.sender === 'user'
                    ? 'bg-slate-900 text-white rounded-br-none shadow-md font-medium'
                    : 'bg-slate-100/90 text-slate-800 rounded-bl-none border border-slate-200/90 shadow-2xs'
                }`}
              >
                {m.text}
              </div>

              {/* Jika ini pesan sambutan, tampilkan tombol aksi cepat siap pakai */}
              {m.isWelcome && m.quickActions && (
                <div className="w-full mt-3 space-y-2 pl-1 pr-2">
                  <span className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-blue-600" /> Contoh Perintah Siap Pakai:
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {m.quickActions.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => handleSend(q)}
                        disabled={isLoading}
                        className="text-left px-3 py-2 rounded-xl bg-white hover:bg-blue-50/80 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-900 text-[11px] font-semibold transition flex items-center gap-2 shadow-2xs group disabled:opacity-50"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0 group-hover:scale-110 transition-transform" />
                        <span className="line-clamp-2">{q}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <span className="text-[10px] text-slate-400 mt-1 px-1">
                {m.timestamp}
              </span>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-100 p-3 rounded-2xl w-fit border border-slate-200 shadow-2xs animate-pulse">
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
              <span className="font-medium">AI sedang memproses dan memperbarui kanvas Anda...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Info Status API Key di Bawah */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px]">
        <div className="flex items-center gap-1.5 text-slate-600">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="font-semibold">
            {hasApiKey ? 'Gemini 1.5 Flash Aktif' : 'Mode Offline Cerdas Aktif'}
          </span>
        </div>
        <button
          type="button"
          onClick={onOpenApiKeyModal}
          className="text-blue-600 hover:text-blue-800 font-bold underline"
        >
          {hasApiKey ? 'Ganti Key' : 'Pasang Key'}
        </button>
      </div>

      {/* Input Prompt Docked di Bawah */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Ketik instruksi (misal: 'Ubah Judul Hero jadi...')..."
            className="w-full pl-3.5 pr-20 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition"
          />
          <button
            type="submit"
            disabled={!inputPrompt.trim() || isLoading}
            className="absolute right-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1 shadow transition"
          >
            <span>Kirim</span>
            <Send className="w-3 h-3" />
          </button>
        </form>
      </div>

    </aside>
  );
}
