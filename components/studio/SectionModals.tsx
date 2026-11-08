'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Check, Sparkles, KeyRound, Star, RotateCcw, LayoutTemplate, Flame, Coffee, ArrowRight } from 'lucide-react';
import { SectionItem, SectionType, ProductItem, DesignTheme, DesignTemplate, NavLinkItem } from '@/lib/types';
import { DEFAULT_THEMES, DEFAULT_TEMPLATES } from '@/lib/defaultData';

interface SectionModalsProps {
  // Modal states
  isAddSectionOpen: boolean;
  onCloseAddSection: () => void;
  onAddSection: (section: Partial<SectionItem>) => void;

  editingSection: SectionItem | null;
  onCloseEditSection: () => void;
  onUpdateSection: (updated: Partial<SectionItem>) => void;

  isManageMenuOpen: boolean;
  onCloseManageMenu: () => void;
  products: ProductItem[];
  onAddProduct: (product: Omit<ProductItem, 'id'>) => void;
  onDeleteProduct: (id: string) => void;

  isDesignModalOpen: boolean;
  onCloseDesignModal: () => void;
  activeDesignId: string;
  onSelectDesign: (design: DesignTemplate) => void;

  isThemeModalOpen: boolean;
  onCloseThemeModal: () => void;
  activeThemeId: string;
  onSelectTheme: (theme: DesignTheme) => void;

  isApiKeyModalOpen: boolean;
  onCloseApiKeyModal: () => void;
  onSaveApiKey: (key: string) => void;

  // Active sections in canvas for navbar link target dropdown
  canvasSections: SectionItem[];
}

