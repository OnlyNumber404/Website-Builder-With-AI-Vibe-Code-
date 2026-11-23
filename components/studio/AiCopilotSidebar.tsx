'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  RotateCcw,
  AtSign,
  ChevronRight,
  Store,
  Phone,
  Utensils,
  Layers,
  Navigation,
  Check
} from 'lucide-react';
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

const MENTION_OPTIONS = [
  {
    id: 'hero',
    name: 'Hero',
    label: '@Hero',
    desc: 'Banner Utama Website (Judul & Sub-judul)',
    badge: 'Banner',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    subActions: [
      { label: 'Ubah Judul Utama', prefix: '@Hero ubah judul jadi: ' },
      { label: 'Ubah Sub-Judul', prefix: '@Hero ubah subjudul jadi: ' },
      { label: 'Ubah Kalimat Aksi', prefix: '@Hero ubah kalimat jadi: ' }
    ]
  },
  {
    id: 'about',
    name: 'About',
    label: '@About',
    desc: 'Tentang Usaha & Cerita Toko',
    badge: 'Cerita',
    color: 'bg-amber-50 text-amber-800 border-amber-200',
    subActions: [
      { label: 'Ubah Judul', prefix: '@About ubah judul jadi: ' },
      { label: 'Ganti Isi Cerita Toko', prefix: '@About gantikan isi jadi: ' },
      { label: 'Ubah Sub-Judul', prefix: '@About ubah subjudul jadi: ' }
    ]
  },
  {
    id: 'katalog',
    name: 'Katalog',
    label: '@Katalog',
    desc: 'Katalog Menu & Produk Toko',
    badge: 'Produk',
    color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    subActions: [
      { label: 'Tambah Menu Baru', prefix: '@Katalog tambah menu: ' },
      { label: 'Hapus Menu', prefix: '@Katalog hapus menu: ' },
      { label: 'Ubah Judul Katalog', prefix: '@Katalog ubah judul jadi: ' }
    ]
  },
  {
    id: 'kontak',
    name: 'Kontak',
    label: '@Kontak',
    desc: 'Nomor WhatsApp, Alamat & Jam Buka',
    badge: 'WhatsApp',
    color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    subActions: [
      { label: 'Ubah Nomor WhatsApp', prefix: '@Kontak ubah nomor WA jadi: ' },
      { label: 'Ubah Alamat Toko', prefix: '@Kontak ubah alamat jadi: ' },
      { label: 'Ubah Jam Operasional', prefix: '@Kontak ubah jam buka jadi: ' }
    ]
  },
  {
    id: 'navbar',
    name: 'Navbar',
    label: '@Navbar',
    desc: 'Header Navigasi & Nama Toko',
    badge: 'Header',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    subActions: [
      { label: 'Ubah Nama Toko', prefix: '@Navbar ubah nama jadi: ' },
      { label: 'Tambah Menu Link', prefix: '@Navbar tambahkan menu navigasi: ' }
    ]
  },
  {
    id: 'footer',
    name: 'Footer',
    label: '@Footer',
    desc: 'Bagian Bawah & Hak Cipta Toko',
    badge: 'Footer',
    color: 'bg-slate-100 text-slate-700 border-slate-200',
    subActions: [
      { label: 'Ubah Hak Cipta', prefix: '@Footer ubah teks jadi: ' }
    ]
  }
];

