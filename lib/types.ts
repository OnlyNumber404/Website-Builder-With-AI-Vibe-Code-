export type SectionType = 'NAVBAR' | 'HERO' | 'ABOUT' | 'CATALOG' | 'CONTACT' | 'FOOTER';

export interface NavLinkItem {
  label: string;
  target: string;
}

export interface SectionItem {
  id: string;
  type: SectionType;
  title: string;
  subtitle: string;
  content: string;
  waMessage?: string;
  orderIndex: number;
}

export interface ProductItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

export interface DesignTheme {
  id: string;
  name: string;
  tag: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  headingColor: string;
  cardBackground: string;
  headingFont: string;
  bodyFont: string;
  accentBadge: string;
}

export interface DesignTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  themeId?: string;
  isRecommended?: boolean;
  score?: string;
  styleConfig: {
    heroVariant: 'modern-centered' | 'split-classic' | 'minimal-warm' | 'bold-impact';
    cardVariant: 'modern-rounded' | 'cafe-handcrafted' | 'bold-compact' | 'corporate-clean';
    accentLabel: string;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isWelcome?: boolean;
  quickActions?: string[];
}
