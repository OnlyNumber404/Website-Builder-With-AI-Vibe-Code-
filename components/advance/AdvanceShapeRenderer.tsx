'use client';

import React from 'react';
import { ShapeType } from '@/lib/advanceTypes';

export interface AdvanceShapeRendererProps {
  shapeType?: ShapeType;
  fillColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  borderRadius?: number;
  opacity?: number;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

export function getShadowFilter(shadow?: 'none' | 'sm' | 'md' | 'lg'): string | undefined {
  if (shadow === 'sm') return 'drop-shadow(0 2px 4px rgba(0,0,0,0.08))';
  if (shadow === 'md') return 'drop-shadow(0 6px 14px rgba(0,0,0,0.16))';
  if (shadow === 'lg') return 'drop-shadow(0 14px 26px rgba(0,0,0,0.24))';
  return undefined;
}

export function getDashArray(borderStyle?: 'solid' | 'dashed' | 'dotted', borderWidth: number = 2): string | undefined {
  if (borderStyle === 'dashed') return `${Math.max(6, borderWidth * 3)},${Math.max(4, borderWidth * 2)}`;
  if (borderStyle === 'dotted') return `${Math.max(2, borderWidth)},${Math.max(4, borderWidth * 2)}`;
  return undefined;
}

export default function AdvanceShapeRenderer({
  shapeType = 'rectangle',
  fillColor = '#2563eb',
  borderColor = 'transparent',
  borderWidth = 0,
  borderStyle = 'solid',
  borderRadius = 16,
  opacity = 1,
  shadow = 'none',
  className = ''
}: AdvanceShapeRendererProps) {
  const dashArray = getDashArray(borderStyle, borderWidth);
  const shadowFilter = getShadowFilter(shadow);
  const effectiveBorderColor = borderWidth > 0 && borderColor ? borderColor : 'transparent';
  const effectiveBorderWidth = effectiveBorderColor === 'transparent' ? 0 : borderWidth;

  const style: React.CSSProperties = {
    width: '100%',
    height: '100%',
    opacity,
    filter: shadowFilter,
    transition: 'filter 0.2s ease, opacity 0.2s ease'
  };

  switch (shapeType) {
    case 'circle':
      return (
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className={`w-full h-full block ${className}`}
          style={style}
        >
          <ellipse
            cx="50"
            cy="50"
            rx="48"
            ry="48"
            fill={fillColor}
            stroke={effectiveBorderColor}
            strokeWidth={effectiveBorderWidth}
            strokeDasharray={dashArray}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      );

    case 'triangle':
      return (
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className={`w-full h-full block ${className}`}
          style={style}
        >
          <polygon
            points="50,4 98,96 2,96"
            fill={fillColor}
            stroke={effectiveBorderColor}
            strokeWidth={effectiveBorderWidth}
            strokeDasharray={dashArray}
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      );

    case 'star':
      return (
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className={`w-full h-full block ${className}`}
          style={style}
        >
          <polygon
            points="50,3 63,36 98,36 70,58 81,93 50,72 19,93 30,58 2,36 37,36"
            fill={fillColor}
            stroke={effectiveBorderColor}
            strokeWidth={effectiveBorderWidth}
            strokeDasharray={dashArray}
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      );

    case 'heart':
      return (
        <svg
          viewBox="0 0 24 24"
          preserveAspectRatio="none"
          className={`w-full h-full block ${className}`}
          style={style}
        >
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill={fillColor}
            stroke={effectiveBorderColor}
            strokeWidth={effectiveBorderWidth}
            strokeDasharray={dashArray}
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      );

    case 'arrow-right':
      return (
        <svg
          viewBox="0 0 100 60"
          preserveAspectRatio="none"
          className={`w-full h-full block ${className}`}
          style={style}
        >
          <polygon
            points="0,20 60,20 60,4 98,30 60,56 60,40 0,40"
            fill={fillColor}
            stroke={effectiveBorderColor}
            strokeWidth={effectiveBorderWidth}
            strokeDasharray={dashArray}
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      );

    case 'hexagon':
      return (
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className={`w-full h-full block ${className}`}
          style={style}
        >
          <polygon
            points="25,4 75,4 98,50 75,96 25,96 2,50"
            fill={fillColor}
            stroke={effectiveBorderColor}
            strokeWidth={effectiveBorderWidth}
            strokeDasharray={dashArray}
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      );

    case 'line':
      return (
        <div
          className={`w-full h-full flex items-center justify-center ${className}`}
          style={style}
        >
          <div
            style={{
              width: '100%',
              height: `${Math.max(2, borderWidth || 4)}px`,
              backgroundColor: fillColor,
              borderStyle: borderStyle,
              borderRadius: '9999px'
            }}
          />
        </div>
      );

    case 'rounded-rect':
      return (
        <div
          className={`w-full h-full ${className}`}
          style={{
            ...style,
            backgroundColor: fillColor,
            borderRadius: `${borderRadius ?? 24}px`,
            borderWidth: `${effectiveBorderWidth}px`,
            borderColor: effectiveBorderColor,
            borderStyle: borderStyle
          }}
        />
      );

    case 'rectangle':
    case 'square':
    default:
      return (
        <div
          className={`w-full h-full ${className}`}
          style={{
            ...style,
            backgroundColor: fillColor,
            borderRadius: `${borderRadius || 0}px`,
            borderWidth: `${effectiveBorderWidth}px`,
            borderColor: effectiveBorderColor,
            borderStyle: borderStyle
          }}
        />
      );
  }
}
