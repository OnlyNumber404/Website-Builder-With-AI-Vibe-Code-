'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Undo2,
  Redo2,
  Eye,
  Download,
  Sparkles,
  Plus,
  Layers,
  ZoomIn,
  ZoomOut,
  Sliders,
  Check,
  Rocket
} from 'lucide-react';
import {
  AdvanceCanvas,
  CanvasElement,
  HistoryStack,
  createDefaultCanvas,
  CANVAS_DEFAULT_WIDTH,
  CANVAS_DEFAULT_HEIGHT,
  NavItemData
} from '@/lib/advanceTypes';
import AdvancePaletteSidebar from '@/components/advance/AdvancePaletteSidebar';
import AdvanceContextualToolbar from '@/components/advance/AdvanceContextualToolbar';
import AdvanceCanvasPage from '@/components/advance/AdvanceCanvasPage';
import AdvanceAiCopilot from '@/components/advance/AdvanceAiCopilot';
import AdvanceNavigationConfigModal from '@/components/advance/AdvanceNavigationConfigModal';
import AdvancePreviewModal from '@/components/advance/AdvancePreviewModal';
import { exportAdvanceWebsiteZip } from '@/lib/advanceExport';
import { NexaWebMark } from '@/components/common/NexaWebLogo';

export default function AdvanceStudioPage() {
  const router = useRouter();

  // -------------------------------------------------------------------------
  // 1. In-Memory State: Canvas Pages & History Stack (PRD Section 5)
  // -------------------------------------------------------------------------
  // AC-ADV-01: Memuat satu lembar kanvas kosong default (Canvas 1)
  const [canvases, setCanvases] = useState<AdvanceCanvas[]>([
    createDefaultCanvas(1)
  ]);
  const [activeCanvasId, setActiveCanvasId] = useState<string>(canvases[0].id);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  // AC-ADV-06: History Stack (In-Memory State: List<List<AdvanceCanvas>>)
  const [history, setHistory] = useState<HistoryStack>({
    undoStack: [],
    redoStack: []
  });

  // UI States
  const [isAiOpen, setIsAiOpen] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isNavConfigOpen, setIsNavConfigOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(0.75);
  const [isAutoFit, setIsAutoFit] = useState<boolean>(true);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);

  const mainContainerRef = useRef<HTMLDivElement>(null);

  const updateFitScale = useCallback(() => {
    if (!mainContainerRef.current) return;
    const containerWidth = mainContainerRef.current.clientWidth;
    const availableWidth = Math.max(300, containerWidth - 48);
    const scale = Math.min(1.0, Math.max(0.35, Math.round((availableWidth / (CANVAS_DEFAULT_WIDTH + 24)) * 100) / 100));
    setZoomLevel(scale);
  }, []);

  useEffect(() => {
    if (!mainContainerRef.current) return;
    updateFitScale();

    const observer = new ResizeObserver(() => {
      if (isAutoFit) {
        updateFitScale();
      }
    });

    observer.observe(mainContainerRef.current);
    return () => observer.disconnect();
  }, [isAutoFit, updateFitScale, isAiOpen]);

  // Hidden file input for element-triggered uploads (AC-PRD-04, etc.)
  const elementUploadInputRef = useRef<HTMLInputElement>(null);
  const pendingUploadTargetRef = useRef<string | null>(null);

  // Find active canvas object
  const activeCanvas =
    canvases.find((c) => c.id === activeCanvasId) || canvases[0];

  // Find selected element object
  let selectedElement: CanvasElement | null = null;
  for (const c of canvases) {
    const el = c.elements.find((e) => e.id === selectedElementId);
    if (el) {
      selectedElement = el;
      break;
    }
  }

  // -------------------------------------------------------------------------
  // Helper: Commit State to History Stack for Undo/Redo (AC-ADV-06)
  // -------------------------------------------------------------------------
  const pushToHistory = useCallback((currentCanvases: AdvanceCanvas[]) => {
    // Deep clone current state
    const snapshot = JSON.parse(JSON.stringify(currentCanvases));
    setHistory((prev) => ({
      undoStack: [...prev.undoStack.slice(-15), snapshot],
      redoStack: [] // Reset redo stack when new action performed
    }));
  }, []);

  const handleUndo = useCallback(() => {
    if (history.undoStack.length === 0) return;
    const previousSnapshot = history.undoStack[history.undoStack.length - 1];
    const newUndoStack = history.undoStack.slice(0, -1);
    const currentSnapshot = JSON.parse(JSON.stringify(canvases));

    setHistory({
      undoStack: newUndoStack,
      redoStack: [...history.redoStack, currentSnapshot]
    });
    setCanvases(previousSnapshot);
    if (!previousSnapshot.some((c: AdvanceCanvas) => c.id === activeCanvasId)) {
      setActiveCanvasId(previousSnapshot[0]?.id || '');
    }
  }, [history, canvases, activeCanvasId]);

  const handleRedo = useCallback(() => {
    if (history.redoStack.length === 0) return;
    const nextSnapshot = history.redoStack[history.redoStack.length - 1];
    const newRedoStack = history.redoStack.slice(0, -1);
    const currentSnapshot = JSON.parse(JSON.stringify(canvases));

    setHistory({
      undoStack: [...history.undoStack, currentSnapshot],
      redoStack: newRedoStack
    });
    setCanvases(nextSnapshot);
    if (!nextSnapshot.some((c: AdvanceCanvas) => c.id === activeCanvasId)) {
      setActiveCanvasId(nextSnapshot[0]?.id || '');
    }
  }, [history, canvases, activeCanvasId]);

  // Keyboard Shortcuts: Undo, Redo, Delete, Duplicate
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Undo: Ctrl+Z / Cmd+Z
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      // Redo: Ctrl+Y or Ctrl+Shift+Z
      else if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z')
      ) {
        e.preventDefault();
        handleRedo();
      }
      // Delete: Delete or Backspace
      else if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElementId) {
        e.preventDefault();
        handleDeleteElement();
      }
      // Duplicate: Ctrl+D
      else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd' && selectedElementId) {
        e.preventDefault();
        handleDuplicateElement();
      }
      // Deselect: Escape
      else if (e.key === 'Escape') {
        setSelectedElementId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, selectedElementId]);

  // -------------------------------------------------------------------------
  // Element Actions
  // -------------------------------------------------------------------------
  // Add element to center of active canvas (AC-TXT-02, AC-IMG-02, AC-PRD-02, AC-BTN-02, AC-NAV-01)
  const handleAddElement = (elementData: Omit<CanvasElement, 'id'>) => {
    pushToHistory(canvases);
    const newId = `el-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newElement: CanvasElement = {
      ...elementData,
      id: newId
    };

    setCanvases((prev) =>
      prev.map((c) =>
        c.id === activeCanvas.id
          ? { ...c, elements: [...c.elements, newElement] }
          : c
      )
    );
    setSelectedElementId(newId);
  };

  // Update element coordinates (AC-ADV-03 & Section 4 Free Positioning)
  const handleUpdateElementPosition = (elementId: string, posX: number, posY: number) => {
    setCanvases((prev) =>
      prev.map((c) => ({
        ...c,
        elements: c.elements.map((el) =>
          el.id === elementId ? { ...el, posX, posY } : el
        )
      }))
    );
  };

  // Update element dimensions (Section 4 Resize Item)
  const handleUpdateElementSize = (
    elementId: string,
    width: number,
    height: number,
    posX?: number,
    posY?: number
  ) => {
    setCanvases((prev) =>
      prev.map((c) => ({
        ...c,
        elements: c.elements.map((el) => {
          if (el.id === elementId) {
            return {
              ...el,
              width,
              height,
              posX: posX !== undefined ? posX : el.posX,
              posY: posY !== undefined ? posY : el.posY
            };
          }
          return el;
        })
      }))
    );
  };

  // Update element properties
  const handleUpdateElementProperties = (properties: Partial<CanvasElement['properties']>) => {
    if (!selectedElementId) return;
    pushToHistory(canvases);
    setCanvases((prev) =>
      prev.map((c) => ({
        ...c,
        elements: c.elements.map((el) =>
          el.id === selectedElementId
            ? { ...el, properties: { ...el.properties, ...properties } }
            : el
        )
      }))
    );
  };

  // Update element color
  const handleUpdateElementColor = (color: string) => {
    if (!selectedElementId) return;
    setCanvases((prev) =>
      prev.map((c) => ({
        ...c,
        elements: c.elements.map((el) =>
          el.id === selectedElementId ? { ...el, color } : el
        )
      }))
    );
  };

  // Update element text directly
  const handleUpdateElementText = (elementId: string, newText: string) => {
    pushToHistory(canvases);
    setCanvases((prev) =>
      prev.map((c) => ({
        ...c,
        elements: c.elements.map((el) =>
          el.id === elementId
            ? { ...el, properties: { ...el.properties, text: newText } }
            : el
        )
      }))
    );
  };

  // Update product card fields
  const handleUpdateProductCardText = (
    elementId: string,
    updates: { title?: string; price?: string; description?: string; buttonText?: string }
  ) => {
    pushToHistory(canvases);
    setCanvases((prev) =>
      prev.map((c) => ({
        ...c,
        elements: c.elements.map((el) => {
          if (el.id === elementId && el.properties.cardData) {
            return {
              ...el,
              properties: {
                ...el.properties,
                cardData: {
                  ...el.properties.cardData,
                  ...updates
                }
              }
            };
          }
          return el;
        })
      }))
    );
  };

  // Delete element
  const handleDeleteElement = () => {
    if (!selectedElementId) return;
    pushToHistory(canvases);
    setCanvases((prev) =>
      prev.map((c) => ({
        ...c,
        elements: c.elements.filter((el) => el.id !== selectedElementId)
      }))
    );
    setSelectedElementId(null);
  };

  // Duplicate element
  const handleDuplicateElement = () => {
    if (!selectedElement) return;
    pushToHistory(canvases);
    const newId = `el-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const cloned: CanvasElement = {
      ...JSON.parse(JSON.stringify(selectedElement)),
      id: newId,
      posX: selectedElement.posX + 25,
      posY: selectedElement.posY + 25
    };
    setCanvases((prev) =>
      prev.map((c) =>
        c.elements.some((el) => el.id === selectedElementId)
          ? { ...c, elements: [...c.elements, cloned] }
          : c
      )
    );
    setSelectedElementId(newId);
  };

  // Bring forward in z-order
  const handleBringForward = () => {
    if (!selectedElementId) return;
    pushToHistory(canvases);
    setCanvases((prev) =>
      prev.map((c) => {
        const idx = c.elements.findIndex((el) => el.id === selectedElementId);
        if (idx === -1 || idx === c.elements.length - 1) return c;
        const newEls = [...c.elements];
        const [moved] = newEls.splice(idx, 1);
        newEls.push(moved);
        return { ...c, elements: newEls };
      })
    );
  };

  // Send backward in z-order
  const handleSendBackward = () => {
    if (!selectedElementId) return;
    pushToHistory(canvases);
    setCanvases((prev) =>
      prev.map((c) => {
        const idx = c.elements.findIndex((el) => el.id === selectedElementId);
        if (idx <= 0) return c;
        const newEls = [...c.elements];
        const [moved] = newEls.splice(idx, 1);
        newEls.unshift(moved);
        return { ...c, elements: newEls };
      })
    );
  };

  // -------------------------------------------------------------------------
  // Multi-Canvas Management Actions (AC-ADV-04)
  // -------------------------------------------------------------------------
  // AC-ADV-04: Tombol aksi Tambah Kanvas (+): Menambahkan halaman kanvas baru secara berurutan ke bawah
  const handleAddNewCanvas = () => {
    pushToHistory(canvases);
    const nextIndex = canvases.length + 1;
    const newCanvas = createDefaultCanvas(nextIndex);
    setCanvases((prev) => [...prev, newCanvas]);
    setActiveCanvasId(newCanvas.id);
  };

  const handleDuplicateCanvas = (canvasId: string) => {
    pushToHistory(canvases);
    const target = canvases.find((c) => c.id === canvasId);
    if (!target) return;

    const nextIndex = canvases.length + 1;
    const cloned: AdvanceCanvas = {
      ...JSON.parse(JSON.stringify(target)),
      id: `canvas-${Date.now()}-${nextIndex}`,
      pageIndex: nextIndex,
      title: `${target.title || `Kanvas ${target.pageIndex}`} (Salinan)`,
      elements: target.elements.map((el) => ({
        ...el,
        id: `el-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
      }))
    };
    setCanvases((prev) => [...prev, cloned]);
    setActiveCanvasId(cloned.id);
  };

  const handleDeleteCanvas = (canvasId: string) => {
    if (canvases.length <= 1) return; // minimal 1 canvas
    pushToHistory(canvases);
    const updated = canvases
      .filter((c) => c.id !== canvasId)
      .map((c, i) => ({ ...c, pageIndex: i + 1, title: c.title || `Kanvas ${i + 1}` }));
    setCanvases(updated);
    if (activeCanvasId === canvasId) {
      setActiveCanvasId(updated[0]?.id || '');
    }
  };

  const handleUpdateCanvasBackground = (
    canvasId: string,
    bg: { color?: string; image?: string }
  ) => {
    pushToHistory(canvases);
    setCanvases((prev) =>
      prev.map((c) => {
        if (c.id === canvasId) {
          return {
            ...c,
            backgroundColor: bg.color !== undefined ? bg.color : c.backgroundColor,
            backgroundImage: bg.image !== undefined ? bg.image : c.backgroundImage
          };
        }
        return c;
      })
    );
  };

  // Image Upload Handling
  const handleUploadImage = (url: string) => {
    setUploadedImages((prev) => [url, ...prev]);
  };

  const handleTriggerImageUploadForElement = (elementId: string) => {
    pendingUploadTargetRef.current = elementId;
    elementUploadInputRef.current?.click();
  };

  const handleElementFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const targetElId = pendingUploadTargetRef.current;
    if (!file || !targetElId) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      if (url) {
        handleUploadImage(url);
        pushToHistory(canvases);
        setCanvases((prev) =>
          prev.map((c) => ({
            ...c,
            elements: c.elements.map((el) => {
              if (el.id === targetElId) {
                if (el.category === 'IMAGE') {
                  return { ...el, properties: { ...el.properties, imageUrl: url } };
                } else if (el.category === 'PRODUCT' && el.properties.cardData) {
                  return {
                    ...el,
                    properties: {
                      ...el.properties,
                      cardData: { ...el.properties.cardData, image: url }
                    }
                  };
                }
              }
              return el;
            })
          }))
        );
      }
    };
    reader.readAsDataURL(file);
    if (elementUploadInputRef.current) elementUploadInputRef.current.value = '';
    pendingUploadTargetRef.current = null;
  };

  // Deploy / Export Website ZIP
  const handleDeployZip = async () => {
    setIsDeploying(true);
    try {
      await exportAdvanceWebsiteZip(canvases);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 select-none">
      {/* Hidden file input for contextual element image replacements */}
      <input
        ref={elementUploadInputRef}
        type="file"
        accept="image/*"
        onChange={handleElementFileUpload}
        className="hidden"
      />

      {/* --------------------------------------------------------------------- */}
      {/* 1. BILAH ATAS (TOP BAR): BRAND, HISTORI UNDO/REDO, EXPORT, AI TOGGLE  */}
      {/* --------------------------------------------------------------------- */}
      <header className="h-14 bg-white border-b border-slate-200/90 px-4 flex items-center justify-between z-30 shrink-0">
        {/* Kiri: Tombol Kembali & Brand */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200/80 transition shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>Kembali</span>
          </Link>

          <div className="h-5 w-px bg-slate-200" />

          <div className="flex items-center gap-2.5">
            <NexaWebMark size={34} className="rounded-lg shadow-md shadow-blue-500/20" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-slate-900 tracking-tight">
                  NexaWeb<span className="text-blue-600">.advance</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                  Canva-like Mode
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Free-Form Multi-Canvas Editor</p>
            </div>
          </div>
        </div>

        {/* Tengah: Zoom Scale Controls */}
        <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setIsAutoFit(false);
              setZoomLevel((z) => Math.max(0.35, Math.round((z - 0.05) * 100) / 100));
            }}
            className="p-1 rounded-lg hover:bg-slate-200 text-slate-600 transition"
            title="Perkecil Tampilan Kanvas"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          
          <button
            type="button"
            onClick={() => {
              setIsAutoFit(true);
              updateFitScale();
            }}
            className={`px-2 py-0.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1 ${
              isAutoFit
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'hover:bg-slate-200 text-slate-700'
            }`}
            title="Paskan Kanvas Otomatis ke Layar (Auto-Fit)"
          >
            <span>{Math.round(zoomLevel * 100)}%</span>
            {isAutoFit && (
              <span className="text-[9px] uppercase font-black text-blue-600 bg-blue-100 px-1 rounded">
                Fit
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsAutoFit(false);
              setZoomLevel((z) => Math.min(1.4, Math.round((z + 0.05) * 100) / 100));
            }}
            className="p-1 rounded-lg hover:bg-slate-200 text-slate-600 transition"
            title="Perbesar Tampilan Kanvas"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        {/* Kanan: Undo, Redo, Preview, Deploy ZIP, Toggle AI */}
        <div className="flex items-center gap-2">
          {/* AC-ADV-06: Tombol Undo dan Redo */}
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-0.5">
            <button
              type="button"
              onClick={handleUndo}
              disabled={history.undoStack.length === 0}
              className="p-2 rounded-lg hover:bg-slate-200 disabled:opacity-40 text-slate-700 transition"
              title={`Undo (${history.undoStack.length}) - Ctrl+Z`}
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={history.redoStack.length === 0}
              className="p-2 rounded-lg hover:bg-slate-200 disabled:opacity-40 text-slate-700 transition"
              title={`Redo (${history.redoStack.length}) - Ctrl+Y`}
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          {/* Pratinjau Live Website */}
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition shadow-2xs"
            title="Lihat Pratinjau Interaktif Website"
          >
            <Eye className="w-4 h-4 text-slate-600" />
            <span>Pratinjau</span>
          </button>

          {/* Deploy / Unduh ZIP Website */}
          <button
            type="button"
            onClick={handleDeployZip}
            disabled={isDeploying}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition active:scale-95 disabled:opacity-60"
            title="Unduh Paket Website Lengkap (index.html & css)"
          >
            <Rocket className="w-4 h-4 text-blue-200" />
            <span>{isDeploying ? 'Mengekspor...' : 'Deploy ZIP'}</span>
          </button>

          {/* AC-ADV-05: Tombol Buka/Tutup Asisten AI */}
          <button
            type="button"
            onClick={() => setIsAiOpen(!isAiOpen)}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              isAiOpen
                ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                : 'bg-blue-600 text-white shadow-md shadow-blue-600/20 hover:bg-blue-700'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{isAiOpen ? 'Tutup AI' : 'Buka AI'}</span>
          </button>
        </div>
      </header>

      {/* --------------------------------------------------------------------- */}
      {/* 2. CONTEXTUAL TOOLBAR PROPERTI ELEMEN                                 */}
      {/* --------------------------------------------------------------------- */}
      <AdvanceContextualToolbar
        selectedElement={selectedElement}
        activeCanvas={activeCanvas}
        allCanvases={canvases}
        onUpdateElementProperties={handleUpdateElementProperties}
        onUpdateElementColor={handleUpdateElementColor}
        onDeleteElement={handleDeleteElement}
        onDuplicateElement={handleDuplicateElement}
        onBringForward={handleBringForward}
        onSendBackward={handleSendBackward}
        onOpenNavConfigModal={() => setIsNavConfigOpen(true)}
      />

      {/* --------------------------------------------------------------------- */}
      {/* 3. RUANG KERJA UTAMA: PALET KIRI, KANVAS TENGAH, ASISTEN AI KANAN      */}
      {/* --------------------------------------------------------------------- */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* AC-ADV-02: Bilah Palet Kiri & Laci Komponen */}
        <AdvancePaletteSidebar
          activeCanvas={activeCanvas}
          allCanvases={canvases}
          onAddElement={handleAddElement}
          onUpdateCanvasBackground={handleUpdateCanvasBackground}
          uploadedImages={uploadedImages}
          onUploadImage={handleUploadImage}
        />

        {/* AC-ADV-03 & AC-ADV-04: Kanvas Utama Tengah & Manajemen Multi-Kanvas */}
        <main
          ref={mainContainerRef}
          aria-label="Area Kerja Kanvas Utama"
          className="flex-1 min-w-0 overflow-auto bg-slate-200/70 p-4 sm:p-6 relative flex"
        >
          <div
            style={{
              width: `${Math.round(CANVAS_DEFAULT_WIDTH * zoomLevel)}px`,
              transition: 'width 0.15s ease'
            }}
            className="m-auto flex flex-col items-center gap-8 pb-20"
          >
            <div
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top center',
                width: `${CANVAS_DEFAULT_WIDTH}px`,
                transition: 'transform 0.15s ease'
              }}
              className="flex flex-col items-center gap-8"
            >
              {/* Daftar Lembar Kanvas Bertingkat */}
              {canvases.map((c) => (
                <AdvanceCanvasPage
                  key={c.id}
                  canvas={c}
                  isActive={c.id === activeCanvas.id}
                  canDelete={canvases.length > 1}
                  selectedElementId={selectedElementId}
                  allCanvases={canvases}
                  onSelectCanvas={() => setActiveCanvasId(c.id)}
                  onSelectElement={setSelectedElementId}
                  onUpdateElementPosition={handleUpdateElementPosition}
                  onUpdateElementSize={handleUpdateElementSize}
                  onUpdateElementText={handleUpdateElementText}
                  onUpdateProductCardText={handleUpdateProductCardText}
                  onDuplicateCanvas={handleDuplicateCanvas}
                  onDeleteCanvas={handleDeleteCanvas}
                  onDuplicateElement={handleDuplicateElement}
                  onDeleteElement={handleDeleteElement}
                  onUpdateCanvasBackground={handleUpdateCanvasBackground}
                  onTriggerImageUploadForElement={handleTriggerImageUploadForElement}
                  onOpenNavConfigModal={() => setIsNavConfigOpen(true)}
                />
              ))}

              {/* AC-ADV-04: Tombol Aksi Tambah Kanvas (+) */}
              <div className="pt-2 pb-8">
                <button
                  type="button"
                  onClick={handleAddNewCanvas}
                  className="group px-8 py-4 rounded-2xl bg-white hover:bg-blue-600 text-slate-800 hover:text-white font-extrabold text-sm border-2 border-dashed border-slate-300 hover:border-blue-600 shadow-md hover:shadow-xl flex items-center gap-3 transition-all transform hover:-translate-y-0.5 active:scale-98"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-50 group-hover:bg-blue-500 text-blue-600 group-hover:text-white flex items-center justify-center transition">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span>Tambah Kanvas Baru (Canvas {canvases.length + 1})</span>
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* AC-ADV-05: Asisten AI Kanan (Collapsible Gemini Flash) */}
        <AdvanceAiCopilot
          isOpen={isAiOpen}
          onClose={() => setIsAiOpen(false)}
          activeCanvas={activeCanvas}
          allCanvases={canvases}
          onAddElement={handleAddElement}
          onUpdateCanvasBackground={handleUpdateCanvasBackground}
          onAddNewCanvas={handleAddNewCanvas}
        />
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* 4. MODALS: NAV CONFIG & PREVIEW                                       */}
      {/* --------------------------------------------------------------------- */}
      {/* AC-NAV-02: Modal Konfigurasi Menu Navigasi */}
      <AdvanceNavigationConfigModal
        isOpen={isNavConfigOpen}
        onClose={() => setIsNavConfigOpen(false)}
        selectedNavElement={selectedElement?.category === 'NAV' ? selectedElement : null}
        allCanvases={canvases}
        onSaveNavItems={(navItems, navBrand) => {
          handleUpdateElementProperties({ navItems, navBrand });
        }}
      />

      {/* Modal Pratinjau Live Website */}
      <AdvancePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        canvases={canvases}
      />
    </div>
  );
}
