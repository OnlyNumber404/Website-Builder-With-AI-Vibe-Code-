export type CanvasElementCategory = 'TEXT' | 'IMAGE' | 'PRODUCT' | 'BUTTON' | 'NAV';

export interface ProductCardData {
  title: string;
  description: string;
  image: string;
  price?: string;
  buttonText: string;
  buttonLink?: string;
  targetCanvasId?: string;
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

  // Product Card Properties
  cardData?: ProductCardData;

  // Navigation Properties
  navBrand?: string;
  navVariant?: 'classic' | 'minimal' | 'floating' | 'dark';
  navItems?: NavItemData[];
  color?: string;
  navTextColor?: string;
}

export interface CanvasElement {
  id: string;
  category: CanvasElementCategory;
  posX: number;
  posY: number;
  width: number;
  height: number;
  color: string; // hex
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
