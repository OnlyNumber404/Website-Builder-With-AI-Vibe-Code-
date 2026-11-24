'use client';

import React, { useState, useRef } from 'react';
import {
  Type,
  Image as ImageIcon,
  ShoppingBag,
  MousePointerClick,
  Compass,
  Palette,
  Upload,
  Plus,
  X,
  Sparkles,
  ChevronRight,
  Sliders,
  Check,
  Shapes,
  Square,
  Circle,
  Triangle,
  Star,
  Heart,
  ArrowRight,
  Hexagon,
  Minus
} from 'lucide-react';
import {
  CanvasElement,
  CanvasElementCategory,
  AdvanceCanvas,
  ShapeType,
  CANVAS_DEFAULT_WIDTH,
  CANVAS_DEFAULT_HEIGHT
} from '@/lib/advanceTypes';
import AdvanceShapeRenderer from '@/components/advance/AdvanceShapeRenderer';

export interface AdvancePaletteSidebarProps {
  activeCanvas: AdvanceCanvas;
  allCanvases: AdvanceCanvas[];
  onAddElement: (element: Omit<CanvasElement, 'id'>) => void;
  onUpdateCanvasBackground: (canvasId: string, bg: { color?: string; image?: string }) => void;
  uploadedImages: string[];
  onUploadImage: (imageUrl: string) => void;
}

export type PaletteCategory = 'text' | 'shape' | 'image' | 'product' | 'button' | 'nav' | 'background';

