const HEX_COLOR_REGEX = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

const expandShorthandHex = (hex: string) =>
  hex.length === 3
    ? hex
        .split('')
        .map((char) => char + char)
        .join('')
    : hex;

const normalizeHex = (hex: string) => {
  const sanitized = hex.trim().replace('#', '');
  const expanded = expandShorthandHex(sanitized);
  return `#${expanded.toLowerCase()}`;
};

export const DEFAULT_PRIMARY_HEX = '#3b82f6';
export const DEFAULT_ACCENT_HEX = '#8b5cf6';

export const isValidHexColor = (hex: string | undefined): hex is string =>
  typeof hex === 'string' && HEX_COLOR_REGEX.test(hex.trim());

export const resolveHexColor = (candidate: string | undefined, fallback: string) =>
  isValidHexColor(candidate) ? normalizeHex(candidate) : normalizeHex(fallback);

const hexToRgb = (hexColor: string) => {
  const hex = normalizeHex(hexColor).replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return { r, g, b };
};

export const hexToHsl = (hexColor: string): string => {
  const { r, g, b } = hexToRgb(hexColor);

  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      default:
        h = (rNorm - gNorm) / d + 4;
        break;
    }

    h /= 6;
  }

  const hue = Math.round(h * 360);
  const saturation = Math.round(s * 100);
  const lightness = Math.round(l * 100);

  return `${hue} ${saturation}% ${lightness}%`;
};

const relativeLuminance = ({ r, g, b }: { r: number; g: number; b: number }): number => {
  const srgbToLinear = (channel: number) => {
    const normalized = channel / 255;
    return normalized <= 0.03928 ? normalized / 12.92 : Math.pow((normalized + 0.055) / 1.055, 2.4);
  };

  const R = srgbToLinear(r);
  const G = srgbToLinear(g);
  const B = srgbToLinear(b);

  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
};

export const getReadableForegroundHsl = (hexColor: string): string => {
  const luminance = relativeLuminance(hexToRgb(hexColor));
  return luminance > 0.6 ? '0 0% 10%' : '0 0% 100%';
};

export const createAccentGradient = (primaryHsl: string, accentHsl: string) =>
  `linear-gradient(135deg, hsl(${primaryHsl}) 0%, hsl(${accentHsl}) 100%)`;


