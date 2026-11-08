'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowLeft,
  Layout,
  Palette,
  Layers,
  Plus,
  UtensilsCrossed,
  RotateCcw,
  KeyRound,
  Eye,
  EyeOff,
  GripVertical,
  Trash2,
  Edit3,
  ChevronUp,
  ChevronDown,
  Navigation,
  MessageCircle,
  Phone,
  MapPin,
  Clock,
  HeartHandshake,
  Flame,
  Check,
  PackageOpen,
  Coffee,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  SectionItem,
  SectionType,
  ProductItem,
  DesignTheme,
  DesignTemplate,
  NavLinkItem
} from '@/lib/types';
import {
  INITIAL_SECTIONS,
  INITIAL_PRODUCTS,
  INITIAL_PALETTE_ITEMS,
  DEFAULT_THEMES,
  DEFAULT_TEMPLATES
} from '@/lib/defaultData';
import AiCopilotSidebar from '@/components/studio/AiCopilotSidebar';
import SectionModals from '@/components/studio/SectionModals';

export default function StudioPage() {
  // 1. Data Store State
  const [sections, setSections] = useState<SectionItem[]>(INITIAL_SECTIONS);
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [paletteItems, setPaletteItems] = useState<ProductItem[]>(INITIAL_PALETTE_ITEMS);
  const [activeTheme, setActiveTheme] = useState<DesignTheme>(DEFAULT_THEMES[0]);
  const [activeDesign, setActiveDesign] = useState<DesignTemplate>(DEFAULT_TEMPLATES[0]);

  // 2. Editor & UI Control State
  const [isEditorMode, setIsEditorMode] = useState(true);
  const [isPaletteOpen, setIsPaletteOpen] = useState(true);
  const [isAiChatOpen, setIsAiChatOpen] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<'items' | 'sections'>('items');
  const [highlightedSectionId, setHighlightedSectionId] = useState<string | null>(null);

  // 3. Form Buat Item Sendiri di Sidebar
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Makanan Utama');

  // 4. Modal States
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<SectionItem | null>(null);
  const [isManageMenuOpen, setIsManageMenuOpen] = useState(false);
  const [isDesignModalOpen, setIsDesignModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  // Cek API Key dari localStorage saat mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const key = localStorage.getItem('gemini_api_key');
      setHasApiKey(Boolean(key && key.trim()));
    }
  }, []);

  // Perhitungan Label Seragam (e.g. Hero #1, Hero #2, About #1, About #2)
  const getSectionUniformLabel = (section: SectionItem) => {
    const sameType = sections.filter((s) => s.type === section.type);
    const index = sameType.findIndex((s) => s.id === section.id) + 1;
    const typeNames: Record<SectionType, string> = {
      NAVBAR: 'Navbar Navigasi',
      HERO: 'Hero',
      ABOUT: 'About',
      CATALOG: 'Katalog Menu',
      CONTACT: 'Kontak WhatsApp',
      FOOTER: 'Footer'
    };
    return `${typeNames[section.type] || section.type} #${index}`;
  };

  // Scroll & Sorot Bagian Kanvas
  const handleHighlightSection = (secId: string) => {
    setHighlightedSectionId(secId);
    const el = document.getElementById(`section-${secId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setTimeout(() => {
      setHighlightedSectionId(null);
    }, 2000);
  };

  // Drag & Drop Handler untuk Item Produk
  const handleDragStart = (e: React.DragEvent, item: ProductItem) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(item));
  };

  const handleDropOnCatalog = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const raw = e.dataTransfer.getData('text/plain');
      if (!raw) return;
      const item: ProductItem = JSON.parse(raw);
      addProductToCanvas(item);
    } catch (err) {
      console.error('Error drop item:', err);
    }
  };

  const addProductToCanvas = (item: ProductItem) => {
    const newProd: ProductItem = {
      id: 'prod-' + Date.now(),
      name: item.name,
      price: item.price,
      category: item.category
    };
    setProducts((prev) => [...prev, newProd]);
    try {
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
    } catch {}
  };

  // Simpan Item Baru ke Palet
  const handleSaveItemToPalette = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    const priceNum = parseInt(newItemPrice.replace(/\D/g, ''), 10) || 15000;
    const newItem: ProductItem = {
      id: 'pal-' + Date.now(),
      name: newItemName.trim(),
      price: priceNum,
      category: newItemCategory
    };
    setPaletteItems((prev) => [newItem, ...prev]);
    // Juga langsung bisa dimasukkan ke katalog bila diinginkan
    addProductToCanvas(newItem);
    setNewItemName('');
    setNewItemPrice('');
  };

  // Tambah Preset Section dari Sidebar
  const handleAddPresetSection = (type: SectionType) => {
    const newSec: SectionItem = {
      id: 'sec-' + Date.now(),
      type,
      title: type === 'HERO' ? 'Penawaran Spesial Terbaru' : `Bagian ${type}`,
      subtitle: type === 'HERO' ? 'Sajian lezat siap antar untuk Anda' : '',
      content: type === 'CONTACT' ? 'WhatsApp: 0812-3456-7890 | Alamat: Toko Kami | Buka: 08.00 - 20.00 WIB' : '',
      waMessage: type === 'CONTACT' ? 'Halo, saya ingin memesan menu dari website Anda.' : undefined,
      orderIndex: sections.length + 1
    };
    setSections((prev) => [...prev, newSec]);
  };

  // Reorder Sections
  const handleMoveSection = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;
    const updated = [...sections];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    // update orderIndex
    updated.forEach((s, i) => {
      s.orderIndex = i;
    });
    setSections(updated);
  };

  // Delete Section
  const handleDeleteSection = (id: string) => {
    if (sections.length <= 1) {
      alert('Minimal harus ada 1 bagian di kanvas website.');
      return;
    }
    setSections((prev) => prev.filter((s) => s.id !== id));
  };

  // Eksekusi Tindakan AI (Action Dispatcher Lengkap: Reset, Judul, Isi, Menu, Nomor WA, Alamat, Navigasi, Tema, Template)
  const handleExecuteAiAction = (action: any) => {
    if (!action) return;

    // 1. KEMBALIKAN KE AWAL / RESET KANVAS
    if (action.type === 'RESET_CANVAS') {
      setSections(INITIAL_SECTIONS);
      setProducts(INITIAL_PRODUCTS);
      setPaletteItems(INITIAL_PALETTE_ITEMS);
      setActiveTheme(DEFAULT_THEMES[0]);
      setActiveDesign(DEFAULT_TEMPLATES[0]);
      setTimeout(() => {
        handleHighlightSection(INITIAL_SECTIONS[0]?.id || 'sec-nav-1');
      }, 100);
      return;
    }

    // 2. TAMBAH PRODUK / MENU BARU
    if (action.type === 'ADD_PRODUCT' && action.payload) {
      const p = action.payload;
      addProductToCanvas({
        id: 'ai-prod-' + Date.now(),
        name: p.name || 'Menu Spesial',
        price: p.price || 15000,
        category: p.category || 'Makanan Utama'
      });
      // Efek confetti ceria saat produk berhasil ditambah
      try {
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
      } catch {}
      return;
    }

    // 3. HAPUS PRODUK / MENU
    if (action.type === 'DELETE_PRODUCT' && action.payload?.query) {
      const q = action.payload.query.toLowerCase().trim();
      setProducts((prev) => prev.filter((item) => !item.name.toLowerCase().includes(q)));
      setPaletteItems((prev) => prev.filter((item) => !item.name.toLowerCase().includes(q)));
      return;
    }

    // 4. GANTI GAYA DESAIN / TEMPLATE
    if (action.type === 'SET_DESIGN' && action.payload?.templateId) {
      const tid = action.payload.templateId;
      const tmpl = DEFAULT_TEMPLATES.find((t) => t.id === tid || t.name.toLowerCase().includes(tid.toLowerCase()));
      if (tmpl) {
        setActiveDesign(tmpl);
        if (tmpl.themeId) {
          const th = DEFAULT_THEMES.find((t) => t.id === tmpl.themeId);
          if (th) setActiveTheme(th);
        }
      }
      return;
    }

    // 5. GANTI TEMA / WARNA
    if (action.type === 'SET_THEME' && action.payload?.themeId) {
      const found = DEFAULT_THEMES.find((t) => t.id === action.payload.themeId);
      if (found) setActiveTheme(found);
      return;
    }

    // 6. TAMBAH BAGIAN BARU
    if (action.type === 'ADD_SECTION' && action.payload) {
      const p = action.payload;
      const newSec: SectionItem = {
        id: 'sec-ai-' + Date.now(),
        type: p.type || 'HERO',
        title: p.title || 'Bagian Baru',
        subtitle: p.subtitle || '',
        content: p.content || '',
        waMessage: p.waMessage,
        orderIndex: sections.length + 1
      };
      setSections((prev) => [...prev, newSec]);
      handleHighlightSection(newSec.id);
      return;
    }

    // 7. HAPUS BAGIAN
    if (action.type === 'DELETE_SECTION' && action.payload) {
      const p = action.payload;
      setSections((prev) =>
        prev.filter((s) => (p.id ? s.id !== p.id : p.sectionType ? s.type !== p.sectionType : true))
      );
      return;
    }

    // 8. UPDATE BAGIAN (JUDUL, ISI, NOMOR WA, ALAMAT, JAM BUKA, PESAN WA)
    if (action.type === 'UPDATE_SECTION' && action.payload) {
      const p = action.payload;
      let targetSecId: string | null = null;

      setSections((prev) => {
        let idx = -1;
        if (p.id) {
          idx = prev.findIndex((s) => s.id === p.id);
        }
        if (idx === -1 && p.sectionType) {
          idx = prev.findIndex((s) => s.type === p.sectionType);
        }
        if (idx === -1 && p.type) {
          idx = prev.findIndex((s) => s.type === p.type);
        }
        // Fallback default ke HERO jika tidak spesifik
        if (idx === -1) {
          idx = prev.findIndex((s) => s.type === 'HERO');
        }
        if (idx === -1 && prev.length > 0) {
          idx = 0;
        }

        if (idx === -1) return prev;

        const updated = [...prev];
        const cur = updated[idx];

        let newContent = p.content !== undefined && p.content.trim() ? p.content.trim() : cur.content;

        // Jika ada perubahan phone, address, atau hours untuk CONTACT
        if (cur.type === 'CONTACT' && (p.phone || p.address || p.hours)) {
          let phone = p.phone;
          let address = p.address;
          let hours = p.hours;
          let waMsg = p.waMessage;

          if (!phone) {
            const m = cur.content.match(/(?:WhatsApp|WA|Telepon|Telp|No\.?):\s*([^|]+)/i);
            if (m) phone = m[1].trim();
          }
          if (!address) {
            const m = cur.content.match(/(?:Alamat|Lokasi):\s*([^|]+)/i);
            if (m) address = m[1].trim();
          }
          if (!hours) {
            const m = cur.content.match(/(?:Buka|Operasional|Jam):\s*([^|]+)/i);
            if (m) hours = m[1].trim();
          }
          if (!waMsg) {
            const m = cur.content.match(/(?:Pesan(?:\s*WA)?|Template):\s*([^|]+)/i);
            if (m) waMsg = m[1].trim();
          }

          const parts = [];
          if (phone) parts.push(`WhatsApp: ${phone}`);
          if (address) parts.push(`Alamat: ${address}`);
          if (hours) parts.push(`Buka: ${hours}`);
          if (waMsg) parts.push(`Pesan: ${waMsg}`);
          newContent = parts.join(' | ');
        }

        updated[idx] = {
          ...cur,
          title: p.title !== undefined && p.title.trim() ? p.title.trim() : cur.title,
          subtitle: p.subtitle !== undefined && p.subtitle.trim() ? p.subtitle.trim() : cur.subtitle,
          content: newContent,
          waMessage: p.waMessage !== undefined && p.waMessage.trim() ? p.waMessage.trim() : cur.waMessage
        };
        targetSecId = updated[idx].id;
        return updated;
      });

      // Gulirkan otomatis dan sorot bagian kanvas yang baru diperbarui
      if (targetSecId) {
        setTimeout(() => {
          handleHighlightSection(targetSecId!);
        }, 100);
      }
      return;
    }

    // 9. UPDATE TAUTAN NAVIGASI
    if (action.type === 'UPDATE_NAV_LINKS' && action.payload) {
      const newLinks = action.payload.links;
      if (Array.isArray(newLinks)) {
        let navId: string | null = null;
        setSections((prev) =>
          prev.map((s) => {
            if (s.type === 'NAVBAR') {
              navId = s.id;
              return { ...s, content: JSON.stringify(newLinks) };
            }
            return s;
          })
        );
        if (navId) {
          setTimeout(() => {
            handleHighlightSection(navId!);
          }, 100);
        }
      }
      return;
    }
  };

  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden flex flex-col bg-slate-100 text-slate-900 font-sans select-none z-0">
      
      {/* 1. TOP STUDIO NAVIGATION BAR */}
      <header className="h-[68px] w-full bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0 z-30 shadow-xs">
        
        {/* Kiri: Brand & Kembali ke Home */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
            title="Kembali ke Beranda"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs font-bold hidden sm:inline">Kembali</span>
          </Link>

          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 leading-none">
                NexaWeb<span className="text-blue-600">.ai</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                Studio Kanvas
              </span>
            </div>
          </div>
        </div>

        {/* Tengah: Tombol Aksi Alat Editor */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1">
          {/* Toggle Palet Samping */}
          <button
            type="button"
            onClick={() => setIsPaletteOpen(!isPaletteOpen)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
              isPaletteOpen
                ? 'bg-slate-100 border-slate-300 text-slate-900'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden md:inline">Palet Item</span>
          </button>

          {/* Toggle Preview Fullscreen */}
          <button
            type="button"
            onClick={() => setIsEditorMode(!isEditorMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
              !isEditorMode
                ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {!isEditorMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-blue-600" />}
            <span className="hidden sm:inline">{isEditorMode ? 'Preview Fullscreen' : 'Mode Edit'}</span>
          </button>

          {/* Gaya Desain (Dengan Lencana Rekomendasi) */}
          <button
            type="button"
            onClick={() => setIsDesignModalOpen(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 shadow-2xs"
          >
            <Layout className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden lg:inline">Gaya Desain</span>
            <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
              ★ Rekomendasi
            </span>
          </button>

          {/* Warna & Font */}
          <button
            type="button"
            onClick={() => setIsThemeModalOpen(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
          >
            <Palette className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden lg:inline">Warna & Font</span>
          </button>

          {/* + Tambah Bagian (CTA Utama) */}
          <button
            type="button"
            onClick={() => setIsAddSectionOpen(true)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold bg-slate-900 hover:bg-slate-800 text-white shadow transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-blue-400" />
            <span>Tambah Bagian</span>
          </button>

          {/* Kelola Menu */}
          <button
            type="button"
            onClick={() => setIsManageMenuOpen(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
          >
            <UtensilsCrossed className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden xl:inline">Kelola Menu</span>
          </button>

          {/* Reset Demo */}
          <button
            type="button"
            onClick={() => {
              if (confirm('Apakah Anda yakin ingin mereset susunan toko kembali ke contoh awal?')) {
                setSections(INITIAL_SECTIONS);
                setProducts(INITIAL_PRODUCTS);
                setPaletteItems(INITIAL_PALETTE_ITEMS);
                setActiveTheme(DEFAULT_THEMES[0]);
                setActiveDesign(DEFAULT_TEMPLATES[0]);
              }
            }}
            title="Reset ke Toko Default"
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* API Key Modal Button */}
          <button
            type="button"
            onClick={() => setIsApiKeyModalOpen(true)}
            className={`p-1.5 rounded-lg border transition ${
              hasApiKey
                ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
                : 'text-slate-500 bg-white border-slate-200 hover:bg-slate-50'
            }`}
            title={hasApiKey ? 'Google AI Studio API Key Terhubung' : 'Pasang Google AI Studio API Key'}
          >
            <KeyRound className="w-4 h-4" />
          </button>
        </div>

        {/* Kanan: Buka / Tutup Chat AI */}
        <div>
          <button
            type="button"
            onClick={() => setIsAiChatOpen(!isAiChatOpen)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
              isAiChatOpen
                ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">{isAiChatOpen ? 'Tutup AI' : 'Buka AI'}</span>
          </button>
        </div>

      </header>

      {/* 2. BODY BUILDER 3-PANEL (SIDEBAR KIRI, CENTER KANVAS, SIDEBAR KANAN) */}
      <div className="flex-1 w-full flex overflow-hidden relative">
        
        {/* PANEL KIRI: PALET ITEM & BAGIAN */}
        {isPaletteOpen && isEditorMode && (
          <aside className="w-72 sm:w-80 h-full bg-white border-r border-slate-200 flex flex-col shrink-0 z-20 shadow-md overflow-hidden">
            
            {/* Header Tab Palet */}
            <div className="p-3 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl">
                <button
                  type="button"
                  onClick={() => setSidebarTab('items')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                    sidebarTab === 'items'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Item Produk
                </button>
                <button
                  type="button"
                  onClick={() => setSidebarTab('sections')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                    sidebarTab === 'sections'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Bagian Web ({sections.length})
                </button>
              </div>
            </div>

            {/* Konten Tab 1: Item Produk */}
            {sidebarTab === 'items' && (
              <div className="flex-1 overflow-y-auto p-3 space-y-4">
                
                {/* Form Buat Item Sendiri */}
                <form
                  onSubmit={handleSaveItemToPalette}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 shadow-sm"
                >
                  <span className="text-[11px] font-black uppercase text-slate-800 tracking-wider flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5 text-blue-600" /> Buat Item Sendiri:
                  </span>
                  <div>
                    <input
                      type="text"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      placeholder="Nama menu (misal: Sate Padang)"
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={newItemPrice}
                      onChange={(e) => setNewItemPrice(e.target.value)}
                      placeholder="Harga (misal: 25000)"
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900"
                      required
                    />
                    <select
                      value={newItemCategory}
                      onChange={(e) => setNewItemCategory(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="Makanan Utama">Makanan Utama</option>
                      <option value="Minuman">Minuman</option>
                      <option value="Camilan">Camilan</option>
                      <option value="Paket Spesial">Paket Spesial</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition"
                  >
                    + Simpan & Masukkan Kanvas
                  </button>
                </form>

                {/* Daftar Item Siap Di-Drag */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
                    <span>Item Siap Di-Drag:</span>
                    <span className="text-[10px] text-blue-600 font-semibold">Tarik ke kanvas</span>
                  </div>

                  <div className="space-y-2">
                    {paletteItems.map((item) => (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item)}
                        className="p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-md transition cursor-grab active:cursor-grabbing flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
                          <div>
                            <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">
                              {item.category}
                            </span>
                            <h5 className="text-xs font-bold text-slate-900 mt-0.5 line-clamp-1">
                              {item.name}
                            </h5>
                            <span className="text-xs font-extrabold text-emerald-700 block mt-0.5">
                              Rp {item.price.toLocaleString('id-ID')}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => addProductToCanvas(item)}
                          className="px-2 py-1 rounded-lg bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-600 text-[10px] font-bold transition shrink-0"
                          title="Langsung masukkan ke kanvas"
                        >
                          + Taruh
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Konten Tab 2: Bagian Web (Preset & Bagian Aktif di Kanvas) */}
            {sidebarTab === 'sections' && (
              <div className="flex-1 overflow-y-auto p-3 space-y-4">
                
                {/* Presets Cepat Tambah */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block px-1">
                    + Preset Bagian Siap Pakai:
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { type: 'HERO', label: '+ Hero Baru' },
                      { type: 'ABOUT', label: '+ Tentang Usaha' },
                      { type: 'CATALOG', label: '+ Katalog Menu' },
                      { type: 'CONTACT', label: '+ Kontak WhatsApp' },
                      { type: 'NAVBAR', label: '+ Navigasi' },
                      { type: 'FOOTER', label: '+ Footer' }
                    ].map((p) => (
                      <button
                        key={p.type}
                        type="button"
                        onClick={() => handleAddPresetSection(p.type as SectionType)}
                        className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-700 text-xs font-bold transition text-left"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Daftar Bagian Aktif di Kanvas */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block px-1">
                    Bagian Aktif di Kanvas ({sections.length}):
                  </span>

                  <div className="space-y-2">
                    {sections.map((sec, idx) => (
                      <div
                        key={sec.id}
                        className={`p-3 rounded-2xl border transition-all ${
                          highlightedSectionId === sec.id
                            ? 'border-blue-600 bg-blue-50/70 shadow-md ring-2 ring-blue-400'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-black text-slate-900">
                            {getSectionUniformLabel(sec)}
                          </span>
                          
                          {/* Reorder Buttons */}
                          <div className="flex items-center gap-0.5">
                            <button
                              type="button"
                              onClick={() => handleMoveSection(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveSection(idx, 'down')}
                              disabled={idx === sections.length - 1}
                              className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-500 line-clamp-1 mb-2">
                          {sec.title || 'Tanpa Judul'}
                        </p>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                          <button
                            type="button"
                            onClick={() => handleHighlightSection(sec.id)}
                            className="font-bold text-blue-600 hover:underline"
                          >
                            Sorot
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingSection(sec)}
                              className="text-slate-600 hover:text-slate-900 font-bold"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSection(sec.id)}
                              className="text-rose-600 hover:text-rose-800 font-bold"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </aside>
        )}

        {/* CENTER: DESK KANVAS WEBSITE PREVIEW (HANYA AREA INI YANG DI-SCROLL KE BAWAH) */}
        <main
          id="mainCanvasArea"
          className="flex-1 min-h-0 h-full overflow-y-auto bg-slate-100/90 relative"
          style={{ overflowY: 'scroll', WebkitOverflowScrolling: 'touch' }}
        >
          <div className="max-w-4xl mx-auto p-4 sm:p-8 pb-48 w-full flex flex-col items-center">
            
            {/* Header Status Bar Kanvas */}
            <div className="w-full bg-white rounded-2xl p-3 px-5 mb-5 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Status: <strong>Kanvas Siap Digunakan</strong></span>
                <span className="text-slate-300">|</span>
                <span>Total Bagian: <strong>{sections.length}</strong></span>
                <span className="text-slate-300">|</span>
                <span>Total Menu: <strong>{products.length}</strong></span>
              </div>

              <div className="flex items-center gap-2.5">
                {sections.length < 5 && (
                  <button
                    type="button"
                    onClick={() => {
                      setSections(INITIAL_SECTIONS);
                      setProducts(INITIAL_PRODUCTS);
                    }}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 transition flex items-center gap-1 shadow-2xs"
                    title="Klik untuk memulihkan seluruh susunan bagian website (Navbar, Hero, About, Katalog Menu, Kontak WhatsApp, Footer)"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Pulihkan Lengkap (6 Bagian)</span>
                  </button>
                )}
                <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                  ↕ Scroll ke bawah untuk melihat seluruh website
                </span>
              </div>
            </div>

            {/* KERTAS KANVAS (CANVAS PAPER) - SELURUH BAGIAN DARI NAV SAMPAI FOOTER TAMPIL UTUH */}
            <div
              id="canvasPaper"
              className="w-full bg-white rounded-3xl shadow-2xl border border-slate-200/90 transition-all duration-300 relative divide-y divide-slate-100 overflow-hidden"
              style={{
                backgroundColor: activeTheme.backgroundColor,
                fontFamily: `'${activeTheme.bodyFont}', sans-serif`,
                color: activeTheme.textColor
              }}
            >
            {sections.map((section, sIdx) => {
              const isHighlight = highlightedSectionId === section.id;

              return (
                <div
                  key={section.id}
                  id={`section-${section.id}`}
                  className={`relative group transition-all duration-200 ${
                    isHighlight ? 'ring-4 ring-blue-500 shadow-xl' : ''
                  }`}
                >
                  {/* Indikator Garis Dot Border Saat Hover (Khusus Mode Editor) */}
                  {isEditorMode && (
                    <div
                      className={`absolute inset-0 border-2 border-dotted pointer-events-none z-10 transition-colors duration-150 ${
                        isHighlight
                          ? 'border-blue-600 bg-blue-500/[0.03]'
                          : 'border-transparent group-hover:border-blue-500 group-hover:bg-blue-500/[0.015]'
                      }`}
                    />
                  )}

                  {/* Overlay Kontrol Bagian (Khusus Mode Editor) */}
                  {isEditorMode && (
                    <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/90 text-white p-1.5 rounded-xl shadow-lg flex items-center gap-2 backdrop-blur-sm">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 text-blue-300">
                        {getSectionUniformLabel(section)}
                      </span>
                      <button
                        type="button"
                        onClick={() => setEditingSection(section)}
                        className="p-1 hover:bg-slate-700 rounded text-slate-200 hover:text-white transition"
                        title="Edit Bagian Ini"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSection(section.id)}
                        className="p-1 hover:bg-rose-900 rounded text-rose-300 hover:text-rose-100 transition"
                        title="Hapus Bagian Ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* 1. SECTION: NAVBAR */}
                  {section.type === 'NAVBAR' && (
                    <nav className="py-4 px-6 sm:px-10 border-b border-slate-200/60 flex items-center justify-between">
                      <div>
                        <h2 className="font-black text-lg sm:text-xl tracking-tight" style={{ color: activeTheme.headingColor }}>
                          {section.title || 'Nama Toko'}
                        </h2>
                        {section.subtitle && (
                          <p className="text-xs opacity-75">{section.subtitle}</p>
                        )}
                      </div>

                      {/* Dynamic Links */}
                      <div className="flex items-center gap-4 sm:gap-6">
                        {(() => {
                          try {
                            const links: NavLinkItem[] = JSON.parse(section.content);
                            if (Array.isArray(links)) {
                              return links.map((l, i) => (
                                <a
                                  key={i}
                                  href={l.target}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    const clean = (l.target || '').replace(/^#/, '');
                                    const el =
                                      document.getElementById(clean) ||
                                      document.getElementById(`section-${clean}`) ||
                                      (clean === 'hero' ? document.getElementById(`section-${sections.find((s) => s.type === 'HERO')?.id}`) : null) ||
                                      (clean === 'about' ? document.getElementById(`section-${sections.find((s) => s.type === 'ABOUT')?.id}`) : null) ||
                                      (clean === 'catalog' ? document.getElementById(`section-${sections.find((s) => s.type === 'CATALOG')?.id}`) : null) ||
                                      (clean === 'contact' ? document.getElementById(`section-${sections.find((s) => s.type === 'CONTACT')?.id}`) : null);
                                    if (el) {
                                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }
                                  }}
                                  className="text-xs font-bold hover:opacity-80 transition cursor-pointer"
                                  style={{ color: activeTheme.primaryColor }}
                                >
                                  {l.label}
                                </a>
                              ));
                            }
                          } catch {}
                          return (
                            <span className="text-xs opacity-60">Menu Navigasi</span>
                          );
                        })()}
                      </div>
                    </nav>
                  )}

                  {/* 2. SECTION: HERO (BERBAGAI VARIAN LAYOUT GAYA DESAIN) */}
                  {section.type === 'HERO' && (
                    <>
                      {activeDesign?.styleConfig?.heroVariant === 'split-classic' ? (
                        <div className="py-14 sm:py-20 px-6 sm:px-12">
                          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                            <div className="md:col-span-7 space-y-4 text-left">
                              <span
                                className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border inline-block"
                                style={{
                                  color: activeTheme.primaryColor,
                                  borderColor: `${activeTheme.primaryColor}40`,
                                  backgroundColor: `${activeTheme.primaryColor}15`
                                }}
                              >
                                ☕ {activeTheme.accentBadge}
                              </span>
                              <h2
                                className="text-3xl sm:text-5xl font-black tracking-tight leading-tight"
                                style={{ color: activeTheme.headingColor, fontFamily: `'${activeTheme.headingFont}', serif` }}
                              >
                                {section.title}
                              </h2>
                              <p className="text-sm sm:text-base leading-relaxed opacity-90">
                                {section.subtitle}
                              </p>
                              <div className="pt-2 flex flex-wrap gap-3">
                                <a
                                  href="#section-catalog"
                                  className="px-6 py-3 rounded-xl font-bold text-sm text-white shadow-md hover:opacity-90 transition"
                                  style={{ backgroundColor: activeTheme.primaryColor }}
                                >
                                  Lihat Racikan Menu
                                </a>
                                <a
                                  href="#section-contact"
                                  className="px-6 py-3 rounded-xl font-bold text-sm border hover:bg-black/5 transition"
                                  style={{ borderColor: activeTheme.primaryColor, color: activeTheme.primaryColor }}
                                >
                                  Reservasi & Kontak
                                </a>
                              </div>
                            </div>
                            <div
                              className="md:col-span-5 rounded-3xl p-6 border-2 border-dashed text-center space-y-3 shadow-sm"
                              style={{
                                backgroundColor: activeTheme.cardBackground || '#fffbeb',
                                borderColor: `${activeTheme.primaryColor}40`
                              }}
                            >
                              <div
                                className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center text-white shadow-md"
                                style={{ backgroundColor: activeTheme.primaryColor }}
                              >
                                <Coffee className="w-7 h-7" />
                              </div>
                              <h4 className="font-bold text-base" style={{ color: activeTheme.headingColor, fontFamily: `'${activeTheme.headingFont}', serif` }}>
                                Seduh Hangat Setiap Hari
                              </h4>
                              <p className="text-xs leading-relaxed opacity-80">
                                Kopi pilihan dan seduhan racikan istimewa untuk menemani hari santai Anda.
                              </p>
                              <div className="pt-2">
                                <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                                  Buka: 09.00 - 22.00 WIB
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : activeDesign?.styleConfig?.heroVariant === 'bold-impact' ? (
                        <div className="py-16 sm:py-20 px-6 sm:px-12 text-center bg-gradient-to-b from-red-500/10 to-transparent">
                          <div className="max-w-2xl mx-auto space-y-4">
                            <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full bg-red-600 text-white inline-flex items-center gap-1 shadow-sm">
                              <Flame className="w-3.5 h-3.5 fill-white" /> {activeTheme.accentBadge || 'SPESIAL PEDAS GURIH TERLARIS'}
                            </span>
                            <h2
                              className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-red-950"
                              style={{ color: activeTheme.headingColor, fontFamily: `'${activeTheme.headingFont}', sans-serif` }}
                            >
                              {section.title}
                            </h2>
                            <p className="text-sm sm:text-base leading-relaxed text-red-900/80 font-medium max-w-xl mx-auto">
                              {section.subtitle}
                            </p>
                            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                              <a
                                href="#section-catalog"
                                className="px-8 py-3.5 rounded-xl font-black text-sm text-white shadow-xl bg-red-600 hover:bg-red-700 transition transform hover:scale-105"
                              >
                                PESAN SEKARANG (PROMO CEPAT)
                              </a>
                              <a
                                href="#section-contact"
                                className="px-6 py-3.5 rounded-xl font-bold text-sm bg-white border border-red-300 text-red-700 hover:bg-red-50 transition"
                              >
                                WhatsApp Kasir
                              </a>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="py-16 sm:py-24 px-6 sm:px-12 text-center relative overflow-hidden">
                          <div className="max-w-2xl mx-auto space-y-4">
                            <span
                              className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border"
                              style={{
                                color: activeTheme.primaryColor,
                                borderColor: `${activeTheme.primaryColor}40`,
                                backgroundColor: `${activeTheme.primaryColor}15`
                              }}
                            >
                              {activeTheme.accentBadge}
                            </span>

                            <h2
                              className="text-3xl sm:text-5xl font-black tracking-tight leading-tight"
                              style={{ color: activeTheme.headingColor, fontFamily: `'${activeTheme.headingFont}', serif` }}
                            >
                              {section.title}
                            </h2>

                            <p className="text-sm sm:text-base leading-relaxed opacity-90 max-w-xl mx-auto">
                              {section.subtitle}
                            </p>

                            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                              <a
                                href="#section-catalog"
                                className="px-7 py-3 rounded-xl font-black text-sm text-white shadow-lg hover:opacity-90 transition transform hover:scale-105"
                                style={{ backgroundColor: activeTheme.primaryColor }}
                              >
                                Lihat Menu Pilihan
                              </a>
                              <a
                                href="#section-contact"
                                className="px-6 py-3 rounded-xl font-bold text-sm border hover:bg-black/5 transition"
                                style={{ borderColor: activeTheme.primaryColor, color: activeTheme.primaryColor }}
                              >
                                Hubungi Pemesanan
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* 3. SECTION: ABOUT */}
                  {section.type === 'ABOUT' && (
                    <div className="py-14 px-6 sm:px-12 border-t border-slate-200/40">
                      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                        <div
                          className="md:col-span-5 rounded-3xl p-6 border text-center space-y-3 shadow-sm"
                          style={{
                            backgroundColor: activeTheme.cardBackground,
                            borderColor: `${activeTheme.primaryColor}30`
                          }}
                        >
                          <div
                            className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center text-white shadow-md"
                            style={{ backgroundColor: activeTheme.primaryColor }}
                          >
                            <HeartHandshake className="w-7 h-7" />
                          </div>
                          <h4 className="font-bold text-sm" style={{ color: activeTheme.headingColor }}>
                            Resep Khas & Higienis
                          </h4>
                          <p className="text-xs leading-relaxed opacity-85">
                            Diolah setiap hari dengan bahan pilihan segar dan rempah alami tanpa bahan pengawet.
                          </p>
                        </div>

                        <div className="md:col-span-7 space-y-3">
                          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: activeTheme.primaryColor }}>
                            Cerita Kami
                          </span>
                          <h3
                            className="text-2xl sm:text-3xl font-black"
                            style={{ color: activeTheme.headingColor, fontFamily: `'${activeTheme.headingFont}', serif` }}
                          >
                            {section.title}
                          </h3>
                          <h4 className="text-xs sm:text-sm font-semibold opacity-90">
                            {section.subtitle}
                          </h4>
                          <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line opacity-85">
                            {section.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 4. SECTION: CATALOG (SESUAI VARIAN KARTU GAYA DESAIN) */}
                  {section.type === 'CATALOG' && (
                    <div id="section-catalog" className="py-16 px-6 sm:px-12 border-t border-slate-200/40">
                      <div className="max-w-3xl mx-auto space-y-6">
                        
                        <div className="text-center space-y-2">
                          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: activeTheme.secondaryColor }}>
                            {activeDesign?.styleConfig?.accentLabel || 'Pilihan Menu Favorit'}
                          </span>
                          <h3
                            className="text-2xl sm:text-3xl font-black"
                            style={{ color: activeTheme.headingColor, fontFamily: `'${activeTheme.headingFont}', serif` }}
                          >
                            {section.title}
                          </h3>
                          <p className="text-xs sm:text-sm opacity-85 max-w-lg mx-auto">
                            {section.subtitle}
                          </p>
                        </div>

                        {/* Interactive Drop Target */}
                        {isEditorMode && (
                          <div
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDropOnCatalog}
                            onClick={() => setIsManageMenuOpen(true)}
                            className="p-5 rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/50 hover:bg-blue-50/30 text-center cursor-pointer transition space-y-1"
                          >
                            <div className="flex items-center justify-center gap-2 font-bold text-xs" style={{ color: activeTheme.primaryColor }}>
                              <Sparkles className="w-4 h-4" />
                              <span>TARIK (DRAG) ITEM DARI PALET SAMPING & LEPASKAN DI SINI</span>
                            </div>
                            <p className="text-[11px] opacity-70">
                              Atau klik area ini untuk mengetik menu baru secara langsung
                            </p>
                          </div>
                        )}

                        {/* Products Grid Sesuai Card Variant Gaya Desain */}
                        {products.length === 0 ? (
                          <div className="p-8 text-center rounded-2xl border border-dashed border-slate-300 space-y-2">
                            <PackageOpen className="w-8 h-8 mx-auto text-slate-400" />
                            <p className="text-xs font-bold">Belum ada item di katalog.</p>
                            <p className="text-[11px] opacity-75">Tarik item dari palet samping untuk mengisi kanvas.</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {products.map((p) => {
                              const cardVariant = activeDesign?.styleConfig?.cardVariant || 'modern-rounded';

                              if (cardVariant === 'cafe-handcrafted') {
                                return (
                                  <div
                                    key={p.id}
                                    className="p-4 rounded-2xl border-2 border-dashed shadow-sm hover:shadow-md transition flex flex-col justify-between group/card"
                                    style={{
                                      backgroundColor: activeTheme.cardBackground || '#fffbeb',
                                      borderColor: `${activeTheme.primaryColor}50`
                                    }}
                                  >
                                    <div>
                                      <div className="flex items-center justify-between mb-1.5">
                                        <span
                                          className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border border-dashed"
                                          style={{
                                            color: activeTheme.primaryColor,
                                            backgroundColor: `${activeTheme.primaryColor}15`,
                                            borderColor: `${activeTheme.primaryColor}60`
                                          }}
                                        >
                                          ☕ {p.category || 'Racikan Kedai'}
                                        </span>
                                        {isEditorMode && (
                                          <button
                                            type="button"
                                            onClick={() => setProducts(products.filter((item) => item.id !== p.id))}
                                            className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition"
                                            title="Hapus Menu Ini"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        )}
                                      </div>
                                      <h4 className="font-bold text-sm" style={{ color: activeTheme.headingColor, fontFamily: `'${activeTheme.headingFont}', Georgia, serif` }}>
                                        {p.name}
                                      </h4>
                                    </div>
                                    <div className="mt-3 pt-2.5 border-t border-amber-900/10 flex items-center justify-between">
                                      <div className="font-extrabold text-base" style={{ color: activeTheme.primaryColor }}>
                                        Rp {p.price.toLocaleString('id-ID')}
                                      </div>
                                      <span className="text-[11px] opacity-80 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-medium">
                                        Khas Kedai
                                      </span>
                                    </div>
                                  </div>
                                );
                              }

                              if (cardVariant === 'bold-compact') {
                                return (
                                  <div
                                    key={p.id}
                                    className="p-4 rounded-xl border-2 shadow-md hover:shadow-lg transition flex flex-col justify-between group/card"
                                    style={{
                                      backgroundColor: activeTheme.cardBackground || '#ffffff',
                                      borderColor: '#ef444450'
                                    }}
                                  >
                                    <div>
                                      <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-red-600 text-white flex items-center gap-1">
                                          <Flame className="w-3 h-3 fill-white text-white" /> TERLARIS
                                        </span>
                                        {isEditorMode && (
                                          <button
                                            type="button"
                                            onClick={() => setProducts(products.filter((item) => item.id !== p.id))}
                                            className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition"
                                            title="Hapus Menu Ini"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        )}
                                      </div>
                                      <h4 className="font-black text-sm" style={{ color: activeTheme.headingColor }}>
                                        {p.name}
                                      </h4>
                                    </div>
                                    <div className="mt-3 pt-2 border-t border-red-100 flex items-center justify-between">
                                      <div className="font-black text-base text-red-700">
                                        Rp {p.price.toLocaleString('id-ID')}
                                      </div>
                                      <span className="text-[10px] font-black text-white px-2 py-0.5 rounded bg-amber-500 shadow-sm">
                                        Siap Saji
                                      </span>
                                    </div>
                                  </div>
                                );
                              }

                              if (cardVariant === 'corporate-clean') {
                                return (
                                  <div
                                    key={p.id}
                                    className="p-4 rounded-xl border shadow-sm hover:shadow-md transition flex flex-col justify-between group/card"
                                    style={{
                                      backgroundColor: activeTheme.cardBackground || '#ffffff',
                                      borderColor: '#93c5fd'
                                    }}
                                  >
                                    <div>
                                      <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                                          {p.category || 'Paket Katering'}
                                        </span>
                                        {isEditorMode && (
                                          <button
                                            type="button"
                                            onClick={() => setProducts(products.filter((item) => item.id !== p.id))}
                                            className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition"
                                            title="Hapus Menu Ini"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        )}
                                      </div>
                                      <h4 className="font-bold text-sm" style={{ color: activeTheme.headingColor, fontFamily: `'${activeTheme.headingFont}', Inter, sans-serif` }}>
                                        {p.name}
                                      </h4>
                                    </div>
                                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                                      <div className="font-extrabold text-base text-blue-800">
                                        Rp {p.price.toLocaleString('id-ID')} <span className="text-[10px] font-normal text-slate-500">/ porsi</span>
                                      </div>
                                      <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                                        Min. 10 Box
                                      </span>
                                    </div>
                                  </div>
                                );
                              }

                              // Default modern-rounded
                              return (
                                <div
                                  key={p.id}
                                  className="p-4 rounded-2xl border shadow-sm hover:shadow-md transition flex flex-col justify-between group/card"
                                  style={{
                                    backgroundColor: activeTheme.cardBackground,
                                    borderColor: `${activeTheme.primaryColor}25`
                                  }}
                                >
                                  <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                      <span
                                        className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border"
                                        style={{
                                          color: activeTheme.primaryColor,
                                          backgroundColor: `${activeTheme.primaryColor}15`,
                                          borderColor: `${activeTheme.primaryColor}30`
                                        }}
                                      >
                                        {p.category || 'Menu'}
                                      </span>

                                      {isEditorMode && (
                                        <button
                                          type="button"
                                          onClick={() => setProducts(products.filter((item) => item.id !== p.id))}
                                          className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition"
                                          title="Hapus Menu Ini"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                    </div>

                                    <h4 className="font-bold text-sm" style={{ color: activeTheme.headingColor, fontFamily: `'${activeTheme.headingFont}', serif` }}>
                                      {p.name}
                                    </h4>
                                  </div>

                                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between">
                                    <div className="font-extrabold text-base" style={{ color: activeTheme.primaryColor }}>
                                      Rp {p.price.toLocaleString('id-ID')}
                                    </div>
                                    <span className="text-[10px] font-semibold opacity-75 px-1.5 py-0.5 rounded bg-black/5">
                                      Tersedia
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                      </div>
                    </div>
                  )}

                  {/* 5. SECTION: CONTACT (DENGAN WHATSAPP KUSTOM & PREVIEW PESAN) */}
                  {section.type === 'CONTACT' && (
                    <div id="section-contact" className="py-16 px-6 sm:px-12 border-t border-slate-200/40 text-center">
                      <div className="max-w-2xl mx-auto space-y-6">
                        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: activeTheme.primaryColor }}>
                          Layanan Pelanggan
                        </span>
                        
                        <h3
                          className="text-2xl sm:text-3xl font-black"
                          style={{ color: activeTheme.headingColor, fontFamily: `'${activeTheme.headingFont}', serif` }}
                        >
                          {section.title}
                        </h3>

                        <p className="text-xs sm:text-sm opacity-85">
                          {section.subtitle}
                        </p>

                        {/* Kartu Alamat & Kontak Bersih */}
                        <div
                          className="rounded-2xl p-5 text-xs sm:text-sm leading-relaxed shadow-sm border space-y-2 text-left sm:text-center"
                          style={{
                            backgroundColor: activeTheme.cardBackground,
                            borderColor: `${activeTheme.primaryColor}30`
                          }}
                        >
                          <div className="flex items-center justify-center gap-2 font-bold" style={{ color: activeTheme.primaryColor }}>
                            <MapPin className="w-4 h-4" />
                            <span>Informasi Alamat & Jadwal:</span>
                          </div>
                          <p className="whitespace-pre-line font-medium opacity-90">
                            {(section.content || '').replace(/Pesan:[^|]+/i, '').trim() || 'WhatsApp: 0812-3456-7890 | Buka Setiap Hari'}
                          </p>
                        </div>

                        {/* Tombol WhatsApp dengan Format Pesan Otomatis */}
                        {(() => {
                          const customMsg = section.waMessage || 'Halo, saya ingin memesan menu dari website Anda.';
                          const rawPhone = ((section.content || '').match(/(?:WhatsApp|WA|Telepon|Telp|No\.?):\s*([0-9+\-\s]+)/i)?.[1] || '0812-3456-7890').replace(/\D/g, '');
                          const cleanDigits = rawPhone.startsWith('0') ? '62' + rawPhone.slice(1) : rawPhone;
                          const waUrl = `https://wa.me/${cleanDigits}?text=${encodeURIComponent(customMsg)}`;

                          return (
                            <div className="space-y-2 pt-2">
                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-7 py-3.5 text-white font-extrabold rounded-2xl shadow-xl transition text-sm hover:opacity-90 transform hover:scale-105"
                                style={{ backgroundColor: activeTheme.primaryColor }}
                              >
                                <MessageCircle className="w-4 h-4 fill-white" />
                                <span>Chat Langsung via WhatsApp</span>
                              </a>
                              <div className="text-[11px] text-slate-500 font-medium">
                                Pesan otomatis: <span className="italic font-bold text-slate-700">&quot;{customMsg}&quot;</span>
                              </div>
                            </div>
                          );
                        })()}

                      </div>
                    </div>
                  )}

                  {/* 6. SECTION: FOOTER */}
                  {section.type === 'FOOTER' && (
                    <footer className="py-10 px-6 sm:px-12 bg-slate-900 text-slate-400 text-xs">
                      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                        <div>
                          <h4 className="font-bold text-white text-sm mb-0.5">{section.title}</h4>
                          <p className="text-[11px] text-slate-400">{section.subtitle}</p>
                          {section.content && <p className="text-[11px] text-slate-500 mt-1">{section.content}</p>}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Website dibuat dengan <strong>NexaWeb.ai</strong>
                        </div>
                      </div>
                    </footer>
                  )}

                </div>
              );
            })}
            </div>
          </div>

        </main>

        {/* PANEL KANAN: ASISTEN GEMINI AI COPILOT */}
        <AiCopilotSidebar
          isOpen={isAiChatOpen}
          onClose={() => setIsAiChatOpen(false)}
          onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
          hasApiKey={hasApiKey}
          onExecuteAiAction={handleExecuteAiAction}
          currentContext={{
            sections,
            products,
            activeThemeId: activeTheme.id
          }}
        />

      </div>

      {/* 3. MODALS (TAMBAH BAGIAN, EDIT BAGIAN, KELOLA MENU, GAYA DESAIN, WARNA & FONT, API KEY) */}
      <SectionModals
        isAddSectionOpen={isAddSectionOpen}
        onCloseAddSection={() => setIsAddSectionOpen(false)}
        onAddSection={(newSec) => {
          setSections((prev) => [
            ...prev,
            {
              id: 'sec-' + Date.now(),
              type: newSec.type || 'HERO',
              title: newSec.title || 'Bagian Baru',
              subtitle: newSec.subtitle || '',
              content: newSec.content || '',
              waMessage: newSec.waMessage,
              orderIndex: prev.length + 1
            }
          ]);
        }}
        editingSection={editingSection}
        onCloseEditSection={() => setEditingSection(null)}
        onUpdateSection={(updated) => {
          setSections((prev) =>
            prev.map((s) => (s.id === updated.id ? { ...s, ...updated } : s))
          );
        }}
        isManageMenuOpen={isManageMenuOpen}
        onCloseManageMenu={() => setIsManageMenuOpen(false)}
        products={products}
        onAddProduct={(prod) => {
          addProductToCanvas({
            id: 'prod-' + Date.now(),
            ...prod
          });
        }}
        onDeleteProduct={(id) => {
          setProducts((prev) => prev.filter((p) => p.id !== id));
        }}
        isDesignModalOpen={isDesignModalOpen}
        onCloseDesignModal={() => setIsDesignModalOpen(false)}
        activeDesignId={activeDesign.id}
        onSelectDesign={(design) => {
          setActiveDesign(design);
          if (design.themeId) {
            const matchingTheme = DEFAULT_THEMES.find((t) => t.id === design.themeId);
            if (matchingTheme) {
              setActiveTheme(matchingTheme);
            }
          }
          setIsDesignModalOpen(false);
          try {
            confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
          } catch {}
        }}
        isThemeModalOpen={isThemeModalOpen}
        onCloseThemeModal={() => setIsThemeModalOpen(false)}
        activeThemeId={activeTheme.id}
        onSelectTheme={(theme) => {
          setActiveTheme(theme);
          setIsThemeModalOpen(false);
        }}
        isApiKeyModalOpen={isApiKeyModalOpen}
        onCloseApiKeyModal={() => setIsApiKeyModalOpen(false)}
        onSaveApiKey={(key) => {
          if (typeof window !== 'undefined') {
            localStorage.setItem('gemini_api_key', key);
            setHasApiKey(Boolean(key));
          }
          setIsApiKeyModalOpen(false);
        }}
        canvasSections={sections}
      />

    </div>
  );
}