export default function AdvancePaletteSidebar({
  activeCanvas,
  allCanvases,
  onAddElement,
  onUpdateCanvasBackground,
  uploadedImages,
  onUploadImage
}: AdvancePaletteSidebarProps) {
  const [activeTab, setActiveTab] = useState<PaletteCategory | null>('text');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Starter Curated Image Assets
  const starterAssets = [
    {
      id: 'ast-1',
      title: 'Kuliner Nusantara',
      url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'ast-2',
      title: 'Kopi Artisan',
      url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'ast-3',
      title: 'Produk Bakery',
      url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'ast-4',
      title: 'Fashion & Kriya',
      url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80'
    }
  ];

  // Helper untuk menghitung posisi tengah kanvas aktif
  const getCenterCoords = (width: number, height: number) => {
    const canvasWidth = CANVAS_DEFAULT_WIDTH;
    const canvasHeight = activeCanvas.height || CANVAS_DEFAULT_HEIGHT;
    const posX = Math.max(20, Math.round((canvasWidth - width) / 2));
    const posY = Math.max(40, Math.round((canvasHeight - height) / 2));
    return { posX, posY };
  };

  // 1. Text Presets (AC-TXT-01 & AC-TXT-02)
  const handleAddText = (preset: {
    text: string;
    fontSize: number;
    fontWeight: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
    font: string;
    width: number;
    height: number;
    color: string;
  }) => {
    const { posX, posY } = getCenterCoords(preset.width, preset.height);
    onAddElement({
      category: 'TEXT',
      posX,
      posY,
      width: preset.width,
      height: preset.height,
      color: preset.color,
      properties: {
        text: preset.text,
        fontSize: preset.fontSize,
        fontWeight: preset.fontWeight,
        font: preset.font,
        textAlign: 'center'
      }
    });
  };

  // 2. Upload Gambar Handlers (AC-IMG-01 & AC-IMG-02)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      if (url) {
        onUploadImage(url);
        // Otomatis tempatkan di tengah kanvas aktif (AC-IMG-02)
        const width = 360;
        const height = 240;
        const { posX, posY } = getCenterCoords(width, height);
        onAddElement({
          category: 'IMAGE',
          posX,
          posY,
          width,
          height,
          color: '#ffffff',
          properties: {
            imageUrl: url,
            objectFit: 'cover',
            borderRadius: 12
          }
        });
      }
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSelectImageGallery = (imgUrl: string) => {
    const width = 360;
    const height = 240;
    const { posX, posY } = getCenterCoords(width, height);
    onAddElement({
      category: 'IMAGE',
      posX,
      posY,
      width,
      height,
      color: '#ffffff',
      properties: {
        imageUrl: imgUrl,
        objectFit: 'cover',
        borderRadius: 12
      }
    });
  };

  // 3. Product Card Presets (AC-PRD-01..03)
  const handleAddProductCard = (variant: 'modern' | 'minimal' | 'badge' | 'warm') => {
    const width = 320;
    const height = 400;
    const { posX, posY } = getCenterCoords(width, height);

    const defaultImages = [
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80'
    ];
    const chosenImg = defaultImages[Math.floor(Math.random() * defaultImages.length)];

    let cardBg = '#ffffff';
    let btnColor = '#2563eb';

    if (variant === 'badge') {
      btnColor = '#059669';
    } else if (variant === 'warm') {
      cardBg = '#fffbeb';
      btnColor = '#d97706';
    } else if (variant === 'minimal') {
      btnColor = '#0f172a';
    }

    onAddElement({
      category: 'PRODUCT',
      posX,
      posY,
      width,
      height,
      color: cardBg,
      properties: {
        cardData: {
          title: 'Paket Spesial Nusantara',
          description: 'Cita rasa rempah istimewa dibuat higienis dan segar setiap hari.',
          image: chosenImg,
          price: 'Rp 28.000',
          buttonText: 'Pesan Sekarang',
          buttonLink: 'https://wa.me/6281234567890?text=Halo%20saya%20mau%20pesan'
        },
        buttonVariant: 'rounded',
        buttonTextColor: '#ffffff'
      }
    });
  };

  // 4. Button Presets (AC-BTN-01..02)
  const handleAddButton = (variant: 'rounded' | 'pill' | 'outline' | 'solid', color: string, textColor: string) => {
    const width = 200;
    const height = 50;
    const { posX, posY } = getCenterCoords(width, height);

    onAddElement({
      category: 'BUTTON',
      posX,
      posY,
      width,
      height,
      color,
      properties: {
        text: 'Hubungi Kami',
        buttonVariant: variant,
        buttonTextColor: textColor,
        fontSize: 15,
        fontWeight: 'bold',
        linkType: 'wa',
        waNumber: '081234567890',
        waMessage: 'Halo, saya ingin menanyakan informasi produk.'
      }
    });
  };

  // 5. Navigation Presets (AC-NAV-01)
  const handleAddNavbar = (variant: 'classic' | 'minimal' | 'floating' | 'dark') => {
    const width = 940;
    const height = 64;
    // Diletakkan di bagian atas kanvas aktif
    const posX = Math.round((CANVAS_DEFAULT_WIDTH - width) / 2);
    const posY = 20;

    let bg = '#ffffff';
    let textColor = '#0f172a';

    if (variant === 'dark') {
      bg = '#0f172a';
      textColor = '#f8fafc';
    } else if (variant === 'floating') {
      bg = 'rgba(255, 255, 255, 0.9)';
    }

    onAddElement({
      category: 'NAV',
      posX,
      posY,
      width,
      height,
      color: bg,
      properties: {
        navBrand: '',
        navLogoUrl: '',
        navVariant: variant,
        color: textColor,
        navItems: [
          { id: 'nav-1', label: 'Beranda', targetCanvasId: allCanvases[0]?.id || activeCanvas.id },
          { id: 'nav-2', label: 'Produk', targetCanvasId: allCanvases[1]?.id || activeCanvas.id },
          { id: 'nav-3', label: 'Tentang', targetCanvasId: allCanvases[2]?.id || activeCanvas.id },
          { id: 'nav-4', label: 'Kontak', targetCanvasId: allCanvases[allCanvases.length - 1]?.id || activeCanvas.id }
        ]
      }
    });
  };

  // 6. Shape Presets (AC-SHP-01)
  const [selectedShapeColor, setSelectedShapeColor] = useState<string>('#2563eb');

  const handleAddShape = (
    shapeType: ShapeType,
    colorOverride?: string,
    options?: {
      width?: number;
      height?: number;
      borderColor?: string;
      borderWidth?: number;
      borderStyle?: 'solid' | 'dashed' | 'dotted';
      borderRadius?: number;
      opacity?: number;
      shadow?: 'none' | 'sm' | 'md' | 'lg';
    }
  ) => {
    let width = options?.width || 160;
    let height = options?.height || 160;

    if (shapeType === 'rectangle') {
      width = options?.width || 240;
      height = options?.height || 140;
    } else if (shapeType === 'rounded-rect') {
      width = options?.width || 220;
      height = options?.height || 140;
    } else if (shapeType === 'arrow-right') {
      width = options?.width || 200;
      height = options?.height || 90;
    } else if (shapeType === 'line') {
      width = options?.width || 340;
      height = options?.height || 28;
    }

    const { posX, posY } = getCenterCoords(width, height);
    const shapeColor = colorOverride || selectedShapeColor;

    onAddElement({
      category: 'SHAPE',
      posX,
      posY,
      width,
      height,
      color: shapeColor,
      properties: {
        shapeType,
        borderColor: options?.borderColor || 'transparent',
        borderWidth: options?.borderWidth || 0,
        borderStyle: options?.borderStyle || 'solid',
        borderRadius: options?.borderRadius ?? (shapeType === 'rounded-rect' ? 24 : 0),
        opacity: options?.opacity ?? 1,
        shadow: options?.shadow || 'none'
      }
    });
  };

  const navCategories = [
    { id: 'text', label: 'Teks', icon: Type },
    { id: 'shape', label: 'Shape', icon: Shapes },
    { id: 'image', label: 'Unggah', icon: Upload },
    { id: 'product', label: 'Produk', icon: ShoppingBag },
    { id: 'button', label: 'Tombol', icon: MousePointerClick },
    { id: 'nav', label: 'Navigasi', icon: Compass },
    { id: 'background', label: 'Kanvas', icon: Palette }
  ] as const;

  return (
    <div className="flex h-full z-20">
      {/* Hidden File Input for Image Upload (AC-IMG-01) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* ------------------------------------------------------------------- */}
      {/* DOCK KIRI: IKON KATEGORI PALET (Canva-like Dock)                    */}
      {/* ------------------------------------------------------------------- */}
      <div className="w-18 bg-slate-900 flex flex-col items-center py-3 border-r border-slate-800 text-white shrink-0 select-none">
        <div className="space-y-1.5 w-full px-2">
          {navCategories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveTab(activeTab === cat.id ? null : cat.id)}
                className={`w-full py-2.5 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all text-xs font-semibold ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
                title={cat.label}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] tracking-tight">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* DRAWER KANAN DARI DOCK: ISI DETAIL KATEGORI (AC-ADV-02)             */}
      {/* ------------------------------------------------------------------- */}
      {activeTab && (
        <aside
          aria-label="Panel Laci Komponen"
          className="w-72 bg-white border-r border-slate-200/90 shadow-xl flex flex-col h-full overflow-hidden animate-in slide-in-from-left-2 duration-150"
        >
          {/* Header Drawer */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                {activeTab === 'text' && 'Gaya Huruf & Teks'}
                {activeTab === 'shape' && 'Shape & Bentuk Geometris'}
                {activeTab === 'image' && 'Unggah Galeri Gambar'}
                {activeTab === 'product' && 'Template Kartu Produk'}
                {activeTab === 'button' && 'Varian Tombol CTA'}
                {activeTab === 'nav' && 'Bilah Navigasi (Navbar)'}
                {activeTab === 'background' && 'Latar Belakang Kanvas'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab(null)}
              className="p-1 rounded-lg hover:bg-slate-200/70 text-slate-400 hover:text-slate-700 transition"
              title="Tutup Panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Konten Drawer Berdasarkan Kategori */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            {/* ============================================================= */}
            {/* 1. TEKS (AC-TXT-01..03)                                       */}
            {/* ============================================================= */}
            {activeTab === 'text' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-500 font-medium">
                  Klik salah satu preset huruf untuk menambahkannya tepat di titik tengah kanvas aktif.
                </p>

                {/* Heading 1 */}
                <div
                  onClick={() =>
                    handleAddText({
                      text: 'Judul Utama Spektakuler',
                      fontSize: 42,
                      fontWeight: 'extrabold',
                      font: 'Inter, sans-serif',
                      width: 550,
                      height: 70,
                      color: '#0f172a'
                    })
                  }
                  className="p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md cursor-pointer transition bg-white group"
                >
                  <span className="text-2xl font-black text-slate-900 group-hover:text-blue-600">
                    Tambahkan Judul Utama
                  </span>
                  <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400">
                    <span>Heading 1 • 42px Bold</span>
                    <span className="text-blue-600 font-bold opacity-0 group-hover:opacity-100 transition">+ Tambah</span>
                  </div>
                </div>

                {/* Subheading */}
                <div
                  onClick={() =>
                    handleAddText({
                      text: 'Subjudul informatif penjelas nilai usaha Anda',
                      fontSize: 22,
                      fontWeight: 'semibold',
                      font: 'Inter, sans-serif',
                      width: 480,
                      height: 50,
                      color: '#334155'
                    })
                  }
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md cursor-pointer transition bg-white group"
                >
                  <span className="text-lg font-bold text-slate-700 group-hover:text-blue-600">
                    Tambahkan Subjudul
                  </span>
                  <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
                    <span>Subheading • 22px Semibold</span>
                    <span className="text-blue-600 font-bold opacity-0 group-hover:opacity-100 transition">+ Tambah</span>
                  </div>
                </div>

                {/* Paragraph */}
                <div
                  onClick={() =>
                    handleAddText({
                      text: 'Tuliskan deskripsi lengkap atau keterangan menarik mengenai produk dan penawaran terbaik Anda di sini.',
                      fontSize: 15,
                      fontWeight: 'normal',
                      font: 'Inter, sans-serif',
                      width: 420,
                      height: 60,
                      color: '#64748b'
                    })
                  }
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md cursor-pointer transition bg-white group"
                >
                  <span className="text-sm text-slate-600 group-hover:text-blue-600">
                    Tambahkan Teks Paragraf Keterangan
                  </span>
                  <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
                    <span>Body • 15px Regular</span>
                    <span className="text-blue-600 font-bold opacity-0 group-hover:opacity-100 transition">+ Tambah</span>
                  </div>
                </div>

                {/* Font Presets Spesial */}
                <div className="pt-2">
                  <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                    Kombinasi Gaya Font Populer
                  </h4>
                  <div className="grid grid-cols-1 gap-2.5">
                    {/* Modern Clean Sans */}
                    <button
                      type="button"
                      onClick={() =>
                        handleAddText({
                          text: 'EKSKLUSIF & MODERN',
                          fontSize: 26,
                          fontWeight: 'extrabold',
                          font: 'sans-serif',
                          width: 380,
                          height: 50,
                          color: '#1e1b4b'
                        })
                      }
                      className="p-3 text-left rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition"
                    >
                      <p className="font-sans font-black tracking-widest text-slate-900 text-sm">
                        EKSKLUSIF & MODERN
                      </p>
                      <span className="text-[10px] text-slate-400">Sans Serif • All Caps</span>
                    </button>

                    {/* Elegant Serif */}
                    <button
                      type="button"
                      onClick={() =>
                        handleAddText({
                          text: 'Keanggunan Rasa Tradisi',
                          fontSize: 30,
                          fontWeight: 'bold',
                          font: 'Georgia, serif',
                          width: 420,
                          height: 55,
                          color: '#451a03'
                        })
                      }
                      className="p-3 text-left rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition"
                    >
                      <p className="font-serif italic font-bold text-amber-950 text-base">
                        Keanggunan Rasa Tradisi
                      </p>
                      <span className="text-[10px] text-slate-400">Serif • Klasik Mewah</span>
                    </button>

                    {/* Bold Impact / Badge */}
                    <button
                      type="button"
                      onClick={() =>
                        handleAddText({
                          text: 'PROMO SPESIAL 50% HARI INI!',
                          fontSize: 24,
                          fontWeight: 'extrabold',
                          font: 'Impact, sans-serif',
                          width: 440,
                          height: 50,
                          color: '#dc2626'
                        })
                      }
                      className="p-3 text-left rounded-xl bg-red-50 hover:bg-red-100/70 border border-red-200 transition"
                    >
                      <p className="font-mono font-black text-red-600 text-sm tracking-tight">
                        PROMO SPESIAL 50% HARI INI!
                      </p>
                      <span className="text-[10px] text-red-400">Impact • Promo Eye-Catching</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* 2. SHAPE & BENTUK GEOMETRIS (AC-SHP-01)                       */}
            {/* ============================================================= */}
            {activeTab === 'shape' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-500 font-medium">
                  Klik bentuk geometris untuk menambahkannya ke titik tengah kanvas aktif. Anda dapat mengatur ukuran, warna isian, border, dan posisi secara bebas.
                </p>

                {/* Pemilih Warna Cepat Isian Shape */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
                      Warna Isian Shape
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      {selectedShapeColor}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[
                      { name: 'Nexa Blue', color: '#2563eb' },
                      { name: 'Dark Navy', color: '#0f172a' },
                      { name: 'Emerald', color: '#10b981' },
                      { name: 'Amber', color: '#f59e0b' },
                      { name: 'Rose', color: '#ef4444' },
                      { name: 'Violet', color: '#8b5cf6' },
                      { name: 'Cyan', color: '#06b6d4' },
                      { name: 'Putih', color: '#ffffff' }
                    ].map((swatch) => (
                      <button
                        key={swatch.color}
                        type="button"
                        onClick={() => setSelectedShapeColor(swatch.color)}
                        className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
                          selectedShapeColor.toLowerCase() === swatch.color.toLowerCase()
                            ? 'ring-2 ring-blue-600 ring-offset-1 scale-110 shadow-xs border-transparent'
                            : 'border-slate-300 hover:scale-105'
                        }`}
                        style={{ backgroundColor: swatch.color }}
                        title={swatch.name}
                      >
                        {selectedShapeColor.toLowerCase() === swatch.color.toLowerCase() && (
                          <Check
                            className={`w-3.5 h-3.5 ${
                              swatch.color === '#ffffff' ? 'text-slate-900' : 'text-white'
                            }`}
                          />
                        )}
                      </button>
                    ))}
                    {/* Custom Hex Picker */}
                    <label
                      className="w-7 h-7 rounded-lg border border-slate-300 bg-gradient-to-br from-red-400 via-amber-300 via-emerald-400 to-blue-500 flex items-center justify-center cursor-pointer hover:scale-105 transition shadow-2xs"
                      title="Pilih Warna Kustom"
                    >
                      <input
                        type="color"
                        value={selectedShapeColor}
                        onChange={(e) => setSelectedShapeColor(e.target.value)}
                        className="w-0 h-0 opacity-0 absolute pointer-events-none"
                      />
                    </label>
                  </div>
                </div>

                {/* Grid Bentuk Dasar (9 Macam Bentuk Geometris) */}
                <div>
                  <h4 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">
                    Pilihan Bentuk (Klik untuk Tambah)
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { type: 'rectangle' as ShapeType, label: 'Persegi', desc: 'Kotak' },
                      { type: 'rounded-rect' as ShapeType, label: 'Kotak Halus', desc: 'Rounded' },
                      { type: 'circle' as ShapeType, label: 'Lingkaran', desc: 'Circle' },
                      { type: 'triangle' as ShapeType, label: 'Segitiga', desc: 'Triangle' },
                      { type: 'star' as ShapeType, label: 'Bintang', desc: 'Star 5-pt' },
                      { type: 'heart' as ShapeType, label: 'Hati / Love', desc: 'Heart' },
                      { type: 'arrow-right' as ShapeType, label: 'Panah', desc: 'Arrow' },
                      { type: 'hexagon' as ShapeType, label: 'Segienam', desc: 'Hexagon' },
                      { type: 'line' as ShapeType, label: 'Garis', desc: 'Divider' }
                    ].map((shp) => (
                      <button
                        key={shp.type}
                        type="button"
                        onClick={() => handleAddShape(shp.type)}
                        className="p-2 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 hover:shadow-md bg-white flex flex-col items-center justify-center gap-1.5 transition group active:scale-95"
                        title={`Tambahkan ${shp.label} (${shp.desc})`}
                      >
                        <div className="w-10 h-10 flex items-center justify-center">
                          <AdvanceShapeRenderer
                            shapeType={shp.type}
                            fillColor={selectedShapeColor}
                            borderRadius={shp.type === 'rounded-rect' ? 8 : 2}
                            className="w-8 h-8 drop-shadow-xs"
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-700 group-hover:text-blue-600 text-center leading-tight">
                          {shp.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preset Gaya Shape Populer */}
                <div className="pt-2">
                  <h4 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">
                    Preset Gaya Populer
                  </h4>
                  <div className="grid grid-cols-1 gap-2.5">
                    {/* Outline / Bingkai Transparan */}
                    <button
                      type="button"
                      onClick={() =>
                        handleAddShape('rounded-rect', 'transparent', {
                          borderColor: selectedShapeColor,
                          borderWidth: 3,
                          borderRadius: 20
                        })
                      }
                      className="p-3 text-left rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition flex items-center gap-3 group"
                    >
                      <div className="w-8 h-8 rounded-lg border-2 border-blue-600 shrink-0" />
                      <div>
                        <p className="font-bold text-slate-900 text-xs group-hover:text-blue-600">
                          Kotak Garis Tepi (Outline)
                        </p>
                        <span className="text-[10px] text-slate-500">Border 3px • Latar transparan</span>
                      </div>
                    </button>

                    {/* Badge Bintang Promo Emas */}
                    <button
                      type="button"
                      onClick={() =>
                        handleAddShape('star', '#f59e0b', {
                          shadow: 'md',
                          width: 150,
                          height: 150
                        })
                      }
                      className="p-3 text-left rounded-xl bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200 transition flex items-center gap-3 group"
                    >
                      <div className="w-8 h-8 text-amber-500 flex items-center justify-center shrink-0">
                        <Star className="w-7 h-7 fill-amber-500" />
                      </div>
                      <div>
                        <p className="font-bold text-amber-950 text-xs group-hover:text-amber-700">
                          Bintang Promo Emas
                        </p>
                        <span className="text-[10px] text-amber-600">Bintang warna emas + bayangan</span>
                      </div>
                    </button>

                    {/* Kartu Elevated Lembut */}
                    <button
                      type="button"
                      onClick={() =>
                        handleAddShape('rounded-rect', '#ffffff', {
                          shadow: 'lg',
                          borderColor: '#e2e8f0',
                          borderWidth: 1,
                          borderRadius: 24,
                          width: 280,
                          height: 180
                        })
                      }
                      className="p-3 text-left rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-300 shadow-xs transition flex items-center gap-3 group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 shadow-md shrink-0" />
                      <div>
                        <p className="font-bold text-slate-900 text-xs group-hover:text-blue-600">
                          Kartu Kontainer Elevated
                        </p>
                        <span className="text-[10px] text-slate-500">Latar putih + bayangan halus</span>
                      </div>
                    </button>

                    {/* Garis Pemisah Konten */}
                    <button
                      type="button"
                      onClick={() =>
                        handleAddShape('line', '#94a3b8', {
                          borderWidth: 4,
                          width: 400,
                          height: 28
                        })
                      }
                      className="p-3 text-left rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition flex items-center gap-3 group"
                    >
                      <div className="w-8 h-8 flex items-center justify-center shrink-0">
                        <div className="w-7 h-1 bg-slate-400 rounded-full" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-xs group-hover:text-blue-600">
                          Garis Pembatas Halus
                        </p>
                        <span className="text-[10px] text-slate-500">Divider tebal 4px</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* 3. UNGGAH GAMBAR (AC-IMG-01..02)                              */}
            {/* ============================================================= */}
            {activeTab === 'image' && (
              <div className="space-y-4">
                {/* Tombol Unggah File Lokal */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3.5 px-4 rounded-xl border-2 border-dashed border-blue-400 bg-blue-50/70 hover:bg-blue-100/70 text-blue-700 font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition group"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span>Unggah Gambar dari Perangkat</span>
                  <span className="text-[10px] text-blue-500 font-normal">PNG, JPG, WebP (Maks 5MB)</span>
                </button>

                {/* Galeri Gambar Hasil Unggahan Pengguna */}
                {uploadedImages.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">
                      Gambar Terunggah Anda ({uploadedImages.length})
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {uploadedImages.map((img, idx) => (
                        <div
                          key={`upload-${idx}`}
                          onClick={() => handleSelectImageGallery(img)}
                          className="relative group aspect-video rounded-lg overflow-hidden border border-slate-200 hover:border-blue-500 cursor-pointer shadow-2xs hover:shadow-md transition"
                        >
                          <img src={img} alt="Aset Terunggah" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-blue-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[11px] font-bold transition">
                            + Pasang
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Galeri Starter Aset Siap Pakai */}
                <div>
                  <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                    Koleksi Foto Bebas Royalti
                  </h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    {starterAssets.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleSelectImageGallery(item.url)}
                        className="group relative rounded-xl overflow-hidden border border-slate-200 hover:border-blue-500 cursor-pointer bg-slate-100 transition shadow-2xs hover:shadow-md"
                      >
                        <img src={item.url} alt={item.title} className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="p-1.5 bg-white text-center">
                          <span className="text-[11px] font-semibold text-slate-700 block truncate">
                            {item.title}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* 3. KARTU PRODUK (AC-PRD-01..04)                               */}
            {/* ============================================================= */}
            {activeTab === 'product' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-500 font-medium">
                  Setiap kartu terintegrasi dengan 4 elemen wajib: Slot Gambar, Judul, Deskripsi, dan Tombol CTA.
                </p>

                {/* Varian 1: Modern Rounded */}
                <div
                  onClick={() => handleAddProductCard('modern')}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md cursor-pointer transition bg-white group"
                >
                  <div className="flex gap-3 items-center">
                    <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 font-bold text-xs">
                      Foto Slot
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 group-hover:text-blue-600">
                        Kartu Produk Modern
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        Desain elegan dengan bayangan lembut & tombol biru.
                      </p>
                      <span className="inline-block mt-1 text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        Rp 28.000 • CTA WhatsApp
                      </span>
                    </div>
                  </div>
                </div>

                {/* Varian 2: Badge Accent */}
                <div
                  onClick={() => handleAddProductCard('badge')}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md cursor-pointer transition bg-white group"
                >
                  <div className="flex gap-3 items-center">
                    <div className="w-16 h-16 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 font-bold text-xs">
                      Foto Slot
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 group-hover:text-blue-600">
                        Kartu Menu Unggulan
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        Aksen warna hijau segar cocok untuk kuliner & herbal.
                      </p>
                      <span className="inline-block mt-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        Paling Laris • Hijau Emerald
                      </span>
                    </div>
                  </div>
                </div>

                {/* Varian 3: Warm Cafe */}
                <div
                  onClick={() => handleAddProductCard('warm')}
                  className="p-3.5 rounded-xl border border-amber-200 hover:border-amber-400 hover:shadow-md cursor-pointer transition bg-amber-50/50 group"
                >
                  <div className="flex gap-3 items-center">
                    <div className="w-16 h-16 rounded-lg bg-amber-200 flex items-center justify-center text-amber-800 shrink-0 font-bold text-xs">
                      Foto Slot
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-amber-950 group-hover:text-amber-700">
                        Kartu Artisan & Cafe
                      </h4>
                      <p className="text-[11px] text-amber-800/80 line-clamp-1">
                        Warna krem hangat, cocok untuk kopi dan bakery.
                      </p>
                      <span className="inline-block mt-1 text-[10px] font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                        Artisan Bakery • Warm Amber
                      </span>
                    </div>
                  </div>
                </div>

                {/* Varian 4: Minimal Clean */}
                <div
                  onClick={() => handleAddProductCard('minimal')}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-400 hover:shadow-md cursor-pointer transition bg-white group"
                >
                  <div className="flex gap-3 items-center">
                    <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 shrink-0 font-bold text-xs">
                      Foto Slot
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">
                        Kartu Minimalis Monokrom
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        Garis tipis tegas cocok untuk fashion & kriya.
                      </p>
                      <span className="inline-block mt-1 text-[10px] font-extrabold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        Monokrom • Clean Border
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* 4. TOMBOL (AC-BTN-01..03)                                     */}
            {/* ============================================================= */}
            {activeTab === 'button' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-500 font-medium">
                  Pilih gaya tombol untuk diletakkan di tengah kanvas. Tombol dapat dihubungkan ke WhatsApp, URL, atau perpindahan antar kanvas.
                </p>

                {/* Solid Rounded */}
                <div
                  onClick={() => handleAddButton('rounded', '#2563eb', '#ffffff')}
                  className="p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-sm cursor-pointer transition bg-white group"
                >
                  <button type="button" className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-sm">
                    Solid Rounded (Biru)
                  </button>
                  <div className="flex justify-between items-center mt-2 text-[10px] text-slate-400">
                    <span>Sudut melengkung halus</span>
                    <span className="text-blue-600 font-bold">+ Pasang</span>
                  </div>
                </div>

                {/* Pill Shape (Emerald / WA) */}
                <div
                  onClick={() => handleAddButton('pill', '#059669', '#ffffff')}
                  className="p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-sm cursor-pointer transition bg-white group"
                >
                  <button type="button" className="w-full py-2.5 rounded-full bg-emerald-600 text-white font-bold text-xs shadow-sm">
                    Pill WhatsApp (Hijau)
                  </button>
                  <div className="flex justify-between items-center mt-2 text-[10px] text-slate-400">
                    <span>Bentuk Kapsul (Pill)</span>
                    <span className="text-blue-600 font-bold">+ Pasang</span>
                  </div>
                </div>

                {/* Outline Minimal */}
                <div
                  onClick={() => handleAddButton('outline', '#ffffff', '#0f172a')}
                  className="p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-sm cursor-pointer transition bg-white group"
                >
                  <button type="button" className="w-full py-2.5 rounded-xl border-2 border-slate-900 text-slate-900 font-bold text-xs bg-white">
                    Outline Elegan (Border)
                  </button>
                  <div className="flex justify-between items-center mt-2 text-[10px] text-slate-400">
                    <span>Garis tepi tegas</span>
                    <span className="text-blue-600 font-bold">+ Pasang</span>
                  </div>
                </div>

                {/* Blue Indigo Gradient */}
                <div
                  onClick={() => handleAddButton('pill', '#2563eb', '#ffffff')}
                  className="p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-sm cursor-pointer transition bg-white group"
                >
                  <button type="button" className="w-full py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-md">
                    Gradient Modern (Nexa Blue)
                  </button>
                  <div className="flex justify-between items-center mt-2 text-[10px] text-slate-400">
                    <span>Gaya Premium Glow</span>
                    <span className="text-blue-600 font-bold">+ Pasang</span>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* 5. NAVIGASI (AC-NAV-01..02)                                   */}
            {/* ============================================================= */}
            {activeTab === 'nav' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-500 font-medium">
                  Pilih gaya bilah navigasi untuk ditempatkan di bagian atas kanvas aktif. Menu navigasi dapat dikonfigurasi untuk melompat antar kanvas.
                </p>

                {/* Classic Clean Header */}
                <div
                  onClick={() => handleAddNavbar('classic')}
                  className="p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-sm cursor-pointer transition bg-white group space-y-2"
                >
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                    <span className="font-extrabold text-xs text-slate-900">Brand</span>
                    <div className="flex gap-2 text-[10px] text-slate-600 font-medium">
                      <span>Beranda</span>
                      <span>Menu</span>
                      <span>Kontak</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-500">
                    <span className="font-bold text-slate-700">Navbar Putih Klasik</span>
                    <span className="text-blue-600 font-bold">+ Pasang ke Atas</span>
                  </div>
                </div>

                {/* Floating Modern Navbar */}
                <div
                  onClick={() => handleAddNavbar('floating')}
                  className="p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-sm cursor-pointer transition bg-white group space-y-2"
                >
                  <div className="p-2.5 bg-gradient-to-r from-slate-100 to-blue-50 rounded-full border border-blue-200/80 flex items-center justify-between px-4">
                    <span className="font-extrabold text-xs text-blue-700">Logo</span>
                    <div className="flex gap-2 text-[10px] text-slate-700 font-semibold">
                      <span>Beranda</span>
                      <span>Katalog</span>
                      <span>WhatsApp</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-500">
                    <span className="font-bold text-slate-700">Navbar Floating Melayang</span>
                    <span className="text-blue-600 font-bold">+ Pasang ke Atas</span>
                  </div>
                </div>

                {/* Dark Modern Nav */}
                <div
                  onClick={() => handleAddNavbar('dark')}
                  className="p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-sm cursor-pointer transition bg-white group space-y-2"
                >
                  <div className="p-2.5 bg-slate-900 rounded-lg flex items-center justify-between px-3 text-white">
                    <span className="font-extrabold text-xs text-amber-400">Exclusive</span>
                    <div className="flex gap-2 text-[10px] text-slate-300 font-medium">
                      <span>Home</span>
                      <span>Gallery</span>
                      <span>Order</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-500">
                    <span className="font-bold text-slate-700">Navbar Gelap Modern</span>
                    <span className="text-blue-600 font-bold">+ Pasang ke Atas</span>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* 6. LATAR KANVAS (Section 4)                                   */}
            {/* ============================================================= */}
            {activeTab === 'background' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-500 font-medium">
                  Atur warna latar belakang atau gambar latar untuk lembar kanvas yang sedang aktif ({activeCanvas.title || `Kanvas ${activeCanvas.pageIndex}`}).
                </p>

                {/* Warna Solid Pilihan */}
                <div>
                  <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                    Warna Solid Populer
                  </h4>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { name: 'Putih Bersih', color: '#ffffff' },
                      { name: 'Abu Lembut', color: '#f8fafc' },
                      { name: 'Krem Hangat', color: '#fffbeb' },
                      { name: 'Biru Muda', color: '#eff6ff' },
                      { name: 'Hijau Mint', color: '#ecfdf5' },
                      { name: 'Biru Lembut', color: '#f0f7ff' },
                      { name: 'Slate Gelap', color: '#0f172a' },
                      { name: 'Navy Malam', color: '#172554' }
                    ].map((item) => (
                      <button
                        key={item.color}
                        type="button"
                        onClick={() => onUpdateCanvasBackground(activeCanvas.id, { color: item.color, image: '' })}
                        className={`h-11 rounded-xl border flex items-center justify-center transition-all ${
                          activeCanvas.backgroundColor === item.color
                            ? 'ring-2 ring-blue-600 ring-offset-2 scale-105 border-transparent shadow-sm'
                            : 'border-slate-200 hover:scale-105'
                        }`}
                        style={{ backgroundColor: item.color }}
                        title={item.name}
                      >
                        {activeCanvas.backgroundColor === item.color && (
                          <Check
                            className={`w-4 h-4 ${
                              item.color === '#0f172a' || item.color === '#172554' ? 'text-white' : 'text-blue-700'
                            }`}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Hex Color Input */}
                <div className="pt-2">
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Kode Warna Kustom (Hex)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={activeCanvas.backgroundColor || '#ffffff'}
                      onChange={(e) => onUpdateCanvasBackground(activeCanvas.id, { color: e.target.value, image: '' })}
                      className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                    />
                    <input
                      type="text"
                      value={activeCanvas.backgroundColor || '#ffffff'}
                      onChange={(e) => onUpdateCanvasBackground(activeCanvas.id, { color: e.target.value, image: '' })}
                      className="flex-1 px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 uppercase"
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>

                {/* URL Gambar Latar Belakang */}
                <div className="pt-2">
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Gambar Latar Belakang (URL)
                  </label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={activeCanvas.backgroundImage || ''}
                      onChange={(e) => onUpdateCanvasBackground(activeCanvas.id, { image: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                    />
                    {activeCanvas.backgroundImage && (
                      <button
                        type="button"
                        onClick={() => onUpdateCanvasBackground(activeCanvas.id, { image: '' })}
                        className="text-[11px] text-red-600 hover:underline font-semibold"
                      >
                        Hapus Gambar Latar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        </aside>
      )}
    </div>
  );
}
