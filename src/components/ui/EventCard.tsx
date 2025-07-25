'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Badge } from '~/components/ui/Badge';
import { useNotificationStore } from '~/stores/useNotificationStore';
import type { Event } from '~/stores/useAppStore';

interface EventCardProps {
  event: Event;
  size?: 'sm' | 'md' | 'lg';
  onShare?: (url: string) => void;
}

interface ColorTheme {
  primary: string;
  secondary: string;
  accent: string;
  border: string;
  background: string;
  text: string;
  textSecondary: string;
}

export function EventCard({ event, size = 'md', onShare }: EventCardProps) {
  const { showInfo } = useNotificationStore();
  const [isFlipped, setIsFlipped] = useState(false);
  const [colorTheme, setColorTheme] = useState<ColorTheme>({
    primary: '#92400e',
    secondary: '#d97706', 
    accent: '#fbbf24',
    border: '#92400e',
    background: '#fffdf5',
    text: '#92400e',
    textSecondary: '#b45309'
  });
  const imgRef = useRef<HTMLImageElement>(null);

  const sizeClasses = {
    sm: 'w-48 h-64',
    md: 'w-64 h-80', 
    lg: 'w-80 h-96'
  };

  // Expanded size classes for flipped state
  const expandedSizeClasses = {
    sm: 'w-72 h-96',
    md: 'w-96 h-[32rem]', 
    lg: 'w-[28rem] h-[36rem]'
  };

  // Extract colors from image (same logic as StampCard)
  const extractImageColors = useCallback((img: HTMLImageElement): ColorTheme => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return {
      primary: '#92400e',
      secondary: '#d97706', 
      accent: '#fbbf24',
      border: '#92400e',
      background: '#fffdf5',
      text: '#92400e',
      textSecondary: '#b45309'
    };

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    const colors: Array<{r: number, g: number, b: number}> = [];
    const sampleSize = 10;
    
    for (let i = 0; i < data.length; i += 4 * sampleSize) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      
      if (a !== undefined && a > 128 && r !== undefined && g !== undefined && b !== undefined) {
        colors.push({r, g, b});
      }
    }

    if (colors.length === 0) {
      return {
        primary: '#92400e',
        secondary: '#d97706', 
        accent: '#fbbf24',
        border: '#92400e',
        background: '#fffdf5',
        text: '#92400e',
        textSecondary: '#b45309'
      };
    }
    
    const avgColor = colors.reduce((acc, color) => ({
      r: acc.r + color.r,
      g: acc.g + color.g,
      b: acc.b + color.b
    }), {r: 0, g: 0, b: 0});
    
    avgColor.r = Math.floor(avgColor.r / colors.length);
    avgColor.g = Math.floor(avgColor.g / colors.length);
    avgColor.b = Math.floor(avgColor.b / colors.length);

    const hsl = rgbToHsl(avgColor.r, avgColor.g, avgColor.b);
    
    const primary = hslToHex(hsl.h, Math.min(hsl.s, 0.6), Math.max(hsl.l * 0.4, 0.2));
    const secondary = hslToHex(hsl.h, Math.min(hsl.s, 0.5), Math.max(hsl.l * 0.6, 0.4));
    const accent = hslToHex(hsl.h, Math.min(hsl.s, 0.4), Math.max(hsl.l * 0.8, 0.6));
    const background = hslToHex(hsl.h, Math.min(hsl.s * 0.3, 0.2), Math.max(hsl.l * 1.2, 0.95));
    
    return {
      primary,
      secondary,
      accent,
      border: primary,
      background,
      text: primary,
      textSecondary: secondary
    };
  }, []);

  // Color conversion helper functions
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {h, s, l};
  };

  const hslToHex = (h: number, s: number, l: number) => {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    const toHex = (c: number) => {
      const hex = Math.round(c * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  useEffect(() => {
    if (imgRef.current?.complete) {
      const theme = extractImageColors(imgRef.current);
      setColorTheme(theme);
    }
  }, [event.imageUrl, extractImageColors]);

  const handleImageLoad = () => {
    if (imgRef.current) {
      const theme = extractImageColors(imgRef.current);
      setColorTheme(theme);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/event/${event.id}`;
    if (onShare) {
      onShare(url);
    } else {
      void navigator.clipboard.writeText(url);
      showInfo('Event link copied to clipboard!');
    }
  };

  // Calculate event status
  const isEventActive = new Date(event.eventDate) > new Date();
  const isSoldOut = event.maxSupply && event.totalClaimed >= event.maxSupply;
  const claimRate = event.maxSupply ? Math.round((event.totalClaimed / event.maxSupply) * 100) : null;

  return (
    <>
      {/* Background overlay when flipped */}
      {isFlipped && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-700"
          onClick={() => setIsFlipped(false)}
        />
      )}
      
      {/* Positioning Wrapper */}
      <div className={`
        ${isFlipped ? 'fixed inset-0 z-50 flex items-center justify-center' : 'relative z-10'}
        transition-all duration-700 ease-in-out
      `}>
        {/* Card Container */}
        <div className={`
          ${isFlipped ? expandedSizeClasses[size] : sizeClasses[size]} 
          group perspective-1000 transition-all duration-700 ease-in-out
        `}>
          {/* Event Container with Perforation Border */}
          <div 
            className={`
              relative w-full h-full transform-style-preserve-3d transition-transform duration-700 cursor-pointer
              ${isFlipped ? 'rotate-y-180' : ''}
            `}
            onClick={() => setIsFlipped(!isFlipped)}
          >
        {/* Front Side - Event Card */}
        <div className="absolute inset-0 backface-hidden">
          {/* Event Card with Perforation Border */}
          <div className="w-full h-full p-2 bg-white rounded-lg shadow-2xl stamp-perforations hover:shadow-3xl transition-shadow duration-300">
            {/* Inner Border Frame */}
            <div 
              className="w-full h-full border-4 border-double rounded-sm relative overflow-hidden"
              style={{
                borderColor: `${colorTheme.border}CC`,
                background: `linear-gradient(135deg, ${colorTheme.background} 0%, ${colorTheme.accent}20 100%)`
              }}
            >
          
          {/* Decorative Corner Flourishes */}
          <div 
            className="absolute top-1 left-1 w-4 h-4 border-l-2 border-t-2 rounded-tl-lg"
            style={{ borderColor: `${colorTheme.primary}99` }}
          ></div>
          <div 
            className="absolute top-1 right-1 w-4 h-4 border-r-2 border-t-2 rounded-tr-lg"
            style={{ borderColor: `${colorTheme.primary}99` }}
          ></div>
          <div 
            className="absolute bottom-1 left-1 w-4 h-4 border-l-2 border-b-2 rounded-bl-lg"
            style={{ borderColor: `${colorTheme.primary}99` }}
          ></div>
          <div 
            className="absolute bottom-1 right-1 w-4 h-4 border-r-2 border-b-2 rounded-br-lg"
            style={{ borderColor: `${colorTheme.primary}99` }}
          ></div>

          {/* Status Badges */}
          <div className="absolute top-2 right-2 flex gap-1 z-10">
            {isSoldOut && (
              <Badge 
                className="text-xs px-2 py-1"
                style={{ 
                  backgroundColor: '#dc2626',
                  color: 'white'
                }}
              >
                Sold Out
              </Badge>
            )}
            {!isEventActive && !isSoldOut && (
              <Badge 
                className="text-xs px-2 py-1"
                style={{ 
                  backgroundColor: colorTheme.secondary,
                  color: 'white'
                }}
              >
                Past Event
              </Badge>
            )}
            {isEventActive && !isSoldOut && (
              <Badge 
                className="text-xs px-2 py-1"
                style={{ 
                  backgroundColor: '#16a34a',
                  color: 'white'
                }}
              >
                Active
              </Badge>
            )}
          </div>

          {/* Main Image Area */}
          <div className="relative m-3 h-1/2 rounded-sm overflow-hidden shadow-inner">
            <img 
              ref={imgRef}
              src={event.imageUrl} 
              alt={event.name}
              onLoad={handleImageLoad}
              className="w-full h-full object-cover sepia-[0.1] contrast-105"
              crossOrigin="anonymous"
            />
            
            {/* Vintage Overlay */}
            <div 
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to top, ${colorTheme.primary}33 0%, transparent 40%, ${colorTheme.accent}1A 100%)`
              }}
            ></div>
          </div>

          {/* Content Section */}
          <div className="px-3 pb-3 h-1/2 flex flex-col">
            {/* Title */}
            <h3 
              className="font-serif text-sm font-bold tracking-wide leading-tight mb-2 text-center"
              style={{ color: colorTheme.text }}
            >
              {event.name.toUpperCase()}
            </h3>
            
            {/* Description */}
            <p 
              className="text-xs leading-relaxed mb-3 line-clamp-2 text-center"
              style={{ color: colorTheme.textSecondary }}
            >
              {event.description}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2 mb-3 flex-1">
              <div 
                className="text-center p-2 rounded"
                style={{ backgroundColor: `${colorTheme.accent}40` }}
              >
                <div 
                  className="text-lg font-bold"
                  style={{ color: colorTheme.primary }}
                >
                  {event.totalClaimed}
                </div>
                <div 
                  className="text-xs"
                  style={{ color: colorTheme.textSecondary }}
                >
                  Claimed
                </div>
              </div>
              <div 
                className="text-center p-2 rounded"
                style={{ backgroundColor: `${colorTheme.accent}40` }}
              >
                <div 
                  className="text-lg font-bold"
                  style={{ color: colorTheme.primary }}
                >
                  {event.maxSupply ? (event.maxSupply - event.totalClaimed) : '∞'}
                </div>
                <div 
                  className="text-xs"
                  style={{ color: colorTheme.textSecondary }}
                >
                  Remaining
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            {event.maxSupply && claimRate !== null && (
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1" style={{ color: colorTheme.textSecondary }}>
                  <span>Progress</span>
                  <span>{claimRate}%</span>
                </div>
                <div 
                  className="w-full rounded-full h-1.5"
                  style={{ backgroundColor: `${colorTheme.accent}60` }}
                >
                  <div 
                    className="h-1.5 rounded-full transition-all duration-300" 
                    style={{ 
                      width: `${claimRate}%`,
                      backgroundColor: colorTheme.primary
                    }}
                  ></div>
                </div>
              </div>
            )}

            {/* Event Date */}
            <div className="text-xs mb-3 text-center" style={{ color: colorTheme.textSecondary }}>
              <div className="flex items-center justify-center space-x-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                </svg>
                <span>{new Date(event.eventDate).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-1">
              <Link href={`/event/${event.id}`} className="flex-1">
                <button 
                  className="w-full px-2 py-1 rounded text-xs font-medium transition-colors"
                  style={{
                    backgroundColor: colorTheme.primary,
                    color: 'white'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colorTheme.secondary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colorTheme.primary;
                  }}
                >
                  View Details
                </button>
              </Link>
              <button 
                onClick={handleShare}
                className="px-2 py-1 rounded text-xs font-medium transition-colors"
                style={{
                  backgroundColor: colorTheme.accent,
                  color: colorTheme.primary
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colorTheme.secondary;
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colorTheme.accent;
                  e.currentTarget.style.color = colorTheme.primary;
                }}
              >
                Share
              </button>
            </div>

            {/* Bottom decoration */}
            <div className="flex justify-between items-center text-xs mt-2 pt-2" style={{ borderTop: `1px solid ${colorTheme.accent}80`, color: colorTheme.textSecondary }}>
              <span className="font-mono">
                {new Date(event.eventDate).getFullYear()}
              </span>
              <div 
                className="px-2 py-0.5 rounded font-bold text-xs"
                style={{ 
                  backgroundColor: colorTheme.accent,
                  color: colorTheme.primary
                }}
              >
                EVENT
              </div>
              <span className="font-mono">
                #{event.id}
              </span>
            </div>
          </div>

              {/* Watermark Pattern */}
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div 
                  className="w-full h-full bg-repeat" 
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodeURIComponent(colorTheme.primary)}' fill-opacity='1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '30px 30px'
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Side - Event Details Certificate */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          <div className="w-full h-full p-3 bg-white rounded-lg shadow-2xl stamp-perforations">
            <div 
              className="w-full h-full border-4 border-double rounded-sm p-6 flex flex-col overflow-hidden"
              style={{
                borderColor: `${colorTheme.border}CC`,
                background: `linear-gradient(135deg, ${colorTheme.background} 0%, ${colorTheme.accent}15 100%)`
              }}
            >
              
              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(false);
                }}
                className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs hover:opacity-80 transition-opacity z-10"
                style={{
                  backgroundColor: colorTheme.accent,
                  color: colorTheme.primary
                }}
              >
                ✕
              </button>

              {/* Certificate Header */}
              <div 
                className="text-center pb-4 mb-6"
                style={{ borderBottom: `1px solid ${colorTheme.accent}80` }}
              >
                <h2 
                  className="font-serif text-2xl font-bold tracking-wide"
                  style={{ color: colorTheme.text }}
                >
                  EVENT CERTIFICATE
                </h2>
                <p 
                  className="text-sm tracking-wider font-medium"
                  style={{ color: colorTheme.textSecondary }}
                >
                  CHRONOSTAMP EVENT DETAILS
                </p>
                <div 
                  className="mt-2 text-xs"
                  style={{ color: colorTheme.textSecondary }}
                >
                  Digital Event • Permanent Record • Created Memory
                </div>
              </div>

              {/* Main Event Content */}
              <div className="flex-1 space-y-4 text-sm overflow-y-auto" style={{ color: colorTheme.text }}>
                
                {/* Event Title Section */}
                <div 
                  className="rounded-lg p-4"
                  style={{
                    backgroundColor: `${colorTheme.accent}40`,
                    border: `1px solid ${colorTheme.accent}80`
                  }}
                >
                  <h3 
                    className="font-serif text-xl font-bold mb-2"
                    style={{ color: colorTheme.text }}
                  >
                    {event.name}
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="font-bold" style={{ color: colorTheme.textSecondary }}>Event ID:</span>
                      <p className="font-mono" style={{ color: colorTheme.text }}>#{event.id.toString().padStart(4, '0')}</p>
                    </div>
                    <div>
                      <span className="font-bold" style={{ color: colorTheme.textSecondary }}>Organizer:</span>
                      <p className="font-mono" style={{ color: colorTheme.text }}>{event.organizer.slice(0, 8)}...{event.organizer.slice(-6)}</p>
                    </div>
                  </div>
                </div>

                {/* Event Description */}
                <div>
                  <h4 
                    className="font-bold mb-2 flex items-center"
                    style={{ color: colorTheme.textSecondary }}
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Event Description
                  </h4>
                  <p 
                    className="text-sm leading-relaxed p-3 rounded"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.5)',
                      border: `1px solid ${colorTheme.accent}80`,
                      color: colorTheme.text
                    }}
                  >
                    {event.description}
                  </p>
                </div>

                {/* Event Statistics */}
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    className="p-3 rounded"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.6)',
                      border: `1px solid ${colorTheme.accent}80`
                    }}
                  >
                    <h4 
                      className="font-bold mb-1 flex items-center text-xs"
                      style={{ color: colorTheme.textSecondary }}
                    >
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                      </svg>
                      Event Date
                    </h4>
                    <p className="text-xs font-medium" style={{ color: colorTheme.text }}>
                      {new Date(event.eventDate).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div 
                    className="p-3 rounded"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.6)',
                      border: `1px solid ${colorTheme.accent}80`
                    }}
                  >
                    <h4 
                      className="font-bold mb-1 flex items-center text-xs"
                      style={{ color: colorTheme.textSecondary }}
                    >
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                      </svg>
                      Event Created
                    </h4>
                    <p className="text-xs font-medium" style={{ color: colorTheme.text }}>
                      {new Date(event.createdAt).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p className="text-xs mt-1" style={{ color: colorTheme.textSecondary }}>
                      {Math.floor((Date.now() - new Date(event.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days ago
                    </p>
                  </div>
                </div>

                {/* Event Statistics Section */}
                <div 
                  className="rounded-lg p-4"
                  style={{
                    background: `linear-gradient(135deg, ${colorTheme.accent}60 0%, ${colorTheme.secondary}40 100%)`,
                    border: `1px solid ${colorTheme.accent}`
                  }}
                >
                  <h4 
                    className="font-bold mb-3 flex items-center"
                    style={{ color: colorTheme.textSecondary }}
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                    </svg>
                    Event Statistics
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span style={{ color: colorTheme.textSecondary }}>Total Claimed:</span>
                      <span className="font-medium" style={{ color: colorTheme.text }}>{event.totalClaimed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: colorTheme.textSecondary }}>Max Supply:</span>
                      <span className="font-medium" style={{ color: colorTheme.text }}>{event.maxSupply ?? 'Unlimited'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: colorTheme.textSecondary }}>Remaining:</span>
                      <span className="font-medium" style={{ color: colorTheme.text }}>
                        {event.maxSupply ? (event.maxSupply - event.totalClaimed) : '∞'}
                      </span>
                    </div>
                    {claimRate !== null && (
                      <div className="flex justify-between">
                        <span style={{ color: colorTheme.textSecondary }}>Claim Rate:</span>
                        <span className="font-medium" style={{ color: colorTheme.text }}>{claimRate}%</span>
                      </div>
                    )}
                    <div className="mt-3">
                      <span style={{ color: colorTheme.textSecondary }}>Contract Address:</span>
                      <p 
                        className="font-mono text-xs break-all mt-1 p-2 rounded"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.5)',
                          color: colorTheme.text
                        }}
                      >
                        {event.contractAddress}
                      </p>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (event.contractAddress) {
                            void navigator.clipboard.writeText(event.contractAddress);
                            showInfo('Contract address copied to clipboard!');
                          }
                        }}
                        className="mt-2 px-3 py-1 rounded text-xs font-medium transition-colors"
                        style={{
                          backgroundColor: colorTheme.accent,
                          color: colorTheme.primary
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = colorTheme.secondary;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = colorTheme.accent;
                        }}
                      >
                        📋 Copy Contract Address
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Certificate Footer - Minimal */}
              <div 
                className="text-center pt-2 mt-2"
                style={{ borderTop: `1px solid ${colorTheme.accent}60` }}
              >
                <div className="flex items-center justify-center space-x-2 text-xs" style={{ color: colorTheme.textSecondary }}>
                  <span>✨</span>
                  <span className="font-mono">Permanent • Verifiable • Collectible</span>
                  <span>✨</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
          
          {/* Flip Instruction */}
          {!isFlipped && (
            <div className="absolute -bottom-6 left-0 right-0 text-center text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
              Click to flip
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .stamp-perforations {
          position: relative;
        }
        
        .stamp-perforations::before {
          content: '';
          position: absolute;
          inset: -1px;
          background: 
            radial-gradient(circle at 4px 4px, transparent 1px, currentColor 1px, currentColor 2px, transparent 2px),
            radial-gradient(circle at 4px 4px, transparent 1px, currentColor 1px, currentColor 2px, transparent 2px);
          background-size: 8px 8px;
          background-position: 0 0, 4px 4px;
          opacity: 0.4;
          border-radius: inherit;
          color: #6366f1;
        }

        .perspective-1000 {
          perspective: 1000px;
        }

        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }

        .backface-hidden {
          backface-visibility: hidden;
        }

        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </>
  );
}