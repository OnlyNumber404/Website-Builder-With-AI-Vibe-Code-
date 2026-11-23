'use client';

import React from 'react';
import {
  X,
  ExternalLink,
  Phone,
  Compass,
  ArrowRight,
  Eye,
  CheckCircle2
} from 'lucide-react';
import {
  AdvanceCanvas,
  CANVAS_DEFAULT_WIDTH,
  CANVAS_DEFAULT_HEIGHT
} from '@/lib/advanceTypes';

export interface AdvancePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  canvases: AdvanceCanvas[];
}

export default function AdvancePreviewModal({
  isOpen,
  onClose,
  canvases
}: AdvancePreviewModalProps) {
  if (!isOpen) return null;

  const handleNavClick = (targetCanvasId?: string) => {
    if (!targetCanvasId) return;
    const el = document.getElementById(`preview-canvas-${targetCanvasId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleButtonClick = (properties: any) => {
    if (properties.linkType === 'canvas' && properties.targetCanvasId) {
      handleNavClick(properties.targetCanvasId);
    } else if (properties.linkType === 'wa' && properties.waNumber) {
      const cleanPhone = properties.waNumber.replace(/[^0-9]/g, '');
      const formattedPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
      const text = encodeURIComponent(properties.waMessage || 'Halo, saya ingin memesan.');
      window.open(`https://wa.me/${formattedPhone}?text=${text}`, '_blank');
    } else if (properties.linkUrl) {
      window.open(properties.linkUrl, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      {/* Top Bar Preview */}
      <div className="h-14 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between text-white shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight">Pratinjau Live Website</h3>
            <p className="text-[10px] text-slate-400">Interaksi tombol & navigasi aktif</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition"
        >
          <X className="w-4 h-4" />
          <span>Tutup Pratinjau</span>
        </button>
      </div>

      {/* Viewport Website */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center gap-6 bg-slate-900/40">
        {canvases.map((canvas, cIdx) => (
          <div
            key={canvas.id}
            id={`preview-canvas-${canvas.id}`}
            style={{
              width: `${CANVAS_DEFAULT_WIDTH}px`,
              minHeight: `${canvas.height || CANVAS_DEFAULT_HEIGHT}px`,
              backgroundColor: canvas.backgroundColor || '#ffffff',
              backgroundImage: canvas.backgroundImage ? `url(${canvas.backgroundImage})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
            className="relative shadow-2xl rounded-2xl overflow-hidden border border-slate-700/50 shrink-0"
          >
            {canvas.elements.map((el) => {
              const { category, properties, color } = el;

              return (
                <div
                  key={el.id}
                  style={{
                    left: `${el.posX}px`,
                    top: `${el.posY}px`,
                    width: `${el.width}px`,
                    height: `${el.height}px`,
                    position: 'absolute'
                  }}
                >
                  {/* TEXT */}
                  {category === 'TEXT' && (
                    <div
                      style={{
                        fontFamily: properties.font || 'Inter, sans-serif',
                        fontSize: `${properties.fontSize || 16}px`,
                        fontWeight: properties.fontWeight || 'normal',
                        textAlign: properties.textAlign || 'center',
                        color: color || '#000000'
                      }}
                      className="w-full h-full flex items-center justify-center break-words"
                    >
                      {properties.text}
                    </div>
                  )}

                  {/* IMAGE */}
                  {category === 'IMAGE' && (
                    <img
                      src={properties.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'}
                      alt="Gambar"
                      className="w-full h-full"
                      style={{
                        objectFit: properties.objectFit || 'cover',
                        borderRadius: `${properties.borderRadius || 12}px`
                      }}
                    />
                  )}

                  {/* PRODUCT */}
                  {category === 'PRODUCT' && properties.cardData && (
                    <div
                      style={{ backgroundColor: color || '#ffffff' }}
                      className="w-full h-full rounded-2xl shadow-lg border border-slate-200/90 p-4 flex flex-col justify-between overflow-hidden"
                    >
                      <div className="w-full h-[52%] rounded-xl overflow-hidden bg-slate-100">
                        <img
                          src={properties.cardData.image}
                          alt={properties.cardData.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="pt-2 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-extrabold text-sm text-slate-900 line-clamp-1">
                              {properties.cardData.title}
                            </h4>
                            <span className="font-black text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                              {properties.cardData.price || 'Rp 0'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-snug">
                            {properties.cardData.description}
                          </p>
                        </div>
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (properties.cardData?.buttonLink) {
                                window.open(properties.cardData.buttonLink, '_blank');
                              }
                            }}
                            className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-sm flex items-center justify-center gap-1.5 transition"
                          >
                            <span>{properties.cardData.buttonText || 'Pesan Sekarang'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* BUTTON */}
                  {category === 'BUTTON' && (
                    <button
                      type="button"
                      onClick={() => handleButtonClick(properties)}
                      style={{
                        backgroundColor: properties.buttonVariant === 'outline' ? 'transparent' : color || '#2563eb',
                        color: properties.buttonTextColor || '#ffffff',
                        border: properties.buttonVariant === 'outline' ? `2px solid ${color || '#0f172a'}` : 'none'
                      }}
                      className={`w-full h-full flex items-center justify-center gap-2 font-bold text-xs shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98] ${
                        properties.buttonVariant === 'pill'
                          ? 'rounded-full'
                          : properties.buttonVariant === 'rounded'
                          ? 'rounded-xl'
                          : properties.buttonVariant === 'outline'
                          ? 'rounded-xl'
                          : 'rounded-md'
                      }`}
                    >
                      {properties.linkType === 'wa' && <Phone className="w-3.5 h-3.5" />}
                      {properties.linkType === 'canvas' && <Compass className="w-3.5 h-3.5" />}
                      {properties.linkType === 'url' && <ExternalLink className="w-3.5 h-3.5" />}
                      <span>{properties.text || 'Tombol Aksi'}</span>
                    </button>
                  )}

                  {/* NAV */}
                  {category === 'NAV' && (
                    <div
                      style={{
                        backgroundColor: color || '#ffffff',
                        color: properties.color || '#0f172a'
                      }}
                      className={`w-full h-full px-6 flex items-center justify-between border border-slate-200/80 shadow-md ${
                        properties.navVariant === 'floating'
                          ? 'rounded-full backdrop-blur-md'
                          : 'rounded-xl'
                      }`}
                    >
                      <span className="font-black text-sm tracking-tight">
                        {properties.navBrand || 'Toko Saya'}
                      </span>
                      <div className="flex items-center gap-4">
                        {properties.navItems?.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleNavClick(item.targetCanvasId)}
                            className="text-xs font-semibold hover:text-blue-600 transition"
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
