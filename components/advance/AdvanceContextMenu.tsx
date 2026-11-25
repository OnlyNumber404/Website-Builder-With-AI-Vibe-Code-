'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  Copy,
  PaintRoller,
  ClipboardPaste,
  CopyPlus,
  Trash2,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  AlignStartHorizontal,
  AlignCenterHorizontal,
  AlignEndHorizontal,
  AlignHorizontalSpaceAround,
  AlignVerticalSpaceAround,
  LayoutGrid,
  Layers,
  ArrowUpToLine,
  ArrowUp,
  ArrowDown,
  ArrowDownToLine,
  Group,
  Ungroup,
  Lock,
  Unlock,
  MoveHorizontal,
  ChevronRight,
  Scissors,
  CheckSquare
} from 'lucide-react';
import { CanvasElement } from '@/lib/advanceTypes';

export type AlignType =
  | 'left'
  | 'center-h'
  | 'right'
  | 'top'
  | 'center-v'
  | 'bottom'
  | 'distribute-h'
  | 'distribute-v'
  | 'tidy-grid';

export type LayerActionType = 'front' | 'forward' | 'backward' | 'back';

export interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
  canvasId: string;
  canvasX?: number;
  canvasY?: number;
  mode: 'element' | 'canvas';
}

export interface AdvanceContextMenuProps {
  menu: ContextMenuState | null;
  selectedElements: CanvasElement[];
  hasClipboard: boolean;
  hasStyleClipboard: boolean;
  onClose: () => void;
  onCopy: () => void;
  onCopyStyle: () => void;
  onPasteStyle: () => void;
  onPaste: (canvasX?: number, canvasY?: number) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onAlign: (type: AlignType) => void;
  onLayerAction: (action: LayerActionType) => void;
  onGroup: () => void;
  onUngroup: () => void;
  onToggleLock: () => void;
  onFitCanvasToSelection: () => void;
  onMaskSelected?: () => void;
  onUnmaskSelected?: () => void;
  onSelectAll: () => void;
}

