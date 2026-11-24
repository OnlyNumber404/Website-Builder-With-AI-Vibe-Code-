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
  Edit3,
  Sparkles
} from 'lucide-react';
import {
  AdvanceCanvas,
  CanvasElement,
  AiCursorState,
  CANVAS_DEFAULT_WIDTH,
  CANVAS_DEFAULT_HEIGHT
} from '@/lib/advanceTypes';
import AdvanceShapeRenderer from '@/components/advance/AdvanceShapeRenderer';
import { getShapeClipPath, HEART_CLIP_PATH_D } from '@/lib/advanceMaskUtils';

export interface AdvanceCanvasPageProps {
  canvas: AdvanceCanvas;
  isActive: boolean;
  canDelete: boolean;
  zoomLevel?: number;
  selectedElementIds: string[];
  allCanvases: AdvanceCanvas[];
  aiCursor?: AiCursorState | null;
  recentlyAddedElementId?: string | null;
  onSelectCanvas: () => void;
  onSelectElements: (elementIds: string[]) => void;
  onBatchUpdatePositions: (updates: { id: string; posX: number; posY: number }[]) => void;
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
  zoomLevel = 1,
  selectedElementIds,
  allCanvases,
  aiCursor,
  recentlyAddedElementId,
  onSelectCanvas,
  onSelectElements,
  onBatchUpdatePositions,
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

  // Smart Equal-Spacing & Distance Measurement Guides (px)
  const [spacingGuides, setSpacingGuides] = useState<{
    orientation: 'horizontal' | 'vertical';
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    distance: number;
    isMatched: boolean;
  }[]>([]);

  // 60FPS Local GPU Drag & Resize States (ZERO parent re-render during mousemove!)
  const [liveDrag, setLiveDrag] = useState<{
    ids: Set<string>;
    dx: number;
    dy: number;
  } | null>(null);

  const [liveResize, setLiveResize] = useState<{
    id: string;
    posX: number;
    posY: number;
    width: number;
    height: number;
    aspectLocked?: boolean;
  } | null>(null);

