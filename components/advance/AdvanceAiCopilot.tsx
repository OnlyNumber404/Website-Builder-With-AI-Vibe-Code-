'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  RotateCcw,
  Bot,
  User,
  ArrowRight,
  Layers,
  Palette,
  ShoppingBag,
  MousePointerClick,
  Type
} from 'lucide-react';
import {
  AdvanceCanvas,
  CanvasElement,
  CANVAS_DEFAULT_WIDTH,
  CANVAS_DEFAULT_HEIGHT
} from '@/lib/advanceTypes';

export interface AdvanceAiCopilotProps {
  isOpen: boolean;
  onClose: () => void;
  activeCanvas: AdvanceCanvas;
  allCanvases: AdvanceCanvas[];
  onAddElement: (element: Omit<CanvasElement, 'id'>) => void;
  onUpdateCanvasBackground: (canvasId: string, bg: { color?: string; image?: string }) => void;
  onAddNewCanvas: () => void;
}

interface ChatMsg {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  isWelcome?: boolean;
  quickActions?: string[];
}

export default function AdvanceAiCopilot({
  isOpen,
  onClose,
  activeCanvas,
  allCanvases,
  onAddElement,
  onUpdateCanvasBackground,
  onAddNewCanvas
}: AdvanceAiCopilotProps) {
  const getInitialWelcomeMessage = (): ChatMsg => ({
    id: 'msg-welcome',
    sender: 'ai',
    text: 'Halo! Saya asisten Gemini AI untuk Advance Designer Mode. Saya siap membantu merakitkan teks headline, membuat kartu produk, memasang tombol WhatsApp, mengganti latar kanvas, hingga menambah halaman baru.',
    timestamp: 'Baru saja',
    isWelcome: true,
    quickActions: [
      'Tambahkan judul hero menarik untuk kuliner',
      'Tambahkan tombol WhatsApp untuk pemesanan',
      'Tambahkan kartu produk terlaris dengan foto',
      'Ubah warna latar kanvas jadi krem hangat',
      'Tambahkan navbar dengan menu lengkap',
      'Tambah lembar kanvas baru'
    ]
  });

  const [messages, setMessages] = useState<ChatMsg[]>([getInitialWelcomeMessage()]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSend = async (userPrompt?: string) => {
    const textToSend = (userPrompt || inputVal).trim();
    if (!textToSend || isLoading) return;

    setInputVal('');
    const newMsg: ChatMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, newMsg]);
    setIsLoading(true);

    try {
      const lower = textToSend.toLowerCase();
      let reply = '';

      // 1. Tambah Kanvas Baru
      if (
        lower.includes('tambah kanvas') ||
        lower.includes('tambah halaman') ||
        lower.includes('lembar baru') ||
        lower.includes('kanvas baru')
      ) {
        onAddNewCanvas();
        reply = `Siap! Lembar kanvas baru (Kanvas ${allCanvases.length + 1}) berhasil ditambahkan ke urutan bawah.`;
      }
      // 2. Ganti Warna Latar Kanvas
      else if (
        lower.includes('warna latar') ||
        lower.includes('background') ||
        lower.includes('ganti warna') ||
        lower.includes('ubah warna')
      ) {
        let color = '#f8fafc';
        let colorName = 'abu-abu lembut';
        if (lower.includes('krem') || lower.includes('warm')) {
          color = '#fffbeb';
          colorName = 'krem hangat';
        } else if (lower.includes('biru')) {
          color = '#eff6ff';
          colorName = 'biru lembut';
        } else if (lower.includes('hijau') || lower.includes('mint')) {
          color = '#ecfdf5';
          colorName = 'hijau mint';
        } else if (lower.includes('ungu')) {
          color = '#f5f3ff';
          colorName = 'ungu lavender';
        } else if (lower.includes('gelap') || lower.includes('hitam') || lower.includes('dark')) {
          color = '#0f172a';
          colorName = 'slate gelap premium';
        } else if (lower.includes('putih')) {
          color = '#ffffff';
          colorName = 'putih bersih';
        }
        onUpdateCanvasBackground(activeCanvas.id, { color });
        reply = `Beres! Warna latar untuk ${activeCanvas.title || `Kanvas ${activeCanvas.pageIndex}`} telah diubah menjadi ${colorName} (${color}).`;
      }
      // 3. Tambah Tombol WhatsApp / CTA
      else if (lower.includes('tombol') || lower.includes('button') || lower.includes('cta')) {
        const isWa = lower.includes('wa') || lower.includes('whatsapp') || lower.includes('pesan');
        onAddElement({
          category: 'BUTTON',
          posX: Math.round((CANVAS_DEFAULT_WIDTH - 220) / 2),
          posY: Math.round((CANVAS_DEFAULT_HEIGHT - 50) / 2) + 60,
          width: 220,
          height: 52,
          color: isWa ? '#059669' : '#2563eb',
          properties: {
            text: isWa ? 'Hubungi via WhatsApp' : 'Pelajari Selengkapnya',
            buttonVariant: 'pill',
            buttonTextColor: '#ffffff',
            fontSize: 15,
            fontWeight: 'bold',
            linkType: isWa ? 'wa' : 'url',
            waNumber: '081234567890',
            waMessage: 'Halo, saya ingin menanyakan informasi produk Anda.'
          }
        });
        reply = `Tombol "${isWa ? 'Hubungi via WhatsApp' : 'Pelajari Selengkapnya'}" berhasil ditempatkan di tengah kanvas aktif.`;
      }
      // 4. Tambah Kartu Produk
      else if (lower.includes('produk') || lower.includes('menu') || lower.includes('kartu')) {
        onAddElement({
          category: 'PRODUCT',
          posX: Math.round((CANVAS_DEFAULT_WIDTH - 320) / 2),
          posY: Math.round((CANVAS_DEFAULT_HEIGHT - 400) / 2),
          width: 320,
          height: 400,
          color: '#ffffff',
          properties: {
            cardData: {
              title: 'Paket Spesial Cita Rasa',
              description: 'Olahan rempah tradisional dengan standar higienis dan porsi memuaskan.',
              image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
              price: 'Rp 28.000',
              buttonText: 'Pesan Sekarang',
              buttonLink: 'https://wa.me/6281234567890'
            },
            buttonVariant: 'rounded',
            buttonTextColor: '#ffffff'
          }
        });
        reply = 'Kartu produk terpadu 4 elemen (Slot Foto, Judul, Deskripsi/Harga, dan Tombol CTA) telah ditambahkan di tengah kanvas!';
      }
      // 5. Tambah Navbar
      else if (lower.includes('navbar') || lower.includes('navigasi') || lower.includes('menu atas')) {
        onAddElement({
          category: 'NAV',
          posX: Math.round((CANVAS_DEFAULT_WIDTH - 940) / 2),
          posY: 20,
          width: 940,
          height: 64,
          color: '#ffffff',
          properties: {
            navBrand: 'Dapoer Berkah',
            navVariant: 'classic',
            color: '#0f172a',
            navItems: [
              { id: 'nav-1', label: 'Beranda', targetCanvasId: allCanvases[0]?.id },
              { id: 'nav-2', label: 'Katalog Menu', targetCanvasId: allCanvases[1]?.id || allCanvases[0]?.id },
              { id: 'nav-3', label: 'Tentang Kami', targetCanvasId: allCanvases[2]?.id || allCanvases[0]?.id },
              { id: 'nav-4', label: 'Kontak Toko', targetCanvasId: allCanvases[allCanvases.length - 1]?.id }
            ]
          }
        });
        reply = 'Bilah navigasi (Navbar) dengan menu terhubung telah dipasang di bagian atas kanvas aktif.';
      }
      // 6. Default: Tambah Teks Headline / Judul
      else {
        onAddElement({
          category: 'TEXT',
          posX: Math.round((CANVAS_DEFAULT_WIDTH - 540) / 2),
          posY: Math.round((CANVAS_DEFAULT_HEIGHT - 70) / 2) - 40,
          width: 540,
          height: 70,
          color: '#0f172a',
          properties: {
            text: textToSend.length > 5 && !lower.includes('tambah') ? textToSend : 'Solusi Terbaik Untuk Kebutuhan Anda',
            fontSize: 38,
            fontWeight: 'extrabold',
            font: 'Inter, sans-serif',
            textAlign: 'center'
          }
        });
        reply = 'Teks judul berhasil dibuat dan ditempatkan di tengah kanvas aktif.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: reply,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: 'Maaf, terjadi kendala saat memproses permintaan. Silakan coba kembali.',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <aside
      aria-label="Panel Asisten Gemini AI"
      className="w-80 h-full shrink-0 bg-white border-l border-slate-200/90 flex flex-col overflow-hidden shadow-xl z-20"
    >
      {/* Header Panel AI (Mirip Persis Mode Template) */}
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
            <p className="text-[10px] text-slate-500 font-medium">Copilot Canvas Advance</p>
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

              {/* Jika pesan sambutan, tampilkan tombol aksi cepat siap pakai */}
              {m.isWelcome && m.quickActions && (
                <div className="w-full mt-3 space-y-2 pl-1 pr-1">
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
              <span className="font-medium">AI sedang merakit elemen kanvas Anda...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Status Bar di Bawah */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px]">
        <div className="flex items-center gap-1.5 text-slate-600">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="font-semibold">Gemini 1.5 Flash Aktif</span>
        </div>
        <span className="text-blue-600 font-bold">Advance Mode</span>
      </div>

      {/* Area Dock Input Prompt */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center gap-1.5"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ketik instruksi untuk kanvas..."
            className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || isLoading}
            className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition shadow-sm shrink-0"
            title="Kirim Instruksi"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </aside>
  );
}