export default function AdvanceContextMenu({
  menu,
  selectedElements,
  hasClipboard,
  hasStyleClipboard,
  onClose,
  onCopy,
  onCopyStyle,
  onPasteStyle,
  onPaste,
  onDuplicate,
  onDelete,
  onAlign,
  onLayerAction,
  onGroup,
  onUngroup,
  onToggleLock,
  onFitCanvasToSelection,
  onMaskSelected,
  onUnmaskSelected,
  onSelectAll
}: AdvanceContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number }>({ left: 0, top: 0 });
  const [openSubmenu, setOpenSubmenu] = useState<'align' | 'layer' | null>(null);
  const [flipSubmenuLeft, setFlipSubmenuLeft] = useState(false);

  // Clamp menu cleanly within viewport bounds
  useLayoutEffect(() => {
    if (!menu || !menu.isOpen) return;
    setOpenSubmenu(null);
    const el = menuRef.current;
    const menuWidth = el ? el.offsetWidth : 300;
    const menuHeight = el ? el.offsetHeight : 460;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const margin = 12;

    let left = menu.x;
    let top = menu.y;

    if (left + menuWidth + margin > vw) {
      left = Math.max(margin, vw - menuWidth - margin);
    }
    if (top + menuHeight + margin > vh) {
      top = Math.max(margin, vh - menuHeight - margin);
    }

    setPos({ left, top });
    setFlipSubmenuLeft(left + menuWidth + 240 > vw);
  }, [menu]);

  // Close on click outside or Escape
  useEffect(() => {
    if (!menu || !menu.isOpen) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const handleScroll = () => {
      onClose();
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [menu, onClose]);

  if (!menu || !menu.isOpen) return null;

  const isMulti = selectedElements.length > 1;
  const isSingle = selectedElements.length === 1;
  const hasSelection = selectedElements.length > 0;
  const allLocked = hasSelection && selectedElements.every((el) => el.locked);
  const anyLocked = hasSelection && selectedElements.some((el) => el.locked);

  // Check if all selected elements share the same groupId
  const firstGroupId = selectedElements[0]?.groupId;
  const isAlreadyGrouped =
    hasSelection &&
    Boolean(firstGroupId) &&
    selectedElements.every((el) => el.groupId === firstGroupId);

  // Check if 2 selected elements can be masked (at least one SHAPE and other is SHAPE or IMAGE)
  const canMaskPair =
    selectedElements.length === 2 &&
    ((selectedElements[0].category === 'SHAPE' &&
      (selectedElements[1].category === 'SHAPE' || selectedElements[1].category === 'IMAGE')) ||
      (selectedElements[1].category === 'SHAPE' &&
        (selectedElements[0].category === 'SHAPE' || selectedElements[0].category === 'IMAGE')));

  const canUnmaskSingle =
    isSingle &&
    selectedElements[0].category === 'SHAPE' &&
    Boolean(selectedElements[0].properties.maskedLayers?.length);

  const runAndClose = (fn: () => void) => {
    fn();
    onClose();
  };

  // Empty Canvas Right-Click Menu
  if (menu.mode === 'canvas' || !hasSelection) {
    return (
      <div
        ref={menuRef}
        onContextMenu={(e) => e.preventDefault()}
        style={{ left: `${pos.left}px`, top: `${pos.top}px` }}
        className="fixed z-[120] w-[268px] bg-white rounded-2xl shadow-[0_14px_40px_-8px_rgba(15,23,42,0.24)] border border-slate-200/90 py-1.5 select-none animate-in fade-in zoom-in-95 duration-100"
      >
        <button
          type="button"
          disabled={!hasClipboard}
          onClick={() => runAndClose(() => onPaste(menu.canvasX, menu.canvasY))}
          className="w-full px-3.5 py-2 flex items-center justify-between text-left hover:bg-slate-100/90 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <span className="flex items-center gap-3 text-[13.5px] font-medium text-slate-800">
            <ClipboardPaste className="w-[17px] h-[17px] text-slate-600" />
            Tempel di sini
          </span>
          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[11px] font-semibold">
            Ctrl+V
          </span>
        </button>

        <button
          type="button"
          onClick={() => runAndClose(onSelectAll)}
          className="w-full px-3.5 py-2 flex items-center justify-between text-left hover:bg-slate-100/90 transition-colors"
        >
          <span className="flex items-center gap-3 text-[13.5px] font-medium text-slate-800">
            <CheckSquare className="w-[17px] h-[17px] text-slate-600" />
            Pilih semua elemen
          </span>
          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[11px] font-semibold">
            Ctrl+A
          </span>
        </button>
      </div>
    );
  }

  return (
    <div
      ref={menuRef}
      onContextMenu={(e) => e.preventDefault()}
      style={{ left: `${pos.left}px`, top: `${pos.top}px` }}
      className="fixed z-[120] w-[304px] bg-white rounded-2xl shadow-[0_14px_44px_-8px_rgba(15,23,42,0.26)] border border-slate-200/90 py-1.5 select-none animate-in fade-in zoom-in-95 duration-100"
    >
      {/* Badge indikator jumlah elemen jika multi-select */}
      {isMulti && (
        <div className="px-3.5 py-1.5 mb-1 border-b border-slate-100 flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            {selectedElements.length} Elemen Dipilih
          </span>
          {isAlreadyGrouped && (
            <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded">
              Grup
            </span>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* SEKSI 1: SALIN, SALIN GAYA, TEMPEL, DUPLIKAT, HAPUS                 */}
      {/* =================================================================== */}
      <button
        type="button"
        onMouseEnter={() => setOpenSubmenu(null)}
        onClick={() => runAndClose(onCopy)}
        className="w-full px-3.5 py-2 flex items-center justify-between text-left hover:bg-slate-100/90 transition-colors"
      >
        <span className="flex items-center gap-3 text-[13.5px] font-medium text-slate-800">
          <Copy className="w-[17px] h-[17px] text-slate-700" />
          Salin
        </span>
        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[11px] font-semibold">
          Ctrl+C
        </span>
      </button>

      <button
        type="button"
        onMouseEnter={() => setOpenSubmenu(null)}
        onClick={() => runAndClose(onCopyStyle)}
        className="w-full px-3.5 py-2 flex items-center justify-between text-left hover:bg-slate-100/90 transition-colors"
      >
        <span className="flex items-center gap-3 text-[13.5px] font-medium text-slate-800">
          <PaintRoller className="w-[17px] h-[17px] text-slate-700" />
          Salin gaya
        </span>
        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[11px] font-semibold">
          Ctrl+Alt+C
        </span>
      </button>

      {hasStyleClipboard && (
        <button
          type="button"
          disabled={allLocked}
          onMouseEnter={() => setOpenSubmenu(null)}
          onClick={() => runAndClose(onPasteStyle)}
          className="w-full px-3.5 py-2 flex items-center justify-between text-left hover:bg-blue-50/70 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <span className="flex items-center gap-3 text-[13.5px] font-medium text-blue-700">
            <PaintRoller className="w-[17px] h-[17px] text-blue-600" />
            Tempel gaya
          </span>
          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[11px] font-semibold">
            Ctrl+Alt+V
          </span>
        </button>
      )}

      <button
        type="button"
        disabled={!hasClipboard}
        onMouseEnter={() => setOpenSubmenu(null)}
        onClick={() => runAndClose(() => onPaste(menu.canvasX, menu.canvasY))}
        className="w-full px-3.5 py-2 flex items-center justify-between text-left hover:bg-slate-100/90 disabled:opacity-40 disabled:pointer-events-none transition-colors"
      >
        <span className="flex items-center gap-3 text-[13.5px] font-medium text-slate-800">
          <ClipboardPaste className="w-[17px] h-[17px] text-slate-700" />
          Tempel
        </span>
        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[11px] font-semibold">
          Ctrl+V
        </span>
      </button>

      <button
        type="button"
        onMouseEnter={() => setOpenSubmenu(null)}
        onClick={() => runAndClose(onDuplicate)}
        className="w-full px-3.5 py-2 flex items-center justify-between text-left hover:bg-slate-100/90 transition-colors"
      >
        <span className="flex items-center gap-3 text-[13.5px] font-medium text-slate-800">
          <CopyPlus className="w-[17px] h-[17px] text-slate-700" />
          Duplikat
        </span>
        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[11px] font-semibold">
          Ctrl+D
        </span>
      </button>

      <button
        type="button"
        disabled={allLocked}
        onMouseEnter={() => setOpenSubmenu(null)}
        onClick={() => runAndClose(onDelete)}
        className="w-full px-3.5 py-2 flex items-center justify-between text-left hover:bg-red-50/90 group disabled:opacity-40 disabled:pointer-events-none transition-colors"
      >
        <span className="flex items-center gap-3 text-[13.5px] font-medium text-slate-800 group-hover:text-red-600">
          <Trash2 className="w-[17px] h-[17px] text-slate-700 group-hover:text-red-600" />
          Hapus
        </span>
        <span className="px-2 py-0.5 rounded-md bg-slate-100 group-hover:bg-red-100 text-slate-500 group-hover:text-red-600 text-[11px] font-semibold">
          DELETE
        </span>
      </button>

      <div className="my-1.5 border-t border-slate-100" />

      {/* =================================================================== */}
      {/* SEKSI 2: RATA ELEMEN & LAPISAN (SUBMENU FLYOUT)                     */}
      {/* =================================================================== */}
      {/* Submenu: Rata elemen */}
      <div
        className="relative"
        onMouseEnter={() => setOpenSubmenu('align')}
      >
        <button
          type="button"
          disabled={allLocked}
          onClick={() => setOpenSubmenu(openSubmenu === 'align' ? null : 'align')}
          className={`w-full px-3.5 py-2 flex items-center justify-between text-left transition-colors disabled:opacity-40 disabled:pointer-events-none ${
            openSubmenu === 'align' ? 'bg-slate-100' : 'hover:bg-slate-100/90'
          }`}
        >
          <span className="flex items-center gap-3 text-[13.5px] font-medium text-slate-800">
            <AlignStartVertical className="w-[17px] h-[17px] text-slate-700" />
            Rata elemen
          </span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {openSubmenu === 'align' && !allLocked && (
          <div
            className={`absolute top-0 ${
              flipSubmenuLeft ? 'right-full mr-1.5' : 'left-full ml-1.5'
            } w-[228px] bg-white rounded-2xl shadow-[0_14px_40px_-8px_rgba(15,23,42,0.24)] border border-slate-200/90 py-1.5 z-[130] animate-in fade-in duration-75`}
          >
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {isMulti ? 'Ratakan Antar Elemen' : 'Ratakan ke Kanvas'}
            </div>
            <button
              type="button"
              onClick={() => runAndClose(() => onAlign('left'))}
              className="w-full px-3.5 py-1.5 flex items-center gap-2.5 text-[13px] font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <AlignStartVertical className="w-4 h-4 text-slate-500" />
              Rata Kiri
            </button>
            <button
              type="button"
              onClick={() => runAndClose(() => onAlign('center-h'))}
              className="w-full px-3.5 py-1.5 flex items-center gap-2.5 text-[13px] font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <AlignCenterVertical className="w-4 h-4 text-slate-500" />
              Tengah Horizontal
            </button>
            <button
              type="button"
              onClick={() => runAndClose(() => onAlign('right'))}
              className="w-full px-3.5 py-1.5 flex items-center gap-2.5 text-[13px] font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <AlignEndVertical className="w-4 h-4 text-slate-500" />
              Rata Kanan
            </button>

            <div className="my-1 border-t border-slate-100" />

            <button
              type="button"
              onClick={() => runAndClose(() => onAlign('top'))}
              className="w-full px-3.5 py-1.5 flex items-center gap-2.5 text-[13px] font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <AlignStartHorizontal className="w-4 h-4 text-slate-500" />
              Rata Atas
            </button>
            <button
              type="button"
              onClick={() => runAndClose(() => onAlign('center-v'))}
              className="w-full px-3.5 py-1.5 flex items-center gap-2.5 text-[13px] font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <AlignCenterHorizontal className="w-4 h-4 text-slate-500" />
              Tengah Vertikal
            </button>
            <button
              type="button"
              onClick={() => runAndClose(() => onAlign('bottom'))}
              className="w-full px-3.5 py-1.5 flex items-center gap-2.5 text-[13px] font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <AlignEndHorizontal className="w-4 h-4 text-slate-500" />
              Rata Bawah
            </button>

            {isMulti && (
              <>
                <div className="my-1 border-t border-slate-100" />
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Jarak & Rapikan
                </div>
                <button
                  type="button"
                  onClick={() => runAndClose(() => onAlign('distribute-h'))}
                  className="w-full px-3.5 py-1.5 flex items-center gap-2.5 text-[13px] font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <AlignHorizontalSpaceAround className="w-4 h-4 text-blue-600" />
                  Ratakan Jarak Horizontal
                </button>
                <button
                  type="button"
                  onClick={() => runAndClose(() => onAlign('distribute-v'))}
                  className="w-full px-3.5 py-1.5 flex items-center gap-2.5 text-[13px] font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <AlignVerticalSpaceAround className="w-4 h-4 text-blue-600" />
                  Ratakan Jarak Vertikal
                </button>
                <button
                  type="button"
                  onClick={() => runAndClose(() => onAlign('tidy-grid'))}
                  className="w-full px-3.5 py-1.5 flex items-center gap-2.5 text-[13px] font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <LayoutGrid className="w-4 h-4 text-blue-600" />
                  Rapikan Baris (Tidy Up)
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Submenu: Lapisan / Posisi */}
      <div
        className="relative"
        onMouseEnter={() => setOpenSubmenu('layer')}
      >
        <button
          type="button"
          onClick={() => setOpenSubmenu(openSubmenu === 'layer' ? null : 'layer')}
          className={`w-full px-3.5 py-2 flex items-center justify-between text-left transition-colors ${
            openSubmenu === 'layer' ? 'bg-slate-100' : 'hover:bg-slate-100/90'
          }`}
        >
          <span className="flex items-center gap-3 text-[13.5px] font-medium text-slate-800">
            <Layers className="w-[17px] h-[17px] text-slate-700" />
            Lapisan &amp; Posisi
          </span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {openSubmenu === 'layer' && (
          <div
            className={`absolute top-0 ${
              flipSubmenuLeft ? 'right-full mr-1.5' : 'left-full ml-1.5'
            } w-[224px] bg-white rounded-2xl shadow-[0_14px_40px_-8px_rgba(15,23,42,0.24)] border border-slate-200/90 py-1.5 z-[130] animate-in fade-in duration-75`}
          >
            <button
              type="button"
              onClick={() => runAndClose(() => onLayerAction('front'))}
              className="w-full px-3.5 py-1.5 flex items-center gap-2.5 text-[13px] font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <ArrowUpToLine className="w-4 h-4 text-slate-500" />
              Bawa ke Paling Depan
            </button>
            <button
              type="button"
              onClick={() => runAndClose(() => onLayerAction('forward'))}
              className="w-full px-3.5 py-1.5 flex items-center gap-2.5 text-[13px] font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <ArrowUp className="w-4 h-4 text-slate-500" />
              Maju Selangkah
            </button>
            <button
              type="button"
              onClick={() => runAndClose(() => onLayerAction('backward'))}
              className="w-full px-3.5 py-1.5 flex items-center gap-2.5 text-[13px] font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <ArrowDown className="w-4 h-4 text-slate-500" />
              Mundur Selangkah
            </button>
            <button
              type="button"
              onClick={() => runAndClose(() => onLayerAction('back'))}
              className="w-full px-3.5 py-1.5 flex items-center gap-2.5 text-[13px] font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <ArrowDownToLine className="w-4 h-4 text-slate-500" />
              Kirim ke Paling Belakang
            </button>
          </div>
        )}
      </div>

      <div className="my-1.5 border-t border-slate-100" />

      {/* =================================================================== */}
      {/* SEKSI 3: GABUNG/PISAH, MASKING, SESUAIKAN KANVAS, KUNCI             */}
      {/* =================================================================== */}
      {isMulti && !isAlreadyGrouped && (
        <button
          type="button"
          onMouseEnter={() => setOpenSubmenu(null)}
          onClick={() => runAndClose(onGroup)}
          className="w-full px-3.5 py-2 flex items-center justify-between text-left hover:bg-slate-100/90 transition-colors"
        >
          <span className="flex items-center gap-3 text-[13.5px] font-medium text-slate-800">
            <Group className="w-[17px] h-[17px] text-slate-700" />
            Gabung
          </span>
          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[11px] font-semibold">
            Ctrl+G
          </span>
        </button>
      )}

      {isAlreadyGrouped && (
        <button
          type="button"
          onMouseEnter={() => setOpenSubmenu(null)}
          onClick={() => runAndClose(onUngroup)}
          className="w-full px-3.5 py-2 flex items-center justify-between text-left hover:bg-slate-100/90 transition-colors"
        >
          <span className="flex items-center gap-3 text-[13.5px] font-medium text-slate-800">
            <Ungroup className="w-[17px] h-[17px] text-slate-700" />
            Pisahkan grup
          </span>
          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[11px] font-semibold">
            Ctrl+Shift+G
          </span>
        </button>
      )}

      {canMaskPair && onMaskSelected && (
        <button
          type="button"
          onMouseEnter={() => setOpenSubmenu(null)}
          onClick={() => runAndClose(onMaskSelected)}
          className="w-full px-3.5 py-2 flex items-center justify-between text-left hover:bg-indigo-50/80 transition-colors"
        >
          <span className="flex items-center gap-3 text-[13.5px] font-medium text-indigo-700">
            <Scissors className="w-[17px] h-[17px] text-indigo-600" />
            Masking objek
          </span>
          <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 text-[10px] font-bold">
            2 Objek
          </span>
        </button>
      )}

      {canUnmaskSingle && onUnmaskSelected && (
        <button
          type="button"
          onMouseEnter={() => setOpenSubmenu(null)}
          onClick={() => runAndClose(onUnmaskSelected)}
          className="w-full px-3.5 py-2 flex items-center justify-between text-left hover:bg-amber-50/80 transition-colors"
        >
          <span className="flex items-center gap-3 text-[13.5px] font-medium text-amber-700">
            <Scissors className="w-[17px] h-[17px] text-amber-600" />
            Lepas masking
          </span>
        </button>
      )}

      <button
        type="button"
        onMouseEnter={() => setOpenSubmenu(null)}
        onClick={() => runAndClose(onFitCanvasToSelection)}
        className="w-full px-3.5 py-2 flex items-center justify-between text-left hover:bg-slate-100/90 transition-colors"
      >
        <span className="flex items-center gap-3 text-[13.5px] font-medium text-slate-800 truncate pr-2">
          <MoveHorizontal className="w-[17px] h-[17px] text-slate-700 shrink-0" />
          <span className="truncate">Sesuaikan tinggi kanvas</span>
        </span>
      </button>

      <button
        type="button"
        onMouseEnter={() => setOpenSubmenu(null)}
        onClick={() => runAndClose(onToggleLock)}
        className="w-full px-3.5 py-2 flex items-center justify-between text-left hover:bg-slate-100/90 transition-colors"
      >
        <span className="flex items-center gap-3 text-[13.5px] font-medium text-slate-800">
          {anyLocked ? (
            <Unlock className="w-[17px] h-[17px] text-amber-600" />
          ) : (
            <Lock className="w-[17px] h-[17px] text-slate-700" />
          )}
          {anyLocked ? 'Buka kunci' : 'Kunci'}
        </span>
        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[11px] font-semibold">
          Alt+Shift+L
        </span>
      </button>
    </div>
  );
}
