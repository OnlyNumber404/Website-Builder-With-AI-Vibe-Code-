export type CanvasElementCategory = 'TEXT' | 'IMAGE' | 'PRODUCT' | 'BUTTON' | 'NAV' | 'SHAPE';

export type ShapeType =
  | 'rectangle'
  | 'square'
  | 'rounded-rect'
  | 'circle'
  | 'triangle'
  | 'star'
  | 'heart'
  | 'arrow-right'
  | 'hexagon'
  | 'line';

export type ProductCardVariant = 'modern' | 'badge' | 'warm' | 'minimal' | 'dark';

export interface ProductCardData {
  title: string;
  description: string;
  image: string;
  price?: string;
  buttonText: string;
  buttonLink?: string;
  targetCanvasId?: string;
  cardVariant?: ProductCardVariant;
  badgeText?: string;
  buttonColor?: string;
}

export interface NavItemData {
  id: string;
  label: string;
  targetCanvasId?: string;
  url?: string;
}

export interface CanvasElementProperties {
  // Text Properties
  font?: string;
  text?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline' | 'line-through';
  textTransform?: 'none' | 'uppercase' | 'lowercase';
  textAlign?: 'left' | 'center' | 'right';
  letterSpacing?: string;

  // Button & Link Properties
  linkType?: 'url' | 'wa' | 'canvas';
  linkUrl?: string;
  waNumber?: string;
  waMessage?: string;
  targetCanvasId?: string;
  buttonVariant?: 'rounded' | 'pill' | 'outline' | 'solid';
  buttonTextColor?: string;

  // Image Properties
  imageUrl?: string;
  objectFit?: 'cover' | 'contain' | 'fill';
  borderRadius?: number;
  maskShape?: ShapeType | 'none';

  // Product Card Properties
  cardData?: ProductCardData;

  // Navigation Properties
  navBrand?: string;
  navLogoUrl?: string;
  navVariant?: 'classic' | 'minimal' | 'floating' | 'dark';
  navItems?: NavItemData[];
  color?: string;
  navTextColor?: string;

  // Shape Properties
  shapeType?: ShapeType;
  borderColor?: string;
  borderWidth?: number;
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  opacity?: number; // 0 to 1
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  maskedLayers?: CanvasElement[]; // Elemen (shape/gambar) yang di-mask di dalam shape ini
}

export interface CanvasElement {
  id: string;
  category: CanvasElementCategory;
  posX: number;
  posY: number;
  width: number;
  height: number;
  color: string; // hex
  locked?: boolean;
  groupId?: string;
  properties: CanvasElementProperties;
}

export interface AdvanceCanvas {
  id: string;
  pageIndex: number;
  title?: string;
  backgroundColor: string; // hex
  backgroundImage?: string; // string or url
  height?: number; // default 650px
  elements: CanvasElement[];
}

export interface HistoryStack {
  undoStack: AdvanceCanvas[][];
  redoStack: AdvanceCanvas[][];
}

export const CANVAS_DEFAULT_WIDTH = 1000;
export const CANVAS_DEFAULT_HEIGHT = 650;

export function createDefaultCanvas(pageIndex: number = 1): AdvanceCanvas {
  return {
    id: `canvas-${Date.now()}-${pageIndex}`,
    pageIndex,
    title: `Kanvas ${pageIndex}`,
    backgroundColor: '#ffffff',
    backgroundImage: '',
    height: CANVAS_DEFAULT_HEIGHT,
    elements: []
  };
}

// ============================================================================
// OVERPOWERED ADVANCE AI COPILOT & LIVE CURSOR TYPES
// ============================================================================
export type AdvanceAiAction =
  | {
      type: 'RESET_CANVASES';
      label: string;
      firstCanvasTitle?: string;
      firstCanvasBg?: string;
      firstCanvasHeight?: number;
    }
  | {
      type: 'CREATE_CANVAS';
      label: string;
      canvasKey: string; // logical key e.g. 'hero', 'products', 'about', 'contact'
      title: string;
      backgroundColor: string;
      height?: number;
    }
  | {
      type: 'SET_CANVAS_STYLE';
      label: string;
      canvasKey?: string; // if omitted, applies to active canvas
      title?: string;
      backgroundColor?: string;
      backgroundImage?: string;
      height?: number;
    }
  | {
      type: 'ADD_ELEMENT';
      label: string;
      canvasKey?: string; // if omitted, adds to active/current canvas
      element: Omit<CanvasElement, 'id'>;
    }
  | {
      type: 'UPDATE_ALL_TEXT_COLOR';
      label: string;
      canvasKey?: string;
      color: string;
    }
  | {
      type: 'CLEAR_CANVAS';
      label: string;
      canvasKey?: string;
    };

export interface AdvanceAiPlan {
  reply: string;
  isFullBuild?: boolean;
  source: 'gemini' | 'smart-engine';
  actions: AdvanceAiAction[];
}

export interface AiCursorState {
  isActive: boolean;
  targetCanvasId: string;
  x: number;
  y: number;
  label: string;
  isClicking: boolean;
  currentStep: number;
  totalSteps: number;
}
