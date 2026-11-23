'use client';

import React, { useState, useRef } from 'react';
import {
  Type,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Layers,
  Phone,
  Compass,
  Image as ImageIcon,
  ChevronDown,
  ExternalLink,
  ShoppingBag,
  MousePointerClick,
  Upload,
  Sliders,
  Check,
  Sparkles
} from 'lucide-react';
import {
  CanvasElement,
  AdvanceCanvas
} from '@/lib/advanceTypes';

export interface AdvanceContextualToolbarProps {
  selectedElement: CanvasElement | null;
  activeCanvas: AdvanceCanvas | null;
  allCanvases: AdvanceCanvas[];
  onUpdateElementProperties: (properties: Partial<CanvasElement['properties']>) => void;
  onUpdateElementColor: (color: string) => void;
  onDeleteElement: () => void;
  onDuplicateElement: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onOpenNavConfigModal: () => void;
}

export default function AdvanceContextualToolbar({
  selectedElement,
  activeCanvas,
  allCanvases,
  onUpdateElementProperties,
  onUpdateElementColor,
  onDeleteElement,
  onDuplicateElement,
  onBringForward,
  onSendBackward,
  onOpenNavConfigModal
}: AdvanceContextualToolbarProps) {
  const replaceImgInputRef = useRef<HTMLInputElement>(null);
  const [showPosisiMenu, setShowPosisiMenu] = useState(false);
  const [showSpacingMenu, setShowSpacingMenu] = useState(false);

  // Jika tidak ada elemen yang dipilih (Floating Status Bar)
  if (!selectedElement) {
    return (
      <div className="mx-4 my-2 h-12 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl px-5 flex items-center justify-between text-xs text-slate-500 shadow-md shadow-slate-900/5 z-20 shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-700">
            Kanvas Aktif: <strong className="text-slate-900 font-extrabold">{activeCanvas?.title || `Kanvas ${activeCanvas?.pageIndex || 1}`}</strong>
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500 font-medium">Klik elemen teks, tombol, atau kartu di kanvas untuk menyunting</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="font-medium text-slate-500">Ukuran: 1000 × {activeCanvas?.height || 650}px</span>
          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200/80">Canva Editor</span>
        </div>
      </div>
    );
  }

  const { category, properties, color } = selectedElement;

  const handleImageReplace = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      if (url) {
        if (category === 'IMAGE') {
          onUpdateElementProperties({ imageUrl: url });
        } else if (category === 'PRODUCT' && properties.cardData) {
          onUpdateElementProperties({
            cardData: {
              ...properties.cardData,
              image: url
            }
          });
        }
      }
    };
    reader.readAsDataURL(file);
    if (replaceImgInputRef.current) replaceImgInputRef.current.value = '';
  };

  return (
    <div className="mx-4 my-2 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-900/5 px-4 py-2 min-h-[58px] flex items-center justify-between text-xs overflow-x-auto gap-3 shrink-0 z-20 animate-in fade-in slide-in-from-top-1 duration-150">
      {/* Hidden File Input for Replace Image */}
      <input
        ref={replaceImgInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageReplace}
        className="hidden"
      />

      {/* Bagian Kiri: Kategori Badge & Properti Utama (Format Canva 1:1) */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Badge Tipe Elemen */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 font-extrabold text-xs uppercase tracking-wider shadow-2xs">
          {category === 'TEXT' && <Type className="w-3.5 h-3.5 text-blue-600" />}
          {category === 'IMAGE' && <ImageIcon className="w-3.5 h-3.5 text-blue-600" />}
          {category === 'PRODUCT' && <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />}
          {category === 'BUTTON' && <MousePointerClick className="w-3.5 h-3.5 text-blue-600" />}
          {category === 'NAV' && <Compass className="w-3.5 h-3.5 text-blue-600" />}
          <span>
            {category === 'TEXT' && 'Teks'}
            {category === 'IMAGE' && 'Gambar'}
            {category === 'PRODUCT' && 'Produk'}
            {category === 'BUTTON' && 'Tombol'}
            {category === 'NAV' && 'Navigasi'}
          </span>
        </div>

        <div className="h-6 w-px bg-slate-200" />

        {/* ================================================================= */}
        {/* 1. KONTROL TEKS GAYA CANVA (Font, Size, Color, B, I, U, S, aA, Align) */}
        {/* ================================================================= */}
        {category === 'TEXT' && (
          <div className="flex items-center gap-2">
            {/* Pilihan Gaya Huruf / Font Family (Pill Canva) */}
            <div className="relative flex items-center">
              <select
                value={properties.font || 'Inter, sans-serif'}
                onChange={(e) => onUpdateElementProperties({ font: e.target.value })}
                className="h-10 pl-3.5 pr-8 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-xs font-bold text-slate-800 cursor-pointer appearance-none transition focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                title="Pilih Gaya Font"
              >
                <option value="Inter, sans-serif">Modern Sans</option>
                <option value="Georgia, serif">Elegant Serif</option>
                <option value="Impact, sans-serif">Bold Impact</option>
                <option value="monospace">Tech Mono</option>
                <option value="cursive">Artisan Script</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 pointer-events-none" />
            </div>

            {/* Kontrol Ukuran Huruf: - / Input / + (Stepper Pill Canva) */}
            <div className="flex items-center bg-slate-100 rounded-xl border border-slate-200 p-1 h-10 shadow-2xs">
              <button
                type="button"
                onClick={() => {
                  const currentSize = properties.fontSize || 16;
                  onUpdateElementProperties({ fontSize: Math.max(10, currentSize - 2) });
                }}
                className="w-7 h-7 rounded-lg hover:bg-white text-slate-700 hover:text-slate-900 font-extrabold text-base flex items-center justify-center transition shadow-2xs"
                title="Perkecil Ukuran Huruf (-)"
              >
                -
              </button>
              <input
                type="number"
                value={properties.fontSize || 16}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val) && val > 0) {
                    onUpdateElementProperties({ fontSize: val });
                  }
                }}
                className="w-12 text-center text-sm font-extrabold text-slate-900 bg-transparent focus:outline-none"
                title="Ukuran Huruf (px)"
              />
              <button
                type="button"
                onClick={() => {
                  const currentSize = properties.fontSize || 16;
                  onUpdateElementProperties({ fontSize: Math.min(120, currentSize + 2) });
                }}
                className="w-7 h-7 rounded-lg hover:bg-white text-slate-700 hover:text-slate-900 font-extrabold text-base flex items-center justify-center transition shadow-2xs"
                title="Perbesar Ukuran Huruf (+)"
              >
                +
              </button>
            </div>

            {/* Warna Teks (Tombol 'A' dengan Color Bar Khas Canva) */}
            <div className="relative">
              <label
                className="h-10 px-3 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 flex items-center gap-1.5 cursor-pointer transition shadow-2xs"
                title="Pilih Warna Teks"
              >
                <div className="flex flex-col items-center justify-center w-5">
                  <span className="font-black text-sm text-slate-900 leading-none">A</span>
                  <span
                    className="w-4 h-1 rounded-full mt-0.5 border border-slate-300"
                    style={{ backgroundColor: color || '#000000' }}
                  />
                </div>
                <input
                  type="color"
                  value={color || '#000000'}
                  onChange={(e) => onUpdateElementColor(e.target.value)}
                  className="w-0 h-0 opacity-0 absolute pointer-events-none"
                />
              </label>
            </div>

            <div className="h-6 w-px bg-slate-200" />

            {/* Grup Formatting: B, I, U, S, aA (Persis seperti Canva) */}
            <div className="flex items-center gap-1">
              {/* Bold (B) */}
              <button
                type="button"
                onClick={() =>
                  onUpdateElementProperties({
                    fontWeight: properties.fontWeight === 'extrabold' || properties.fontWeight === 'bold' ? 'normal' : 'bold'
                  })
                }
                className={`w-9 h-10 rounded-xl flex items-center justify-center font-black transition border shadow-2xs ${
                  properties.fontWeight === 'bold' || properties.fontWeight === 'extrabold'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
                title="Tebalkan Huruf (Bold)"
              >
                <Bold className="w-4 h-4" />
              </button>

              {/* Italic (I) */}
              <button
                type="button"
                onClick={() =>
                  onUpdateElementProperties({
                    fontStyle: properties.fontStyle === 'italic' ? 'normal' : 'italic'
                  })
                }
                className={`w-9 h-10 rounded-xl flex items-center justify-center font-black transition border shadow-2xs ${
                  properties.fontStyle === 'italic'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
                title="Miringkan Huruf (Italic)"
              >
                <Italic className="w-4 h-4" />
              </button>

              {/* Underline (U) */}
              <button
                type="button"
                onClick={() =>
                  onUpdateElementProperties({
                    textDecoration: properties.textDecoration === 'underline' ? 'none' : 'underline'
                  })
                }
                className={`w-9 h-10 rounded-xl flex items-center justify-center font-black transition border shadow-2xs ${
                  properties.textDecoration === 'underline'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
                title="Garis Bawah (Underline)"
              >
                <Underline className="w-4 h-4" />
              </button>

              {/* Strikethrough (S) */}
              <button
                type="button"
                onClick={() =>
                  onUpdateElementProperties({
                    textDecoration: properties.textDecoration === 'line-through' ? 'none' : 'line-through'
                  })
                }
                className={`w-9 h-10 rounded-xl flex items-center justify-center font-black transition border shadow-2xs ${
                  properties.textDecoration === 'line-through'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
                title="Coret Teks (Strikethrough)"
              >
                <Strikethrough className="w-4 h-4" />
              </button>

              {/* Uppercase Toggle (aA) */}
              <button
                type="button"
                onClick={() =>
                  onUpdateElementProperties({
                    textTransform: properties.textTransform === 'uppercase' ? 'none' : 'uppercase'
                  })
                }
                className={`px-2.5 h-10 rounded-xl flex items-center justify-center font-black text-xs transition border shadow-2xs ${
                  properties.textTransform === 'uppercase'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
                title="Ubah Huruf Kapital (aA)"
              >
                aA
              </button>
            </div>

            <div className="h-6 w-px bg-slate-200" />

            {/* Alignment Segmented Control */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 h-10 shadow-2xs">
              <button
                type="button"
                onClick={() => onUpdateElementProperties({ textAlign: 'left' })}
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition ${
                  properties.textAlign === 'left' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Rata Kiri"
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onUpdateElementProperties({ textAlign: 'center' })}
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition ${
                  properties.textAlign === 'center' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Rata Tengah"
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onUpdateElementProperties({ textAlign: 'right' })}
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition ${
                  properties.textAlign === 'right' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Rata Kanan"
              >
                <AlignRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 2. KONTROL KHUSUS TOMBOL (AC-BTN-03)                              */}
        {/* ================================================================= */}
        {category === 'BUTTON' && (
          <div className="flex items-center gap-2.5">
            {/* Input Label Tombol */}
            <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200 h-10">
              <span className="text-[11px] text-slate-500 font-bold">Label:</span>
              <input
                type="text"
                value={properties.text || ''}
                onChange={(e) => onUpdateElementProperties({ text: e.target.value })}
                className="bg-transparent text-xs font-bold w-28 text-slate-900 focus:outline-none"
                placeholder="Teks Tombol"
              />
            </div>

            {/* Bentuk Tombol (AC-BTN-01) */}
            <div className="relative flex items-center">
              <select
                value={properties.buttonVariant || 'rounded'}
                onChange={(e) => onUpdateElementProperties({ buttonVariant: e.target.value as any })}
                className="h-10 pl-3 pr-7 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-800 cursor-pointer appearance-none transition focus:outline-none"
                title="Bentuk Tombol"
              >
                <option value="rounded">Rounded</option>
                <option value="pill">Pill (Kapsul)</option>
                <option value="outline">Outline</option>
                <option value="solid">Solid Kotak</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 pointer-events-none" />
            </div>

            {/* Warna Latar & Teks Swatches */}
            <div className="flex items-center gap-2 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200 h-10">
              <label className="flex items-center gap-1.5 cursor-pointer" title="Ubah Warna Latar Tombol">
                <span className="text-[10px] font-bold text-slate-500">Latar:</span>
                <span
                  className="w-5 h-5 rounded-lg border border-slate-300 shadow-2xs"
                  style={{ backgroundColor: color || '#2563eb' }}
                />
                <input
                  type="color"
                  value={color || '#2563eb'}
                  onChange={(e) => onUpdateElementColor(e.target.value)}
                  className="w-0 h-0 opacity-0 absolute pointer-events-none"
                />
              </label>

              <div className="h-4 w-px bg-slate-300" />

              <label className="flex items-center gap-1.5 cursor-pointer" title="Ubah Warna Teks Tombol">
                <span className="text-[10px] font-bold text-slate-500">Teks:</span>
                <span
                  className="w-5 h-5 rounded-lg border border-slate-300 shadow-2xs"
                  style={{ backgroundColor: properties.buttonTextColor || '#ffffff' }}
                />
                <input
                  type="color"
                  value={properties.buttonTextColor || '#ffffff'}
                  onChange={(e) => onUpdateElementProperties({ buttonTextColor: e.target.value })}
                  className="w-0 h-0 opacity-0 absolute pointer-events-none"
                />
              </label>
            </div>

            {/* Tipe Tautan (AC-BTN-03) */}
            <div className="flex items-center gap-1.5 bg-blue-50/80 px-2.5 py-1 rounded-xl border border-blue-200 h-10 shadow-2xs">
              <span className="text-[10px] text-blue-700 font-black uppercase tracking-wider">
                Tujuan:
              </span>
              <select
                value={properties.linkType || 'wa'}
                onChange={(e) => onUpdateElementProperties({ linkType: e.target.value as any })}
                className="px-2 py-1 rounded-lg border border-blue-300 text-xs font-bold text-blue-900 bg-white"
              >
                <option value="canvas">Perpindahan Kanvas</option>
                <option value="wa">WhatsApp Langsung</option>
                <option value="url">Tautan Web / URL</option>
              </select>

              {properties.linkType === 'canvas' && (
                <select
                  value={properties.targetCanvasId || allCanvases[0]?.id || ''}
                  onChange={(e) => onUpdateElementProperties({ targetCanvasId: e.target.value })}
                  className="px-2 py-1 rounded-lg border border-blue-300 text-xs font-semibold bg-white"
                  title="Pilih Kanvas Tujuan"
                >
                  {allCanvases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title || `Kanvas ${c.pageIndex}`}
                    </option>
                  ))}
                </select>
              )}

              {properties.linkType === 'wa' && (
                <input
                  type="text"
                  value={properties.waNumber || '081234567890'}
                  onChange={(e) => onUpdateElementProperties({ waNumber: e.target.value })}
                  placeholder="0812xxxx"
                  className="w-28 px-2 py-1 rounded-lg border border-blue-300 text-xs bg-white font-semibold"
                  title="Nomor WhatsApp"
                />
              )}

              {properties.linkType === 'url' && (
                <input
                  type="text"
                  value={properties.linkUrl || 'https://'}
                  onChange={(e) => onUpdateElementProperties({ linkUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-32 px-2 py-1 rounded-lg border border-blue-300 text-xs bg-white"
                  title="Alamat Web"
                />
              )}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 3. KONTROL KHUSUS KARTU PRODUK (AC-PRD-03..04)                   */}
        {/* ================================================================= */}
        {category === 'PRODUCT' && properties.cardData && (
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => replaceImgInputRef.current?.click()}
              className="h-10 px-3.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold border border-blue-200 flex items-center gap-1.5 transition shadow-2xs"
              title="Ganti Foto Produk (AC-PRD-04)"
            >
              <Upload className="w-4 h-4" />
              <span>Ganti Foto Produk</span>
            </button>

            <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200 h-10">
              <span className="text-[11px] text-slate-500 font-bold">Judul:</span>
              <input
                type="text"
                value={properties.cardData.title}
                onChange={(e) =>
                  onUpdateElementProperties({
                    cardData: {
                      ...properties.cardData!,
                      title: e.target.value
                    }
                  })
                }
                className="w-28 bg-transparent text-xs font-bold text-slate-900 focus:outline-none"
                placeholder="Nama Produk"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200 h-10">
              <span className="text-[11px] text-slate-500 font-bold">Harga:</span>
              <input
                type="text"
                value={properties.cardData.price || ''}
                onChange={(e) =>
                  onUpdateElementProperties({
                    cardData: {
                      ...properties.cardData!,
                      price: e.target.value
                    }
                  })
                }
                className="w-24 bg-transparent text-xs font-black text-emerald-700 focus:outline-none"
                placeholder="Rp 0"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200 h-10">
              <span className="text-[11px] text-slate-500 font-bold">Deskripsi:</span>
              <input
                type="text"
                value={properties.cardData.description || ''}
                onChange={(e) =>
                  onUpdateElementProperties({
                    cardData: {
                      ...properties.cardData!,
                      description: e.target.value
                    }
                  })
                }
                className="w-48 bg-transparent text-xs font-medium text-slate-700 focus:outline-none"
                placeholder="Deskripsi singkat produk..."
                title="Sunting Deskripsi Produk"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200 h-10">
              <span className="text-[11px] text-slate-500 font-bold">CTA:</span>
              <input
                type="text"
                value={properties.cardData.buttonText}
                onChange={(e) =>
                  onUpdateElementProperties({
                    cardData: {
                      ...properties.cardData!,
                      buttonText: e.target.value
                    }
                  })
                }
                className="w-24 bg-transparent text-xs font-semibold focus:outline-none"
                placeholder="Label Tombol"
              />
            </div>

            {/* Warna Latar Kartu Swatch */}
            <label className="h-10 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center gap-1.5 cursor-pointer shadow-2xs" title="Warna Latar Kartu">
              <span className="text-[10px] font-bold text-slate-500">Latar:</span>
              <span
                className="w-5 h-5 rounded-lg border border-slate-300 shadow-2xs"
                style={{ backgroundColor: color || '#ffffff' }}
              />
              <input
                type="color"
                value={color || '#ffffff'}
                onChange={(e) => onUpdateElementColor(e.target.value)}
                className="w-0 h-0 opacity-0 absolute pointer-events-none"
              />
            </label>
          </div>
        )}

        {/* ================================================================= */}
        {/* 4. KONTROL KHUSUS NAVIGASI (AC-NAV-02)                            */}
        {/* ================================================================= */}
        {category === 'NAV' && (
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200 h-10">
              <span className="text-[11px] text-slate-500 font-bold">Brand:</span>
              <input
                type="text"
                value={properties.navBrand || 'Toko Saya'}
                onChange={(e) => onUpdateElementProperties({ navBrand: e.target.value })}
                className="bg-transparent text-xs font-black w-28 text-slate-900 focus:outline-none"
                placeholder="Nama Toko"
              />
            </div>

            {/* Tombol Konfigurasi Daftar Menu (AC-NAV-02) */}
            <button
              type="button"
              onClick={onOpenNavConfigModal}
              className="h-10 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold flex items-center gap-2 shadow-md shadow-blue-600/20 transition active:scale-95"
            >
              <Compass className="w-4 h-4" />
              <span>Kelola Menu Navigasi ({properties.navItems?.length || 0})</span>
            </button>

            {/* Warna Latar Navbar */}
            <label className="h-10 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center gap-1.5 cursor-pointer shadow-2xs" title="Warna Latar Navbar">
              <span className="text-[10px] font-bold text-slate-500">Latar:</span>
              <span
                className="w-5 h-5 rounded-lg border border-slate-300 shadow-2xs"
                style={{ backgroundColor: color || '#ffffff' }}
              />
              <input
                type="color"
                value={color || '#ffffff'}
                onChange={(e) => onUpdateElementColor(e.target.value)}
                className="w-0 h-0 opacity-0 absolute pointer-events-none"
              />
            </label>
          </div>
        )}

        {/* ================================================================= */}
        {/* 5. KONTROL KHUSUS GAMBAR                                          */}
        {/* ================================================================= */}
        {category === 'IMAGE' && (
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => replaceImgInputRef.current?.click()}
              className="h-10 px-3.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold border border-blue-200 flex items-center gap-1.5 transition shadow-2xs"
            >
              <Upload className="w-4 h-4" />
              <span>Ganti Gambar</span>
            </button>

            <select
              value={properties.objectFit || 'cover'}
              onChange={(e) => onUpdateElementProperties({ objectFit: e.target.value as any })}
              className="h-10 px-3 rounded-xl border border-slate-200 text-xs font-bold bg-slate-100 text-slate-800"
            >
              <option value="cover">Penuh (Cover)</option>
              <option value="contain">Proporsional (Contain)</option>
            </select>
          </div>
        )}
      </div>

      {/* Bagian Kanan: Tombol Posisi (Layer), Duplikat, Hapus (Gaya Canva) */}
      <div className="flex items-center gap-2 shrink-0 pl-3 border-l border-slate-200">
        {/* Tombol Posisi (Khas Canva "Posisi") */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowPosisiMenu(!showPosisiMenu)}
            className="h-10 px-3 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition border border-slate-200 shadow-2xs"
            title="Atur Urutan Lapisan (Posisi)"
          >
            <Layers className="w-4 h-4 text-slate-600" />
            <span>Posisi</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showPosisiMenu && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-12 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-30 w-44 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150"
            >
              <button
                type="button"
                onClick={() => {
                  onBringForward();
                  setShowPosisiMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-2 transition"
              >
                <ArrowUp className="w-4 h-4 text-blue-600" />
                <span>Bawa Maju (Depan)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onSendBackward();
                  setShowPosisiMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-2 transition"
              >
                <ArrowDown className="w-4 h-4 text-blue-600" />
                <span>Kirim Mundur (Belakang)</span>
              </button>
            </div>
          )}
        </div>

        {/* Duplicate Element Button */}
        <button
          type="button"
          onClick={onDuplicateElement}
          className="h-10 px-3 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition border border-slate-200 shadow-2xs"
          title="Duplikasi Elemen (Ctrl+D)"
        >
          <Copy className="w-4 h-4" />
          <span className="hidden md:inline">Duplikat</span>
        </button>

        {/* Delete Element Button */}
        <button
          type="button"
          onClick={onDeleteElement}
          className="h-10 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs flex items-center gap-1.5 transition border border-red-200 shadow-2xs"
          title="Hapus Elemen (Delete / Backspace)"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden md:inline">Hapus</span>
        </button>
      </div>
    </div>
  );
}
