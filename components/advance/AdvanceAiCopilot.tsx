'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  RotateCcw,
  Bot,
  User,
  Zap,
  KeyRound,
  Check,
  Wand2
} from 'lucide-react';
import {
  AdvanceCanvas,
  AdvanceAiPlan,
  AiCursorState
} from '@/lib/advanceTypes';

export interface AdvanceAiCopilotProps {
  isOpen: boolean;
  onClose: () => void;
  activeCanvas: AdvanceCanvas;
  allCanvases: AdvanceCanvas[];
  aiCursor: AiCursorState | null;
  onExecuteAiPlan: (plan: AdvanceAiPlan) => Promise<void>;
  onSkipAiAnimation: () => void;
}

interface ChatMsg {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  isWelcome?: boolean;
  badge?: string;
  quickActions?: string[];
}

export default function AdvanceAiCopilot({
  isOpen,
  onClose,
  activeCanvas,
  allCanvases,
  aiCursor,
  onExecuteAiPlan,
  onSkipAiAnimation
}: AdvanceAiCopilotProps) {
  const getInitialWelcomeMessage = (): ChatMsg => ({
    id: 'msg-welcome',
    sender: 'ai',
    text: 'Halo! Saya **NexaWeb AI Architect** untuk Advance Mode. Ketik saja website atau elemen apapun yang Anda inginkan — saya akan langsung merancang multi-halaman secara otomatis dengan animasi kursor live di kanvas!',
    timestamp: 'Baru saja',
    isWelcome: true,
    quickActions: [
      'Buatkan website UMKM penjualan donat 4 produk, ada about dan tombol kontak nomer HP',
      'Buatkan website Kedai Kopi Artisan 4 menu lengkap + tentang kami & kontak WA',
      'Buatkan website Toko Fashion Butik 4 produk modern & elegan',
      'Tambahkan bagian kontak nomor HP 0812-8888-9999 di bawah',
      'Ubah warna latar kanvas jadi dark mode elegan'
    ]
  });

  const [messages, setMessages] = useState<ChatMsg[]>([getInitialWelcomeMessage()]);
  const [inputVal, setInputVal] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [keySaved, setKeySaved] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gemini_api_key') || '';
      setApiKeyInput(saved);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking, aiCursor?.currentStep]);

  if (!isOpen) return null;

  const isBusy = isThinking || Boolean(aiCursor?.isActive);

  const handleSaveApiKey = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('gemini_api_key', apiKeyInput.trim());
      setKeySaved(true);
      setTimeout(() => {
        setKeySaved(false);
        setShowKeyInput(false);
      }, 900);
    }
  };

  const handleSend = async (userPrompt?: string) => {
    const textToSend = (userPrompt || inputVal).trim();
    if (!textToSend || isBusy) return;

    setInputVal('');
    const newMsg: ChatMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, newMsg]);
    setIsThinking(true);

    try {
      const savedKey = typeof window !== 'undefined' ? localStorage.getItem('gemini_api_key') || '' : '';

      const res = await fetch('/api/advance-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          activeCanvas,
          allCanvases,
          apiKey: savedKey
        })
      });

      if (!res.ok) {
        throw new Error('Gagal menghubungi layanan AI');
      }

      const plan: AdvanceAiPlan = await res.json();
      setIsThinking(false);

      // Jalankan rencana AI secara live dengan animasi kursor di kanvas!
      if (plan.actions && plan.actions.length > 0) {
        await onExecuteAiPlan(plan);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: plan.reply || 'Selesai! Semua elemen telah ditambahkan ke kanvas.',
          badge: plan.source === 'gemini' ? 'Gemini 2.0 Flash' : 'NexaWeb AI Architect',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error(err);
      setIsThinking(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: 'Maaf, terjadi kendala saat memproses permintaan AI. Silakan coba kirim ulang.',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, i) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <span key={i} className="block mb-0.5 last:mb-0">
          {parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={j} className="font-extrabold text-slate-900">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return <React.Fragment key={j}>{part}</React.Fragment>;
          })}
        </span>
      );
    });
  };

  return (
    <aside
      aria-label="Panel Asisten Gemini AI"
      className="w-80 h-full shrink-0 bg-white border-l border-slate-200/90 flex flex-col overflow-hidden shadow-xl z-20"
    >
      {/* Header Panel AI */}
      <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-blue-50/50">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-600/25">
            <Wand2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-black text-slate-900">NexaWeb AI Pro</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[10px] text-slate-500 font-semibold">Auto-Build Multi-Kanvas</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowKeyInput(!showKeyInput)}
            className={`p-1.5 rounded-lg transition ${
              showKeyInput || apiKeyInput
                ? 'bg-blue-100 text-blue-700'
                : 'hover:bg-slate-200/70 text-slate-400 hover:text-slate-700'
            }`}
            title="Opsional: Hubungkan Gemini API Key Sendiri"
          >
            <KeyRound className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setMessages([getInitialWelcomeMessage()])}
            disabled={isBusy}
            className="p-1.5 rounded-lg hover:bg-slate-200/70 text-slate-400 hover:text-slate-700 transition disabled:opacity-40"
            title="Reset Percakapan"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200/70 text-slate-400 hover:text-slate-700 transition"
            title="Tutup Panel AI"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Optional Gemini API Key Drawer */}
      {showKeyInput && (
        <div className="p-3 bg-blue-50/70 border-b border-blue-100 space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-blue-900 uppercase tracking-wider">
              Gemini API Key (Opsional)
            </span>
            <span className="text-[10px] text-blue-600 font-semibold">
              {apiKeyInput ? 'Terhubung' : 'Mode Pintar Aktif'}
            </span>
          </div>
          <div className="flex gap-1.5">
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="AIzaSy... (opsional)"
              className="flex-1 px-2.5 py-1.5 text-[11px] bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleSaveApiKey}
              className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold flex items-center gap-1 transition"
            >
              {keySaved ? <Check className="w-3.5 h-3.5" /> : 'Simpan'}
            </button>
          </div>
          <p className="text-[10px] text-slate-500 leading-snug">
            Tanpa API Key pun AI tetap bisa merakit website lengkap. Masukkan Gemini Key jika ingin kustomisasi LLM tak terbatas.
          </p>
        </div>
      )}

      {/* Riwayat Pesan */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 bg-slate-50/40">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              {msg.sender === 'ai' ? (
                <div className="flex items-center gap-1 text-[10px] font-bold text-blue-700">
                  <Bot className="w-3 h-3" /> {msg.badge || 'NexaWeb AI'}
                </div>
              ) : (
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                  Anda <User className="w-3 h-3" />
                </div>
              )}
              <span className="text-[9px] text-slate-400">{msg.timestamp}</span>
            </div>

            <div
              className={`max-w-[94%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-2xs ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-sm font-medium'
                  : 'bg-white border border-slate-200/80 text-slate-700 rounded-tl-sm'
              }`}
            >
              {msg.sender === 'ai' ? renderFormattedText(msg.text) : msg.text}
            </div>

            {/* Quick Action Pills */}
            {msg.quickActions && msg.quickActions.length > 0 && (
              <div className="mt-2.5 flex flex-col gap-1.5 w-full">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-1">
                  Coba Perintah Super AI:
                </span>
                {msg.quickActions.map((act, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleSend(act)}
                    className="text-left px-3 py-2 rounded-xl bg-white hover:bg-blue-50 border border-slate-200/90 hover:border-blue-300 text-slate-700 hover:text-blue-700 text-[11px] font-semibold flex items-start gap-2 transition group shadow-2xs disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                    <span className="leading-snug">{act}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Thinking indicator */}
        {isThinking && (
          <div className="flex items-start gap-2">
            <div className="bg-white border border-blue-200 rounded-2xl rounded-tl-sm px-3.5 py-2.5 shadow-xs flex items-center gap-2 text-xs text-blue-700 font-bold">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
              <span>Merancang struktur & layout website...</span>
            </div>
          </div>
        )}

        {/* Live AI Cursor Working Card */}
        {aiCursor?.isActive && (
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-3.5 shadow-lg space-y-2.5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-extrabold">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                <span>AI Sedang Bekerja di Kanvas</span>
              </div>
              <span className="text-[10px] font-mono font-bold bg-white/20 px-2 py-0.5 rounded-full">
                {aiCursor.currentStep}/{aiCursor.totalSteps}
              </span>
            </div>

            <p className="text-[11px] text-blue-100 font-medium truncate">
              {aiCursor.label}
            </p>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-300 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.round((aiCursor.currentStep / Math.max(1, aiCursor.totalSteps)) * 100)}%`
                }}
              />
            </div>

            <button
              type="button"
              onClick={onSkipAiAnimation}
              className="w-full py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Selesaikan Instan</span>
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <div className="relative flex items-end gap-1.5">
          <textarea
            rows={2}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={isBusy}
            placeholder="Contoh: Buatkan website UMKM donat 4 produk, ada about & tombol kontak HP..."
            className="flex-1 pl-3 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition resize-none disabled:opacity-60"
          />
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!inputVal.trim() || isBusy}
            className="p-2.5 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white transition active:scale-95 shrink-0 shadow-sm"
            title="Kirim Perintah AI"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-slate-400 mt-1.5 text-center font-medium">
          Enter untuk kirim • AI otomatis menyusun elemen di kanvas
        </p>
      </div>
    </aside>
  );
}
