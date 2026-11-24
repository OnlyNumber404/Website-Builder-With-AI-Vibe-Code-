import React, { useId } from 'react';

interface NexaWebMarkProps {
  /** Ukuran ikon dalam piksel (width & height). Default: 40 */
  size?: number;
  /** 'squircle' = ikon aplikasi rounded-square (Obsidian-to-Blue); 'mark' = monogram N + sparkle tanpa kotak */
  variant?: 'squircle' | 'mark';
  className?: string;
}

/**
 * Ikon Brand Resmi NexaWeb.ai (Vektor SVG Tajam)
 * Mengikuti palet resmi ColorPalate.txt: Obsidian (#0F172A), Deep Navy (#1E3A8A),
 * Electric Royal Blue (#2563EB), dan Sky Blue (#93C5FD).
 */
export function NexaWebMark({
  size = 40,
  variant = 'squircle',
  className = '',
}: NexaWebMarkProps) {
  const uid = useId().replace(/:/g, '');
  const bgId = `nexa-bg-${uid}`;
  const borderId = `nexa-border-${uid}`;
  const foldLId = `nexa-fold-l-${uid}`;
  const foldRId = `nexa-fold-r-${uid}`;
  const sparkleId = `nexa-sparkle-${uid}`;
  const markLeftId = `nexa-mark-l-${uid}`;
  const markDiagId = `nexa-mark-d-${uid}`;
  const markRightId = `nexa-mark-r-${uid}`;

  if (variant === 'mark') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
        aria-label="NexaWeb.ai Logo"
      >
        <defs>
          <linearGradient id={markLeftId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>
          <linearGradient id={markDiagId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="55%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          <linearGradient id={markRightId} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="55%" stopColor="#1E3A8A" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          <linearGradient id={sparkleId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#BAE6FD" />
            <stop offset="50%" stopColor="#93C5FD" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>

        {/* Left Pillar */}
        <path d="M 14 18 H 32 V 86 H 14 Z" fill={`url(#${markLeftId})`} />
        {/* Right Pillar with Sparkle Cradle */}
        <path d="M 64 36 L 73 48 L 82 36 V 86 H 64 Z" fill={`url(#${markRightId})`} />
        {/* Diagonal Connecting Ribbon */}
        <path d="M 14 18 H 32 L 82 86 H 64 Z" fill={`url(#${markDiagId})`} />

        {/* 4-Point AI Sparkle Star */}
        <path
          d="M 73 10 Q 74.2 24.8 89 26 Q 74.2 27.2 73 42 Q 71.8 27.2 57 26 Q 71.8 24.8 73 10 Z"
          fill={`url(#${sparkleId})`}
        />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="NexaWeb.ai Logo"
    >
      <defs>
        <linearGradient id={bgId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0F172A" />
          <stop offset="52%" stopColor="#1E3A8A" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
        <linearGradient id={borderId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.38" />
          <stop offset="50%" stopColor="#93C5FD" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#93C5FD" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id={foldLId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#64748B" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={foldRId} x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#64748B" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={sparkleId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E0F2FE" />
          <stop offset="55%" stopColor="#93C5FD" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>
      </defs>

      {/* Squircle Brand Container */}
      <rect x="2" y="2" width="96" height="96" rx="24" fill={`url(#${bgId})`} />
      <rect
        x="5"
        y="5"
        width="90"
        height="90"
        rx="21"
        stroke={`url(#${borderId})`}
        strokeWidth="1.4"
      />

      {/* Geometric Folded Ribbon "N" */}
      <path d="M 24 27 H 38 V 73 H 24 Z" fill="#FFFFFF" />
      <path d="M 59 27 H 73 V 73 H 59 Z" fill="#FFFFFF" />
      <path d="M 24 27 L 38 46.5 L 38 27 Z" fill={`url(#${foldLId})`} />
      <path d="M 73 73 L 59 53.5 L 59 73 Z" fill={`url(#${foldRId})`} />
      <path d="M 24 27 H 38 L 73 73 H 59 Z" fill="#FFFFFF" />
      <path d="M 24 27 L 59 73" stroke="#CBD5E1" strokeWidth="0.9" strokeOpacity="0.65" />
      <path d="M 38 27 L 73 73" stroke="#E2E8F0" strokeWidth="0.7" strokeOpacity="0.5" />

      {/* 4-Point AI Sparkle Star */}
      <path
        d="M 78 10 Q 78.8 21.2 90 22 Q 78.8 22.8 78 34 Q 77.2 22.8 66 22 Q 77.2 21.2 78 10 Z"
        fill={`url(#${sparkleId})`}
      />
    </svg>
  );
}

interface NexaWebLogoProps {
  /** Ukuran ikon (px) */
  iconSize?: number;
  variant?: 'squircle' | 'mark';
  /** Akhiran nama brand, misal '.ai' atau '.advance' */
  suffix?: string;
  /** Subtitle opsional di bawah nama brand */
  subtitle?: string;
  /** Tema teks: 'light' untuk latar terang, 'dark' untuk footer/latar gelap */
  theme?: 'light' | 'dark';
  /** Ukuran teks wordmark */
  textClassName?: string;
  subtitleClassName?: string;
  className?: string;
}

export function NexaWebLogo({
  iconSize = 40,
  variant = 'squircle',
  suffix = '.ai',
  subtitle,
  theme = 'light',
  textClassName = 'text-xl sm:text-2xl',
  subtitleClassName = 'text-[11px] font-semibold text-slate-500 uppercase tracking-wider',
  className = '',
}: NexaWebLogoProps) {
  const isDark = theme === 'dark';

  return (
    <div className={`inline-flex items-center gap-2.5 shrink-0 ${className}`}>
      <NexaWebMark
        size={iconSize}
        variant={variant}
        className="drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
      />
      <div className="flex flex-col shrink-0">
        <span
          className={`font-extrabold tracking-tight leading-none flex items-center ${textClassName} ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          NexaWeb
          <span className={isDark ? 'text-blue-400' : 'text-blue-600'}>{suffix}</span>
        </span>
        {subtitle && <span className={subtitleClassName}>{subtitle}</span>}
      </div>
    </div>
  );
}

export default NexaWebLogo;
