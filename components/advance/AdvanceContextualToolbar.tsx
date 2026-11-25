'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  SlidersHorizontal,
  Check,
  Sparkles,
  Shapes,
  Square,
  Circle,
  Triangle,
  Star,
  Heart,
  ArrowRight,
  Hexagon,
  Minus,
  Scissors,
  X
} from 'lucide-react';
import {
  CanvasElement,
  AdvanceCanvas,
  ShapeType
} from '@/lib/advanceTypes';
import {
  findOverlappingMaskTarget,
  MASK_SHAPE_OPTIONS
} from '@/lib/advanceMaskUtils';

export interface AdvanceContextualToolbarProps {
  selectedElement: CanvasElement | null;
  selectedElements?: CanvasElement[];
  activeCanvas: AdvanceCanvas | null;
  allCanvases: AdvanceCanvas[];
  onUpdateElementProperties: (properties: Partial<CanvasElement['properties']>) => void;
  onUpdateElementColor: (color: string) => void;
  onDeleteElement: () => void;
  onDuplicateElement: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onOpenNavConfigModal: () => void;
  onMaskWithElement?: (targetElementId: string, sourceElementIdOverride?: string) => void;
  onUnmaskElement?: () => void;
}

export default function AdvanceContextualToolbar({
  selectedElement,
  selectedElements = [],
  activeCanvas,
  allCanvases,
  onUpdateElementProperties,
  onUpdateElementColor,
  onDeleteElement,
  onDuplicateElement,
  onBringForward,
  onSendBackward,
  onOpenNavConfigModal,
  onMaskWithElement,
  onUnmaskElement
}: AdvanceContextualToolbarProps) {
  const replaceImgInputRef = useRef<HTMLInputElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  type ActiveMenu = 'none' | 'posisi' | 'shape' | 'border' | 'opacity' | 'mask';
  const [activeMenu, setActiveMenu] = useState<ActiveMenu>('none');
  const [popoverAlign, setPopoverAlign] = useState<'left' | 'right'>('left');

  const toggleMenu = (menu: ActiveMenu, e?: React.MouseEvent<HTMLElement>) => {
    if (activeMenu === menu) {
      setActiveMenu('none');
      return;
    }
    if (e?.currentTarget && typeof window !== 'undefined') {
      const rect = e.currentTarget.getBoundingClientRect();
      if (rect.left < 280) {
        setPopoverAlign('left');
      } else if (window.innerWidth - rect.left < 280) {
        setPopoverAlign('right');
      } else {
        setPopoverAlign('left');
      }
    }
    setActiveMenu(menu);
  };

  // Close menus when clicking outside the toolbar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setActiveMenu('none');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset open menu when selection changes
  const selectionKey = selectedElements.map((e) => e.id).join(',');
  useEffect(() => {
    setActiveMenu('none');
  }, [selectionKey]);

  const effectiveSelected =
    selectedElements.length > 0
      ? selectedElements
      : selectedElement
      ? [selectedElement]
      : [];

  // Jika tidak ada elemen yang dipilih (Floating Status Bar — Single-Line & Responsif HP)
  if (effectiveSelected.length === 0) {
    return (
      <div className="mx-2.5 sm:mx-4 my-1.5 sm:my-2 min-h-[42px] sm:h-12 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl sm:rounded-2xl px-3 sm:px-5 py-1.5 flex items-center justify-between gap-2 text-xs text-slate-500 shadow-sm shadow-slate-900/5 z-20 shrink-0 whitespace-nowrap overflow-x-auto">
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="font-semibold text-slate-700">
            <span className="hidden sm:inline">Kanvas Aktif: </span>
            <strong className="text-slate-900 font-extrabold">{activeCanvas?.title || `Kanvas ${activeCanvas?.pageIndex || 1}`}</strong>
          </span>
          <span className="text-slate-300 hidden lg:inline">|</span>
          <span className="text-slate-500 font-medium hidden lg:inline">Klik elemen atau tahan klik kiri &amp; tarik di kanvas untuk multi-select</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-slate-400 shrink-0">
          <span className="font-medium text-slate-500">1000 × {activeCanvas?.height || 650}px</span>
          <span className="px-2 sm:px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200/80 text-[10px] sm:text-xs">Visual Editor</span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MULTI-SELECT MODE (2+ ELEMEN DIPILIH BERSAMAAN)
  // =========================================================================
  if (effectiveSelected.length > 1) {
    const firstEl = effectiveSelected[0];
    const allSameCategory = effectiveSelected.every((e) => e.category === firstEl.category);
    const sharedCategory = allSameCategory ? firstEl.category : null;
    const allSupportColor = effectiveSelected.every(
      (e) => e.category === 'TEXT' || e.category === 'SHAPE' || e.category === 'BUTTON'
    );

    // Opsi Mask muncul otomatis jika TEPAT 2 objek dipilih & kombinasi Shape+Shape atau Shape+Image!
    const canMaskTwoSelected =
      effectiveSelected.length === 2 &&
      ((effectiveSelected[0].category === 'SHAPE' && effectiveSelected[1].category === 'SHAPE') ||
        (effectiveSelected[0].category === 'SHAPE' && effectiveSelected[1].category === 'IMAGE') ||
        (effectiveSelected[0].category === 'IMAGE' && effectiveSelected[1].category === 'SHAPE'));

    const currentOpacityPct = Math.round(
      (firstEl.properties.opacity !== undefined ? firstEl.properties.opacity : 1) * 100
    );

    return (
      <div
        ref={toolbarRef}
        className="mx-4 my-2 bg-white rounded-2xl border border-blue-300 shadow-xl shadow-blue-900/10 px-4 py-2 min-h-[58px] flex flex-wrap items-center justify-between text-xs gap-3 shrink-0 z-30 relative overflow-visible animate-in fade-in slide-in-from-top-1 duration-150"
      >
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Badge Jumlah Elemen Terpilih */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white font-extrabold text-xs tracking-wide shadow-sm">
            <Layers className="w-3.5 h-3.5" />
            <span>{effectiveSelected.length} Elemen Dipilih</span>
          </div>

          <div className="h-6 w-px bg-slate-200" />

          {/* TOMBOL MASK 2 OBJEK (Muncul Otomatis saat 2 Objek Shape/Gambar Dipilih Bersamaan!) */}
          {canMaskTwoSelected && onMaskWithElement && (
            <button
              type="button"
              onClick={() => onMaskWithElement(effectiveSelected[1].id, effectiveSelected[0].id)}
              className="h-10 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/25 transition active:scale-95"
              title="Mask 2 objek terpilih (Shape + Gambar atau 2 Shape)"
            >
              <Scissors className="w-4 h-4" />
              <span>Terapkan Mask (2 Objek)</span>
            </button>
          )}

          {/* Edit Properti Bersama: Jika Semua TEKS */}
          {sharedCategory === 'TEXT' && (
            <>
              <select
                value={firstEl.properties.font || 'Inter, sans-serif'}
                onChange={(e) => onUpdateElementProperties({ font: e.target.value })}
                className="h-10 px-3 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 cursor-pointer"
              >
                <option value="Inter, sans-serif">Modern Sans</option>
                <option value="Georgia, serif">Elegant Serif</option>
                <option value="Impact, sans-serif">Bold Impact</option>
                <option value="monospace">Tech Mono</option>
                <option value="cursive">Artisan Script</option>
              </select>

              <div className="flex items-center bg-slate-100 rounded-xl border border-slate-200 p-1 h-10">
                <button
                  type="button"
                  onClick={() =>
                    onUpdateElementProperties({
                      fontSize: Math.max(10, (firstEl.properties.fontSize || 16) - 2)
                    })
                  }
                  className="w-7 h-7 rounded-lg hover:bg-white font-extrabold text-slate-700"
                >
                  -
                </button>
                <span className="w-10 text-center font-extrabold text-slate-800">
                  {firstEl.properties.fontSize || 16}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateElementProperties({
                      fontSize: (firstEl.properties.fontSize || 16) + 2
                    })
                  }
                  className="w-7 h-7 rounded-lg hover:bg-white font-extrabold text-slate-700"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={() =>
                  onUpdateElementProperties({
                    fontWeight: firstEl.properties.fontWeight === 'bold' ? 'normal' : 'bold'
                  })
                }
                className="h-10 w-10 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center font-bold text-slate-700"
                title="Bold Semua Teks"
              >
                <Bold className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Edit Properti Bersama: Warna untuk Teks / Shape / Tombol */}
          {allSupportColor && (
            <label
              className="h-10 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Ubah Warna Semua Elemen Terpilih"
            >
              <span className="text-[10px] font-bold text-slate-500">Warna Bersama:</span>
              <span
                className="w-5 h-5 rounded-lg border border-slate-300"
                style={{ backgroundColor: firstEl.color || '#2563eb' }}
              />
              <input
                type="color"
                value={firstEl.color && firstEl.color !== 'transparent' ? firstEl.color : '#2563eb'}
                onChange={(e) => onUpdateElementColor(e.target.value)}
                className="w-0 h-0 opacity-0 absolute pointer-events-none"
              />
            </label>
          )}

          {/* Edit Properti Bersama: Bayangan untuk Semua Shape */}
          {sharedCategory === 'SHAPE' && (
            <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200 h-10">
              <span className="text-[10px] text-slate-500 font-bold">Bayangan:</span>
              <select
                value={firstEl.properties.shadow || 'none'}
                onChange={(e) => onUpdateElementProperties({ shadow: e.target.value as any })}
                className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="none">Tanpa Bayangan</option>
                <option value="sm">Lembut (Sm)</option>
                <option value="md">Sedang (Md)</option>
                <option value="lg">Elevated (Lg)</option>
              </select>
            </div>
          )}

          <span className="text-[11px] text-slate-400 font-medium hidden md:inline">
            Geser salah satu item untuk memindahkan semua bersamaan
          </span>
        </div>

        {/* Bagian Kanan Multi-Select: Opasitas Bersama, Posisi, Duplikat Semua, Hapus Semua */}
        <div className="flex items-center gap-2 shrink-0 pl-3 border-l border-slate-200">
          {/* Opasitas Bersama */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleMenu('opacity')}
              className={`h-10 px-3 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition shadow-2xs ${
                activeMenu === 'opacity'
                  ? 'bg-blue-50 border-blue-400 text-blue-700'
                  : 'bg-slate-100 hover:bg-slate-200/80 border-slate-200 text-slate-700'
              }`}
              title="Atur Opasitas Semua Elemen Terpilih"
            >
              <SlidersHorizontal className="w-4 h-4 text-slate-600" />
              <span className="font-extrabold font-mono text-slate-900 w-9 text-right">
                {currentOpacityPct}%
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {activeMenu === 'opacity' && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3.5 z-50 w-64 space-y-3 animate-in fade-in slide-in-from-top-1 duration-150"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-800">Transparansi ({effectiveSelected.length} Item)</span>
                  <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={currentOpacityPct}
                      onChange={(e) => {
                        let val = parseInt(e.target.value);
                        if (isNaN(val)) val = 100;
                        val = Math.max(0, Math.min(100, val));
                        onUpdateElementProperties({ opacity: val / 100 });
                      }}
                      className="w-10 bg-transparent text-xs font-extrabold font-mono text-slate-900 text-center outline-none"
                    />
                    <span className="text-xs font-bold text-slate-500">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={currentOpacityPct}
                  onChange={(e) => onUpdateElementProperties({ opacity: parseInt(e.target.value) / 100 })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="grid grid-cols-4 gap-1 pt-1 border-t border-slate-100">
                  {[25, 50, 75, 100].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => onUpdateElementProperties({ opacity: preset / 100 })}
                      className={`py-1 rounded-lg text-[10px] font-bold border transition ${
                        currentOpacityPct === preset
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {preset}%
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onDuplicateElement}
            className="h-10 px-3 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition border border-slate-200"
            title="Duplikasi Semua Elemen Terpilih (Ctrl+D)"
          >
            <Copy className="w-4 h-4" />
            <span className="hidden md:inline">Duplikat</span>
          </button>

          <button
            type="button"
            onClick={onDeleteElement}
            className="h-10 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs flex items-center gap-1.5 transition border border-red-200"
            title="Hapus Semua Elemen Terpilih (Delete)"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden md:inline">Hapus ({effectiveSelected.length})</span>
          </button>
        </div>
      </div>
    );
  }

  // Single-element mode
  const singleElement = effectiveSelected[0];
  const { category, properties, color } = singleElement;
  const overlappingTarget = activeCanvas
    ? findOverlappingMaskTarget(singleElement, activeCanvas.elements)
    : null;

  const handleImageReplace = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      if (url) {
        if (category === 'IMAGE') {
          onUpdateElementProperties({ imageUrl: url });
        } else if (category === 'NAV') {
          onUpdateElementProperties({ navLogoUrl: url });
        } else if (category === 'SHAPE') {
          onUpdateElementProperties({
            maskedLayers: [
              {
                id: `mask-img-${Date.now()}`,
                category: 'IMAGE',
                posX: 0,
                posY: 0,
                width: singleElement.width,
                height: singleElement.height,
                color: '#ffffff',
                properties: {
                  imageUrl: url,
                  objectFit: 'cover'
                }
              }
            ]
          });
          setActiveMenu('none');
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
    <div
      ref={toolbarRef}
      className="mx-2.5 sm:mx-4 my-1.5 sm:my-2 bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-lg shadow-slate-900/5 px-3 sm:px-4 py-1.5 sm:py-2 min-h-[50px] sm:min-h-[58px] flex flex-nowrap md:flex-wrap items-center justify-between text-xs gap-2.5 sm:gap-3 shrink-0 z-30 relative overflow-x-auto md:overflow-visible animate-in fade-in slide-in-from-top-1 duration-150"
    >
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
          {category === 'SHAPE' && <Shapes className="w-3.5 h-3.5 text-blue-600" />}
          {category === 'IMAGE' && <ImageIcon className="w-3.5 h-3.5 text-blue-600" />}
          {category === 'PRODUCT' && <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />}
          {category === 'BUTTON' && <MousePointerClick className="w-3.5 h-3.5 text-blue-600" />}
          {category === 'NAV' && <Compass className="w-3.5 h-3.5 text-blue-600" />}
          <span>
            {category === 'TEXT' && 'Teks'}
            {category === 'SHAPE' && 'Shape'}
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

            {/* Tujuan Tombol Produk (WhatsApp / Kanvas / URL) */}
            <div className="flex items-center gap-1.5 bg-blue-50/80 px-2.5 py-1 rounded-xl border border-blue-200 h-10 shadow-2xs">
              <span className="text-[10px] text-blue-700 font-black uppercase tracking-wider">
                Tujuan:
              </span>
              <select
                value={properties.linkType || (properties.cardData.targetCanvasId ? 'canvas' : properties.cardData.buttonLink && !properties.cardData.buttonLink.includes('wa.me') ? 'url' : 'wa')}
                onChange={(e) => {
                  const nextType = e.target.value as 'canvas' | 'wa' | 'url';
                  onUpdateElementProperties({ linkType: nextType });
                }}
                className="px-2 py-1 rounded-lg border border-blue-300 text-xs font-bold text-blue-900 bg-white"
              >
                <option value="wa">WhatsApp</option>
                <option value="canvas">Pindah Kanvas</option>
                <option value="url">Tautan URL</option>
              </select>

              {(properties.linkType === 'canvas' || (!properties.linkType && properties.cardData.targetCanvasId)) && (
                <select
                  value={properties.targetCanvasId || properties.cardData.targetCanvasId || allCanvases[0]?.id || ''}
                  onChange={(e) =>
                    onUpdateElementProperties({
                      linkType: 'canvas',
                      targetCanvasId: e.target.value,
                      cardData: {
                        ...properties.cardData!,
                        targetCanvasId: e.target.value
                      }
                    })
                  }
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

              {(properties.linkType === 'wa' || (!properties.linkType && !properties.cardData.targetCanvasId && (!properties.cardData.buttonLink || properties.cardData.buttonLink.includes('wa.me')))) && (
                <input
                  type="text"
                  value={properties.waNumber ?? '081234567890'}
                  onChange={(e) => {
                    const num = e.target.value;
                    const clean = num.replace(/[^0-9]/g, '');
                    const formatted = clean.startsWith('0') ? '62' + clean.slice(1) : clean;
                    const msg = `Halo, saya ingin memesan ${properties.cardData?.title || 'produk ini'}.`;
                    onUpdateElementProperties({
                      linkType: 'wa',
                      waNumber: num,
                      cardData: {
                        ...properties.cardData!,
                        buttonLink: formatted ? `https://wa.me/${formatted}?text=${encodeURIComponent(msg)}` : ''
                      }
                    });
                  }}
                  placeholder="0812xxxx"
                  className="w-28 px-2 py-1 rounded-lg border border-blue-300 text-xs bg-white font-semibold"
                  title="Nomor WhatsApp Tujuan"
                />
              )}

              {(properties.linkType === 'url' || (!properties.linkType && properties.cardData.buttonLink && !properties.cardData.buttonLink.includes('wa.me'))) && (
                <input
                  type="text"
                  value={properties.linkUrl ?? properties.cardData.buttonLink ?? 'https://'}
                  onChange={(e) =>
                    onUpdateElementProperties({
                      linkType: 'url',
                      linkUrl: e.target.value,
                      cardData: {
                        ...properties.cardData!,
                        buttonLink: e.target.value
                      }
                    })
                  }
                  placeholder="https://..."
                  className="w-32 px-2 py-1 rounded-lg border border-blue-300 text-xs bg-white"
                  title="Alamat Web Tujuan"
                />
              )}
            </div>

            {/* Pilihan Gaya Desain Kartu Produk */}
            <div className="relative flex items-center">
              <select
                value={properties.cardData.cardVariant || 'modern'}
                onChange={(e) => {
                  const nextVariant = e.target.value as 'modern' | 'badge' | 'warm' | 'minimal' | 'dark';
                  const defaultColors: Record<string, { bg: string; btn: string; badge: string }> = {
                    modern: { bg: '#ffffff', btn: '#2563eb', badge: '' },
                    badge: { bg: '#ffffff', btn: '#059669', badge: '★ Paling Laris' },
                    warm: { bg: '#fffbeb', btn: '#b45309', badge: 'Fresh Oven' },
                    minimal: { bg: '#ffffff', btn: '#0f172a', badge: 'NEW DROP' },
                    dark: { bg: '#0f172a', btn: '#6366f1', badge: 'LIMITED' }
                  };
                  const preset = defaultColors[nextVariant];
                  onUpdateElementColor(preset.bg);
                  onUpdateElementProperties({
                    cardData: {
                      ...properties.cardData!,
                      cardVariant: nextVariant,
                      buttonColor: preset.btn,
                      badgeText: properties.cardData?.badgeText || preset.badge
                    }
                  });
                }}
                className="h-10 pl-3 pr-7 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-800 cursor-pointer appearance-none transition focus:outline-none"
                title="Ubah Gaya Desain Kartu Produk"
              >
                <option value="modern">Gaya: Modern Biru</option>
                <option value="badge">Gaya: Unggulan Badge</option>
                <option value="warm">Gaya: Horizontal Cafe</option>
                <option value="minimal">Gaya: Editorial 0px</option>
                <option value="dark">Gaya: Dark Luxury</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 pointer-events-none" />
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
        {/* 4. KONTROL KHUSUS NAVIGASI (UPLOAD LOGO PERUSAHAAN + MENU)        */}
        {/* ================================================================= */}
        {category === 'NAV' && (
          <div className="flex items-center gap-2 flex-wrap">
            {/* Upload / Ganti Gambar Logo Perusahaan */}
            <button
              type="button"
              onClick={() => replaceImgInputRef.current?.click()}
              className="h-10 px-3.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold border border-blue-200 flex items-center gap-1.5 transition shadow-2xs"
              title="Unggah Gambar Logo Perusahaan (PNG/JPG/SVG)"
            >
              <Upload className="w-4 h-4" />
              <span>{properties.navLogoUrl ? 'Ganti Logo' : 'Upload Logo'}</span>
            </button>

            {properties.navLogoUrl && (
              <button
                type="button"
                onClick={() => onUpdateElementProperties({ navLogoUrl: '' })}
                className="h-10 px-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold border border-red-200 flex items-center gap-1 transition shadow-2xs"
                title="Hapus Gambar Logo"
              >
                <X className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Hapus Logo</span>
              </button>
            )}

            <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200 h-10">
              <span className="text-[11px] text-slate-500 font-bold">Teks:</span>
              <input
                type="text"
                value={properties.navBrand ?? ''}
                onChange={(e) => onUpdateElementProperties({ navBrand: e.target.value })}
                className="bg-transparent text-xs font-black w-28 text-slate-900 focus:outline-none placeholder:font-medium placeholder:text-slate-400"
                placeholder="Opsional..."
              />
            </div>

            {/* Tombol Konfigurasi Daftar Menu (AC-NAV-02) */}
            <button
              type="button"
              onClick={onOpenNavConfigModal}
              className="h-10 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold flex items-center gap-2 shadow-md shadow-blue-600/20 transition active:scale-95"
            >
              <Compass className="w-4 h-4" />
              <span>Kelola Menu ({properties.navItems?.length || 0})</span>
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
        {/* 5. KONTROL KHUSUS GAMBAR (+ MASKING BENTUK SHAPE)                 */}
        {/* ================================================================= */}
        {category === 'IMAGE' && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => replaceImgInputRef.current?.click()}
              className="h-10 px-3.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold border border-blue-200 flex items-center gap-1.5 transition shadow-2xs"
            >
              <Upload className="w-4 h-4" />
              <span>Ganti Gambar</span>
            </button>

            {/* Tombol Masking Bentuk untuk Gambar */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleMenu('mask')}
                className={`h-10 px-3 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition shadow-2xs ${
                  activeMenu === 'mask' || (properties.maskShape && properties.maskShape !== 'none')
                    ? 'bg-blue-50 border-blue-400 text-blue-700'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                }`}
                title="Masking Gambar Sesuai Bentuk Shape"
              >
                <Scissors className="w-4 h-4 text-blue-600" />
                <span>
                  Mask:{' '}
                  {MASK_SHAPE_OPTIONS.find((m) => m.type === (properties.maskShape || 'none'))?.label || 'Normal'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {activeMenu === 'mask' && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute left-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 w-64 space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-150"
                >
                  <span className="text-[11px] font-extrabold text-slate-700 block">
                    Masking Gambar ke Bentuk Shape
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {MASK_SHAPE_OPTIONS.map((opt) => (
                      <button
                        key={opt.type}
                        type="button"
                        onClick={() => {
                          onUpdateElementProperties({ maskShape: opt.type });
                          setActiveMenu('none');
                        }}
                        className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border text-left transition ${
                          (properties.maskShape || 'none') === opt.type
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-slate-50 hover:bg-blue-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Deteksi Otomatis: Jika Gambar Bertumpuk dengan Shape */}
            {overlappingTarget && overlappingTarget.category === 'SHAPE' && onMaskWithElement && (
              <button
                type="button"
                onClick={() => onMaskWithElement(overlappingTarget.id)}
                className="h-10 px-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition active:scale-95"
                title="Gabungkan & Mask gambar ini ke dalam Shape yang bertumpuk"
              >
                <Scissors className="w-4 h-4" />
                <span>Mask ke Shape</span>
              </button>
            )}

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

        {/* ================================================================= */}
        {/* 6. KONTROL KHUSUS SHAPE (BENTUK GEOMETRIS)                        */}
        {/* ================================================================= */}
        {category === 'SHAPE' && (
          <div className="flex items-center gap-2 flex-wrap">
            {/* Shape Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleMenu('shape')}
                className="h-10 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1.5 border border-blue-200 transition shadow-2xs"
                title="Ganti Tipe Bentuk"
              >
                <Shapes className="w-4 h-4 text-blue-600" />
                <span className="capitalize">
                  {properties.shapeType === 'triangle' && 'Segitiga'}
                  {properties.shapeType === 'circle' && 'Lingkaran'}
                  {properties.shapeType === 'star' && 'Bintang'}
                  {properties.shapeType === 'heart' && 'Hati'}
                  {properties.shapeType === 'arrow-right' && 'Panah'}
                  {properties.shapeType === 'hexagon' && 'Segienam'}
                  {properties.shapeType === 'line' && 'Garis'}
                  {properties.shapeType === 'rounded-rect' && 'Kotak Halus'}
                  {(properties.shapeType === 'rectangle' || properties.shapeType === 'square' || !properties.shapeType) && 'Persegi'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-blue-500" />
              </button>

              {activeMenu === 'shape' && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute left-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 w-56 grid grid-cols-3 gap-1.5 animate-in fade-in slide-in-from-top-1 duration-150"
                >
                  {[
                    { type: 'rectangle' as ShapeType, label: 'Persegi' },
                    { type: 'rounded-rect' as ShapeType, label: 'Kotak Halus' },
                    { type: 'circle' as ShapeType, label: 'Lingkaran' },
                    { type: 'triangle' as ShapeType, label: 'Segitiga' },
                    { type: 'star' as ShapeType, label: 'Bintang' },
                    { type: 'heart' as ShapeType, label: 'Hati' },
                    { type: 'arrow-right' as ShapeType, label: 'Panah' },
                    { type: 'hexagon' as ShapeType, label: 'Segienam' },
                    { type: 'line' as ShapeType, label: 'Garis' }
                  ].map((s) => (
                    <button
                      key={s.type}
                      type="button"
                      onClick={() => {
                        onUpdateElementProperties({
                          shapeType: s.type,
                          borderRadius: s.type === 'rounded-rect' ? (properties.borderRadius || 24) : properties.borderRadius
                        });
                        setActiveMenu('none');
                      }}
                      className={`p-2 rounded-xl text-center text-[10px] font-bold border transition flex flex-col items-center gap-1 ${
                        properties.shapeType === s.type
                          ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-xs'
                          : 'border-slate-100 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="capitalize">{s.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Warna Isian Shape */}
            <label
              className="h-10 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Ubah Warna Isian Shape"
            >
              <span className="text-[10px] font-bold text-slate-500">Warna:</span>
              <span
                className="w-5 h-5 rounded-lg border border-slate-300 shadow-2xs"
                style={{ backgroundColor: color || '#2563eb' }}
              />
              <input
                type="color"
                value={color && color !== 'transparent' ? color : '#2563eb'}
                onChange={(e) => onUpdateElementColor(e.target.value)}
                className="w-0 h-0 opacity-0 absolute pointer-events-none"
              />
            </label>

            {/* Tombol Warna Isian Transparan */}
            <button
              type="button"
              onClick={() => onUpdateElementColor(color === 'transparent' ? '#2563eb' : 'transparent')}
              className={`h-9 px-2 rounded-xl text-[10px] font-extrabold border transition shadow-2xs ${
                color === 'transparent'
                  ? 'bg-red-50 text-red-600 border-red-300 ring-1 ring-red-400'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
              title="Isian Transparan (Hanya Garis Tepi)"
            >
              {color === 'transparent' ? 'Transparan ✓' : 'No Fill'}
            </button>

            {/* Menu Garis Tepi (Border) */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => toggleMenu('border', e)}
                className="h-9 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition shadow-2xs"
                title="Atur Garis Tepi (Border)"
              >
                <div
                  className="w-4 h-4 rounded border-2"
                  style={{
                    borderColor: properties.borderColor || '#0f172a',
                    borderStyle: properties.borderStyle || 'solid'
                  }}
                />
                <span>Border ({properties.borderWidth || 0}px)</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {activeMenu === 'border' && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute left-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3.5 z-50 w-64 space-y-3 animate-in fade-in slide-in-from-top-1 duration-150"
                >
                  {/* Ketebalan Garis */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1.5">
                      Ketebalan Border
                    </label>
                    <div className="flex items-center gap-1">
                      {[0, 1, 2, 4, 6, 8].map((w) => (
                        <button
                          key={w}
                          type="button"
                          onClick={() =>
                            onUpdateElementProperties({
                              borderWidth: w,
                              borderColor: properties.borderColor || '#0f172a'
                            })
                          }
                          className={`flex-1 py-1 rounded-lg text-xs font-bold border transition ${
                            (properties.borderWidth || 0) === w
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {w}px
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Warna Border */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1.5">
                      Warna Border
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={properties.borderColor || '#0f172a'}
                        onChange={(e) =>
                          onUpdateElementProperties({
                            borderColor: e.target.value,
                            borderWidth: properties.borderWidth || 2
                          })
                        }
                        className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                      />
                      <input
                        type="text"
                        value={properties.borderColor || '#0F172A'}
                        onChange={(e) =>
                          onUpdateElementProperties({
                            borderColor: e.target.value,
                            borderWidth: properties.borderWidth || 2
                          })
                        }
                        className="flex-1 px-2.5 py-1 text-xs font-mono rounded-lg border border-slate-300 uppercase"
                        placeholder="#0F172A"
                      />
                    </div>
                  </div>

                  {/* Gaya Garis */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1.5">
                      Gaya Garis
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'solid', label: 'Solid' },
                        { id: 'dashed', label: 'Putus' },
                        { id: 'dotted', label: 'Titik' }
                      ].map((style) => (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() =>
                            onUpdateElementProperties({
                              borderStyle: style.id as any,
                              borderWidth: properties.borderWidth || 2
                            })
                          }
                          className={`py-1 rounded-lg text-[10px] font-bold border transition ${
                            (properties.borderStyle || 'solid') === style.id
                              ? 'bg-blue-50 text-blue-700 border-blue-500 shadow-xs'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {style.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sudut Membulat (Border Radius) untuk Kotak */}
            {(properties.shapeType === 'rectangle' || properties.shapeType === 'rounded-rect' || properties.shapeType === 'square') && (
              <div className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200 h-9" title="Radius Sudut">
                <span className="text-[10px] text-slate-500 font-bold">Sudut:</span>
                <select
                  value={properties.borderRadius ?? (properties.shapeType === 'rounded-rect' ? 24 : 0)}
                  onChange={(e) => onUpdateElementProperties({ borderRadius: parseInt(e.target.value) })}
                  className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value={0}>0px</option>
                  <option value={8}>8px</option>
                  <option value={16}>16px</option>
                  <option value={24}>24px</option>
                  <option value={32}>32px</option>
                  <option value={48}>48px</option>
                </select>
              </div>
            )}

            {/* Efek Bayangan (Shadow) */}
            <div className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200 h-9" title="Efek Bayangan">
              <span className="text-[10px] text-slate-500 font-bold">Shadow:</span>
              <select
                value={properties.shadow || 'none'}
                onChange={(e) => onUpdateElementProperties({ shadow: e.target.value as any })}
                className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="none">None</option>
                <option value="sm">Sm</option>
                <option value="md">Md</option>
                <option value="lg">Lg</option>
              </select>
            </div>

            {/* Fitur Masking untuk Shape (2-Shape Overlap Mask / Image Fill Mask / Unmask) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleMenu('mask')}
                className={`h-10 px-3 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition shadow-2xs ${
                  activeMenu === 'mask' || (properties.maskedLayers && properties.maskedLayers.length > 0)
                    ? 'bg-blue-50 border-blue-400 text-blue-700'
                    : overlappingTarget
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-transparent shadow-md shadow-blue-600/20'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                }`}
                title="Masking Shape dengan Shape Bertumpuk atau Gambar"
              >
                <Scissors className="w-4 h-4" />
                <span>
                  {overlappingTarget
                    ? 'Mask Bertumpuk'
                    : properties.maskedLayers && properties.maskedLayers.length > 0
                    ? `Masked (${properties.maskedLayers.length})`
                    : 'Masking'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {activeMenu === 'mask' && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute left-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3.5 z-50 w-68 space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-150"
                >
                  <span className="text-[11px] font-extrabold text-slate-700 block">
                    Masking Shape & Gambar
                  </span>

                  {/* 1. Mask dengan Elemen Bertumpuk (2 Shape atau Shape + Gambar) */}
                  {overlappingTarget && onMaskWithElement ? (
                    <button
                      type="button"
                      onClick={() => {
                        onMaskWithElement(overlappingTarget.id);
                        setActiveMenu('none');
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md transition active:scale-95"
                    >
                      <Scissors className="w-3.5 h-3.5" />
                      <span>
                        Mask dengan {overlappingTarget.category === 'IMAGE' ? 'Gambar' : 'Shape'} Bertumpuk
                      </span>
                    </button>
                  ) : (
                    <p className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-200/80 leading-snug">
                      💡 <strong>Tips Mask 2 Shape:</strong> Tumpuk 2 shape (atau gambar di atas shape) di kanvas, lalu klik tombol ini untuk memotong/masking otomatis!
                    </p>
                  )}

                  {/* 2. Isi Shape langsung dengan Gambar */}
                  <button
                    type="button"
                    onClick={() => replaceImgInputRef.current?.click()}
                    className="w-full py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Isi Shape dengan Gambar (Mask)</span>
                  </button>

                  {/* 3. Lepas Mask jika sudah ada layer di dalamnya */}
                  {properties.maskedLayers && properties.maskedLayers.length > 0 && onUnmaskElement && (
                    <button
                      type="button"
                      onClick={() => {
                        onUnmaskElement();
                        setActiveMenu('none');
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Lepas Mask (Unmask)</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bagian Kanan: Tombol Opasitas, Posisi (Layer), Duplikat, Hapus (Gaya Canva) */}
      <div className="flex items-center gap-1.5 shrink-0 pl-2.5 border-l border-slate-200">
        {/* Tombol Universal Opasitas / Transparansi (Volume Bar & Persen) */}
        <div className="relative">
          <button
            type="button"
            onClick={(e) => toggleMenu('opacity', e)}
            className={`h-9 px-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition shadow-2xs ${
              activeMenu === 'opacity'
                ? 'bg-blue-50 border-blue-400 text-blue-700'
                : 'bg-slate-100 hover:bg-slate-200/80 border-slate-200 text-slate-700'
            }`}
            title="Atur Transparansi / Opasitas Elemen"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600" />
            <span className="font-extrabold font-mono text-slate-900">
              {Math.round((properties.opacity !== undefined ? properties.opacity : 1) * 100)}%
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {activeMenu === 'opacity' && (
            <div
              onClick={(e) => e.stopPropagation()}
              className={`absolute ${
                popoverAlign === 'right' ? 'right-0' : 'left-0'
              } top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3.5 z-50 w-64 space-y-3 animate-in fade-in slide-in-from-top-1 duration-150`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-extrabold text-slate-800">Transparansi</span>
                </div>
                {/* Angka yang bisa diketik persennya */}
                <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={Math.round((properties.opacity !== undefined ? properties.opacity : 1) * 100)}
                    onChange={(e) => {
                      let val = parseInt(e.target.value);
                      if (isNaN(val)) val = 100;
                      val = Math.max(0, Math.min(100, val));
                      onUpdateElementProperties({ opacity: val / 100 });
                    }}
                    className="w-10 bg-transparent text-xs font-extrabold font-mono text-slate-900 text-center outline-none"
                  />
                  <span className="text-xs font-bold text-slate-500">%</span>
                </div>
              </div>

              {/* Volume Bar Slider */}
              <div className="space-y-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={Math.round((properties.opacity !== undefined ? properties.opacity : 1) * 100)}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    onUpdateElementProperties({ opacity: val / 100 });
                  }}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none"
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-400 px-0.5">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="grid grid-cols-4 gap-1 pt-1 border-t border-slate-100">
                {[25, 50, 75, 100].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => onUpdateElementProperties({ opacity: preset / 100 })}
                    className={`py-1 text-center rounded-lg text-[10px] font-bold border transition ${
                      Math.round((properties.opacity !== undefined ? properties.opacity : 1) * 100) === preset
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {preset}%
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tombol Posisi (Khas Canva "Posisi") */}
        <div className="relative">
          <button
            type="button"
            onClick={(e) => toggleMenu('posisi', e)}
            className="h-9 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-bold text-xs flex items-center gap-1 transition border border-slate-200 shadow-2xs"
            title="Atur Urutan Lapisan (Posisi)"
          >
            <Layers className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden 2xl:inline">Posisi</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {activeMenu === 'posisi' && (
            <div
              onClick={(e) => e.stopPropagation()}
              className={`absolute ${
                popoverAlign === 'right' ? 'right-0' : 'left-0'
              } top-full mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 p-1.5 z-50 w-44 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150`}
            >
              <button
                type="button"
                onClick={() => {
                  onBringForward();
                  setActiveMenu('none');
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
                  setActiveMenu('none');
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
          className="h-9 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-bold text-xs flex items-center gap-1 transition border border-slate-200 shadow-2xs"
          title="Duplikasi Elemen (Ctrl+D)"
        >
          <Copy className="w-3.5 h-3.5" />
          <span className="hidden 2xl:inline">Duplikat</span>
        </button>

        {/* Delete Element Button */}
        <button
          type="button"
          onClick={onDeleteElement}
          className="h-9 px-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs flex items-center gap-1 transition border border-red-200 shadow-2xs"
          title="Hapus Elemen (Delete / Backspace)"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden 2xl:inline">Hapus</span>
        </button>
      </div>
    </div>
  );
}