const getInitialWelcomeMessage = (): ChatMessage => ({
  id: 'msg-welcome-init',
  sender: 'assistant',
  text: `Halo! 👋 Saya **Asisten AI NexaWeb**, copilot dengan hak akses penuh untuk mengedit seluruh kanvas website toko Anda tanpa perlu koding.

💡 **Tips Praktis:** Ketik simbol **@** untuk langsung memilih bagian yang ingin diedit (*misal: @Hero, @About, @Kontak, @Katalog*), lalu pilih judul atau sub-isinya!

✨ **Perintah yang bisa Anda lakukan otomatis:**
1. 🎯 **Target Langsung via @** *(Ketik "@" untuk memilih bagian: @Hero, @About, @Kontak)*
2. ✏️ **Ubah Judul & Nama Toko** *(misal: "@Hero ubah judul jadi Nasi Padang Pak Udin")*
3. 📱 **Ubah WhatsApp & Kontak** *(misal: "@Kontak ubah nomor WA jadi 0812-9999-8888")*
4. 📝 **Ganti Cerita & Deskripsi** *(misal: "@About gantikan isi jadi...")*
5. 🍽️ **Tambah / Hapus Menu Produk** *(misal: "@Katalog tambah menu: Rendang 35000")*
6. 🎨 **Ganti Tema & Warna** *(misal: "Ganti tema jadi kopi tradisional hangat")*
7. 🔄 **Kembalikan ke Awal** *(misal: "Kembalikan ke awal" untuk mereset susunan toko)*

Klik salah satu contoh cepat di bawah atau gunakan fitur **@** di kolom ketik! 👇`,
  timestamp: 'Otomatis',
  isWelcome: true,
  quickActions: [
    '@Hero ubah judul jadi Nasi Padang Pak Udin',
    '@Kontak ubah nomor WA jadi 0812-9999-8888',
    '@About gantikan isi jadi Cerita Dapoer Barokah sejak 2020',
    '@Katalog tambah menu: Rendang Sapi harga 35000',
    'Ganti tema jadi kopi tradisional hangat',
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

  // State untuk Fitur Autocomplete "@" Mention
  const [showMentionMenu, setShowMentionMenu] = useState(false);
  const [activeMention, setActiveMention] = useState<typeof MENTION_OPTIONS[0] | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll saat ada pesan baru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Deteksi pengetikan simbol "@"
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputPrompt(val);

    // Cek apakah ada kata yang berawalan "@"
    const lastWord = val.split(' ').pop() || '';
    if (lastWord.startsWith('@')) {
      setShowMentionMenu(true);
    } else {
      setShowMentionMenu(false);
    }
  };

  // Pilih Bagian dari Menu "@"
  const handleSelectMention = (option: typeof MENTION_OPTIONS[0]) => {
    // Gantikan token '@...' terakhir dengan '@NamaBagian '
    const words = inputPrompt.split(' ');
    words.pop();
    const prefix = words.length > 0 ? words.join(' ') + ' ' : '';
    const newText = `${prefix}${option.label} `;

    setInputPrompt(newText);
    setShowMentionMenu(false);
    setActiveMention(option);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  // Pilih Sub-Aksi (misal: Ubah Judul, Ubah Sub-Judul, Ubah Isi)
  const handleSelectSubAction = (subActionPrefix: string) => {
    setInputPrompt(subActionPrefix);
    setActiveMention(null);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

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
    setShowMentionMenu(false);
    setActiveMention(null);
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
            onClick={() => {
              setMessages([getInitialWelcomeMessage()]);
              setInputPrompt('');
              setShowMentionMenu(false);
              setActiveMention(null);
            }}
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
                    <Sparkles className="w-3 h-3 text-blue-600" /> Contoh Perintah Langsung:
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

      {/* Area Dock Input Prompt dengan Fitur Autocomplete "@" Mention */}
      <div className="p-3 border-t border-slate-200 bg-white relative">
        
        {/* POPOVER 1: PILIHAN BAGIAN DENGAN SIMBOL "@" */}
        {showMentionMenu && (
          <div className="absolute bottom-full left-3 right-3 mb-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2.5 z-30 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="flex items-center justify-between px-2 py-1 mb-1.5 border-b border-slate-100">
              <span className="text-[11px] font-extrabold text-slate-800 flex items-center gap-1.5">
                <AtSign className="w-3.5 h-3.5 text-blue-600" />
                <span>Pilih Bagian yang Ingin Diubah:</span>
              </span>
              <button
                type="button"
                onClick={() => setShowMentionMenu(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-1 max-h-56 overflow-y-auto">
              {MENTION_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectMention(opt)}
                  className="w-full text-left p-2 rounded-xl hover:bg-slate-50 transition flex items-center justify-between group border border-transparent hover:border-slate-200"
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-black px-2 py-0.5 rounded-lg border ${opt.color}`}>
                      {opt.label}
                    </span>
                    <span className="text-xs text-slate-700 font-medium group-hover:text-slate-900">
                      {opt.desc}
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* POPOVER 2: PILIHAN SUB-AKSI (JUDUL / SUBJUDUL / ISI KONTEN) SETELAH MEMILIH "@" */}
        {activeMention && (
          <div className="mb-2 p-2 bg-blue-50/90 border border-blue-200 rounded-xl animate-in fade-in slide-in-from-bottom-1 duration-150">
            <div className="flex items-center justify-between mb-1.5 px-1">
              <span className="text-[10px] font-bold text-blue-900">
                Pilih target perubahan untuk <strong>{activeMention.label}</strong>:
              </span>
              <button
                type="button"
                onClick={() => setActiveMention(null)}
                className="text-[10px] text-blue-600 hover:underline"
              >
                Tutup
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {activeMention.subActions.map((sub) => (
                <button
                  key={sub.label}
                  type="button"
                  onClick={() => handleSelectSubAction(sub.prefix)}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-600 text-blue-900 hover:text-white border border-blue-200 hover:border-blue-600 text-[11px] font-bold transition shadow-2xs"
                >
                  {sub.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Form Input Prompt Utama */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center"
        >
          {/* Tombol Cepat Pemicu "@" */}
          <button
            type="button"
            onClick={() => {
              if (!showMentionMenu) {
                if (!inputPrompt.includes('@')) {
                  setInputPrompt((prev) => (prev ? prev + ' @' : '@'));
                }
                setShowMentionMenu(true);
              } else {
                setShowMentionMenu(false);
              }
            }}
            className={`absolute left-2 p-1 rounded-lg transition ${
              showMentionMenu
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-blue-600 hover:bg-slate-100'
            }`}
            title="Sebut Bagian dengan @"
          >
            <AtSign className="w-3.5 h-3.5" />
          </button>

          <input
            ref={inputRef}
            type="text"
            value={inputPrompt}
            onChange={handleInputChange}
            placeholder="Ketik instruksi (atau ketik '@' untuk pilih bagian)..."
            className="w-full pl-8 pr-20 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition"
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
