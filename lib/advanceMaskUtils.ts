import { CanvasElement, ShapeType } from './advanceTypes';

/**
 * Normalized (0..1) SVG path for heart shape to use with clipPathUnits="objectBoundingBox".
 */
export const HEART_CLIP_PATH_D =
  'M 0.5 0.8896 C 0.225 0.64 0.0833 0.5117 0.0833 0.3542 C 0.0833 0.2258 0.1842 0.125 0.3125 0.125 C 0.385 0.125 0.4546 0.1588 0.5 0.2121 C 0.5454 0.1588 0.615 0.125 0.6875 0.125 C 0.8158 0.125 0.9167 0.2258 0.9167 0.3542 C 0.9167 0.5117 0.775 0.64 0.5 0.8896 Z';

/**
 * Returns the CSS clip-path string for any ShapeType.
 */
export function getShapeClipPath(
  shapeType?: ShapeType | 'none',
  borderRadius?: number
): string | undefined {
  if (!shapeType || shapeType === 'none') return undefined;

  switch (shapeType) {
    case 'circle':
      return 'ellipse(49% 49% at 50% 50%)';
    case 'triangle':
      return 'polygon(50% 4%, 98% 96%, 2% 96%)';
    case 'star':
      return 'polygon(50% 3%, 63% 36%, 98% 36%, 70% 58%, 81% 93%, 50% 72%, 19% 93%, 30% 58%, 2% 36%, 37% 36%)';
    case 'heart':
      return 'url(#nexa-clip-heart)';
    case 'arrow-right':
      return 'polygon(0% 33%, 60% 33%, 60% 7%, 98% 50%, 60% 93%, 60% 67%, 0% 67%)';
    case 'hexagon':
      return 'polygon(25% 4%, 75% 4%, 98% 50%, 75% 96%, 25% 96%, 2% 50%)';
    case 'rounded-rect':
      return `inset(0 round ${borderRadius ?? 24}px)`;
    case 'rectangle':
    case 'square':
      return `inset(0 round ${borderRadius || 0}px)`;
    default:
      return undefined;
  }
}

export const MASK_SHAPE_OPTIONS: { type: ShapeType | 'none'; label: string }[] = [
  { type: 'none', label: 'Normal' },
  { type: 'circle', label: 'Lingkaran' },
  { type: 'rounded-rect', label: 'Kotak Halus' },
  { type: 'triangle', label: 'Segitiga' },
  { type: 'star', label: 'Bintang' },
  { type: 'heart', label: 'Hati' },
  { type: 'hexagon', label: 'Segienam' },
  { type: 'arrow-right', label: 'Panah' }
];

/**
 * Checks whether two CanvasElements overlap spatially on the canvas.
 */
export function elementsOverlap(a: CanvasElement, b: CanvasElement): boolean {
  return (
    a.posX < b.posX + b.width &&
    a.posX + a.width > b.posX &&
    a.posY < b.posY + b.height &&
    a.posY + a.height > b.posY
  );
}

/**
 * Finds the best overlapping SHAPE or IMAGE element to mask with the currently selected element.
 * Returns the closest overlapping candidate (preferring highest z-order / most recent).
 */
export function findOverlappingMaskTarget(
  selected: CanvasElement | null,
  elements: CanvasElement[]
): CanvasElement | null {
  if (!selected) return null;
  if (selected.category !== 'SHAPE' && selected.category !== 'IMAGE') return null;

  // Search from top-most layer downwards, skipping self
  for (let i = elements.length - 1; i >= 0; i--) {
    const candidate = elements[i];
    if (candidate.id === selected.id) continue;
    if (candidate.category !== 'SHAPE' && candidate.category !== 'IMAGE') continue;
    // If both are IMAGE, cannot mask image-to-image directly without a shape
    if (selected.category === 'IMAGE' && candidate.category === 'IMAGE') continue;
    if (elementsOverlap(selected, candidate)) {
      return candidate;
    }
  }
  return null;
}