export default function SectionModals({
  isAddSectionOpen,
  onCloseAddSection,
  onAddSection,
  editingSection,
  onCloseEditSection,
  onUpdateSection,
  isManageMenuOpen,
  onCloseManageMenu,
  products,
  onAddProduct,
  onDeleteProduct,
  isDesignModalOpen,
  onCloseDesignModal,
  activeDesignId,
  onSelectDesign,
  isThemeModalOpen,
  onCloseThemeModal,
  activeThemeId,
  onSelectTheme,
  isApiKeyModalOpen,
  onCloseApiKeyModal,
  onSaveApiKey,
  canvasSections
}: SectionModalsProps) {
  // Form State untuk Tambah Bagian
  const [addType, setAddType] = useState<SectionType>('HERO');
  const [addTitle, setAddTitle] = useState('');
  const [addSubtitle, setAddSubtitle] = useState('');
  const [addContent, setAddContent] = useState('');
  const [addContactPhone, setAddContactPhone] = useState('0812-3456-7890');
  const [addContactAddress, setAddContactAddress] = useState('Jl. Kenanga No. 24, Pasar Minggu, Jakarta Selatan');
  const [addContactHours, setAddContactHours] = useState('Buka Setiap Hari: 08.00 - 20.00 WIB');
  const [addContactWaMessage, setAddContactWaMessage] = useState('Halo Admin, saya ingin memesan menu dari website.');
  const [addNavLinks, setAddNavLinks] = useState<NavLinkItem[]>([
    { label: 'Beranda', target: '#hero' },
    { label: 'Tentang Kami', target: '#about' },
    { label: 'Daftar Menu', target: '#catalog' },
    { label: 'Kontak', target: '#contact' }
  ]);

  // Form State untuk Edit Bagian
  const [editTitle, setEditTitle] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editContactPhone, setEditContactPhone] = useState('');
  const [editContactAddress, setEditContactAddress] = useState('');
  const [editContactHours, setEditContactHours] = useState('');
  const [editContactWaMessage, setEditContactWaMessage] = useState('');
  const [editNavLinks, setEditNavLinks] = useState<NavLinkItem[]>([]);

  // Form State untuk Tambah Produk di Kelola Menu
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodCategory, setProdCategory] = useState('Makanan Utama');

  // Form State untuk API Key
  const [apiKeyInput, setApiKeyInput] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setApiKeyInput(localStorage.getItem('gemini_api_key') || '');
    }
  }, [isApiKeyModalOpen]);

  // Pre-fill Edit Modal saat editingSection berubah
  useEffect(() => {
    if (editingSection) {
      setEditTitle(editingSection.title);
      setEditSubtitle(editingSection.subtitle);
      setEditContent(editingSection.content);

      if (editingSection.type === 'NAVBAR') {
        try {
          const parsed = JSON.parse(editingSection.content);
          if (Array.isArray(parsed)) setEditNavLinks(parsed);
        } catch {
          setEditNavLinks([
            { label: 'Beranda', target: '#hero' },
            { label: 'Tentang Kami', target: '#about' },
            { label: 'Daftar Menu', target: '#catalog' },
            { label: 'Kontak', target: '#contact' }
          ]);
        }
      } else if (editingSection.type === 'CONTACT') {
        setEditContactWaMessage(editingSection.waMessage || 'Halo, saya ingin memesan menu dari website Anda.');
        const raw = editingSection.content || '';
        const phoneM = raw.match(/(?:WhatsApp|WA|Telepon|Telp|No\.?):\s*([0-9+\-\s]+)/i);
        const addrM = raw.match(/(?:Alamat|Lokasi):\s*([^|]+)/i);
        const hoursM = raw.match(/(?:Buka|Operasional|Jam):\s*([^|]+)/i);
        const msgM = raw.match(/(?:Pesan(?:\s*WA)?|Template(?:\s*Chat)?):\s*([^|]+)/i);

        setEditContactPhone(phoneM ? phoneM[1].trim() : '0812-3456-7890');
        setEditContactAddress(addrM ? addrM[1].trim() : 'Jl. Usaha Bersama No. 10');
        setEditContactHours(hoursM ? hoursM[1].trim() : 'Buka Setiap Hari: 08.00 - 20.00 WIB');
        if (msgM && !editingSection.waMessage) {
          setEditContactWaMessage(msgM[1].trim());
        }
      }
    }
  }, [editingSection]);

  // Helper perhitungan label seragam persis sama dengan yang ada di Bagian Web
  const getSectionUniformLabel = (section: SectionItem) => {
    const sameType = canvasSections.filter((s) => s.type === section.type);
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

  // Daftar opsi section target: HANYA mengambil bagian yang aktif di kanvas (persis sama dengan Bagian Web)
  const targetOptions = canvasSections.map((sec) => {
    const uniform = getSectionUniformLabel(sec);
    const titleSnippet = sec.title ? ` - ${sec.title.slice(0, 24)}${sec.title.length > 24 ? '...' : ''}` : '';
    return {
      label: `${uniform}${titleSnippet}`,
      value: `#section-${sec.id}`,
      id: sec.id,
      type: sec.type
    };
  });

  // Resolver untuk mencocokkan target link (mendukung baik #section-id maupun legacy #hero, #about, dll)
  const resolveTargetValue = (target: string) => {
    if (!target) return targetOptions[0]?.value || '';
    if (targetOptions.some((opt) => opt.value === target)) return target;
    // Map legacy hashtag ke section id yang cocok di kanvas
    if (target === '#hero') {
      const hero = canvasSections.find((s) => s.type === 'HERO');
      if (hero) return `#section-${hero.id}`;
    }
    if (target === '#about') {
      const about = canvasSections.find((s) => s.type === 'ABOUT');
      if (about) return `#section-${about.id}`;
    }
    if (target === '#catalog' || target === '#section-catalog') {
      const cat = canvasSections.find((s) => s.type === 'CATALOG');
      if (cat) return `#section-${cat.id}`;
    }
    if (target === '#contact' || target === '#section-contact') {
      const con = canvasSections.find((s) => s.type === 'CONTACT');
      if (con) return `#section-${con.id}`;
    }
    return targetOptions[0]?.value || target;
  };

  // Submit Tambah Bagian
  const handleAddSectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let contentToSave = addContent;
    let waMsg = '';

    if (addType === 'NAVBAR') {
      contentToSave = JSON.stringify(addNavLinks);
    } else if (addType === 'CONTACT') {
      waMsg = addContactWaMessage.trim();
      const parts = [];
      if (addContactPhone) parts.push(`WhatsApp: ${addContactPhone}`);
      if (addContactAddress) parts.push(`Alamat: ${addContactAddress}`);
      if (addContactHours) parts.push(`Buka: ${addContactHours}`);
      if (waMsg) parts.push(`Pesan: ${waMsg}`);
      contentToSave = parts.join(' | ');
    }

    onAddSection({
      type: addType,
      title: addTitle || `Bagian ${addType}`,
      subtitle: addSubtitle,
      content: contentToSave,
      waMessage: waMsg
    });

    onCloseAddSection();
  };

  // Submit Edit Bagian
  const handleEditSectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection) return;

    let contentToSave = editContent;
    let waMsg = editingSection.waMessage || '';

    if (editingSection.type === 'NAVBAR') {
      contentToSave = JSON.stringify(editNavLinks);
    } else if (editingSection.type === 'CONTACT') {
      waMsg = editContactWaMessage.trim();
      const parts = [];
      if (editContactPhone) parts.push(`WhatsApp: ${editContactPhone}`);
      if (editContactAddress) parts.push(`Alamat: ${editContactAddress}`);
      if (editContactHours) parts.push(`Buka: ${editContactHours}`);
      if (waMsg) parts.push(`Pesan: ${waMsg}`);
      contentToSave = parts.join(' | ');
    }

    onUpdateSection({
      id: editingSection.id,
      title: editTitle,
      subtitle: editSubtitle,
      content: contentToSave,
      waMessage: waMsg
    });

    onCloseEditSection();
  };

  return (
    <>
      {/* 1. MODAL TAMBAH BAGIAN (LEBAR MAKSIMAL & BEBAS HORIZONTAL SCROLL) */}
      {isAddSectionOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[88vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            
            {/* Header Modal (Fixed di atas) */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 bg-white shrink-0">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">Tambah Bagian Baru ke Kanvas</h3>
                <p className="text-xs text-slate-500 mt-0.5">Pilih jenis bagian dan sesuaikan teksnya</p>
              </div>
              <button
                type="button"
                onClick={onCloseAddSection}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form & Body Scrollable */}
            <form onSubmit={handleAddSectionSubmit} className="flex-1 flex flex-col overflow-hidden">
              <div className="overflow-y-auto overflow-x-hidden flex-1 p-5 sm:p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Jenis Bagian</label>
                  <select
                    value={addType}
                    onChange={(e) => setAddType(e.target.value as SectionType)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="HERO">Hero Banner (Penyambut Pengunjung)</option>
                    <option value="ABOUT">Tentang Usaha (Cerita & Keunggulan)</option>
                    <option value="CATALOG">Katalog Menu & Produk</option>
                    <option value="CONTACT">Kontak WhatsApp & Alamat</option>
                    <option value="NAVBAR">Navigasi Header Atas</option>
                    <option value="FOOTER">Footer Bawah</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Judul Utama</label>
                  <input
                    type="text"
                    value={addTitle}
                    onChange={(e) => setAddTitle(e.target.value)}
                    placeholder="Contoh: Menu Spesial Hari Ini"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Sub-Judul / Keterangan Singkat</label>
                  <input
                    type="text"
                    value={addSubtitle}
                    onChange={(e) => setAddSubtitle(e.target.value)}
                    placeholder="Contoh: Dibuat segar setiap pagi untuk Anda"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                {/* Sub-form khusus Contact */}
                {addType === 'CONTACT' && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-3.5">
                    <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                      Detail Kontak & WhatsApp
                    </h4>

                    <div>
                      <label className="block text-[11px] font-bold text-emerald-900 mb-1">Nomor WhatsApp Usaha</label>
                      <input
                        type="text"
                        value={addContactPhone}
                        onChange={(e) => setAddContactPhone(e.target.value)}
                        placeholder="0812-3456-7890"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-emerald-300 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-emerald-900 mb-1">Alamat Fisik / Lokasi Toko</label>
                      <input
                        type="text"
                        value={addContactAddress}
                        onChange={(e) => setAddContactAddress(e.target.value)}
                        placeholder="Jl. Kenanga No. 24, Jakarta Selatan"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-emerald-300 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-emerald-900 mb-1">Jam Operasional / Buka</label>
                      <input
                        type="text"
                        value={addContactHours}
                        onChange={(e) => setAddContactHours(e.target.value)}
                        placeholder="Buka Setiap Hari: 08.00 - 20.00 WIB"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-emerald-300 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-emerald-900 mb-1">
                        Isi Pesan Otomatis WhatsApp (Bisa Dikustomisasi)
                      </label>
                      <input
                        type="text"
                        value={addContactWaMessage}
                        onChange={(e) => setAddContactWaMessage(e.target.value)}
                        placeholder="Contoh: Halo Admin, saya ingin memesan menu dari website..."
                        className="w-full px-3 py-2 text-xs rounded-xl border border-emerald-300 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                      <p className="text-[10px] text-slate-500 mt-1">
                        Pesan ini otomatis muncul di kolom chat WhatsApp pembeli saat tombol diklik.
                      </p>
                    </div>
                  </div>
                )}

                {/* Sub-form khusus Navbar (Lebar Penuh, Bebas Horizontal Scroll) */}
                {addType === 'NAVBAR' && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Tautan Menu Navigasi</h4>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        Pilih bagian kanvas yang dituju ({targetOptions.length} Bagian Tersedia)
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {addNavLinks.map((link, idx) => (
                        <div key={idx} className="grid grid-cols-12 gap-2 sm:gap-3 items-center w-full min-w-0">
                          <div className="col-span-5 min-w-0">
                            <input
                              type="text"
                              value={link.label}
                              onChange={(e) => {
                                const updated = [...addNavLinks];
                                updated[idx].label = e.target.value;
                                setAddNavLinks(updated);
                              }}
                              placeholder="Label Menu"
                              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
                            />
                          </div>
                          <div className="col-span-6 min-w-0">
                            <select
                              value={resolveTargetValue(link.target)}
                              onChange={(e) => {
                                const updated = [...addNavLinks];
                                updated[idx].target = e.target.value;
                                setAddNavLinks(updated);
                              }}
                              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 truncate"
                            >
                              {targetOptions.map((opt) => (
                                <option key={opt.value} value={opt.value} title={opt.label}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="col-span-1 min-w-0 flex justify-center">
                            <button
                              type="button"
                              onClick={() => setAddNavLinks(addNavLinks.filter((_, i) => i !== idx))}
                              className="w-9 h-9 p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition flex items-center justify-center shrink-0 border border-transparent hover:border-rose-200"
                              title="Hapus Tautan"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => {
                          const fallbackTarget = targetOptions[0]?.value || '#hero';
                          setAddNavLinks([...addNavLinks, { label: 'Menu Baru', target: fallbackTarget }]);
                        }}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 pt-1.5"
                      >
                        <Plus className="w-4 h-4" /> Tambah Tautan Baru
                      </button>
                    </div>
                  </div>
                )}

                {/* Textarea Konten (Disembunyikan jika NAVBAR atau CONTACT) */}
                {addType !== 'NAVBAR' && addType !== 'CONTACT' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Isi Teks / Konten</label>
                    <textarea
                      rows={3}
                      value={addContent}
                      onChange={(e) => setAddContent(e.target.value)}
                      placeholder="Tuliskan keterangan lengkap atau cerita usaha Anda di sini..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                )}
              </div>

              {/* Footer Modal (Fixed di bawah, selalu tampak) */}
              <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={onCloseAddSection}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/70 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition"
                >
                  + Tambahkan ke Kanvas
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* 2. MODAL EDIT BAGIAN (LEBAR MAKSIMAL & BEBAS HORIZONTAL SCROLL) */}
      {editingSection && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[88vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            
            {/* Header Modal (Fixed di atas) */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 bg-white shrink-0">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                  Edit Bagian {editingSection.type}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Perbarui konten bagian yang tampil di kanvas</p>
              </div>
              <button
                type="button"
                onClick={onCloseEditSection}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form & Body Scrollable */}
            <form onSubmit={handleEditSectionSubmit} className="flex-1 flex flex-col overflow-hidden">
              <div className="overflow-y-auto overflow-x-hidden flex-1 p-5 sm:p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Judul</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Sub-Judul</label>
                  <input
                    type="text"
                    value={editSubtitle}
                    onChange={(e) => setEditSubtitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                {/* Sub-form Contact Edit */}
                {editingSection.type === 'CONTACT' && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-3.5">
                    <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                      Detail Kontak & WhatsApp
                    </h4>
                    <div>
                      <label className="block text-[11px] font-bold text-emerald-900 mb-1">Nomor WhatsApp Usaha</label>
                      <input
                        type="text"
                        value={editContactPhone}
                        onChange={(e) => setEditContactPhone(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-emerald-300 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-emerald-900 mb-1">Alamat Fisik / Lokasi Toko</label>
                      <input
                        type="text"
                        value={editContactAddress}
                        onChange={(e) => setEditContactAddress(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-emerald-300 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-emerald-900 mb-1">Jam Operasional / Buka</label>
                      <input
                        type="text"
                        value={editContactHours}
                        onChange={(e) => setEditContactHours(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-emerald-300 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-emerald-900 mb-1">
                        Isi Pesan Otomatis WhatsApp (Bisa Dikustomisasi)
                      </label>
                      <input
                        type="text"
                        value={editContactWaMessage}
                        onChange={(e) => setEditContactWaMessage(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-emerald-300 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                      <p className="text-[10px] text-slate-500 mt-1">
                        Pesan otomatis ini yang langsung terisi di WhatsApp pembeli saat tombol diklik.
                      </p>
                    </div>
                  </div>
                )}

                {/* Sub-form Navbar Edit (12 Kolom Grid, Bebas Horizontal Scroll) */}
                {editingSection.type === 'NAVBAR' && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Tautan Menu Navigasi</h4>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        Pilih bagian kanvas yang dituju ({targetOptions.length} Bagian Tersedia)
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {editNavLinks.map((link, idx) => (
                        <div key={idx} className="grid grid-cols-12 gap-2 sm:gap-3 items-center w-full min-w-0">
                          <div className="col-span-5 min-w-0">
                            <input
                              type="text"
                              value={link.label}
                              onChange={(e) => {
                                const updated = [...editNavLinks];
                                updated[idx].label = e.target.value;
                                setEditNavLinks(updated);
                              }}
                              placeholder="Label Menu"
                              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
                            />
                          </div>
                          <div className="col-span-6 min-w-0">
                            <select
                              value={resolveTargetValue(link.target)}
                              onChange={(e) => {
                                const updated = [...editNavLinks];
                                updated[idx].target = e.target.value;
                                setEditNavLinks(updated);
                              }}
                              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 truncate"
                            >
                              {targetOptions.map((opt) => (
                                <option key={opt.value} value={opt.value} title={opt.label}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="col-span-1 min-w-0 flex justify-center">
                            <button
                              type="button"
                              onClick={() => setEditNavLinks(editNavLinks.filter((_, i) => i !== idx))}
                              className="w-9 h-9 p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition flex items-center justify-center shrink-0 border border-transparent hover:border-rose-200"
                              title="Hapus Tautan"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => {
                          const fallbackTarget = targetOptions[0]?.value || '#hero';
                          setEditNavLinks([...editNavLinks, { label: 'Menu Baru', target: fallbackTarget }]);
                        }}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 pt-1.5"
                      >
                        <Plus className="w-4 h-4" /> Tambah Tautan Baru
                      </button>
                    </div>
                  </div>
                )}

                {/* Textarea Konten untuk selain Navbar & Contact */}
                {editingSection.type !== 'NAVBAR' && editingSection.type !== 'CONTACT' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Isi Teks / Konten</label>
                    <textarea
                      rows={3}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                )}
              </div>

              {/* Footer Modal (Fixed di bawah, selalu tampak) */}
              <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={onCloseEditSection}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/70 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. MODAL KELOLA MENU (HEADER & FOOTER FIXED, BODY SCROLLABLE) */}
      {isManageMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[88vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            
            {/* Header Modal (Fixed) */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 bg-white shrink-0">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                  Kelola Menu & Katalog Produk
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Tambah menu baru dan atur daftar produk aktif di kanvas</p>
              </div>
              <button
                type="button"
                onClick={onCloseManageMenu}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body Scrollable */}
            <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-5">
              {/* Form Tambah Item Baru dengan Dropdown Kategori */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!prodName.trim()) return;
                  const p = parseInt(prodPrice.replace(/\D/g, ''), 10) || 15000;
                  onAddProduct({
                    name: prodName.trim(),
                    price: p,
                    category: prodCategory
                  });
                  setProdName('');
                  setProdPrice('');
                }}
                className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
              >
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">+ Buat Menu Baru</h4>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama Menu / Produk</label>
                  <input
                    type="text"
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    placeholder="Contoh: Es Cendol Durian Segar"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Harga (Rp)</label>
                    <input
                      type="number"
                      value={prodPrice}
                      onChange={(e) => setProdPrice(e.target.value)}
                      placeholder="Contoh: 18000"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Kategori (Dropdown)</label>
                    <select
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                    >
                      <option value="Makanan Utama">Makanan Utama</option>
                      <option value="Minuman">Minuman</option>
                      <option value="Camilan">Camilan</option>
                      <option value="Paket Spesial">Paket Spesial</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition"
                >
                  + Masukkan ke Katalog
                </button>
              </form>

              {/* List Produk Aktif */}
              <div className="space-y-2">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Produk Aktif di Kanvas ({products.length})
                </h4>
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {products.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300"
                    >
                      <div>
                        <h5 className="text-xs font-bold text-slate-900">{p.name}</h5>
                        <span className="text-[10px] text-slate-500">{p.category} • Rp {p.price.toLocaleString('id-ID')}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onDeleteProduct(p.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                        title="Hapus Menu"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Modal (Fixed) */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-end shrink-0">
              <button
                type="button"
                onClick={onCloseManageMenu}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow transition"
              >
                Selesai
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 4. MODAL GAYA DESAIN (DILENGKAPI PREVIEW WIREFRAME & REKOMENDASI UTAMA) */}
      {isDesignModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            
            {/* Header Modal */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-100 text-slate-800 rounded-2xl shadow-xs">
                  <LayoutTemplate className="w-6 h-6 text-slate-800" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      Pilihan Gaya Desain Website (Template Siap Pakai)
                    </h3>
                    <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Ada Rekomendasi Utama
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pilih tata letak visual siap pakai yang paling pas dengan karakter usaha Anda
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onCloseDesignModal}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body Modal Ber-scroll */}
            <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-6">
              
              {/* BANNER REKOMENDASI UTAMA */}
              <div className="bg-gradient-to-r from-slate-50 via-blue-50/50 to-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-slate-900 text-white shadow-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Rekomendasi Utama (Skor 9.9/10)
                      </span>
                      <span className="text-xs font-bold text-slate-800">Warung Modern & Bersih</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                      <strong>Mengapa Paling Direkomendasikan?</strong> Layout ini terbukti paling nyaman dan mudah dibaca oleh siapa saja, penataan menu 2 kolom sangat pas di layar ponsel maupun komputer, serta tombol pemesanan WhatsApp terpasang di posisi emas dengan konversi pesanan tertinggi.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const rec = DEFAULT_TEMPLATES.find((t) => t.id === 'modern-warung');
                      if (rec) onSelectDesign(rec);
                    }}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5 shrink-0"
                  >
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Gunakan Desain Rekomendasi</span>
                  </button>
                </div>
              </div>

              {/* DAFTAR KARTU CONTOH TEMPLATE DENGAN MINI WIREFRAME PREVIEW */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                    Koleksi Template Desain Tersedia:
                  </h4>
                  <span className="text-[11px] text-slate-500">Klik kartu atau tombol untuk menerapkan seketika</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {DEFAULT_TEMPLATES.map((tmpl) => {
                    const active = tmpl.id === activeDesignId;
                    const isRec = !!tmpl.isRecommended;

                    return (
                      <div
                        key={tmpl.id}
                        onClick={() => onSelectDesign(tmpl)}
                        className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-4 ${
                          active
                            ? 'border-slate-900 bg-slate-50/70 shadow-lg ring-2 ring-slate-900/20'
                            : isRec
                            ? 'border-amber-300 bg-amber-50/20 hover:border-amber-400 hover:shadow-md'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                        }`}
                      >
                        <div className="space-y-3">
                          
                          {/* Top Status Bar */}
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <div className="flex items-center gap-1.5">
                              {isRec ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                  <span>Rekomendasi #1 (Skor 9.9/10)</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                                  Skor {tmpl.score || '9.5/10'}
                                </span>
                              )}
                              <span className="text-[10px] font-semibold text-slate-500 px-1.5 py-0.5 rounded bg-slate-100">
                                {tmpl.category}
                              </span>
                            </div>

                            {active && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-md bg-slate-900 text-white">
                                <Check className="w-3 h-3 text-emerald-400" /> Aktif
                              </span>
                            )}
                          </div>

                          {/* Detail Informasi */}
                          <div>
                            <h4 className="text-sm font-black text-slate-900 mb-1">{tmpl.name}</h4>
                            <p className="text-xs text-slate-600 leading-relaxed">{tmpl.description}</p>
                          </div>

                          {/* MINI WIREFRAME MOCKUP PREVIEW */}
                          <div className="pt-1">
                            {tmpl.id === 'modern-warung' && (
                              <div className="p-2.5 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-inner">
                                <div className="h-6 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-800 flex items-center justify-between px-2 text-[9px] text-white font-bold">
                                  <span>WARUNG NUSANTARA</span>
                                  <span className="bg-amber-400 text-slate-900 px-1 rounded text-[7px] font-black">WA Cepat</span>
                                </div>
                                <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                                  <div className="h-9 rounded bg-emerald-50 border border-emerald-200 p-1 flex flex-col justify-between">
                                    <span className="text-[8px] font-bold text-emerald-950 truncate">Nasi Padang</span>
                                    <span className="text-[7px] text-emerald-700 font-extrabold">Rp 30.000</span>
                                  </div>
                                  <div className="h-9 rounded bg-emerald-50 border border-emerald-200 p-1 flex flex-col justify-between">
                                    <span className="text-[8px] font-bold text-emerald-950 truncate">Sate Madura</span>
                                    <span className="text-[7px] text-emerald-700 font-extrabold">Rp 25.000</span>
                                  </div>
                                </div>
                                <div className="h-4 rounded bg-emerald-600 text-white flex items-center justify-center text-[7px] font-bold">
                                  Chat Langsung via WhatsApp
                                </div>
                              </div>
                            )}

                            {tmpl.id === 'cafe-handcrafted' && (
                              <div className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/50 space-y-1.5 shadow-inner">
                                <div className="grid grid-cols-12 gap-1 h-6">
                                  <div className="col-span-8 bg-amber-800 rounded px-1.5 flex items-center text-[8px] font-serif text-amber-100 font-bold">
                                    Kedai Racikan
                                  </div>
                                  <div className="col-span-4 bg-amber-200 rounded flex items-center justify-center text-[8px] text-amber-900 font-bold">
                                    ☕ Coffee
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                                  <div className="h-9 rounded border border-dashed border-amber-600/40 bg-white p-1 flex flex-col justify-between">
                                    <span className="text-[8px] font-serif font-bold text-amber-950 truncate">Es Kopi Susu</span>
                                    <span className="text-[7px] text-amber-800 font-bold">Rp 18.000</span>
                                  </div>
                                  <div className="h-9 rounded border border-dashed border-amber-600/40 bg-white p-1 flex flex-col justify-between">
                                    <span className="text-[8px] font-serif font-bold text-amber-950 truncate">Pastry Croissant</span>
                                    <span className="text-[7px] text-amber-800 font-bold">Rp 22.000</span>
                                  </div>
                                </div>
                                <div className="h-4 rounded bg-amber-800 text-amber-100 flex items-center justify-center text-[7px] font-medium font-serif">
                                  Reservasi Meja & Pemesanan
                                </div>
                              </div>
                            )}

                            {tmpl.id === 'bold-pedas' && (
                              <div className="p-2.5 rounded-xl border border-rose-200 bg-rose-50/50 space-y-1.5 shadow-inner">
                                <div className="h-6 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 flex items-center justify-between px-2 text-[9px] text-white font-extrabold tracking-wide">
                                  <span>🔥 SPESIAL PEDAS GURIH</span>
                                  <span className="bg-yellow-400 text-red-950 px-1 rounded text-[7px] font-black">HEMAT!</span>
                                </div>
                                <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                                  <div className="h-9 rounded bg-white border border-red-200 p-1 flex flex-col justify-between relative overflow-hidden">
                                    <div className="flex justify-between items-center">
                                      <span className="text-[8px] font-black text-red-900 truncate">Ayam Geprek</span>
                                      <span className="text-[6px] bg-red-600 text-white px-1 rounded">HOT</span>
                                    </div>
                                    <span className="text-[8px] text-red-700 font-black">Rp 18.000</span>
                                  </div>
                                  <div className="h-9 rounded bg-white border border-red-200 p-1 flex flex-col justify-between relative overflow-hidden">
                                    <div className="flex justify-between items-center">
                                      <span className="text-[8px] font-black text-red-900 truncate">Bakso Mercon</span>
                                      <span className="text-[6px] bg-orange-600 text-white px-1 rounded">FAV</span>
                                    </div>
                                    <span className="text-[8px] text-red-700 font-black">Rp 22.000</span>
                                  </div>
                                </div>
                                <div className="h-4 rounded bg-red-600 text-white flex items-center justify-center text-[7px] font-black">
                                  PESAN SEKARANG (PROMO CEPAT)
                                </div>
                              </div>
                            )}

                            {tmpl.id === 'corporate-clean' && (
                              <div className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/40 space-y-1.5 shadow-inner">
                                <div className="h-6 rounded-lg bg-slate-900 flex items-center justify-between px-2 text-[8px] text-white font-bold">
                                  <span>KATERING RESMI BERKUALITAS</span>
                                  <span className="bg-blue-600 text-white px-1 rounded text-[7px]">Halal ID</span>
                                </div>
                                <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                                  <div className="h-9 rounded bg-white border border-blue-200 p-1 flex flex-col justify-between">
                                    <span className="text-[8px] font-bold text-slate-800 truncate">Paket Nasi Kotak</span>
                                    <span className="text-[7px] text-blue-700 font-bold">Min. 20 Box</span>
                                  </div>
                                  <div className="h-9 rounded bg-white border border-blue-200 p-1 flex flex-col justify-between">
                                    <span className="text-[8px] font-bold text-slate-800 truncate">Prasmanan Acara</span>
                                    <span className="text-[7px] text-blue-700 font-bold">Min. 50 Porsi</span>
                                  </div>
                                </div>
                                <div className="h-4 rounded bg-blue-700 text-white flex items-center justify-center text-[7px] font-bold">
                                  Permintaan Penawaran & Invoice
                                </div>
                              </div>
                            )}
                          </div>

                        </div>

                        {/* Tombol Terapkan */}
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectDesign(tmpl);
                            }}
                            className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                              active
                                ? 'bg-slate-900 text-white'
                                : 'bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-800'
                            }`}
                          >
                            {active ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Sedang Digunakan</span>
                              </>
                            ) : (
                              <>
                                <span>Terapkan Desain Ini</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Footer Modal */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-t border-slate-200 bg-white shrink-0">
              <button
                type="button"
                onClick={() => {
                  const rec = DEFAULT_TEMPLATES.find((t) => t.id === 'modern-warung');
                  if (rec) onSelectDesign(rec);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Kembalikan ke Desain Awal</span>
              </button>

              <button
                type="button"
                onClick={onCloseDesignModal}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow transition"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 5. MODAL WARNA & FONT (SCROLL MULUS & FOOTER FIXED) */}
      {isThemeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[88vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            
            {/* Header Modal (Fixed) */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 bg-white shrink-0">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">Palet Warna & Gaya Huruf</h3>
                <p className="text-xs text-slate-500 mt-0.5">Pilih nuansa warna yang membuat pelanggan langsung tertarik</p>
              </div>
              <button
                type="button"
                onClick={onCloseThemeModal}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body Scrollable */}
            <div className="overflow-y-auto overflow-x-hidden flex-1 p-5 sm:p-6 space-y-3">
              {DEFAULT_THEMES.map((th) => {
                const active = th.id === activeThemeId;
                return (
                  <div
                    key={th.id}
                    onClick={() => onSelectTheme(th)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                      active
                        ? 'border-slate-900 bg-slate-50 shadow-md ring-2 ring-slate-900/10'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="flex items-center -space-x-2">
                        <div
                          className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: th.primaryColor }}
                        />
                        <div
                          className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: th.secondaryColor }}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{th.name}</h4>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                            {th.tag}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Font: {th.headingFont} • Lencana: {th.accentBadge}
                        </p>
                      </div>
                    </div>

                    {active ? (
                      <span className="p-1.5 rounded-full bg-slate-900 text-white">
                        <Check className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-slate-400">Terapkan</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer Modal (Fixed) */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-end shrink-0">
              <button
                type="button"
                onClick={onCloseThemeModal}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow transition"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 6. MODAL API KEY GEMINI */}
      {isApiKeyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Google Gemini API Key</h3>
                  <p className="text-[11px] text-slate-500">Koneksi AI Studio Google untuk Copilot</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onCloseApiKeyModal}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed">
                Kunci API disimpan dengan aman di peramban (localStorage) Anda dan tidak akan pernah dibagikan ke pihak luar.
              </p>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kunci API (API Key)</label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="AQ.Ab8RN6IobJilVJo..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setApiKeyInput('');
                  onSaveApiKey('');
                }}
                className="text-xs font-bold text-rose-600 hover:underline"
              >
                Hapus Kunci
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onCloseApiKeyModal}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={() => onSaveApiKey(apiKeyInput.trim())}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow"
                >
                  Simpan Kunci
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
