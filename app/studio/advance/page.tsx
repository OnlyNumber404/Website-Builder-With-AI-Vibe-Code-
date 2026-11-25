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
  NavItemData,
  AdvanceAiPlan,
  AiCursorState
} from '@/lib/advanceTypes';
import AdvancePaletteSidebar from '@/components/advance/AdvancePaletteSidebar';
import AdvanceContextualToolbar from '@/components/advance/AdvanceContextualToolbar';
import AdvanceCanvasPage from '@/components/advance/AdvanceCanvasPage';
import AdvanceAiCopilot from '@/components/advance/AdvanceAiCopilot';
import AdvanceNavigationConfigModal from '@/components/advance/AdvanceNavigationConfigModal';
import AdvancePreviewModal from '@/components/advance/AdvancePreviewModal';
import AdvanceContextMenu, {
  AlignType,
  ContextMenuState,
  LayerActionType
} from '@/components/advance/AdvanceContextMenu';
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
  const [selectedElementIds, setSelectedElementIds] = useState<string[]>([]);
  const selectedElementId = selectedElementIds.length === 1 ? selectedElementIds[0] : null;
  const setSelectedElementId = useCallback((id: string | null) => {
    setSelectedElementIds(id ? [id] : []);
  }, []);

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

  // Live Animated AI Cursor States
  const [aiCursor, setAiCursor] = useState<AiCursorState | null>(null);
  const [recentlyAddedElementId, setRecentlyAddedElementId] = useState<string | null>(null);
  const skipAiAnimRef = useRef<boolean>(false);

  // Right-Click Context Menu, Clipboard & Toast States
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [clipboardElements, setClipboardElements] = useState<CanvasElement[]>([]);
  const [copiedStyle, setCopiedStyle] = useState<{
    color: string;
    properties: Partial<CanvasElement['properties']>;
  } | null>(null);
  const [actionToast, setActionToast] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string) => {
    setActionToast(message);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setActionToast(null);
    }, 1900);
  }, []);

  const mainContainerRef = useRef<HTMLDivElement>(null);

  // Auto-collapse AI sidebar on mobile screens so canvas gets full space
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsAiOpen(false);
    }
  }, []);

  const updateFitScale = useCallback(() => {
    if (!mainContainerRef.current) return;
    const containerWidth = mainContainerRef.current.clientWidth;
    const padding = containerWidth < 640 ? 16 : 48;
    const availableWidth = Math.max(240, containerWidth - padding);
    const scale = Math.min(1.0, Math.max(0.25, Math.round((availableWidth / (CANVAS_DEFAULT_WIDTH + 24)) * 100) / 100));
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

  // Find selected elements (single or multi-select)
  const selectedElements: CanvasElement[] = [];
  if (selectedElementIds.length > 0) {
    const idSet = new Set(selectedElementIds);
    for (const c of canvases) {
      for (const el of c.elements) {
        if (idSet.has(el.id)) selectedElements.push(el);
      }
    }
  }
  const selectedElement: CanvasElement | null =
    selectedElements.length === 1 ? selectedElements[0] : null;

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

  // Keyboard Shortcuts: Undo, Redo, Copy, Paste, Copy/Paste Style, Duplicate, Group, Lock, Delete, Select All, Arrow Nudge
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

      const key = e.key.toLowerCase();
      const mod = e.ctrlKey || e.metaKey;

      // Undo: Ctrl+Z / Cmd+Z
      if (mod && key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      // Redo: Ctrl+Y or Ctrl+Shift+Z
      else if ((mod && key === 'y') || (mod && e.shiftKey && key === 'z')) {
        e.preventDefault();
        handleRedo();
      }
      // Copy Style: Ctrl+Alt+C
      else if (mod && e.altKey && key === 'c' && selectedElementIds.length > 0) {
        e.preventDefault();
        handleCopyStyle();
      }
      // Paste Style: Ctrl+Alt+V
      else if (mod && e.altKey && key === 'v' && selectedElementIds.length > 0) {
        e.preventDefault();
        handlePasteStyle();
      }
      // Copy: Ctrl+C
      else if (mod && !e.altKey && key === 'c' && selectedElementIds.length > 0) {
        e.preventDefault();
        handleCopyElements();
      }
      // Paste: Ctrl+V
      else if (mod && !e.altKey && key === 'v' && clipboardElements.length > 0) {
        e.preventDefault();
        handlePasteElements();
      }
      // Duplicate: Ctrl+D
      else if (mod && key === 'd' && selectedElementIds.length > 0) {
        e.preventDefault();
        handleDuplicateElement();
      }
      // Ungroup: Ctrl+Shift+G
      else if (mod && e.shiftKey && key === 'g' && selectedElementIds.length > 0) {
        e.preventDefault();
        handleUngroupElements();
      }
      // Group: Ctrl+G
      else if (mod && !e.shiftKey && key === 'g' && selectedElementIds.length > 1) {
        e.preventDefault();
        handleGroupElements();
      }
      // Lock / Unlock: Alt+Shift+L
      else if (e.altKey && e.shiftKey && key === 'l' && selectedElementIds.length > 0) {
        e.preventDefault();
        handleToggleLockElements();
      }
      // Select All: Ctrl+A
      else if (mod && key === 'a') {
        e.preventDefault();
        handleSelectAllInActiveCanvas();
      }
      // Delete: Delete or Backspace
      else if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElementIds.length > 0) {
        e.preventDefault();
        handleDeleteElement();
      }
      // Deselect: Escape
      else if (e.key === 'Escape') {
        setSelectedElementIds([]);
        setContextMenu(null);
      }
      // Precision Keyboard Nudging: Arrow Keys (1px normal, 10px with Shift; skip locked elements)
      else if (
        selectedElementIds.length > 0 &&
        (e.key === 'ArrowUp' ||
          e.key === 'ArrowDown' ||
          e.key === 'ArrowLeft' ||
          e.key === 'ArrowRight')
      ) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        const dx = e.key === 'ArrowLeft' ? -step : e.key === 'ArrowRight' ? step : 0;
        const dy = e.key === 'ArrowUp' ? -step : e.key === 'ArrowDown' ? step : 0;
        const idSet = new Set(selectedElementIds);

        setCanvases((prev) =>
          prev.map((c) => {
            const cHeight = c.height || CANVAS_DEFAULT_HEIGHT;
            let changed = false;
            const nextEls = c.elements.map((el) => {
              if (!idSet.has(el.id) || el.locked) return el;
              changed = true;
              return {
                ...el,
                posX: Math.max(0, Math.min(CANVAS_DEFAULT_WIDTH - 40, el.posX + dx)),
                posY: Math.max(0, Math.min(cHeight - 24, el.posY + dy))
              };
            });
            return changed ? { ...c, elements: nextEls } : c;
          })
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

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

  // Batch commit positions (dipanggil 1x saat mouseup untuk performa 60fps!)
  const handleBatchUpdatePositions = useCallback(
    (updates: { id: string; posX: number; posY: number }[]) => {
      if (updates.length === 0) return;
      const map = new Map(updates.map((u) => [u.id, u]));
      setCanvases((prev) =>
        prev.map((c) => {
          let changed = false;
          const nextEls = c.elements.map((el) => {
            const u = map.get(el.id);
            if (u && (el.posX !== u.posX || el.posY !== u.posY)) {
              changed = true;
              return { ...el, posX: u.posX, posY: u.posY };
            }
            return el;
          });
          return changed ? { ...c, elements: nextEls } : c;
        })
      );
    },
    []
  );

  // Update element dimensions (Section 4 Resize Item)
  const handleUpdateElementSize = useCallback(
    (
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
    },
    []
  );

  // Update element properties (supports single & multi-select bulk editing!)
  const handleUpdateElementProperties = (properties: Partial<CanvasElement['properties']>) => {
    if (selectedElementIds.length === 0) return;
    pushToHistory(canvases);
    const idSet = new Set(selectedElementIds);
    setCanvases((prev) =>
      prev.map((c) => ({
        ...c,
        elements: c.elements.map((el) =>
          idSet.has(el.id)
            ? { ...el, properties: { ...el.properties, ...properties } }
            : el
        )
      }))
    );
  };

  // Update element color (supports single & multi-select bulk editing!)
  const handleUpdateElementColor = (color: string) => {
    if (selectedElementIds.length === 0) return;
    const idSet = new Set(selectedElementIds);
    setCanvases((prev) =>
      prev.map((c) => ({
        ...c,
        elements: c.elements.map((el) =>
          idSet.has(el.id) ? { ...el, color } : el
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

  // Delete element(s) (single or multi-select, skipping locked elements)
  const handleDeleteElement = () => {
    if (selectedElementIds.length === 0) return;
    const deletableIds = selectedElements.filter((el) => !el.locked).map((el) => el.id);
    if (deletableIds.length === 0) {
      showToast('Elemen terkunci — buka kunci terlebih dahulu');
      return;
    }
    pushToHistory(canvases);
    const idSet = new Set(deletableIds);
    setCanvases((prev) =>
      prev.map((c) => ({
        ...c,
        elements: c.elements.filter((el) => !idSet.has(el.id))
      }))
    );
    setSelectedElementIds((prev) => prev.filter((id) => !idSet.has(id)));
  };

  // Duplicate element(s) (single or multi-select)
  const handleDuplicateElement = () => {
    if (selectedElements.length === 0) return;
    pushToHistory(canvases);
    const idSet = new Set(selectedElementIds);
    const newIds: string[] = [];

    setCanvases((prev) =>
      prev.map((c) => {
        const toClone = c.elements.filter((el) => idSet.has(el.id));
        if (toClone.length === 0) return c;
        const clones: CanvasElement[] = toClone.map((orig, idx) => {
          const newId = `el-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 5)}`;
          newIds.push(newId);
          return {
            ...JSON.parse(JSON.stringify(orig)),
            id: newId,
            posX: orig.posX + 25,
            posY: orig.posY + 25
          };
        });
        return { ...c, elements: [...c.elements, ...clones] };
      })
    );
    setTimeout(() => {
      if (newIds.length > 0) setSelectedElementIds(newIds);
    }, 0);
  };

  // Bring forward in z-order (single or multi-select)
  const handleBringForward = () => {
    if (selectedElementIds.length === 0) return;
    pushToHistory(canvases);
    const idSet = new Set(selectedElementIds);
    setCanvases((prev) =>
      prev.map((c) => {
        const selected = c.elements.filter((el) => idSet.has(el.id));
        if (selected.length === 0) return c;
        const others = c.elements.filter((el) => !idSet.has(el.id));
        return { ...c, elements: [...others, ...selected] };
      })
    );
  };

  // Send backward in z-order (single or multi-select)
  const handleSendBackward = () => {
    if (selectedElementIds.length === 0) return;
    pushToHistory(canvases);
    const idSet = new Set(selectedElementIds);
    setCanvases((prev) =>
      prev.map((c) => {
        const selected = c.elements.filter((el) => idSet.has(el.id));
        if (selected.length === 0) return c;
        const others = c.elements.filter((el) => !idSet.has(el.id));
        return { ...c, elements: [...selected, ...others] };
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

  const handleRenameCanvas = (canvasId: string, newTitle: string) => {
    const trimmed = newTitle.trim();
    pushToHistory(canvases);
    setCanvases((prev) =>
      prev.map((c) =>
        c.id === canvasId
          ? { ...c, title: trimmed || `Kanvas ${c.pageIndex}` }
          : c
      )
    );
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
                } else if (el.category === 'NAV') {
                  return { ...el, properties: { ...el.properties, navLogoUrl: url } };
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

  // -------------------------------------------------------------------------
  // Masking Actions: Mask 2 Overlapping Shapes / Image into Shape & Unmask
  // -------------------------------------------------------------------------
  const handleMaskWithElement = (targetElementId: string, sourceElementIdOverride?: string) => {
    const firstId = sourceElementIdOverride || selectedElementId || selectedElementIds[0];
    if (!firstId) return;

    const currentCanvas = canvases.find((c) =>
      c.elements.some((el) => el.id === firstId)
    );
    if (!currentCanvas) return;

    const selectedIdx = currentCanvas.elements.findIndex((el) => el.id === firstId);
    const targetIdx = currentCanvas.elements.findIndex((el) => el.id === targetElementId);
    if (selectedIdx === -1 || targetIdx === -1 || selectedIdx === targetIdx) return;

    const elSelected = currentCanvas.elements[selectedIdx];
    const elTarget = currentCanvas.elements[targetIdx];

    // Determine which element is the Mask Base (must be SHAPE) and which is the Masked Content
    let baseEl: CanvasElement;
    let contentEl: CanvasElement;

    if (elSelected.category === 'IMAGE' && elTarget.category === 'SHAPE') {
      baseEl = elTarget;
      contentEl = elSelected;
    } else if (elSelected.category === 'SHAPE' && elTarget.category === 'IMAGE') {
      baseEl = elSelected;
      contentEl = elTarget;
    } else {
      // Both are SHAPE: lower z-order shape acts as Mask Base, upper shape is clipped inside it
      if (selectedIdx < targetIdx) {
        baseEl = elSelected;
        contentEl = elTarget;
      } else {
        baseEl = elTarget;
        contentEl = elSelected;
      }
    }

    pushToHistory(canvases);

    // Compute content's relative position inside base mask frame
    const relativeLayer: CanvasElement = {
      ...contentEl,
      posX: Math.round(contentEl.posX - baseEl.posX),
      posY: Math.round(contentEl.posY - baseEl.posY)
    };

    const existingLayers = baseEl.properties.maskedLayers || [];

    setCanvases((prev) =>
      prev.map((c) => {
        if (c.id !== currentCanvas.id) return c;
        return {
          ...c,
          elements: c.elements
            .filter((el) => el.id !== contentEl.id)
            .map((el) =>
              el.id === baseEl.id
                ? {
                    ...el,
                    properties: {
                      ...el.properties,
                      maskedLayers: [...existingLayers, relativeLayer]
                    }
                  }
                : el
            )
        };
      })
    );

    setSelectedElementId(baseEl.id);
  };

  const handleUnmaskElement = () => {
    if (!selectedElementId) return;

    const currentCanvas = canvases.find((c) =>
      c.elements.some((el) => el.id === selectedElementId)
    );
    if (!currentCanvas) return;

    const baseEl = currentCanvas.elements.find((el) => el.id === selectedElementId);
    if (!baseEl || !baseEl.properties.maskedLayers || baseEl.properties.maskedLayers.length === 0) {
      return;
    }

    pushToHistory(canvases);

    // Restore masked layers back to independent elements at world canvas coordinates
    const restoredElements: CanvasElement[] = baseEl.properties.maskedLayers.map((layer) => ({
      ...layer,
      id: `el-unmask-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      posX: Math.max(0, Math.round(baseEl.posX + layer.posX)),
      posY: Math.max(0, Math.round(baseEl.posY + layer.posY))
    }));

    setCanvases((prev) =>
      prev.map((c) => {
        if (c.id !== currentCanvas.id) return c;
        return {
          ...c,
          elements: [
            ...c.elements.map((el) =>
              el.id === baseEl.id
                ? {
                    ...el,
                    properties: {
                      ...el.properties,
                      maskedLayers: []
                    }
                  }
                : el
            ),
            ...restoredElements
          ]
        };
      })
    );
  };

  // -------------------------------------------------------------------------
  // Right-Click Context Menu Actions (Canva-style Single & Multi-Select)
  // -------------------------------------------------------------------------
  const handleCopyElements = () => {
    if (selectedElements.length === 0) return;
    setClipboardElements(JSON.parse(JSON.stringify(selectedElements)));
    showToast(
      selectedElements.length > 1
        ? `${selectedElements.length} elemen disalin`
        : 'Elemen disalin'
    );
  };

  const handleCopyStyle = () => {
    const primary = selectedElements[0];
    if (!primary) return;
    const p = primary.properties;
    const styleProps: Partial<CanvasElement['properties']> = {};
    if (p.opacity !== undefined) styleProps.opacity = p.opacity;
    if (p.borderColor !== undefined) styleProps.borderColor = p.borderColor;
    if (p.borderWidth !== undefined) styleProps.borderWidth = p.borderWidth;
    if (p.borderStyle !== undefined) styleProps.borderStyle = p.borderStyle;
    if (p.borderRadius !== undefined) styleProps.borderRadius = p.borderRadius;
    if (p.shadow !== undefined) styleProps.shadow = p.shadow;
    if (p.font !== undefined) styleProps.font = p.font;
    if (p.fontSize !== undefined) styleProps.fontSize = p.fontSize;
    if (p.fontWeight !== undefined) styleProps.fontWeight = p.fontWeight;
    if (p.fontStyle !== undefined) styleProps.fontStyle = p.fontStyle;
    if (p.textAlign !== undefined) styleProps.textAlign = p.textAlign;
    if (p.buttonVariant !== undefined) styleProps.buttonVariant = p.buttonVariant;
    if (p.buttonTextColor !== undefined) styleProps.buttonTextColor = p.buttonTextColor;

    setCopiedStyle({ color: primary.color, properties: styleProps });
    showToast('Gaya elemen disalin (Ctrl+Alt+V untuk tempel)');
  };

  const handlePasteStyle = () => {
    if (!copiedStyle || selectedElements.length === 0) return;
    const unlockedIds = new Set(selectedElements.filter((el) => !el.locked).map((el) => el.id));
    if (unlockedIds.size === 0) {
      showToast('Elemen terkunci — buka kunci terlebih dahulu');
      return;
    }
    pushToHistory(canvases);
    setCanvases((prev) =>
      prev.map((c) => ({
        ...c,
        elements: c.elements.map((el) => {
          if (!unlockedIds.has(el.id)) return el;
          return {
            ...el,
            color: copiedStyle.color,
            properties: {
              ...el.properties,
              ...copiedStyle.properties
            }
          };
        })
      }))
    );
    showToast(`Gaya diterapkan ke ${unlockedIds.size} elemen`);
  };

  const handlePasteElements = (targetCanvasX?: number, targetCanvasY?: number) => {
    if (clipboardElements.length === 0) return;
    pushToHistory(canvases);

    const minX = Math.min(...clipboardElements.map((el) => el.posX));
    const minY = Math.min(...clipboardElements.map((el) => el.posY));
    const cHeight = activeCanvas.height || CANVAS_DEFAULT_HEIGHT;
    const newGroupMap = new Map<string, string>();
    const newIds: string[] = [];

    const pasted: CanvasElement[] = clipboardElements.map((orig, idx) => {
      const newId = `el-paste-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 5)}`;
      newIds.push(newId);

      let nextGroupId = orig.groupId;
      if (orig.groupId) {
        if (!newGroupMap.has(orig.groupId)) {
          newGroupMap.set(orig.groupId, `grp-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`);
        }
        nextGroupId = newGroupMap.get(orig.groupId);
      }

      const rawX =
        targetCanvasX !== undefined ? targetCanvasX + (orig.posX - minX) : orig.posX + 28;
      const rawY =
        targetCanvasY !== undefined ? targetCanvasY + (orig.posY - minY) : orig.posY + 28;

      return {
        ...JSON.parse(JSON.stringify(orig)),
        id: newId,
        locked: false,
        groupId: nextGroupId,
        posX: Math.max(0, Math.min(CANVAS_DEFAULT_WIDTH - 40, Math.round(rawX))),
        posY: Math.max(0, Math.min(cHeight - 24, Math.round(rawY)))
      };
    });

    setCanvases((prev) =>
      prev.map((c) =>
        c.id === activeCanvas.id ? { ...c, elements: [...c.elements, ...pasted] } : c
      )
    );
    setSelectedElementIds(newIds);
    showToast(pasted.length > 1 ? `${pasted.length} elemen ditempel` : 'Elemen ditempel');
  };

  const handleAlignElements = (alignType: AlignType) => {
    const unlocked = selectedElements.filter((el) => !el.locked);
    if (unlocked.length === 0) return;
    pushToHistory(canvases);

    const cHeight = activeCanvas.height || CANVAS_DEFAULT_HEIGHT;
    const updates = new Map<string, { posX: number; posY: number }>();

    if (unlocked.length === 1) {
      // Single element: align relative to the Canvas
      const el = unlocked[0];
      let nextX = el.posX;
      let nextY = el.posY;
      if (alignType === 'left') nextX = 0;
      else if (alignType === 'center-h') nextX = Math.round((CANVAS_DEFAULT_WIDTH - el.width) / 2);
      else if (alignType === 'right') nextX = Math.max(0, CANVAS_DEFAULT_WIDTH - el.width);
      else if (alignType === 'top') nextY = 0;
      else if (alignType === 'center-v') nextY = Math.round((cHeight - el.height) / 2);
      else if (alignType === 'bottom') nextY = Math.max(0, cHeight - el.height);
      updates.set(el.id, { posX: nextX, posY: nextY });
    } else {
      // Multi-select: align relative to bounding box of selection
      const minX = Math.min(...unlocked.map((e) => e.posX));
      const maxX = Math.max(...unlocked.map((e) => e.posX + e.width));
      const minY = Math.min(...unlocked.map((e) => e.posY));
      const maxY = Math.max(...unlocked.map((e) => e.posY + e.height));
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;

      if (alignType === 'left') {
        unlocked.forEach((el) => updates.set(el.id, { posX: minX, posY: el.posY }));
      } else if (alignType === 'center-h') {
        unlocked.forEach((el) =>
          updates.set(el.id, { posX: Math.round(centerX - el.width / 2), posY: el.posY })
        );
      } else if (alignType === 'right') {
        unlocked.forEach((el) => updates.set(el.id, { posX: maxX - el.width, posY: el.posY }));
      } else if (alignType === 'top') {
        unlocked.forEach((el) => updates.set(el.id, { posX: el.posX, posY: minY }));
      } else if (alignType === 'center-v') {
        unlocked.forEach((el) =>
          updates.set(el.id, { posX: el.posX, posY: Math.round(centerY - el.height / 2) })
        );
      } else if (alignType === 'bottom') {
        unlocked.forEach((el) => updates.set(el.id, { posX: el.posX, posY: maxY - el.height }));
      } else if (alignType === 'distribute-h' && unlocked.length >= 3) {
        const sorted = [...unlocked].sort((a, b) => a.posX - b.posX);
        const totalElW = sorted.reduce((acc, el) => acc + el.width, 0);
        const spanW = sorted[sorted.length - 1].posX + sorted[sorted.length - 1].width - sorted[0].posX;
        const gap = Math.max(0, (spanW - totalElW) / (sorted.length - 1));
        let cursorX = sorted[0].posX;
        sorted.forEach((el) => {
          updates.set(el.id, { posX: Math.round(cursorX), posY: el.posY });
          cursorX += el.width + gap;
        });
      } else if (alignType === 'distribute-v' && unlocked.length >= 3) {
        const sorted = [...unlocked].sort((a, b) => a.posY - b.posY);
        const totalElH = sorted.reduce((acc, el) => acc + el.height, 0);
        const spanH = sorted[sorted.length - 1].posY + sorted[sorted.length - 1].height - sorted[0].posY;
        const gap = Math.max(0, (spanH - totalElH) / (sorted.length - 1));
        let cursorY = sorted[0].posY;
        sorted.forEach((el) => {
          updates.set(el.id, { posX: el.posX, posY: Math.round(cursorY) });
          cursorY += el.height + gap;
        });
      } else if (alignType === 'tidy-grid') {
        // Align horizontal row neatly with 20px uniform gap & vertically centered
        const sorted = [...unlocked].sort((a, b) => a.posX - b.posX);
        const gap = 20;
        const totalW = sorted.reduce((acc, el) => acc + el.width, 0) + gap * (sorted.length - 1);
        let cursorX = Math.max(16, Math.round((CANVAS_DEFAULT_WIDTH - totalW) / 2));
        sorted.forEach((el) => {
          updates.set(el.id, {
            posX: Math.min(CANVAS_DEFAULT_WIDTH - el.width, Math.round(cursorX)),
            posY: Math.round(centerY - el.height / 2)
          });
          cursorX += el.width + gap;
        });
      }
    }

    if (updates.size === 0) return;
    setCanvases((prev) =>
      prev.map((c) => ({
        ...c,
        elements: c.elements.map((el) => {
          const u = updates.get(el.id);
          return u ? { ...el, posX: u.posX, posY: u.posY } : el;
        })
      }))
    );
  };

  const handleLayerAction = (action: LayerActionType) => {
    if (selectedElementIds.length === 0) return;
    if (action === 'front') {
      handleBringForward();
      return;
    }
    if (action === 'back') {
      handleSendBackward();
      return;
    }

    pushToHistory(canvases);
    const idSet = new Set(selectedElementIds);
    setCanvases((prev) =>
      prev.map((c) => {
        const els = [...c.elements];
        if (!els.some((el) => idSet.has(el.id))) return c;
        if (action === 'forward') {
          for (let i = els.length - 2; i >= 0; i--) {
            if (idSet.has(els[i].id) && !idSet.has(els[i + 1].id)) {
              [els[i], els[i + 1]] = [els[i + 1], els[i]];
            }
          }
        } else if (action === 'backward') {
          for (let i = 1; i < els.length; i++) {
            if (idSet.has(els[i].id) && !idSet.has(els[i - 1].id)) {
              [els[i], els[i - 1]] = [els[i - 1], els[i]];
            }
          }
        }
        return { ...c, elements: els };
      })
    );
  };

  const handleGroupElements = () => {
    if (selectedElementIds.length < 2) return;
    pushToHistory(canvases);
    const newGroupId = `grp-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    const idSet = new Set(selectedElementIds);
    setCanvases((prev) =>
      prev.map((c) => ({
        ...c,
        elements: c.elements.map((el) =>
          idSet.has(el.id) ? { ...el, groupId: newGroupId } : el
        )
      }))
    );
    showToast(`${selectedElementIds.length} elemen digabung menjadi grup`);
  };

  const handleUngroupElements = () => {
    if (selectedElementIds.length === 0) return;
    pushToHistory(canvases);
    const idSet = new Set(selectedElementIds);
    setCanvases((prev) =>
      prev.map((c) => ({
        ...c,
        elements: c.elements.map((el) =>
          idSet.has(el.id) ? { ...el, groupId: undefined } : el
        )
      }))
    );
    showToast('Grup dipisahkan');
  };

  const handleToggleLockElements = (targetIds?: string[]) => {
    const ids = targetIds && targetIds.length > 0 ? targetIds : selectedElementIds;
    if (ids.length === 0) return;
    const idSet = new Set(ids);
    const targetEls = canvases.flatMap((c) => c.elements).filter((el) => idSet.has(el.id));
    if (targetEls.length === 0) return;

    const shouldUnlock = targetEls.some((el) => el.locked);
    pushToHistory(canvases);
    setCanvases((prev) =>
      prev.map((c) => ({
        ...c,
        elements: c.elements.map((el) =>
          idSet.has(el.id) ? { ...el, locked: !shouldUnlock } : el
        )
      }))
    );
    showToast(shouldUnlock ? 'Kunci elemen dibuka' : 'Elemen dikunci');
  };

  const handleFitCanvasToSelection = () => {
    if (selectedElements.length === 0) return;
    pushToHistory(canvases);
    const maxBottom = Math.max(...selectedElements.map((el) => el.posY + el.height));
    const nextHeight = Math.max(360, Math.min(2000, Math.round(maxBottom + 64)));
    setCanvases((prev) =>
      prev.map((c) => (c.id === activeCanvas.id ? { ...c, height: nextHeight } : c))
    );
    showToast(`Tinggi kanvas disesuaikan ke ${nextHeight}px`);
  };

  const handleSelectAllInActiveCanvas = () => {
    const ids = activeCanvas.elements.map((el) => el.id);
    setSelectedElementIds(ids);
    if (ids.length > 0) {
      showToast(`${ids.length} elemen dipilih`);
    }
  };

  const handleOpenContextMenu = useCallback(
    (payload: Omit<ContextMenuState, 'isOpen'>) => {
      setActiveCanvasId(payload.canvasId);
      setContextMenu({ ...payload, isOpen: true });
    },
    []
  );

  // -------------------------------------------------------------------------
  // Overpowered AI Plan Executor with Live Animated AI Cursor
  // -------------------------------------------------------------------------
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleExecuteAiPlan = async (plan: AdvanceAiPlan) => {
    if (!plan.actions || plan.actions.length === 0) return;

    // Simpan snapshot ke Undo Stack sebelum AI mulai bekerja
    pushToHistory(canvases);
    setSelectedElementId(null);
    skipAiAnimRef.current = false;

    // Deep clone working canvases agar sinkron di setiap langkah async
    let workingCanvases: AdvanceCanvas[] = JSON.parse(JSON.stringify(canvases));
    let currentTargetCanvasId = activeCanvas.id;

    // Pre-generate real canvas IDs untuk setiap canvasKey agar link Navbar & tombol CTA langsung tersambung
    const baseTs = Date.now();
    const canvasKeyMap: Record<string, string> = {};
    let plannedPageIdx = 1;

    const hasReset = plan.actions.some((a) => a.type === 'RESET_CANVASES');
    if (hasReset) {
      const heroId = `canvas-ai-${baseTs}-1`;
      canvasKeyMap['hero'] = heroId;
      plannedPageIdx = 2;
    } else {
      canvasKeyMap['hero'] = workingCanvases[0]?.id || activeCanvas.id;
      plannedPageIdx = workingCanvases.length + 1;
    }

    for (const act of plan.actions) {
      if (act.type === 'CREATE_CANVAS') {
        canvasKeyMap[act.canvasKey] = `canvas-ai-${baseTs}-${plannedPageIdx}`;
        plannedPageIdx += 1;
      }
    }

    const resolveKeyRef = (val?: string): string | undefined => {
      if (!val) return val;
      if (val.startsWith('__KEY__:')) {
        const key = val.replace('__KEY__:', '');
        return canvasKeyMap[key] || currentTargetCanvasId;
      }
      return val;
    };

    const totalSteps = plan.actions.length;

    for (let i = 0; i < totalSteps; i++) {
      const action = plan.actions[i];
      const stepNum = i + 1;

      if (action.type === 'RESET_CANVASES') {
        const heroId = canvasKeyMap['hero'];
        workingCanvases = [
          {
            id: heroId,
            pageIndex: 1,
            title: action.firstCanvasTitle || 'Beranda',
            backgroundColor: action.firstCanvasBg || '#ffffff',
            backgroundImage: '',
            height: action.firstCanvasHeight || CANVAS_DEFAULT_HEIGHT,
            elements: []
          }
        ];
        currentTargetCanvasId = heroId;
        setCanvases([...workingCanvases]);
        setActiveCanvasId(heroId);

        if (!skipAiAnimRef.current) {
          setAiCursor({
            isActive: true,
            targetCanvasId: heroId,
            x: 500,
            y: 120,
            label: action.label,
            isClicking: true,
            currentStep: stepNum,
            totalSteps
          });
          setTimeout(() => {
            document.getElementById(heroId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 50);
          await sleep(340);
        }
      } else if (action.type === 'CREATE_CANVAS') {
        const newId = canvasKeyMap[action.canvasKey] || `canvas-ai-${Date.now()}-${workingCanvases.length + 1}`;
        const newCanvas: AdvanceCanvas = {
          id: newId,
          pageIndex: workingCanvases.length + 1,
          title: action.title,
          backgroundColor: action.backgroundColor || '#ffffff',
          backgroundImage: '',
          height: action.height || CANVAS_DEFAULT_HEIGHT,
          elements: []
        };
        workingCanvases = [...workingCanvases, newCanvas];
        currentTargetCanvasId = newId;
        setCanvases([...workingCanvases]);
        setActiveCanvasId(newId);

        if (!skipAiAnimRef.current) {
          setAiCursor({
            isActive: true,
            targetCanvasId: newId,
            x: 500,
            y: 110,
            label: action.label,
            isClicking: true,
            currentStep: stepNum,
            totalSteps
          });
          setTimeout(() => {
            document.getElementById(newId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 60);
          await sleep(420);
        }
      } else if (action.type === 'SET_CANVAS_STYLE') {
        const targetId = action.canvasKey ? canvasKeyMap[action.canvasKey] || currentTargetCanvasId : currentTargetCanvasId;
        if (!skipAiAnimRef.current) {
          setAiCursor({
            isActive: true,
            targetCanvasId: targetId,
            x: 500,
            y: 90,
            label: action.label,
            isClicking: false,
            currentStep: stepNum,
            totalSteps
          });
          await sleep(220);
          setAiCursor((prev) => (prev ? { ...prev, isClicking: true } : prev));
        }

        workingCanvases = workingCanvases.map((c) =>
          c.id === targetId
            ? {
                ...c,
                title: action.title ?? c.title,
                backgroundColor: action.backgroundColor ?? c.backgroundColor,
                backgroundImage: action.backgroundImage ?? c.backgroundImage,
                height: action.height ?? c.height
              }
            : c
        );
        setCanvases([...workingCanvases]);
        if (!skipAiAnimRef.current) await sleep(180);
      } else if (action.type === 'CLEAR_CANVAS') {
        const targetId = action.canvasKey ? canvasKeyMap[action.canvasKey] || currentTargetCanvasId : currentTargetCanvasId;
        workingCanvases = workingCanvases.map((c) =>
          c.id === targetId ? { ...c, elements: [] } : c
        );
        setCanvases([...workingCanvases]);
        if (!skipAiAnimRef.current) await sleep(200);
      } else if (action.type === 'UPDATE_ALL_TEXT_COLOR') {
        const targetId = action.canvasKey ? canvasKeyMap[action.canvasKey] || currentTargetCanvasId : currentTargetCanvasId;
        workingCanvases = workingCanvases.map((c) =>
          c.id === targetId
            ? {
                ...c,
                elements: c.elements.map((el) =>
                  el.category === 'TEXT' ? { ...el, color: action.color } : el
                )
              }
            : c
        );
        setCanvases([...workingCanvases]);
        if (!skipAiAnimRef.current) await sleep(160);
      } else if (action.type === 'ADD_ELEMENT') {
        const targetId = action.canvasKey ? canvasKeyMap[action.canvasKey] || currentTargetCanvasId : currentTargetCanvasId;
        currentTargetCanvasId = targetId;

        // Resolve logical __KEY__ links inside Button or Nav elements
        const rawEl = action.element;
        const resolvedProps = { ...rawEl.properties };
        if (resolvedProps.targetCanvasId) {
          resolvedProps.targetCanvasId = resolveKeyRef(resolvedProps.targetCanvasId);
        }
        if (resolvedProps.navItems && Array.isArray(resolvedProps.navItems)) {
          resolvedProps.navItems = resolvedProps.navItems.map((item) => ({
            ...item,
            targetCanvasId: resolveKeyRef(item.targetCanvasId)
          }));
        }

        const newElId = `el-ai-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 5)}`;
        const newElement: CanvasElement = {
          ...rawEl,
          id: newElId,
          properties: resolvedProps
        };

        const cursorX = Math.round(newElement.posX + newElement.width / 2);
        const cursorY = Math.round(newElement.posY + Math.min(newElement.height / 2, 120));

        if (!skipAiAnimRef.current) {
          // 1. Kursor meluncur menuju koordinat elemen
          setAiCursor({
            isActive: true,
            targetCanvasId: targetId,
            x: cursorX,
            y: cursorY,
            label: action.label,
            isClicking: false,
            currentStep: stepNum,
            totalSteps
          });
          await sleep(250);

          // 2. Kursor melakukan klik (efek ripple biru)
          setAiCursor((prev) => (prev ? { ...prev, isClicking: true } : prev));
        }

        // 3. Elemen langsung muncul di kanvas
        workingCanvases = workingCanvases.map((c) =>
          c.id === targetId ? { ...c, elements: [...c.elements, newElement] } : c
        );
        setCanvases([...workingCanvases]);
        setActiveCanvasId(targetId);

        if (!skipAiAnimRef.current) {
          setRecentlyAddedElementId(newElId);
          await sleep(170);
        }
      }
    }

    // Selesai merancang!
    setAiCursor(null);
    setTimeout(() => setRecentlyAddedElementId(null), 500);

    // Scroll kembali ke kanvas pertama jika membangun website lengkap agar user melihat dari Hero
    if (plan.isFullBuild && workingCanvases[0]) {
      setActiveCanvasId(workingCanvases[0].id);
      setTimeout(() => {
        document.getElementById(workingCanvases[0].id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
      confetti({
        particleCount: 85,
        spread: 65,
        origin: { y: 0.65 }
      });
    }
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
      <header className="min-h-14 bg-white border-b border-slate-200/90 px-2.5 sm:px-4 py-1.5 flex items-center justify-between gap-2 z-30 shrink-0 overflow-x-auto">
        {/* Kiri: Tombol Kembali & Brand */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200/80 transition shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Kembali</span>
          </Link>

          <div className="h-5 w-px bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2">
            <NexaWebMark size={30} className="rounded-lg shadow-md shadow-blue-500/20 shrink-0" />
            <div className="hidden md:block">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-slate-900 tracking-tight">
                  NexaWeb<span className="text-blue-600">.advance</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                  Freeform Studio
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Free-Form Multi-Canvas Editor</p>
            </div>
          </div>
        </div>

        {/* Tengah: Zoom Scale Controls */}
        <div className="hidden sm:flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200 shrink-0">
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
            className="px-2.5 sm:px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition shadow-2xs shrink-0"
            title="Lihat Pratinjau Interaktif Website"
          >
            <Eye className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">Pratinjau</span>
          </button>

          {/* Deploy / Unduh ZIP Website */}
          <button
            type="button"
            onClick={handleDeployZip}
            disabled={isDeploying}
            className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition active:scale-95 disabled:opacity-60 shrink-0"
            title="Unduh Paket Website Lengkap (index.html & css)"
          >
            <Rocket className="w-4 h-4 text-blue-200" />
            <span className="hidden sm:inline">{isDeploying ? 'Mengekspor...' : 'Deploy ZIP'}</span>
          </button>

          {/* AC-ADV-05: Tombol Buka/Tutup Asisten AI */}
          <button
            type="button"
            onClick={() => setIsAiOpen(!isAiOpen)}
            className={`px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shrink-0 ${
              isAiOpen
                ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                : 'bg-blue-600 text-white shadow-md shadow-blue-600/20 hover:bg-blue-700'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden md:inline">{isAiOpen ? 'Tutup AI' : 'Buka AI'}</span>
          </button>
        </div>
      </header>

      {/* --------------------------------------------------------------------- */}
      {/* 2. CONTEXTUAL TOOLBAR PROPERTI ELEMEN                                 */}
      {/* --------------------------------------------------------------------- */}
      <AdvanceContextualToolbar
        selectedElement={selectedElement}
        selectedElements={selectedElements}
        activeCanvas={activeCanvas}
        allCanvases={canvases}
        onUpdateElementProperties={handleUpdateElementProperties}
        onUpdateElementColor={handleUpdateElementColor}
        onDeleteElement={handleDeleteElement}
        onDuplicateElement={handleDuplicateElement}
        onBringForward={handleBringForward}
        onSendBackward={handleSendBackward}
        onOpenNavConfigModal={() => setIsNavConfigOpen(true)}
        onMaskWithElement={handleMaskWithElement}
        onUnmaskElement={handleUnmaskElement}
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
          className="flex-1 min-w-0 overflow-auto bg-slate-200/70 p-2.5 sm:p-6 pb-20 md:pb-6 relative flex"
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
                  zoomLevel={zoomLevel}
                  selectedElementIds={selectedElementIds}
                  allCanvases={canvases}
                  aiCursor={aiCursor}
                  recentlyAddedElementId={recentlyAddedElementId}
                  onSelectCanvas={() => setActiveCanvasId(c.id)}
                  onSelectElements={setSelectedElementIds}
                  onBatchUpdatePositions={handleBatchUpdatePositions}
                  onUpdateElementSize={handleUpdateElementSize}
                  onUpdateElementText={handleUpdateElementText}
                  onUpdateProductCardText={handleUpdateProductCardText}
                  onDuplicateCanvas={handleDuplicateCanvas}
                  onDeleteCanvas={handleDeleteCanvas}
                  onRenameCanvas={handleRenameCanvas}
                  onDuplicateElement={handleDuplicateElement}
                  onDeleteElement={handleDeleteElement}
                  onUpdateCanvasBackground={handleUpdateCanvasBackground}
                  onTriggerImageUploadForElement={handleTriggerImageUploadForElement}
                  onOpenNavConfigModal={() => setIsNavConfigOpen(true)}
                  onOpenContextMenu={handleOpenContextMenu}
                  onToggleLockElement={(elId) => handleToggleLockElements([elId])}
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

        {/* AC-ADV-05: Asisten AI Kanan (Overpowered NexaWeb AI Architect) */}
        <AdvanceAiCopilot
          isOpen={isAiOpen}
          onClose={() => setIsAiOpen(false)}
          activeCanvas={activeCanvas}
          allCanvases={canvases}
          aiCursor={aiCursor}
          onExecuteAiPlan={handleExecuteAiPlan}
          onSkipAiAnimation={() => {
            skipAiAnimRef.current = true;
          }}
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

      {/* Canva-style Right-Click Context Menu (Single & Multiple Select) */}
      <AdvanceContextMenu
        menu={contextMenu}
        selectedElements={selectedElements}
        hasClipboard={clipboardElements.length > 0}
        hasStyleClipboard={copiedStyle !== null}
        onClose={() => setContextMenu(null)}
        onCopy={handleCopyElements}
        onCopyStyle={handleCopyStyle}
        onPasteStyle={handlePasteStyle}
        onPaste={handlePasteElements}
        onDuplicate={handleDuplicateElement}
        onDelete={handleDeleteElement}
        onAlign={handleAlignElements}
        onLayerAction={handleLayerAction}
        onGroup={handleGroupElements}
        onUngroup={handleUngroupElements}
        onToggleLock={() => handleToggleLockElements()}
        onFitCanvasToSelection={handleFitCanvasToSelection}
        onMaskSelected={
          selectedElements.length === 2
            ? () => handleMaskWithElement(selectedElements[1].id, selectedElements[0].id)
            : undefined
        }
        onUnmaskSelected={handleUnmaskElement}
        onSelectAll={handleSelectAllInActiveCanvas}
      />

      {/* Subtle Floating Action Toast */}
      {actionToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[150] px-4 py-2 rounded-full bg-slate-900/95 text-white text-xs font-semibold shadow-xl border border-slate-700/80 flex items-center gap-2 pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-150">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{actionToast}</span>
        </div>
      )}
    </div>
  );
}
