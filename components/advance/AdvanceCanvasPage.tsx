'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Copy,
  Trash2,
  Palette,
  ExternalLink,
  Phone,
  Compass,
  ArrowRight,
  Upload,
  Check,
  Maximize2,
  Edit3
} from 'lucide-react';
import {
  AdvanceCanvas,
  CanvasElement,
  CANVAS_DEFAULT_WIDTH,
  CANVAS_DEFAULT_HEIGHT
} from '@/lib/advanceTypes';

export interface AdvanceCanvasPageProps {
  canvas: AdvanceCanvas;
  isActive: boolean;
  canDelete: boolean;
  selectedElementId: string | null;
  allCanvases: AdvanceCanvas[];
  onSelectCanvas: () => void;
  onSelectElement: (elementId: string | null) => void;
  onUpdateElementPosition: (elementId: string, posX: number, posY: number) => void;
  onUpdateElementSize: (elementId: string, width: number, height: number, posX?: number, posY?: number) => void;
  onUpdateElementText: (elementId: string, newText: string) => void;
  onUpdateProductCardText: (elementId: string, updates: { title?: string; price?: string; description?: string; buttonText?: string }) => void;
  onDuplicateCanvas: (canvasId: string) => void;
  onDeleteCanvas: (canvasId: string) => void;
  onUpdateCanvasBackground: (canvasId: string, bg: { color?: string; image?: string }) => void;
  onTriggerImageUploadForElement: (elementId: string) => void;
  onOpenNavConfigModal: () => void;
  onDuplicateElement?: () => void;
  onDeleteElement?: () => void;
}

