'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface NFTPreviewProps {
  data: {
    name: string;
    description: string;
    imageUrl: string;
  };
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

export function NFTPreview({ data }: NFTPreviewProps) {
  const hasData = data.name || data.description || data.imageUrl;
  const [colorTheme, setColorTheme] = useState<ColorTheme>({
    primary: '#92400e',
    secondary: '#d97706',
    accent: '#fbbf24',
    border: '#92400e',
    background: '#fffdf5',
    text: '#92400e',
    textSecondary: '#b45309',
  });
  const imgRef = useRef<HTMLImageElement>(null);

  // Extract colors from image (simplified version)
  const extractImageColors = useCallback((img: HTMLImageElement): ColorTheme => {
    if (!img)
      return {
        primary: '#92400e',
        secondary: '#d97706',
        accent: '#fbbf24',
        border: '#92400e',
        background: '#fffdf5',
        text: '#92400e',
        textSecondary: '#b45309',
      };

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx)
        return {
          primary: '#92400e',
          secondary: '#d97706',
          accent: '#fbbf24',
          border: '#92400e',
          background: '#fffdf5',
          text: '#92400e',
          textSecondary: '#b45309',
        };

      canvas.width = 10;
      canvas.height = 10;
      ctx.drawImage(img, 0, 0, 10, 10);

      const imageData = ctx.getImageData(0, 0, 10, 10);
      const data = imageData.data;

      const colors: Array<{ r: number; g: number; b: number }> = [];

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        if (a !== undefined && a > 128 && r !== undefined && g !== undefined && b !== undefined) {
          colors.push({ r, g, b });
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
          textSecondary: '#b45309',
        };
      }

      const avgColor = colors.reduce(
        (acc, color) => ({
          r: acc.r + color.r,
          g: acc.g + color.g,
          b: acc.b + color.b,
        }),
        { r: 0, g: 0, b: 0 },
      );

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
        textSecondary: secondary,
      };
    } catch {
      return {
        primary: '#92400e',
        secondary: '#d97706',
        accent: '#fbbf24',
        border: '#92400e',
        background: '#fffdf5',
        text: '#92400e',
        textSecondary: '#b45309',
      };
    }
  }, []);

  // Color conversion helpers
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return { h, s, l };
  };

  const hslToHex = (h: number, s: number, l: number) => {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    const toHex = (c: number) => {
      const hex = Math.round(c * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && data.imageUrl) {
      const theme = extractImageColors(imgRef.current);
      setColorTheme(theme);
    }
  }, [data.imageUrl, extractImageColors]);

  const handleImageLoad = () => {
    if (imgRef.current && data.imageUrl) {
      const theme = extractImageColors(imgRef.current);
      setColorTheme(theme);
    }
  };

  return (
    <div className="mx-auto w-full max-w-sm">
      {/* Header */}
      <div className="mb-4 text-center">
        <h3 className="mb-2 text-lg font-semibold text-gray-900">Live Preview</h3>
        <p className="text-sm text-gray-600">This is how your ChronoStamp will look</p>
      </div>

      {/* Stamp Preview Card */}
      <div className="group perspective-1000 relative mx-auto h-80 w-64">
        {/* Stamp Container with Perforation Border */}
        <div className="stamp-perforations h-full w-full rounded-lg bg-white p-2 shadow-2xl">
          {/* Inner Border Frame */}
          <div
            className="relative h-full w-full overflow-hidden rounded-sm border-4 border-double"
            style={{
              borderColor: `${colorTheme.border}CC`,
              background: `linear-gradient(135deg, ${colorTheme.background} 0%, ${colorTheme.accent}20 100%)`,
            }}
          >
            {/* Decorative Corner Flourishes */}
            <div
              className="absolute top-1 left-1 h-6 w-6 rounded-tl-lg border-t-2 border-l-2"
              style={{ borderColor: `${colorTheme.primary}99` }}
            ></div>
            <div
              className="absolute top-1 right-1 h-6 w-6 rounded-tr-lg border-t-2 border-r-2"
              style={{ borderColor: `${colorTheme.primary}99` }}
            ></div>
            <div
              className="absolute bottom-1 left-1 h-6 w-6 rounded-bl-lg border-b-2 border-l-2"
              style={{ borderColor: `${colorTheme.primary}99` }}
            ></div>
            <div
              className="absolute right-1 bottom-1 h-6 w-6 rounded-br-lg border-r-2 border-b-2"
              style={{ borderColor: `${colorTheme.primary}99` }}
            ></div>

            {/* Main Image Area */}
            <div className="relative m-4 h-2/3 overflow-hidden rounded-sm shadow-inner">
              {data.imageUrl ? (
                <>
                  <img
                    ref={imgRef}
                    src={data.imageUrl}
                    alt={data.name || 'Event preview'}
                    onLoad={handleImageLoad}
                    className="h-full w-full object-cover contrast-105 sepia-[0.1]"
                    crossOrigin="anonymous"
                  />

                  {/* Vintage Overlay */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to top, ${colorTheme.primary}33 0%, transparent 40%, ${colorTheme.accent}1A 100%)`,
                    }}
                  ></div>

                  {/* Preview Token Number Badge */}
                  <div
                    className="absolute top-2 right-2 rounded-sm px-2 py-1 text-xs font-bold tracking-wider text-white"
                    style={{ backgroundColor: `${colorTheme.primary}E6` }}
                  >
                    #0001
                  </div>
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div className="mb-2 text-4xl">🖼️</div>
                    <p className="text-sm">Upload an image</p>
                  </div>
                </div>
              )}
            </div>

            {/* Title Section */}
            <div className="px-4 pb-2">
              <h3
                className="mb-1 text-center font-serif text-sm leading-tight font-bold tracking-wide"
                style={{ color: colorTheme.text }}
              >
                {(data.name || 'EVENT NAME').toUpperCase()}
              </h3>

              {/* Date and Denomination */}
              <div className="flex items-center justify-between text-xs" style={{ color: colorTheme.textSecondary }}>
                <span className="font-mono">{new Date().getFullYear()}</span>
                <div
                  className="rounded px-2 py-0.5 text-xs font-bold"
                  style={{
                    backgroundColor: colorTheme.accent,
                    color: colorTheme.primary,
                  }}
                >
                  MEMORY
                </div>
                <span className="font-mono">#001</span>
              </div>

              {/* Organizer Attribution */}
              <div className="mt-1 text-center text-xs font-medium" style={{ color: colorTheme.textSecondary }}>
                You • Organizer
              </div>
            </div>

            {/* Watermark Pattern */}
            <div className="pointer-events-none absolute inset-0 opacity-5">
              <div
                className="h-full w-full bg-repeat"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodeURIComponent(colorTheme.primary)}' fill-opacity='1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundSize: '30px 30px',
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Info */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">Preview updates as you type ✨</p>
        {hasData && <p className="mt-1 text-xs text-gray-400">Colors automatically adapt to your image</p>}
      </div>
    </div>
  );
}
