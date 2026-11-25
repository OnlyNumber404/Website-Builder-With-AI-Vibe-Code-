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
import AdvanceShapeRenderer from '@/components/advance/AdvanceShapeRenderer';
import { getShapeClipPath, HEART_CLIP_PATH_D } from '@/lib/advanceMaskUtils';

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
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 animate-in fade-in duration-150">
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

      {/* Viewport Website (Optimized 60fps Opaque Scroll Surface) */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center gap-6 bg-slate-900 will-change-scroll">
        <svg width="0" height="0" className="absolute pointer-events-none" aria-hidden="true">
          <defs>
            <clipPath id="nexa-clip-heart" clipPathUnits="objectBoundingBox">
              <path d={HEART_CLIP_PATH_D} />
            </clipPath>
          </defs>
        </svg>
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
              backgroundPosition: 'center',
              contain: 'layout paint'
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
                    position: 'absolute',
                    opacity: properties.opacity !== undefined ? properties.opacity : 1
                  }}
                >
                  {/* TEXT (Exact Left/Center/Right Alignment Match) */}
                  {category === 'TEXT' && (
                    <div
                      style={{
                        fontFamily: properties.font || 'Inter, sans-serif',
                        fontSize: `${properties.fontSize || 16}px`,
                        fontWeight: properties.fontWeight || 'normal',
                        fontStyle: properties.fontStyle || 'normal',
                        textDecoration: properties.textDecoration || 'none',
                        textTransform: properties.textTransform || 'none',
                        textAlign: properties.textAlign || 'center',
                        justifyContent:
                          properties.textAlign === 'left'
                            ? 'flex-start'
                            : properties.textAlign === 'right'
                            ? 'flex-end'
                            : 'center',
                        color: color || '#000000'
                      }}
                      className="w-full h-full flex items-center break-words leading-snug"
                    >
                      <span className="w-full">{properties.text}</span>
                    </div>
                  )}

                  {/* SHAPE + MASKED LAYERS */}
                  {category === 'SHAPE' && (() => {
                    const hasMaskLayers = properties.maskedLayers && properties.maskedLayers.length > 0;
                    const clipPathVal = hasMaskLayers
                      ? getShapeClipPath(properties.shapeType, properties.borderRadius)
                      : undefined;

                    return (
                      <div className="w-full h-full relative">
                        <AdvanceShapeRenderer
                          shapeType={properties.shapeType}
                          fillColor={color || '#2563eb'}
                          borderColor={properties.borderColor}
                          borderWidth={properties.borderWidth}
                          borderStyle={properties.borderStyle}
                          borderRadius={properties.borderRadius}
                          opacity={1}
                          shadow={properties.shadow}
                        />
                        {hasMaskLayers && (
                          <div
                            className="absolute inset-0 overflow-hidden"
                            style={{ clipPath: clipPathVal }}
                          >
                            {properties.maskedLayers!.map((layer) => (
                              <div
                                key={layer.id}
                                style={{
                                  position: 'absolute',
                                  left: `${layer.posX}px`,
                                  top: `${layer.posY}px`,
                                  width: `${layer.width}px`,
                                  height: `${layer.height}px`,
                                  opacity: layer.properties.opacity !== undefined ? layer.properties.opacity : 1
                                }}
                              >
                                {layer.category === 'IMAGE' ? (
                                  <img
                                    src={layer.properties.imageUrl || ''}
                                    alt="Masked Image"
                                    className="w-full h-full"
                                    style={{ objectFit: layer.properties.objectFit || 'cover' }}
                                  />
                                ) : (
                                  <AdvanceShapeRenderer
                                    shapeType={layer.properties.shapeType}
                                    fillColor={layer.color || '#f59e0b'}
                                    borderColor={layer.properties.borderColor}
                                    borderWidth={layer.properties.borderWidth}
                                    borderStyle={layer.properties.borderStyle}
                                    borderRadius={layer.properties.borderRadius}
                                    opacity={1}
                                    shadow={layer.properties.shadow}
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* IMAGE + SHAPE MASK */}
                  {category === 'IMAGE' && (() => {
                    const clipPathVal = getShapeClipPath(properties.maskShape, properties.borderRadius);
                    return (
                      <div
                        className="w-full h-full overflow-hidden"
                        style={{
                          borderRadius: clipPathVal ? undefined : `${properties.borderRadius || 12}px`,
                          clipPath: clipPathVal
                        }}
                      >
                        <img
                          src={properties.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'}
                          alt="Gambar"
                          className="w-full h-full"
                          style={{ objectFit: properties.objectFit || 'cover' }}
                        />
                      </div>
                    );
                  })()}

                  {/* PRODUCT (5 Varian Desain) */}
                  {category === 'PRODUCT' && properties.cardData && (() => {
                    const cd = properties.cardData;
                    const variant = cd.cardVariant || 'modern';
                    const isHorizontal = variant === 'warm';
                    const isBadge = variant === 'badge';
                    const isMinimal = variant === 'minimal';
                    const isDark = variant === 'dark';

                    const cardOuterClass = isMinimal
                      ? 'rounded-none border-2 border-slate-900 shadow-[4px_4px_0px_#0f172a] p-3.5 flex flex-col justify-between'
                      : isDark
                      ? 'rounded-3xl border border-indigo-500/40 shadow-2xl p-4 flex flex-col justify-between'
                      : isBadge
                      ? 'rounded-2xl border border-emerald-200/90 shadow-lg p-0 flex flex-col justify-between'
                      : isHorizontal
                      ? 'rounded-2xl border border-amber-200 shadow-md p-3 flex flex-row gap-3.5 items-stretch'
                      : 'rounded-2xl border border-slate-200/90 shadow-lg p-4 flex flex-col justify-between';

                    const imgWrapperClass = isMinimal
                      ? 'relative w-full h-[54%] rounded-none overflow-hidden bg-slate-100 border border-slate-900'
                      : isDark
                      ? 'relative w-full h-[52%] rounded-2xl overflow-hidden bg-slate-800 border border-slate-700/80'
                      : isBadge
                      ? 'relative w-full h-[54%] rounded-none overflow-hidden bg-emerald-50'
                      : isHorizontal
                      ? 'relative w-[44%] h-full rounded-xl overflow-hidden bg-amber-100 border border-amber-200/80 shrink-0'
                      : 'relative w-full h-[52%] rounded-xl overflow-hidden bg-slate-100';

                    const contentWrapperClass = isBadge
                      ? 'p-3.5 flex-1 flex flex-col justify-between'
                      : isHorizontal
                      ? 'py-0.5 flex-1 flex flex-col justify-between min-w-0'
                      : 'pt-2.5 flex-1 flex flex-col justify-between';

                    const titleClass = isDark
                      ? 'font-extrabold text-sm text-white line-clamp-1'
                      : isMinimal
                      ? 'font-black text-xs uppercase tracking-wider text-slate-900 line-clamp-1'
                      : isHorizontal
                      ? 'font-black text-sm text-amber-950 line-clamp-1'
                      : 'font-extrabold text-sm text-slate-900 line-clamp-1';

                    const descClass = isDark
                      ? 'text-[11px] text-slate-300 line-clamp-2 mt-1 leading-snug'
                      : isHorizontal
                      ? 'text-[11px] text-amber-900/75 line-clamp-2 mt-1 leading-snug'
                      : 'text-[11px] text-slate-500 line-clamp-2 mt-1 leading-snug';

                    const priceClass = isDark
                      ? 'font-black text-xs text-amber-300 bg-amber-400/15 px-2 py-0.5 rounded-full border border-amber-400/30 shrink-0'
                      : isMinimal
                      ? 'font-black text-xs text-slate-900 bg-slate-100 px-2 py-0.5 border border-slate-900 shrink-0'
                      : isHorizontal
                      ? 'font-black text-xs text-amber-900 bg-amber-100 px-2 py-0.5 rounded-lg border border-amber-300 shrink-0'
                      : 'font-black text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0';

                    const resolvedBtnColor =
                      cd.buttonColor ||
                      (isBadge ? '#059669' : isHorizontal ? '#b45309' : isMinimal ? '#0f172a' : isDark ? '#6366f1' : '#2563eb');

                    const btnRadiusClass = isMinimal
                      ? 'rounded-none uppercase tracking-wider'
                      : isBadge || isDark
                      ? 'rounded-full'
                      : 'rounded-xl';

                    return (
                      <div
                        style={{ backgroundColor: color || (isDark ? '#0f172a' : isHorizontal ? '#fffbeb' : '#ffffff') }}
                        className={`w-full h-full overflow-hidden ${cardOuterClass}`}
                      >
                        <div className={imgWrapperClass}>
                          <img
                            src={cd.image}
                            alt={cd.title}
                            className="w-full h-full object-cover"
                          />
                          {cd.badgeText && (
                            <span
                              className={`absolute top-2 left-2 px-2.5 py-0.5 text-[10px] font-black shadow-md ${
                                isBadge
                                  ? 'rounded-full bg-emerald-600 text-white'
                                  : isMinimal
                                  ? 'rounded-none bg-slate-900 text-white tracking-widest'
                                  : isDark
                                  ? 'rounded-full bg-amber-400 text-slate-950 tracking-wider'
                                  : 'rounded-lg bg-amber-600 text-white'
                              }`}
                            >
                              {cd.badgeText}
                            </span>
                          )}
                          {isBadge && (
                            <span className="absolute bottom-2 right-2 px-2.5 py-0.5 rounded-full bg-white/95 text-emerald-700 font-black text-xs shadow-md border border-emerald-200">
                              {cd.price || 'Rp 0'}
                            </span>
                          )}
                        </div>
                        <div className={contentWrapperClass}>
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h4 className={titleClass}>{cd.title}</h4>
                              {!isBadge && <span className={priceClass}>{cd.price || 'Rp 0'}</span>}
                            </div>
                            <p className={descClass}>{cd.description}</p>
                          </div>
                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={() => {
                                const resolvedTargetCanvas = properties.targetCanvasId || cd.targetCanvasId;
                                if (properties.linkType === 'canvas' && resolvedTargetCanvas) {
                                  handleNavClick(resolvedTargetCanvas);
                                } else if (properties.linkType === 'wa' && properties.waNumber) {
                                  const clean = properties.waNumber.replace(/[^0-9]/g, '');
                                  const formatted = clean.startsWith('0') ? '62' + clean.slice(1) : clean;
                                  const msg = `Halo, saya ingin memesan ${cd.title || 'produk ini'}.`;
                                  window.open(`https://wa.me/${formatted}?text=${encodeURIComponent(msg)}`, '_blank');
                                } else if (properties.linkType === 'url' && properties.linkUrl) {
                                  window.open(properties.linkUrl, '_blank');
                                } else if (cd.buttonLink) {
                                  window.open(cd.buttonLink, '_blank');
                                } else if (resolvedTargetCanvas) {
                                  handleNavClick(resolvedTargetCanvas);
                                }
                              }}
                              style={{
                                background: isDark
                                  ? 'linear-gradient(90deg, #4f46e5 0%, #2563eb 100%)'
                                  : resolvedBtnColor
                              }}
                              className={`w-full py-2 px-3 ${btnRadiusClass} hover:opacity-95 text-white font-extrabold text-xs shadow-sm flex items-center justify-center gap-1.5 transition`}
                            >
                              <span>{cd.buttonText || 'Pesan Sekarang'}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

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
                      <div className="flex items-center gap-2.5">
                        {properties.navLogoUrl && (
                          <img
                            src={properties.navLogoUrl}
                            alt={properties.navBrand || 'Logo'}
                            className="h-9 max-w-[160px] object-contain rounded-md"
                          />
                        )}
                        {(properties.navBrand || !properties.navLogoUrl) && (
                          <span className="font-black text-sm tracking-tight">
                            {properties.navBrand || 'Logo'}
                          </span>
                        )}
                      </div>
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