  // Marquee Multi-Select Box State (Hold Left-Click & Drag Kotak Transparan)
  const [marqueeBox, setMarqueeBox] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
    previewIds: Set<string>;
  } | null>(null);

  // Stable refs so window mouse listeners NEVER detach/re-attach during drag
  const elementsRef = useRef<CanvasElement[]>(canvas.elements);
  const zoomRef = useRef<number>(zoomLevel);
  const canvasHeightRef = useRef<number>(canvas.height || CANVAS_DEFAULT_HEIGHT);
  const selectedIdsRef = useRef<string[]>(selectedElementIds);
  const onBatchUpdatePositionsRef = useRef(onBatchUpdatePositions);
  const onUpdateElementSizeRef = useRef(onUpdateElementSize);
  const onSelectElementsRef = useRef(onSelectElements);
  const onSelectCanvasRef = useRef(onSelectCanvas);

  elementsRef.current = canvas.elements;
  zoomRef.current = zoomLevel || 1;
  canvasHeightRef.current = canvas.height || CANVAS_DEFAULT_HEIGHT;
  selectedIdsRef.current = selectedElementIds;
  onBatchUpdatePositionsRef.current = onBatchUpdatePositions;
  onUpdateElementSizeRef.current = onUpdateElementSize;
  onSelectElementsRef.current = onSelectElements;
  onSelectCanvasRef.current = onSelectCanvas;

  const hasJustDraggedRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  // Group / Single Dragging Ref
  const dragRef = useRef<{
    isDragging: boolean;
    hasMoved: boolean;
    anchorId: string;
    dragItems: { id: string; initialPosX: number; initialPosY: number }[];
    startX: number;
    startY: number;
    anchorInitX: number;
    anchorInitY: number;
    anchorWidth: number;
    anchorHeight: number;
    lastDx: number;
    lastDy: number;
  }>({
    isDragging: false,
    hasMoved: false,
    anchorId: '',
    dragItems: [],
    startX: 0,
    startY: 0,
    anchorInitX: 0,
    anchorInitY: 0,
    anchorWidth: 0,
    anchorHeight: 0,
    lastDx: 0,
    lastDy: 0
  });

  // Resizing Ref
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
    lastBox: { posX: number; posY: number; width: number; height: number } | null;
  }>({
    isResizing: false,
    elementId: '',
    handle: 'se',
    startX: 0,
    startY: 0,
    initialWidth: 0,
    initialHeight: 0,
    initialPosX: 0,
    initialPosY: 0,
    lastBox: null
  });

  // Marquee Multi-Select Ref
  const marqueeRef = useRef<{
    isSelecting: boolean;
    hasMoved: boolean;
    startX: number;
    startY: number;
    previewIds: string[];
  }>({
    isSelecting: false,
    hasMoved: false,
    startX: 0,
    startY: 0,
    previewIds: []
  });

  // Global mousemove and mouseup listeners (registered ONCE on mount -> ultra-fast 60fps!)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const zoom = zoomRef.current || 1;
      const canvasHeight = canvasHeightRef.current;

      // 0. Marquee Multi-Select Dragging (Kotak Transparan ala Canva)
      if (marqueeRef.current.isSelecting && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const currX = Math.max(0, Math.min(CANVAS_DEFAULT_WIDTH, (e.clientX - rect.left) / zoom));
        const currY = Math.max(0, Math.min(canvasHeight, (e.clientY - rect.top) / zoom));

        const x = Math.min(marqueeRef.current.startX, currX);
        const y = Math.min(marqueeRef.current.startY, currY);
        const width = Math.abs(currX - marqueeRef.current.startX);
        const height = Math.abs(currY - marqueeRef.current.startY);

        if (width > 4 || height > 4) {
          marqueeRef.current.hasMoved = true;
        }

        const hitIds: string[] = [];
        for (const el of elementsRef.current) {
          const elH = Math.max(20, el.height);
          if (
            x < el.posX + el.width &&
            x + width > el.posX &&
            y < el.posY + elH &&
            y + height > el.posY
          ) {
            hitIds.push(el.id);
          }
        }
        marqueeRef.current.previewIds = hitIds;

        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
          setMarqueeBox({ x, y, width, height, previewIds: new Set(hitIds) });
        });
        return;
      }

      // 1. Dragging element(s) with 60fps GPU translate3d + Smart Auto-Snap Guides
      if (dragRef.current.isDragging) {
        const rawDx = (e.clientX - dragRef.current.startX) / zoom;
        const rawDy = (e.clientY - dragRef.current.startY) / zoom;

        // Abaikan getaran tangan kecil di bawah 4px agar klik murni tidak memicu drag
        if (!dragRef.current.hasMoved && Math.hypot(rawDx, rawDy) < 4) {
          return;
        }
        dragRef.current.hasMoved = true;

        const elWidth = dragRef.current.anchorWidth;
        const elHeight = dragRef.current.anchorHeight;
        let rawX = dragRef.current.anchorInitX + rawDx;
        let rawY = dragRef.current.anchorInitY + rawDy;

        const draggedIdSet = new Set(dragRef.current.dragItems.map((d) => d.id));
        const SNAP_THRESHOLD = 7;
        const currentGuides: { type: 'vertical' | 'horizontal'; pos: number; label?: string }[] = [];
        const otherElements = elementsRef.current.filter((item) => !draggedIdSet.has(item.id));

        // A. HORIZONTAL SNAPPING
        let bestDiffX = SNAP_THRESHOLD + 1;
        let snappedX = rawX;
        let guideX: { type: 'vertical'; pos: number; label: string } | null = null;

        const canvasCenterX = Math.round(CANVAS_DEFAULT_WIDTH / 2);
        const currentCenterX = rawX + elWidth / 2;
        const centerCanvasDiff = Math.abs(currentCenterX - canvasCenterX);
        if (centerCanvasDiff <= SNAP_THRESHOLD && centerCanvasDiff < bestDiffX) {
          bestDiffX = centerCanvasDiff;
          snappedX = canvasCenterX - elWidth / 2;
          guideX = { type: 'vertical', pos: canvasCenterX, label: 'Tengah Kanvas' };
        }

        for (const other of otherElements) {
          const otherLeft = other.posX;
          const otherCenterX = Math.round(other.posX + other.width / 2);
          const otherRight = other.posX + other.width;

          const diffLeft = Math.abs(rawX - otherLeft);
          if (diffLeft <= SNAP_THRESHOLD && diffLeft < bestDiffX) {
            bestDiffX = diffLeft;
            snappedX = otherLeft;
            guideX = { type: 'vertical', pos: otherLeft, label: 'Rata Kiri' };
          }
          const diffCenter = Math.abs(currentCenterX - otherCenterX);
          if (diffCenter <= SNAP_THRESHOLD && diffCenter < bestDiffX) {
            bestDiffX = diffCenter;
            snappedX = otherCenterX - elWidth / 2;
            guideX = { type: 'vertical', pos: otherCenterX, label: 'Rata Tengah' };
          }
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

        // B. VERTICAL SNAPPING
        let bestDiffY = SNAP_THRESHOLD + 1;
        let snappedY = rawY;
        let guideY: { type: 'horizontal'; pos: number; label: string } | null = null;

        const canvasCenterY = Math.round(canvasHeight / 2);
        const currentCenterY = rawY + elHeight / 2;
        const centerCanvasVDiff = Math.abs(currentCenterY - canvasCenterY);
        if (centerCanvasVDiff <= SNAP_THRESHOLD && centerCanvasVDiff < bestDiffY) {
          bestDiffY = centerCanvasVDiff;
          snappedY = canvasCenterY - elHeight / 2;
          guideY = { type: 'horizontal', pos: canvasCenterY, label: 'Tengah Kanvas' };
        }

        for (const other of otherElements) {
          const otherTop = other.posY;
          const otherCenterY = Math.round(other.posY + other.height / 2);
          const otherBottom = other.posY + other.height;

          const diffTop = Math.abs(rawY - otherTop);
          if (diffTop <= SNAP_THRESHOLD && diffTop < bestDiffY) {
            bestDiffY = diffTop;
            snappedY = otherTop;
            guideY = { type: 'horizontal', pos: otherTop, label: 'Rata Atas' };
          }
          const diffCenterY = Math.abs(currentCenterY - otherCenterY);
          if (diffCenterY <= SNAP_THRESHOLD && diffCenterY < bestDiffY) {
            bestDiffY = diffCenterY;
            snappedY = otherCenterY - elHeight / 2;
            guideY = { type: 'horizontal', pos: otherCenterY, label: 'Rata Tengah' };
          }
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

        // C. SMART EQUAL-SPACING AUTO-SNAP & LIVE DISTANCE MEASUREMENT (PX)
        const currentSpacing: {
          orientation: 'horizontal' | 'vertical';
          x1: number;
          y1: number;
          x2: number;
          y2: number;
          distance: number;
          isMatched: boolean;
        }[] = [];
        const GAP_SNAP = 8;

        // C1. Horizontal Row Spacing (e.g. Produk 1 --gap-- Produk 2 --gap-- Produk 3)
        const rowNeighbors = otherElements
          .filter((o) => o.posY < rawY + elHeight && o.posY + o.height > rawY)
          .sort((a, b) => a.posX - b.posX);

        const leftNeighbors = rowNeighbors.filter((o) => o.posX + o.width <= rawX + 4);
        const rightNeighbors = rowNeighbors.filter((o) => o.posX >= rawX + elWidth - 4);
        const nearestLeft = leftNeighbors.length > 0 ? leftNeighbors[leftNeighbors.length - 1] : null;
        const nearestRight = rightNeighbors.length > 0 ? rightNeighbors[0] : null;

        let horizGapMatched = false;

        // Pattern 1: [A] --gap-- [B] --gap-- [Dragged]
        if (leftNeighbors.length >= 2 && nearestLeft) {
          const prevLeft = leftNeighbors[leftNeighbors.length - 2];
          const refGap = Math.round(nearestLeft.posX - (prevLeft.posX + prevLeft.width));
          const currGap = Math.round(rawX - (nearestLeft.posX + nearestLeft.width));
          if (refGap > 0 && Math.abs(currGap - refGap) <= GAP_SNAP) {
            rawX = nearestLeft.posX + nearestLeft.width + refGap;
            horizGapMatched = true;
            const midY1 = Math.round(
              (Math.max(prevLeft.posY, nearestLeft.posY) +
                Math.min(prevLeft.posY + prevLeft.height, nearestLeft.posY + nearestLeft.height)) / 2
            );
            const midY2 = Math.round(
              (Math.max(nearestLeft.posY, rawY) +
                Math.min(nearestLeft.posY + nearestLeft.height, rawY + elHeight)) / 2
            );
            currentSpacing.push(
              { orientation: 'horizontal', x1: prevLeft.posX + prevLeft.width, y1: midY1, x2: nearestLeft.posX, y2: midY1, distance: refGap, isMatched: true },
              { orientation: 'horizontal', x1: nearestLeft.posX + nearestLeft.width, y1: midY2, x2: rawX, y2: midY2, distance: refGap, isMatched: true }
            );
          }
        }

        // Pattern 2: [Dragged] --gap-- [A] --gap-- [B]
        if (!horizGapMatched && rightNeighbors.length >= 2 && nearestRight) {
          const nextRight = rightNeighbors[1];
          const refGap = Math.round(nextRight.posX - (nearestRight.posX + nearestRight.width));
          const currGap = Math.round(nearestRight.posX - (rawX + elWidth));
          if (refGap > 0 && Math.abs(currGap - refGap) <= GAP_SNAP) {
            rawX = nearestRight.posX - refGap - elWidth;
            horizGapMatched = true;
            const midY1 = Math.round(
              (Math.max(rawY, nearestRight.posY) +
                Math.min(rawY + elHeight, nearestRight.posY + nearestRight.height)) / 2
            );
            const midY2 = Math.round(
              (Math.max(nearestRight.posY, nextRight.posY) +
                Math.min(nearestRight.posY + nearestRight.height, nextRight.posY + nextRight.height)) / 2
            );
            currentSpacing.push(
              { orientation: 'horizontal', x1: rawX + elWidth, y1: midY1, x2: nearestRight.posX, y2: midY1, distance: refGap, isMatched: true },
              { orientation: 'horizontal', x1: nearestRight.posX + nearestRight.width, y1: midY2, x2: nextRight.posX, y2: midY2, distance: refGap, isMatched: true }
            );
          }
        }

        // Pattern 3: Centered between [Left] --gap-- [Dragged] --gap-- [Right]
        if (!horizGapMatched && nearestLeft && nearestRight) {
          const availableSpan = nearestRight.posX - (nearestLeft.posX + nearestLeft.width);
          const idealGap = Math.round((availableSpan - elWidth) / 2);
          const currLeftGap = Math.round(rawX - (nearestLeft.posX + nearestLeft.width));
          if (idealGap > 0 && Math.abs(currLeftGap - idealGap) <= GAP_SNAP) {
            rawX = nearestLeft.posX + nearestLeft.width + idealGap;
            horizGapMatched = true;
            const midY = Math.round(rawY + elHeight / 2);
            currentSpacing.push(
              { orientation: 'horizontal', x1: nearestLeft.posX + nearestLeft.width, y1: midY, x2: rawX, y2: midY, distance: idealGap, isMatched: true },
              { orientation: 'horizontal', x1: rawX + elWidth, y1: midY, x2: nearestRight.posX, y2: midY, distance: idealGap, isMatched: true }
            );
          }
        }

        // Live horizontal distance readout to immediate neighbors even when not equal-snapped
        if (!horizGapMatched) {
          if (nearestLeft) {
            const gapL = Math.round(rawX - (nearestLeft.posX + nearestLeft.width));
            if (gapL > 2 && gapL < 300) {
              const midY = Math.round(
                (Math.max(nearestLeft.posY, rawY) +
                  Math.min(nearestLeft.posY + nearestLeft.height, rawY + elHeight)) / 2
              );
              currentSpacing.push({
                orientation: 'horizontal',
                x1: nearestLeft.posX + nearestLeft.width,
                y1: midY,
                x2: rawX,
                y2: midY,
                distance: gapL,
                isMatched: false
              });
            }
          }
          if (nearestRight) {
            const gapR = Math.round(nearestRight.posX - (rawX + elWidth));
            if (gapR > 2 && gapR < 300) {
              const midY = Math.round(
                (Math.max(nearestRight.posY, rawY) +
                  Math.min(nearestRight.posY + nearestRight.height, rawY + elHeight)) / 2
              );
              currentSpacing.push({
                orientation: 'horizontal',
                x1: rawX + elWidth,
                y1: midY,
                x2: nearestRight.posX,
                y2: midY,
                distance: gapR,
                isMatched: false
              });
            }
          }
        }

        // C2. Vertical Column Spacing (stacked rows)
        const colNeighbors = otherElements
          .filter((o) => o.posX < rawX + elWidth && o.posX + o.width > rawX)
          .sort((a, b) => a.posY - b.posY);

        const topNeighbors = colNeighbors.filter((o) => o.posY + o.height <= rawY + 4);
        const bottomNeighbors = colNeighbors.filter((o) => o.posY >= rawY + elHeight - 4);
        const nearestTop = topNeighbors.length > 0 ? topNeighbors[topNeighbors.length - 1] : null;
        const nearestBottom = bottomNeighbors.length > 0 ? bottomNeighbors[0] : null;

        let vertGapMatched = false;

        if (topNeighbors.length >= 2 && nearestTop) {
          const prevTop = topNeighbors[topNeighbors.length - 2];
          const refGap = Math.round(nearestTop.posY - (prevTop.posY + prevTop.height));
          const currGap = Math.round(rawY - (nearestTop.posY + nearestTop.height));
          if (refGap > 0 && Math.abs(currGap - refGap) <= GAP_SNAP) {
            rawY = nearestTop.posY + nearestTop.height + refGap;
            vertGapMatched = true;
            const midX = Math.round(rawX + elWidth / 2);
            currentSpacing.push(
              { orientation: 'vertical', x1: midX, y1: prevTop.posY + prevTop.height, x2: midX, y2: nearestTop.posY, distance: refGap, isMatched: true },
              { orientation: 'vertical', x1: midX, y1: nearestTop.posY + nearestTop.height, x2: midX, y2: rawY, distance: refGap, isMatched: true }
            );
          }
        }

        if (!vertGapMatched && nearestTop && nearestBottom) {
          const availableSpan = nearestBottom.posY - (nearestTop.posY + nearestTop.height);
          const idealGap = Math.round((availableSpan - elHeight) / 2);
          const currTopGap = Math.round(rawY - (nearestTop.posY + nearestTop.height));
          if (idealGap > 0 && Math.abs(currTopGap - idealGap) <= GAP_SNAP) {
            rawY = nearestTop.posY + nearestTop.height + idealGap;
            vertGapMatched = true;
            const midX = Math.round(rawX + elWidth / 2);
            currentSpacing.push(
              { orientation: 'vertical', x1: midX, y1: nearestTop.posY + nearestTop.height, x2: midX, y2: rawY, distance: idealGap, isMatched: true },
              { orientation: 'vertical', x1: midX, y1: rawY + elHeight, x2: midX, y2: nearestBottom.posY, distance: idealGap, isMatched: true }
            );
          }
        }

        if (!vertGapMatched) {
          if (nearestTop) {
            const gapT = Math.round(rawY - (nearestTop.posY + nearestTop.height));
            if (gapT > 2 && gapT < 260) {
              const midX = Math.round(
                (Math.max(nearestTop.posX, rawX) +
                  Math.min(nearestTop.posX + nearestTop.width, rawX + elWidth)) / 2
              );
              currentSpacing.push({
                orientation: 'vertical',
                x1: midX,
                y1: nearestTop.posY + nearestTop.height,
                x2: midX,
                y2: rawY,
                distance: gapT,
                isMatched: false
              });
            }
          }
          if (nearestBottom) {
            const gapB = Math.round(nearestBottom.posY - (rawY + elHeight));
            if (gapB > 2 && gapB < 260) {
              const midX = Math.round(
                (Math.max(nearestBottom.posX, rawX) +
                  Math.min(nearestBottom.posX + nearestBottom.width, rawX + elWidth)) / 2
              );
              currentSpacing.push({
                orientation: 'vertical',
                x1: midX,
                y1: rawY + elHeight,
                x2: midX,
                y2: nearestBottom.posY,
                distance: gapB,
                isMatched: false
              });
            }
          }
        }

        // C3. INNER-CONTAINER PADDING AUTO-SNAP & DISTANCE GUIDES
        // (Jika elemen berada DI DALAM item lain yang lebih besar, misal foto/tombol di dalam kotak card)
        const elCenterX = rawX + elWidth / 2;
        const elCenterY = rawY + elHeight / 2;
        const enclosingParents = otherElements
          .filter(
            (o) =>
              o.width > elWidth + 8 &&
              o.height > elHeight + 8 &&
              elCenterX >= o.posX &&
              elCenterX <= o.posX + o.width &&
              elCenterY >= o.posY &&
              elCenterY <= o.posY + o.height
          )
          .sort((a, b) => a.width * a.height - b.width * b.height);

        const parentBox = enclosingParents[0] || null;

        if (parentBox) {
          let padL = Math.round(rawX - parentBox.posX);
          let padR = Math.round(parentBox.posX + parentBox.width - (rawX + elWidth));
          let padT = Math.round(rawY - parentBox.posY);
          let padB = Math.round(parentBox.posY + parentBox.height - (rawY + elHeight));

          let hInnerMatched = false;
          let vInnerMatched = false;

          // Snap simetris kiri-kanan di dalam parent container
          if (padL > 2 && padR > 2 && Math.abs(padL - padR) <= GAP_SNAP) {
            const centeredPad = Math.round((parentBox.width - elWidth) / 2);
            rawX = parentBox.posX + centeredPad;
            padL = centeredPad;
            padR = parentBox.width - elWidth - centeredPad;
            hInnerMatched = true;
          }

          // Snap simetris atas-bawah di dalam parent container
          if (padT > 2 && padB > 2 && Math.abs(padT - padB) <= GAP_SNAP) {
            const centeredPadV = Math.round((parentBox.height - elHeight) / 2);
            rawY = parentBox.posY + centeredPadV;
            padT = centeredPadV;
            padB = parentBox.height - elHeight - centeredPadV;
            vInnerMatched = true;
          }

          // Snap padding sudut seragam: Atas == Kiri (misal foto di dalam card 16px atas & 16px kiri!)
          if (!vInnerMatched && padL > 4 && padL <= 120 && padT > 2 && Math.abs(padT - padL) <= GAP_SNAP) {
            rawY = parentBox.posY + padL;
            padT = padL;
            vInnerMatched = true;
            hInnerMatched = true;
          } else if (!vInnerMatched && padR > 4 && padR <= 120 && padT > 2 && Math.abs(padT - padR) <= GAP_SNAP) {
            rawY = parentBox.posY + padR;
            padT = padR;
            vInnerMatched = true;
            hInnerMatched = true;
          } else if (!vInnerMatched && padL > 4 && padL <= 120 && padB > 2 && Math.abs(padB - padL) <= GAP_SNAP) {
            rawY = parentBox.posY + parentBox.height - elHeight - padL;
            padB = padL;
            vInnerMatched = true;
            hInnerMatched = true;
          }

          const midY = Math.round(rawY + elHeight / 2);
          const midX = Math.round(rawX + elWidth / 2);

          if (padL > 2 && padL < parentBox.width) {
            currentSpacing.push({
              orientation: 'horizontal',
              x1: parentBox.posX,
              y1: midY,
              x2: rawX,
              y2: midY,
              distance: padL,
              isMatched: hInnerMatched
            });
          }
          if (padR > 2 && padR < parentBox.width) {
            currentSpacing.push({
              orientation: 'horizontal',
              x1: rawX + elWidth,
              y1: midY,
              x2: parentBox.posX + parentBox.width,
              y2: midY,
              distance: padR,
              isMatched: hInnerMatched
            });
          }
          if (padT > 2 && padT <= 180) {
            currentSpacing.push({
              orientation: 'vertical',
              x1: midX,
              y1: parentBox.posY,
              x2: midX,
              y2: rawY,
              distance: padT,
              isMatched: vInnerMatched
            });
          }
          if (padB > 2 && padB <= 180) {
            currentSpacing.push({
              orientation: 'vertical',
              x1: midX,
              y1: rawY + elHeight,
              x2: midX,
              y2: parentBox.posY + parentBox.height,
              distance: padB,
              isMatched: vInnerMatched
            });
          }
        } else {
          // C4. CANVAS EDGE & CORNER MARGIN AUTO-SNAP + DISTANCE GUIDES
          // (Saat elemen ditaruh dekat pinggir atau pojokan Kanvas!)
          let marginL = Math.round(rawX);
          let marginR = Math.round(CANVAS_DEFAULT_WIDTH - (rawX + elWidth));
          let marginT = Math.round(rawY);
          let marginB = Math.round(canvasHeight - (rawY + elHeight));
          const EDGE_SHOW_THRESHOLD = 140;

          let cornerMatchedL = false;
          let cornerMatchedR = false;
          let cornerMatchedT = false;
          let cornerMatchedB = false;

          // Pojok Kiri-Atas: marginT == marginL
          if (marginL >= 6 && marginL <= EDGE_SHOW_THRESHOLD && marginT >= 6 && Math.abs(marginT - marginL) <= GAP_SNAP) {
            rawY = marginL;
            marginT = marginL;
            cornerMatchedL = true;
            cornerMatchedT = true;
          }
          // Pojok Kanan-Atas: marginT == marginR
          else if (marginR >= 6 && marginR <= EDGE_SHOW_THRESHOLD && marginT >= 6 && Math.abs(marginT - marginR) <= GAP_SNAP) {
            rawY = marginR;
            marginT = marginR;
            cornerMatchedR = true;
            cornerMatchedT = true;
          }
          // Pojok Kiri-Bawah: marginB == marginL
          else if (marginL >= 6 && marginL <= EDGE_SHOW_THRESHOLD && marginB >= 6 && Math.abs(marginB - marginL) <= GAP_SNAP) {
            rawY = canvasHeight - elHeight - marginL;
            marginB = marginL;
            cornerMatchedL = true;
            cornerMatchedB = true;
          }
          // Pojok Kanan-Bawah: marginB == marginR
          else if (marginR >= 6 && marginR <= EDGE_SHOW_THRESHOLD && marginB >= 6 && Math.abs(marginB - marginR) <= GAP_SNAP) {
            rawY = canvasHeight - elHeight - marginR;
            marginB = marginR;
            cornerMatchedR = true;
            cornerMatchedB = true;
          }

          const midY = Math.round(rawY + elHeight / 2);
          const midX = Math.round(rawX + elWidth / 2);

          if (marginL > 2 && marginL <= EDGE_SHOW_THRESHOLD) {
            currentSpacing.push({
              orientation: 'horizontal',
              x1: 0,
              y1: midY,
              x2: rawX,
              y2: midY,
              distance: marginL,
              isMatched: cornerMatchedL
            });
          }
          if (marginR > 2 && marginR <= EDGE_SHOW_THRESHOLD) {
            currentSpacing.push({
              orientation: 'horizontal',
              x1: rawX + elWidth,
              y1: midY,
              x2: CANVAS_DEFAULT_WIDTH,
              y2: midY,
              distance: marginR,
              isMatched: cornerMatchedR
            });
          }
          if (marginT > 2 && marginT <= EDGE_SHOW_THRESHOLD) {
            currentSpacing.push({
              orientation: 'vertical',
              x1: midX,
              y1: 0,
              x2: midX,
              y2: rawY,
              distance: marginT,
              isMatched: cornerMatchedT
            });
          }
          if (marginB > 2 && marginB <= EDGE_SHOW_THRESHOLD) {
            currentSpacing.push({
              orientation: 'vertical',
              x1: midX,
              y1: rawY + elHeight,
              x2: midX,
              y2: canvasHeight,
              distance: marginB,
              isMatched: cornerMatchedB
            });
          }
        }

        const clampedAnchorX = Math.max(0, Math.min(CANVAS_DEFAULT_WIDTH - 40, Math.round(rawX)));
        const clampedAnchorY = Math.max(0, Math.min(canvasHeight - 24, Math.round(rawY)));
        const finalDx = clampedAnchorX - dragRef.current.anchorInitX;
        const finalDy = clampedAnchorY - dragRef.current.anchorInitY;

        dragRef.current.lastDx = finalDx;
        dragRef.current.lastDy = finalDy;

        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
          setLiveDrag({ ids: draggedIdSet, dx: finalDx, dy: finalDy });
          setActiveGuides(currentGuides);
          setSpacingGuides(currentSpacing);
        });
        return;
      }

      // 2. Resizing element with 60fps Local Preview + Shift Proportional Lock + Smart Dimension Snapping
      if (resizeRef.current.isResizing) {
        const dx = (e.clientX - resizeRef.current.startX) / zoom;
        const dy = (e.clientY - resizeRef.current.startY) / zoom;
        const { handle, initialWidth, initialHeight, initialPosX, initialPosY, elementId } = resizeRef.current;

        const otherElements = elementsRef.current.filter((item) => item.id !== elementId);
        const SNAP_THRESHOLD = 8;
        const currentGuides: { type: 'vertical' | 'horizontal'; pos: number; label?: string }[] = [];

        let rawWidth = initialWidth;
        let rawHeight = initialHeight;

        if (handle === 'se') {
          rawWidth = Math.max(40, Math.round(initialWidth + dx));
          rawHeight = Math.max(24, Math.round(initialHeight + dy));
        } else if (handle === 'sw') {
          rawWidth = Math.max(40, Math.round(initialWidth - dx));
          rawHeight = Math.max(24, Math.round(initialHeight + dy));
        } else if (handle === 'ne') {
          rawWidth = Math.max(40, Math.round(initialWidth + dx));
          rawHeight = Math.max(24, Math.round(initialHeight - dy));
        } else if (handle === 'nw') {
          rawWidth = Math.max(40, Math.round(initialWidth - dx));
          rawHeight = Math.max(24, Math.round(initialHeight - dy));
        }

        // HOLD SHIFT = Kunci Rasio Proporsional (Tinggi & Lebar Konsisten!)
        const aspectLocked = e.shiftKey;
        if (aspectLocked && initialWidth > 0 && initialHeight > 0) {
          const aspectRatio = initialWidth / initialHeight;
          const relW = Math.abs(rawWidth - initialWidth) / initialWidth;
          const relH = Math.abs(rawHeight - initialHeight) / initialHeight;
          if (relW >= relH) {
            rawHeight = Math.max(24, Math.round(rawWidth / aspectRatio));
          } else {
            rawWidth = Math.max(40, Math.round(rawHeight * aspectRatio));
          }
        }

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
            guideW = { type: 'vertical', pos: targetX, label: `Lebar Sama (${other.width}px)` };
          }
        }
        if (guideW) {
          rawWidth = snappedW;
          if (aspectLocked && initialWidth > 0 && initialHeight > 0) {
            rawHeight = Math.max(24, Math.round(rawWidth / (initialWidth / initialHeight)));
          }
          currentGuides.push(guideW);
        }

        if (!aspectLocked) {
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
              guideH = { type: 'horizontal', pos: targetY, label: `Tinggi Sama (${other.height}px)` };
            }
          }
          if (guideH) {
            rawHeight = snappedH;
            currentGuides.push(guideH);
          }
        }

        let newPosX = initialPosX;
        let newPosY = initialPosY;
        if (handle === 'sw') {
          newPosX = Math.max(0, Math.round(initialPosX + (initialWidth - rawWidth)));
        } else if (handle === 'ne') {
          newPosY = Math.max(0, Math.round(initialPosY + (initialHeight - rawHeight)));
        } else if (handle === 'nw') {
          newPosX = Math.max(0, Math.round(initialPosX + (initialWidth - rawWidth)));
          newPosY = Math.max(0, Math.round(initialPosY + (initialHeight - rawHeight)));
        }

        const box = { posX: newPosX, posY: newPosY, width: rawWidth, height: rawHeight };
        resizeRef.current.lastBox = box;

        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
          setLiveResize({ id: elementId, ...box, aspectLocked });
          setActiveGuides(currentGuides);
        });
      }
    };

    const handleMouseUp = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      if (marqueeRef.current.isSelecting) {
        const hadMoved = marqueeRef.current.hasMoved;
        const selectedIds = marqueeRef.current.previewIds;
        marqueeRef.current.isSelecting = false;
        marqueeRef.current.hasMoved = false;
        marqueeRef.current.previewIds = [];
        setMarqueeBox(null);

        if (hadMoved) {
          hasJustDraggedRef.current = true;
          setTimeout(() => {
            hasJustDraggedRef.current = false;
          }, 80);
          onSelectCanvasRef.current();
          onSelectElementsRef.current(selectedIds);
        }
      }

      if (dragRef.current.isDragging) {
        if (dragRef.current.hasMoved) {
          hasJustDraggedRef.current = true;
          setTimeout(() => {
            hasJustDraggedRef.current = false;
          }, 80);

          const dx = dragRef.current.lastDx;
          const dy = dragRef.current.lastDy;
          const canvasHeight = canvasHeightRef.current;

          if (dx !== 0 || dy !== 0) {
            const updates = dragRef.current.dragItems.map((item) => ({
              id: item.id,
              posX: Math.max(0, Math.min(CANVAS_DEFAULT_WIDTH - 40, Math.round(item.initialPosX + dx))),
              posY: Math.max(0, Math.min(canvasHeight - 24, Math.round(item.initialPosY + dy)))
            }));
            onBatchUpdatePositionsRef.current(updates);
          }
        }
        dragRef.current.isDragging = false;
        dragRef.current.hasMoved = false;
        dragRef.current.dragItems = [];
        setLiveDrag(null);
        setActiveGuides([]);
        setSpacingGuides([]);
      }

      if (resizeRef.current.isResizing) {
        hasJustDraggedRef.current = true;
        setTimeout(() => {
          hasJustDraggedRef.current = false;
        }, 80);

        const lastBox = resizeRef.current.lastBox;
        const elId = resizeRef.current.elementId;
        resizeRef.current.isResizing = false;
        resizeRef.current.lastBox = null;
        setLiveResize(null);
        setActiveGuides([]);

        if (lastBox) {
          onUpdateElementSizeRef.current(elId, lastBox.width, lastBox.height, lastBox.posX, lastBox.posY);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Start Marquee Multi-Select on empty canvas hold-drag
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    if (e.target !== e.currentTarget || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const zoom = zoomRef.current || 1;
    const startX = Math.max(0, Math.min(CANVAS_DEFAULT_WIDTH, (e.clientX - rect.left) / zoom));
    const startY = Math.max(0, Math.min(canvasHeightRef.current, (e.clientY - rect.top) / zoom));

    setEditingTextId(null);
    marqueeRef.current = {
      isSelecting: true,
      hasMoved: false,
      startX,
      startY,
      previewIds: []
    };
  };

  // Start drag handler (single, Shift+Click multi-select, and group drag!)
  const handleElementMouseDown = (e: React.MouseEvent, el: CanvasElement) => {
    e.stopPropagation();
    onSelectCanvas();

    let nextSelectedIds: string[];
    if (e.shiftKey) {
      if (selectedElementIds.includes(el.id)) {
        nextSelectedIds = selectedElementIds.filter((id) => id !== el.id);
      } else {
        nextSelectedIds = [...selectedElementIds, el.id];
      }
      onSelectElements(nextSelectedIds);
      return;
    } else if (selectedElementIds.includes(el.id) && selectedElementIds.length > 1) {
      nextSelectedIds = selectedElementIds;
    } else {
      nextSelectedIds = [el.id];
      onSelectElements(nextSelectedIds);
    }

    if (editingTextId === el.id) return;

    const dragIdSet = new Set(nextSelectedIds);
    const dragItems = canvas.elements
      .filter((item) => dragIdSet.has(item.id))
      .map((item) => ({
        id: item.id,
        initialPosX: item.posX,
        initialPosY: item.posY
      }));

    dragRef.current = {
      isDragging: true,
      hasMoved: false,
      anchorId: el.id,
      dragItems,
      startX: e.clientX,
      startY: e.clientY,
      anchorInitX: el.posX,
      anchorInitY: el.posY,
      anchorWidth: el.width,
      anchorHeight: el.height,
      lastDx: 0,
      lastDy: 0
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
      initialPosY: el.posY,
      lastBox: null
    };
  };

  return (
    <div
      onClick={(e) => {
        if (hasJustDraggedRef.current) return;
        if (e.target === e.currentTarget) {
          onSelectCanvas();
          onSelectElements([]);
          setEditingTextId(null);
        }
      }}
      className={`group relative flex flex-col items-center transition-all duration-300 ${
        aiCursor?.isActive && aiCursor.targetCanvasId === canvas.id
          ? 'ring-4 ring-blue-500/50 rounded-2xl p-2 bg-blue-50/40 shadow-[0_0_40px_rgba(37,99,235,0.22)]'
          : isActive
          ? 'ring-2 ring-blue-500/40 rounded-2xl p-2 bg-blue-50/20'
          : 'p-2'
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
          {aiCursor?.isActive && aiCursor.targetCanvasId === canvas.id ? (
            <span className="text-[10px] text-white font-extrabold bg-gradient-to-r from-blue-600 to-cyan-500 px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1 animate-pulse">
              <Sparkles className="w-3 h-3" /> AI Sedang Merancang...
            </span>
          ) : (
            isActive && (
              <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                ● Aktif
              </span>
            )
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
        onMouseDown={handleCanvasMouseDown}
        onClick={(e) => {
          if (hasJustDraggedRef.current) return;
          if (e.target === e.currentTarget) {
            onSelectCanvas();
            onSelectElements([]);
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
        {/* Hidden SVG ClipPath Definitions for Responsive Shape Masking (Heart, etc.) */}
        <svg width="0" height="0" className="absolute pointer-events-none" aria-hidden="true">
          <defs>
            <clipPath id="nexa-clip-heart" clipPathUnits="objectBoundingBox">
              <path d={HEART_CLIP_PATH_D} />
            </clipPath>
          </defs>
        </svg>
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

        {/* ============================================================= */}
        {/* SMART DISTANCE & EQUAL-SPACING GUIDES (PX MEASUREMENT BARS)   */}
        {/* ============================================================= */}
        {spacingGuides.map((sg, idx) => {
          if (sg.orientation === 'horizontal') {
            const left = Math.min(sg.x1, sg.x2);
            const width = Math.abs(sg.x2 - sg.x1);
            if (width < 4) return null;
            return (
              <div
                key={`sg-h-${idx}`}
                style={{ left: `${left}px`, top: `${sg.y1}px`, width: `${width}px` }}
                className="absolute z-40 pointer-events-none flex items-center justify-center -translate-y-1/2"
              >
                <div
                  className={`w-full h-0.5 relative ${
                    sg.isMatched ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]' : 'bg-sky-500/80'
                  }`}
                >
                  <span className={`absolute left-0 -top-1.5 w-0.5 h-3.5 ${sg.isMatched ? 'bg-rose-500' : 'bg-sky-500'}`} />
                  <span className={`absolute right-0 -top-1.5 w-0.5 h-3.5 ${sg.isMatched ? 'bg-rose-500' : 'bg-sky-500'}`} />
                </div>
                <span
                  className={`absolute -top-6 px-1.5 py-0.5 rounded text-[10px] font-black font-mono text-white shadow-md whitespace-nowrap ${
                    sg.isMatched ? 'bg-rose-500' : 'bg-sky-600'
                  }`}
                >
                  {sg.isMatched ? `↔ ${sg.distance}px` : `${sg.distance}px`}
                </span>
              </div>
            );
          } else {
            const top = Math.min(sg.y1, sg.y2);
            const height = Math.abs(sg.y2 - sg.y1);
            if (height < 4) return null;
            return (
              <div
                key={`sg-v-${idx}`}
                style={{ left: `${sg.x1}px`, top: `${top}px`, height: `${height}px` }}
                className="absolute z-40 pointer-events-none flex items-center justify-center -translate-x-1/2"
              >
                <div
                  className={`h-full w-0.5 relative ${
                    sg.isMatched ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]' : 'bg-sky-500/80'
                  }`}
                >
                  <span className={`absolute top-0 -left-1.5 h-0.5 w-3.5 ${sg.isMatched ? 'bg-rose-500' : 'bg-sky-500'}`} />
                  <span className={`absolute bottom-0 -left-1.5 h-0.5 w-3.5 ${sg.isMatched ? 'bg-rose-500' : 'bg-sky-500'}`} />
                </div>
                <span
                  className={`absolute left-3 px-1.5 py-0.5 rounded text-[10px] font-black font-mono text-white shadow-md whitespace-nowrap ${
                    sg.isMatched ? 'bg-rose-500' : 'bg-sky-600'
                  }`}
                >
                  {sg.isMatched ? `↕ ${sg.distance}px` : `${sg.distance}px`}
                </span>
              </div>
            );
          }
        })}

        {/* LIVE RESIZE DIMENSION / SHIFT-LOCK INDICATOR */}
        {liveResize && (
          <div
            style={{
              left: `${Math.min(CANVAS_DEFAULT_WIDTH - 160, liveResize.posX + liveResize.width / 2)}px`,
              top: `${Math.max(8, liveResize.posY - 34)}px`
            }}
            className={`absolute -translate-x-1/2 z-50 px-2.5 py-1 rounded-full text-[10px] font-extrabold font-mono text-white shadow-lg pointer-events-none whitespace-nowrap ${
              liveResize.aspectLocked ? 'bg-blue-600 ring-2 ring-cyan-300' : 'bg-slate-900/90'
            }`}
          >
            {liveResize.aspectLocked ? '🔒 Proporsional • ' : ''}
            {liveResize.width} × {liveResize.height}px
          </div>
        )}

        {/* ============================================================= */}
        {/* MARQUEE MULTI-SELECT BOX (KOTAK TRANSPARAN ALA CANVA)         */}
        {/* ============================================================= */}
        {marqueeBox && marqueeBox.width > 3 && marqueeBox.height > 3 && (
          <div
            style={{
              left: `${marqueeBox.x}px`,
              top: `${marqueeBox.y}px`,
              width: `${marqueeBox.width}px`,
              height: `${marqueeBox.height}px`
            }}
            className="absolute bg-blue-500/15 border-2 border-blue-500 rounded-xs pointer-events-none z-50"
          />
        )}

        {/* Render Setiap Elemen di Dalam Kanvas */}
        {canvas.elements.map((el) => {
          const isSelected =
            selectedElementIds.includes(el.id) || Boolean(marqueeBox?.previewIds.has(el.id));
          const isSingleSelected =
            selectedElementIds.length === 1 && selectedElementIds[0] === el.id;
          const isDraggingThis = Boolean(liveDrag && liveDrag.ids.has(el.id));
          const isResizingThis = Boolean(liveResize && liveResize.id === el.id);

          const renderX = isResizingThis ? liveResize!.posX : el.posX;
          const renderY = isResizingThis ? liveResize!.posY : el.posY;
          const renderW = isResizingThis ? liveResize!.width : el.width;
          const renderH = isResizingThis ? liveResize!.height : el.height;

          const { category, properties, color } = el;

          return (
            <div
              key={el.id}
              onMouseDown={(e) => handleElementMouseDown(e, el)}
              onClick={(e) => {
                e.stopPropagation();
                onSelectCanvas();
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                if (category === 'TEXT') {
                  setEditingTextId(el.id);
                } else if (category === 'NAV') {
                  onOpenNavConfigModal();
                } else if (category === 'PRODUCT') {
                  onTriggerImageUploadForElement(el.id);
                }
              }}
              style={{
                left: `${renderX}px`,
                top: `${renderY}px`,
                width: `${renderW}px`,
                height: `${Math.max(20, renderH)}px`,
                position: 'absolute',
                transform: isDraggingThis
                  ? `translate3d(${liveDrag!.dx}px, ${liveDrag!.dy}px, 0)`
                  : undefined,
                willChange: isDraggingThis || isResizingThis ? 'transform' : undefined
              }}
              className={`group/el cursor-move ${
                isDraggingThis || isResizingThis ? '' : 'transition-shadow'
              } ${
                recentlyAddedElementId === el.id
                  ? 'animate-in fade-in zoom-in-95 duration-300 ring-2 ring-cyan-400 shadow-[0_0_24px_rgba(37,99,235,0.35)] z-30'
                  : isSelected
                  ? 'ring-2 ring-blue-500 shadow-xl z-30'
                  : 'hover:ring-1 hover:ring-blue-400/60 z-10'
              }`}
            >
              {/* CANVA FLOATING MINI-ACTION PILL DI ATAS/BAWAH ELEMEN (AUTO-FLIP JIKA DI PUCUK ATAS KANVAS) */}
              {isSingleSelected && !isDraggingThis && (() => {
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

              {/* Content Wrapper dengan Opasitas Universal */}
              <div
                className="w-full h-full"
                style={{ opacity: properties.opacity !== undefined ? properties.opacity : 1 }}
              >
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
              {/* RENDER KATEGORI: SHAPE (AC-SHP-01 + MASKING SUPPORT)      */}
              {/* ========================================================= */}
              {category === 'SHAPE' && (() => {
                const hasMaskLayers = properties.maskedLayers && properties.maskedLayers.length > 0;
                const clipPathVal = hasMaskLayers
                  ? getShapeClipPath(properties.shapeType, properties.borderRadius)
                  : undefined;

                return (
                  <div className="w-full h-full relative pointer-events-none select-none">
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

              {/* ========================================================= */}
              {/* RENDER KATEGORI: GAMBAR (AC-IMG-01..02 + SHAPE MASKING)   */}
              {/* ========================================================= */}
              {category === 'IMAGE' && (() => {
                const clipPathVal = getShapeClipPath(properties.maskShape, properties.borderRadius);
                return (
                  <div
                    className="w-full h-full relative overflow-hidden group/img pointer-events-none select-none"
                    style={{
                      borderRadius: clipPathVal ? undefined : `${properties.borderRadius || 12}px`,
                      clipPath: clipPathVal
                    }}
                  >
                    <img
                      src={properties.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'}
                      alt="Elemen Gambar"
                      className="w-full h-full pointer-events-none select-none"
                      style={{ objectFit: properties.objectFit || 'cover' }}
                    />
                  </div>
                );
              })()}

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
                  <div className="flex items-center gap-2.5">
                    {properties.navLogoUrl ? (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          onTriggerImageUploadForElement(el.id);
                        }}
                        className="relative group/logo cursor-pointer flex items-center"
                        title="Klik untuk mengganti Logo Perusahaan"
                      >
                        <img
                          src={properties.navLogoUrl}
                          alt={properties.navBrand || 'Logo Perusahaan'}
                          className="h-9 max-w-[160px] object-contain rounded-md"
                        />
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onTriggerImageUploadForElement(el.id);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-dashed border-blue-400/80 bg-blue-50/80 hover:bg-blue-100 text-blue-700 text-[11px] font-extrabold transition cursor-pointer"
                        title="Klik untuk unggah gambar Logo Perusahaan Anda (PNG/JPG/SVG)"
                      >
                        <Upload className="w-3.5 h-3.5 text-blue-600" />
                        <span>Upload Logo</span>
                      </button>
                    )}

                    {properties.navBrand && properties.navBrand.trim() !== '' && (
                      <span className="font-black text-sm tracking-tight">
                        {properties.navBrand}
                      </span>
                    )}
                  </div>

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
              </div>

              {/* ========================================================= */}
              {/* RESIZE HANDLES (Section 4 Resize Item - White/Blue Canva) */}
              {/* ========================================================= */}
              {isSingleSelected && !isDraggingThis && (
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
        {canvas.elements.length === 0 && !(aiCursor?.isActive && aiCursor.targetCanvasId === canvas.id) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-slate-400 pointer-events-none">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <Maximize2 className="w-7 h-7" />
            </div>
            <h4 className="text-sm font-extrabold text-slate-700">
              {canvas.title || `Kanvas ${canvas.pageIndex}`} Kosong Siap Didesain
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Gunakan panel palet di sisi kiri atau perintahkan Asisten AI di sebelah kanan untuk membangun website secara otomatis!
            </p>
          </div>
        )}

        {/* ============================================================= */}
        {/* LIVE ANIMATED AI CURSOR (FIGMA / CANVA AI MULTIPLAYER STYLE)  */}
        {/* ============================================================= */}
        {aiCursor && aiCursor.isActive && aiCursor.targetCanvasId === canvas.id && (
          <div
            style={{
              left: `${Math.min(CANVAS_DEFAULT_WIDTH - 40, Math.max(12, aiCursor.x))}px`,
              top: `${Math.min((canvas.height || CANVAS_DEFAULT_HEIGHT) - 40, Math.max(12, aiCursor.y))}px`,
              transition: 'left 320ms cubic-bezier(0.22, 1, 0.36, 1), top 320ms cubic-bezier(0.22, 1, 0.36, 1)'
            }}
            className="absolute z-50 pointer-events-none select-none"
          >
            {/* Glowing Click Ripple */}
            {aiCursor.isClicking && (
              <>
                <span className="absolute -left-5 -top-5 w-10 h-10 rounded-full bg-blue-500/40 animate-ping" />
                <span className="absolute -left-2.5 -top-2.5 w-5 h-5 rounded-full bg-cyan-400/60" />
              </>
            )}

            {/* Glowing Pointer Cursor SVG */}
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              className={`drop-shadow-[0_6px_14px_rgba(37,99,235,0.65)] transition-transform duration-150 ${
                aiCursor.isClicking ? 'scale-90' : 'scale-100'
              }`}
            >
              <path
                d="M4 3L20 10.5L12.5 13L9.5 20.5L4 3Z"
                fill="#2563EB"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>

            {/* Floating Live Action Tag */}
            <div
              className={`mt-0.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-600 via-blue-600 to-cyan-500 text-white text-[11px] font-extrabold shadow-2xl border border-white/40 whitespace-nowrap flex items-center gap-1.5 ${
                aiCursor.x > 680 ? '-translate-x-full -ml-2' : 'ml-5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-spin" />
              <span>NexaWeb AI</span>
              <span className="opacity-60">•</span>
              <span className="font-semibold text-blue-50">{aiCursor.label}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