export default function AdvanceCanvasPage({
  canvas,
  isActive,
  canDelete,
  selectedElementId,
  allCanvases,
  onSelectCanvas,
  onSelectElement,
  onUpdateElementPosition,
  onUpdateElementSize,
  onUpdateElementText,
  onUpdateProductCardText,
  onDuplicateCanvas,
  onDeleteCanvas,
  onUpdateCanvasBackground,
  onTriggerImageUploadForElement,
  onOpenNavConfigModal,
  onDuplicateElement,
  onDeleteElement
}: AdvanceCanvasPageProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [editingProductField, setEditingProductField] = useState<{
    elementId: string;
    field: 'title' | 'price' | 'description' | 'buttonText';
  } | null>(null);
  const [showBgPicker, setShowBgPicker] = useState(false);

  // Smart Snap Alignment Guides (Gaya Canva)
  const [activeGuides, setActiveGuides] = useState<{
    type: 'vertical' | 'horizontal';
    pos: number;
    label?: string;
  }[]>([]);

  const elementsRef = useRef<CanvasElement[]>(canvas.elements);
  useEffect(() => {
    elementsRef.current = canvas.elements;
  }, [canvas.elements]);

  // Dragging State
  const dragRef = useRef<{
    isDragging: boolean;
    elementId: string;
    startX: number;
    startY: number;
    initialPosX: number;
    initialPosY: number;
    width: number;
    height: number;
  }>({
    isDragging: false,
    elementId: '',
    startX: 0,
    startY: 0,
    initialPosX: 0,
    initialPosY: 0,
    width: 0,
    height: 0
  });

  // Resizing State
  const resizeRef = useRef<{
    isResizing: boolean;
    elementId: string;
    handle: 'se' | 'sw' | 'ne' | 'nw';
    startX: number;
    startY: number;
    initialWidth: number;
    initialHeight: number;
    initialPosX: number;
    initialPosY: number;
  }>({
    isResizing: false,
    elementId: '',
    handle: 'se',
    startX: 0,
    startY: 0,
    initialWidth: 0,
    initialHeight: 0,
    initialPosX: 0,
    initialPosY: 0
  });

  // Global mousemove and mouseup listeners for smooth drag & resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // 1. Dragging element with Smart Auto-Snap & Canva Alignment Guides
      if (dragRef.current.isDragging) {
        const dx = e.clientX - dragRef.current.startX;
        const dy = e.clientY - dragRef.current.startY;
        const elId = dragRef.current.elementId;
        const elWidth = dragRef.current.width;
        const elHeight = dragRef.current.height;

        let rawX = dragRef.current.initialPosX + dx;
        let rawY = dragRef.current.initialPosY + dy;

        const SNAP_THRESHOLD = 7;
        const currentGuides: { type: 'vertical' | 'horizontal'; pos: number; label?: string }[] = [];
        const otherElements = elementsRef.current.filter((item) => item.id !== elId);

        // A. HORIZONTAL SNAPPING (X AXIS ALIGNMENT)
        let bestDiffX = SNAP_THRESHOLD + 1;
        let snappedX = rawX;
        let guideX: { type: 'vertical'; pos: number; label: string } | null = null;

        // Snap to Canvas Center (500px)
        const canvasCenterX = Math.round(CANVAS_DEFAULT_WIDTH / 2);
        const currentCenterX = rawX + elWidth / 2;
        const centerCanvasDiff = Math.abs(currentCenterX - canvasCenterX);
        if (centerCanvasDiff <= SNAP_THRESHOLD && centerCanvasDiff < bestDiffX) {
          bestDiffX = centerCanvasDiff;
          snappedX = canvasCenterX - elWidth / 2;
          guideX = { type: 'vertical', pos: canvasCenterX, label: 'Tengah Kanvas' };
        }

        // Snap against other elements on the active canvas
        for (const other of otherElements) {
          const otherLeft = other.posX;
          const otherCenterX = Math.round(other.posX + other.width / 2);
          const otherRight = other.posX + other.width;

          // 1. Rata Kiri (Left Alignment)
          const diffLeft = Math.abs(rawX - otherLeft);
          if (diffLeft <= SNAP_THRESHOLD && diffLeft < bestDiffX) {
            bestDiffX = diffLeft;
            snappedX = otherLeft;
            guideX = { type: 'vertical', pos: otherLeft, label: 'Rata Kiri' };
          }

          // 2. Rata Tengah (Center Alignment)
          const diffCenter = Math.abs(currentCenterX - otherCenterX);
          if (diffCenter <= SNAP_THRESHOLD && diffCenter < bestDiffX) {
            bestDiffX = diffCenter;
            snappedX = otherCenterX - elWidth / 2;
            guideX = { type: 'vertical', pos: otherCenterX, label: 'Rata Tengah' };
          }

          // 3. Rata Kanan (Right Alignment)
          const diffRight = Math.abs(rawX + elWidth - otherRight);
          if (diffRight <= SNAP_THRESHOLD && diffRight < bestDiffX) {
            bestDiffX = diffRight;
            snappedX = otherRight - elWidth;
            guideX = { type: 'vertical', pos: otherRight, label: 'Rata Kanan' };
          }
        }

        if (guideX) {
          rawX = snappedX;
          currentGuides.push(guideX);
        }

        // B. VERTICAL SNAPPING (Y AXIS ALIGNMENT)
        let bestDiffY = SNAP_THRESHOLD + 1;
        let snappedY = rawY;
        let guideY: { type: 'horizontal'; pos: number; label: string } | null = null;

        const canvasHeight = canvas.height || CANVAS_DEFAULT_HEIGHT;
        const canvasCenterY = Math.round(canvasHeight / 2);
        const currentCenterY = rawY + elHeight / 2;
        const centerCanvasVDiff = Math.abs(currentCenterY - canvasCenterY);
        if (centerCanvasVDiff <= SNAP_THRESHOLD && centerCanvasVDiff < bestDiffY) {
          bestDiffY = centerCanvasVDiff;
          snappedY = canvasCenterY - elHeight / 2;
          guideY = { type: 'horizontal', pos: canvasCenterY, label: 'Tengah Kanvas' };
        }

        // Snap against other elements on the active canvas
        for (const other of otherElements) {
          const otherTop = other.posY;
          const otherCenterY = Math.round(other.posY + other.height / 2);
          const otherBottom = other.posY + other.height;

          // 1. Rata Atas (Top Alignment)
          const diffTop = Math.abs(rawY - otherTop);
          if (diffTop <= SNAP_THRESHOLD && diffTop < bestDiffY) {
            bestDiffY = diffTop;
            snappedY = otherTop;
            guideY = { type: 'horizontal', pos: otherTop, label: 'Rata Atas' };
          }

          // 2. Rata Tengah Vertikal (Vertical Center Alignment)
          const diffCenterY = Math.abs(currentCenterY - otherCenterY);
          if (diffCenterY <= SNAP_THRESHOLD && diffCenterY < bestDiffY) {
            bestDiffY = diffCenterY;
            snappedY = otherCenterY - elHeight / 2;
            guideY = { type: 'horizontal', pos: otherCenterY, label: 'Rata Tengah' };
          }

          // 3. Rata Bawah (Bottom Alignment)
          const diffBottom = Math.abs(rawY + elHeight - otherBottom);
          if (diffBottom <= SNAP_THRESHOLD && diffBottom < bestDiffY) {
            bestDiffY = diffBottom;
            snappedY = otherBottom - elHeight;
            guideY = { type: 'horizontal', pos: otherBottom, label: 'Rata Bawah' };
          }
        }

        if (guideY) {
          rawY = snappedY;
          currentGuides.push(guideY);
        }

        const newX = Math.max(0, Math.min(CANVAS_DEFAULT_WIDTH - 50, Math.round(rawX)));
        const newY = Math.max(0, Math.min(canvasHeight - 30, Math.round(rawY)));

        setActiveGuides(currentGuides);
        onUpdateElementPosition(elId, newX, newY);
      }

      // 2. Resizing element with Smart Dimension Snapping (Ukuran Snap Sama ala Canva)
      if (resizeRef.current.isResizing) {
        const dx = e.clientX - resizeRef.current.startX;
        const dy = e.clientY - resizeRef.current.startY;
        const { handle, initialWidth, initialHeight, initialPosX, initialPosY, elementId } = resizeRef.current;

        const otherElements = elementsRef.current.filter((item) => item.id !== elementId);
        const SNAP_THRESHOLD = 8;
        const currentGuides: { type: 'vertical' | 'horizontal'; pos: number; label?: string }[] = [];

        // A. Hitung ukuran dasar berdasarkan sudut pegangan resize (handle)
        let rawWidth = initialWidth;
        let rawHeight = initialHeight;

        if (handle === 'se') {
          rawWidth = Math.max(60, Math.round(initialWidth + dx));
          rawHeight = Math.max(30, Math.round(initialHeight + dy));
        } else if (handle === 'sw') {
          rawWidth = Math.max(60, Math.round(initialWidth - dx));
          rawHeight = Math.max(30, Math.round(initialHeight + dy));
        } else if (handle === 'ne') {
          rawWidth = Math.max(60, Math.round(initialWidth + dx));
          rawHeight = Math.max(30, Math.round(initialHeight - dy));
        } else if (handle === 'nw') {
          rawWidth = Math.max(60, Math.round(initialWidth - dx));
          rawHeight = Math.max(30, Math.round(initialHeight - dy));
        }

        // B. Smart Snap: Menyamakan Lebar (Width) dengan Elemen Lain (Canva Same Width Snap)
        let bestDiffW = SNAP_THRESHOLD + 1;
        let snappedW = rawWidth;
        let guideW: { type: 'vertical'; pos: number; label: string } | null = null;

        for (const other of otherElements) {
          const diffW = Math.abs(rawWidth - other.width);
          if (diffW <= SNAP_THRESHOLD && diffW < bestDiffW) {
            bestDiffW = diffW;
            snappedW = other.width;
            const targetX = handle.includes('w')
              ? initialPosX + (initialWidth - other.width)
              : initialPosX + other.width;
            guideW = {
              type: 'vertical',
              pos: targetX,
              label: `Lebar Sama (${other.width}px)`
            };
          }
        }

        if (guideW) {
          rawWidth = snappedW;
          currentGuides.push(guideW);
        }

        // C. Smart Snap: Menyamakan Tinggi (Height) dengan Elemen Lain (Canva Same Height Snap)
        let bestDiffH = SNAP_THRESHOLD + 1;
        let snappedH = rawHeight;
        let guideH: { type: 'horizontal'; pos: number; label: string } | null = null;

        for (const other of otherElements) {
          const diffH = Math.abs(rawHeight - other.height);
          if (diffH <= SNAP_THRESHOLD && diffH < bestDiffH) {
            bestDiffH = diffH;
            snappedH = other.height;
            const targetY = handle.includes('n')
              ? initialPosY + (initialHeight - other.height)
              : initialPosY + other.height;
            guideH = {
              type: 'horizontal',
              pos: targetY,
              label: `Tinggi Sama (${other.height}px)`
            };
          }
        }

        if (guideH) {
          rawHeight = snappedH;
          currentGuides.push(guideH);
        }

        // D. Hitung koordinat posisi baru sesuai arah resize
        let newWidth = rawWidth;
        let newHeight = rawHeight;
        let newPosX = initialPosX;
        let newPosY = initialPosY;

        if (handle === 'se') {
          newWidth = rawWidth;
          newHeight = rawHeight;
        } else if (handle === 'sw') {
          newWidth = rawWidth;
          newHeight = rawHeight;
          newPosX = Math.max(0, Math.round(initialPosX + (initialWidth - newWidth)));
        } else if (handle === 'ne') {
          newWidth = rawWidth;
          newHeight = rawHeight;
          newPosY = Math.max(0, Math.round(initialPosY + (initialHeight - newHeight)));
        } else if (handle === 'nw') {
          newWidth = rawWidth;
          newHeight = rawHeight;
          newPosX = Math.max(0, Math.round(initialPosX + (initialWidth - newWidth)));
          newPosY = Math.max(0, Math.round(initialPosY + (initialHeight - newHeight)));
        }

        setActiveGuides(currentGuides);
        onUpdateElementSize(elementId, newWidth, newHeight, newPosX, newPosY);
      }
    };

    const handleMouseUp = () => {
      if (dragRef.current.isDragging || resizeRef.current.isResizing) {
        dragRef.current.isDragging = false;
        resizeRef.current.isResizing = false;
        setActiveGuides([]);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [canvas.height, onUpdateElementPosition, onUpdateElementSize]);

  // Start drag handler
  const handleElementMouseDown = (e: React.MouseEvent, el: CanvasElement) => {
    e.stopPropagation();
    onSelectCanvas();
    onSelectElement(el.id);

    // If currently editing text, don't drag
    if (editingTextId === el.id) return;

    dragRef.current = {
      isDragging: true,
      elementId: el.id,
      startX: e.clientX,
      startY: e.clientY,
      initialPosX: el.posX,
      initialPosY: el.posY,
      width: el.width,
      height: el.height
    };
  };

  // Start resize handler
  const handleResizeMouseDown = (e: React.MouseEvent, el: CanvasElement, handle: 'se' | 'sw' | 'ne' | 'nw') => {
    e.stopPropagation();
    e.preventDefault();
    resizeRef.current = {
      isResizing: true,
      elementId: el.id,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      initialWidth: el.width,
      initialHeight: el.height,
      initialPosX: el.posX,
      initialPosY: el.posY
    };
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onSelectCanvas();
          onSelectElement(null);
          setEditingTextId(null);
        }
      }}
      className={`group relative flex flex-col items-center transition-all duration-200 ${
        isActive ? 'ring-2 ring-blue-500/40 rounded-2xl p-2 bg-blue-50/20' : 'p-2'
      }`}
    >
      {/* ----------------------------------------------------------------- */}
      {/* HEADER KANVAS: INDIKATOR HALAMAN & AKSI KANVAS                    */}
      {/* ----------------------------------------------------------------- */}
      <div className="w-[1000px] mb-2 px-3 py-1.5 flex items-center justify-between text-xs text-slate-600 bg-white/90 backdrop-blur-xs rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <span
            className={`px-2.5 py-0.5 rounded-lg text-[11px] font-black tracking-wide ${
              isActive
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {canvas.title || `Kanvas ${canvas.pageIndex}`}
          </span>
          <span className="text-slate-400 text-[11px]">
            Halaman {canvas.pageIndex} dari {allCanvases.length}
          </span>
          {isActive && (
            <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              ● Aktif
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Quick Bg Color Picker */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowBgPicker(!showBgPicker);
              }}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 flex items-center gap-1 transition"
              title="Ganti Warna Latar Kanvas"
            >
              <Palette className="w-3.5 h-3.5" />
              <span className="text-[11px] font-semibold">Latar</span>
              <span
                className="w-3 h-3 rounded-full border border-slate-300 ml-0.5 shadow-2xs"
                style={{ backgroundColor: canvas.backgroundColor || '#ffffff' }}
              />
            </button>

            {showBgPicker && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-8 z-30 bg-white p-3 rounded-xl shadow-xl border border-slate-200 w-48 space-y-2"
              >
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Warna Latar Kanvas
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  {['#ffffff', '#f8fafc', '#fffbeb', '#eff6ff', '#ecfdf5', '#f5f3ff', '#0f172a', '#172554'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        onUpdateCanvasBackground(canvas.id, { color: c });
                        setShowBgPicker(false);
                      }}
                      className="w-8 h-8 rounded-lg border border-slate-200 hover:scale-110 transition shadow-2xs"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={canvas.backgroundColor || '#ffffff'}
                  onChange={(e) => onUpdateCanvasBackground(canvas.id, { color: e.target.value })}
                  className="w-full h-8 rounded cursor-pointer border border-slate-300"
                />
              </div>
            )}
          </div>

          {/* Duplikasi Kanvas */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicateCanvas(canvas.id);
            }}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 flex items-center gap-1 transition"
            title="Duplikasi Lembar Kanvas Ini"
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium hidden sm:inline">Duplikat</span>
          </button>

          {/* Hapus Kanvas */}
          {canDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteCanvas(canvas.id);
              }}
              className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-700 flex items-center gap-1 transition"
              title="Hapus Kanvas Ini"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium hidden sm:inline">Hapus</span>
            </button>
          )}
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* LEMBAR KANVAS UTAMA (1000px × 650px) - FREE-FORM COORDINATES      */}
      {/* ----------------------------------------------------------------- */}
      <div
        ref={canvasRef}
        id={canvas.id}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onSelectCanvas();
            onSelectElement(null);
            setEditingTextId(null);
          }
        }}
        style={{
          width: `${CANVAS_DEFAULT_WIDTH}px`,
          height: `${canvas.height || CANVAS_DEFAULT_HEIGHT}px`,
          backgroundColor: canvas.backgroundColor || '#ffffff',
          backgroundImage: canvas.backgroundImage ? `url(${canvas.backgroundImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        className="relative shadow-2xl rounded-xl border border-slate-300/80 overflow-hidden select-none cursor-default transition-colors duration-150"
      >
        {/* ============================================================= */}
        {/* SMART ALIGNMENT GUIDES (GARIS BANTU AUTO-SNAP ALA CANVA)       */}
        {/* ============================================================= */}
        {activeGuides.map((guide, idx) => {
          if (guide.type === 'vertical') {
            return (
              <div
                key={`guide-v-${idx}-${guide.pos}`}
                style={{ left: `${guide.pos}px` }}
                className="absolute top-0 bottom-0 w-0.5 bg-blue-500 z-40 pointer-events-none shadow-[0_0_8px_rgba(37,99,235,0.85)] animate-in fade-in duration-75"
              >
                {guide.label && (
                  <span className="absolute top-2.5 left-1.5 bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-md pointer-events-none tracking-tight uppercase whitespace-nowrap">
                    {guide.label}
                  </span>
                )}
              </div>
            );
          } else {
            return (
              <div
                key={`guide-h-${idx}-${guide.pos}`}
                style={{ top: `${guide.pos}px` }}
                className="absolute left-0 right-0 h-0.5 bg-blue-500 z-40 pointer-events-none shadow-[0_0_8px_rgba(37,99,235,0.85)] animate-in fade-in duration-75"
              >
                {guide.label && (
                  <span className="absolute left-2.5 top-1.5 bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-md pointer-events-none tracking-tight uppercase whitespace-nowrap">
                    {guide.label}
                  </span>
                )}
              </div>
            );
          }
        })}

        {/* Render Setiap Elemen di Dalam Kanvas */}
        {canvas.elements.map((el) => {
          const isSelected = selectedElementId === el.id;
          const { category, properties, color } = el;

          return (
            <div
              key={el.id}
              onMouseDown={(e) => handleElementMouseDown(e, el)}
              onClick={(e) => {
                e.stopPropagation();
                onSelectCanvas();
                onSelectElement(el.id);
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                if (category === 'TEXT') {
                  setEditingTextId(el.id);
                } else if (category === 'NAV') {
                  onOpenNavConfigModal();
                } else if (category === 'PRODUCT' || category === 'IMAGE') {
                  onTriggerImageUploadForElement(el.id);
                }
              }}
              style={{
                left: `${el.posX}px`,
                top: `${el.posY}px`,
                width: `${el.width}px`,
                height: `${el.height}px`,
                position: 'absolute'
              }}
              className={`group/el cursor-move transition-shadow ${
                isSelected
                  ? 'ring-2 ring-blue-500 shadow-xl z-30'
                  : 'hover:ring-1 hover:ring-blue-400/60 z-10'
              }`}
            >
              {/* CANVA FLOATING MINI-ACTION PILL DI ATAS/BAWAH ELEMEN (AUTO-FLIP JIKA DI PUCUK ATAS KANVAS) */}
              {isSelected && (() => {
                const isNearTop = el.posY < 48;
                const isNearLeft = el.posX < 30;
                const isNearRight = el.posX + el.width > (CANVAS_DEFAULT_WIDTH - 30);

                let horizontalPos = 'left-1/2 -translate-x-1/2';
                if (isNearLeft) {
                  horizontalPos = 'left-1';
                } else if (isNearRight) {
                  horizontalPos = 'right-1';
                }

                return (
                  <div
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    className={`absolute ${
                      isNearTop ? 'top-full mt-2.5' : '-top-11'
                    } ${horizontalPos} bg-white rounded-full shadow-xl border border-slate-200/90 py-1 px-2.5 flex items-center gap-1.5 z-50 select-none animate-in fade-in zoom-in-95 duration-100 whitespace-nowrap`}
                  >
                    {el.category === 'PRODUCT' && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingProductField({ elementId: el.id, field: 'description' });
                        }}
                        className="p-1.5 rounded-full hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition active:scale-95"
                        title="Sunting Teks & Deskripsi Produk"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {onDuplicateElement && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDuplicateElement();
                        }}
                        className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 hover:text-blue-600 transition active:scale-95"
                        title="Duplikasi Elemen (Ctrl+D)"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {onDeleteElement && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteElement();
                        }}
                        className="p-1.5 rounded-full hover:bg-red-50 text-slate-700 hover:text-red-600 transition active:scale-95"
                        title="Hapus Elemen (Delete / Backspace)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })()}

              {/* ========================================================= */}
              {/* RENDER KATEGORI: TEKS (AC-TXT-01..03)                     */}
              {/* ========================================================= */}
              {category === 'TEXT' && (
                <div className="w-full h-full flex items-center justify-center p-1">
                  {editingTextId === el.id ? (
                    <textarea
                      autoFocus
                      defaultValue={properties.text || ''}
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                      onBlur={(e) => {
                        onUpdateElementText(el.id, e.target.value);
                        setEditingTextId(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          onUpdateElementText(el.id, (e.target as HTMLTextAreaElement).value);
                          setEditingTextId(null);
                        }
                      }}
                      style={{
                        fontFamily: properties.font || 'Inter, sans-serif',
                        fontSize: `${properties.fontSize || 16}px`,
                        fontWeight: properties.fontWeight || 'normal',
                        fontStyle: properties.fontStyle || 'normal',
                        textDecoration: properties.textDecoration || 'none',
                        textTransform: properties.textTransform || 'none',
                        textAlign: properties.textAlign || 'center',
                        color: color || '#000000'
                      }}
                      className="w-full h-full bg-white/95 border-2 border-blue-500 rounded p-1 resize-none focus:outline-none shadow-lg"
                    />
                  ) : (
                    <div
                      style={{
                        fontFamily: properties.font || 'Inter, sans-serif',
                        fontSize: `${properties.fontSize || 16}px`,
                        fontWeight: properties.fontWeight || 'normal',
                        fontStyle: properties.fontStyle || 'normal',
                        textDecoration: properties.textDecoration || 'none',
                        textTransform: properties.textTransform || 'none',
                        textAlign: properties.textAlign || 'center',
                        color: color || '#000000'
                      }}
                      className="w-full break-words select-text"
                    >
                      {properties.text || 'Ketik teks di sini...'}
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================= */}
              {/* RENDER KATEGORI: GAMBAR (AC-IMG-01..02)                   */}
              {/* ========================================================= */}
              {category === 'IMAGE' && (
                <div
                  className="w-full h-full relative overflow-hidden group/img"
                  style={{ borderRadius: `${properties.borderRadius || 12}px` }}
                >
                  <img
                    src={properties.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'}
                    alt="Elemen Gambar"
                    className="w-full h-full"
                    style={{ objectFit: properties.objectFit || 'cover' }}
                  />
                  {isSelected && (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        onTriggerImageUploadForElement(el.id);
                      }}
                      className="absolute inset-0 bg-slate-900/40 backdrop-blur-2xs opacity-0 hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition cursor-pointer"
                    >
                      <Upload className="w-4 h-4 mr-1.5" /> Klik Ganti Gambar
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================= */}
              {/* RENDER KATEGORI: KARTU PRODUK (AC-PRD-01..04)             */}
              {/* ========================================================= */}
              {category === 'PRODUCT' && properties.cardData && (
                <div
                  style={{ backgroundColor: color || '#ffffff' }}
                  className="w-full h-full rounded-2xl shadow-md border border-slate-200/90 p-4 flex flex-col justify-between overflow-hidden"
                >
                  {/* Slot 1: Slot Gambar Produk (AC-PRD-04: Klik untuk trigger upload) */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onTriggerImageUploadForElement(el.id);
                    }}
                    className="relative w-full h-[52%] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group/slot cursor-pointer"
                    title="Klik untuk mengganti foto produk"
                  >
                    <img
                      src={properties.cardData.image}
                      alt={properties.cardData.title}
                      className="w-full h-full object-cover group-hover/slot:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-blue-950/40 opacity-0 group-hover/slot:opacity-100 flex items-center justify-center text-white text-xs font-bold transition">
                      <Upload className="w-4 h-4 mr-1" /> Ganti Foto
                    </div>
                  </div>

                  {/* Slot 2 & 3: Teks Judul & Deskripsi / Harga (100% Identik dengan Mode Preview + Inline Editable) */}
                  <div className="pt-2 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        {editingProductField?.elementId === el.id && editingProductField?.field === 'title' ? (
                          <input
                            autoFocus
                            type="text"
                            defaultValue={properties.cardData.title}
                            spellCheck={false}
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                            onBlur={(e) => {
                              onUpdateProductCardText(el.id, { title: e.target.value });
                              setEditingProductField(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                onUpdateProductCardText(el.id, { title: (e.target as HTMLInputElement).value });
                                setEditingProductField(null);
                              }
                            }}
                            className="font-extrabold text-sm text-slate-900 bg-white border border-blue-500 rounded px-1.5 py-0.5 outline-none shadow-xs flex-1"
                          />
                        ) : (
                          <h4
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              setEditingProductField({ elementId: el.id, field: 'title' });
                            }}
                            className="font-extrabold text-sm text-slate-900 line-clamp-1 cursor-text hover:text-blue-600 transition-colors"
                            title="Klik ganda untuk menyunting judul produk"
                          >
                            {properties.cardData.title}
                          </h4>
                        )}

                        {editingProductField?.elementId === el.id && editingProductField?.field === 'price' ? (
                          <input
                            autoFocus
                            type="text"
                            defaultValue={properties.cardData.price || ''}
                            spellCheck={false}
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                            onBlur={(e) => {
                              onUpdateProductCardText(el.id, { price: e.target.value });
                              setEditingProductField(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                onUpdateProductCardText(el.id, { price: (e.target as HTMLInputElement).value });
                                setEditingProductField(null);
                              }
                            }}
                            className="font-black text-xs text-emerald-700 bg-white border border-emerald-500 rounded px-1.5 py-0.5 outline-none shadow-xs w-24 text-center shrink-0"
                          />
                        ) : (
                          <span
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              setEditingProductField({ elementId: el.id, field: 'price' });
                            }}
                            className="font-black text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0 cursor-text hover:border-emerald-400 transition-colors"
                            title="Klik ganda untuk menyunting harga produk"
                          >
                            {properties.cardData.price || 'Rp 0'}
                          </span>
                        )}
                      </div>

                      {editingProductField?.elementId === el.id && editingProductField?.field === 'description' ? (
                        <textarea
                          autoFocus
                          defaultValue={properties.cardData.description || ''}
                          spellCheck={false}
                          rows={2}
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => e.stopPropagation()}
                          onBlur={(e) => {
                            onUpdateProductCardText(el.id, { description: e.target.value });
                            setEditingProductField(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              onUpdateProductCardText(el.id, { description: (e.target as HTMLTextAreaElement).value });
                              setEditingProductField(null);
                            }
                          }}
                          className="text-[11px] text-slate-700 bg-white border border-blue-500 rounded px-1.5 py-1 outline-none shadow-xs w-full resize-none leading-snug mt-1"
                        />
                      ) : (
                        <p
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            setEditingProductField({ elementId: el.id, field: 'description' });
                          }}
                          className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-snug cursor-text hover:text-slate-800 transition-colors"
                          title="Klik ganda untuk menyunting deskripsi produk"
                        >
                          {properties.cardData.description}
                        </p>
                      )}
                    </div>

                    {/* Slot 4: Satu Tombol Aksi (CTA Button) */}
                    <div className="pt-2">
                      {editingProductField?.elementId === el.id && editingProductField?.field === 'buttonText' ? (
                        <div className="w-full py-2 px-3 rounded-xl bg-blue-600 text-white font-extrabold text-xs shadow-sm flex items-center justify-center gap-1.5">
                          <input
                            autoFocus
                            type="text"
                            defaultValue={properties.cardData.buttonText || 'Pesan Sekarang'}
                            spellCheck={false}
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                            onBlur={(e) => {
                              onUpdateProductCardText(el.id, { buttonText: e.target.value });
                              setEditingProductField(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                onUpdateProductCardText(el.id, { buttonText: (e.target as HTMLInputElement).value });
                                setEditingProductField(null);
                              }
                            }}
                            className="bg-transparent text-white text-center font-extrabold text-xs outline-none border-b border-white w-full"
                          />
                          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                        </div>
                      ) : (
                        <button
                          type="button"
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            setEditingProductField({ elementId: el.id, field: 'buttonText' });
                          }}
                          className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-sm flex items-center justify-center gap-1.5 transition active:scale-98"
                          title="Klik ganda untuk menyunting teks tombol CTA"
                        >
                          <span>{properties.cardData.buttonText || 'Pesan Sekarang'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* RENDER KATEGORI: TOMBOL (AC-BTN-01..03)                   */}
              {/* ========================================================= */}
              {category === 'BUTTON' && (
                <div className="w-full h-full flex items-center justify-center">
                  <div
                    style={{
                      backgroundColor: properties.buttonVariant === 'outline' ? 'transparent' : color || '#2563eb',
                      color: properties.buttonTextColor || '#ffffff',
                      border: properties.buttonVariant === 'outline' ? `2px solid ${color || '#0f172a'}` : 'none'
                    }}
                    className={`w-full h-full flex items-center justify-center gap-2 font-bold text-xs shadow-sm px-4 ${
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
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* RENDER KATEGORI: NAVIGASI (AC-NAV-01..02)                 */}
              {/* ========================================================= */}
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
                      <span
                        key={item.id}
                        className="text-xs font-semibold hover:text-blue-600 transition cursor-pointer"
                      >
                        {item.label}
                      </span>
                    ))}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenNavConfigModal();
                      }}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition"
                      title="Konfigurasi Menu Navigasi (AC-NAV-02)"
                    >
                      Kelola Menu
                    </button>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* RESIZE HANDLES (Section 4 Resize Item - White/Blue Canva) */}
              {/* ========================================================= */}
              {isSelected && (
                <>
                  {/* Top-Left Handle (NW) */}
                  <div
                    onMouseDown={(e) => handleResizeMouseDown(e, el, 'nw')}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-white border-2 border-blue-600 rounded-sm cursor-nwse-resize shadow-xs z-30"
                  />
                  {/* Top-Right Handle (NE) */}
                  <div
                    onMouseDown={(e) => handleResizeMouseDown(e, el, 'ne')}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-blue-600 rounded-sm cursor-nesw-resize shadow-xs z-30"
                  />
                  {/* Bottom-Left Handle (SW) */}
                  <div
                    onMouseDown={(e) => handleResizeMouseDown(e, el, 'sw')}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-white border-2 border-blue-600 rounded-sm cursor-nesw-resize shadow-xs z-30"
                  />
                  {/* Bottom-Right Handle (SE) */}
                  <div
                    onMouseDown={(e) => handleResizeMouseDown(e, el, 'se')}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-blue-600 rounded-sm cursor-nwse-resize shadow-xs z-30"
                  />
                </>
              )}
            </div>
          );
        })}

        {/* Empty Canvas Placeholder Guide */}
        {canvas.elements.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-slate-400 pointer-events-none">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <Maximize2 className="w-7 h-7" />
            </div>
            <h4 className="text-sm font-extrabold text-slate-700">
              {canvas.title || `Kanvas ${canvas.pageIndex}`} Kosong Siap Didesain
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Gunakan panel palet di sisi kiri untuk menambahkan Teks, Unggah Gambar, Kartu Produk, Tombol, atau Navigasi.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
