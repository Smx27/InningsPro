export type TokenMap<TValue extends string = string> = Readonly<Record<string, TValue>>;

export type ColorScale<TShade extends string = string> = Readonly<Record<TShade, `#${string}`>>;

export const cricketBrandColors = {
  pitch: {
    50: '#F3FAF2',
    100: '#DDF2DA',
    200: '#BDE4B8',
    300: '#94D38A',
    400: '#67BE5C',
    500: '#3D9F33',
    600: '#2F7F28',
    700: '#266520',
    800: '#1E4E1A',
    900: '#173C15'
  },
  boundary: {
    50: '#EEF7FF',
    100: '#D7EBFF',
    200: '#AFD8FF',
    300: '#82C0FF',
    400: '#539FFF',
    500: '#2D7CFF',
    600: '#1F5EE5',
    700: '#194AC0',
    800: '#173E9B',
    900: '#173576'
  },
  leather: {
    50: '#FFF4F2',
    100: '#FFE5E0',
    200: '#FFC8BD',
    300: '#FFA390',
    400: '#FF7860',
    500: '#F45133',
    600: '#D93A22',
    700: '#B82E1D',
    800: '#93271B',
    900: '#77231B'
  },
  neutral: {
    0: '#FFFFFF',
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#020617'
  }
} as const;

export type CricketBrandColors = typeof cricketBrandColors;
export type BrandColorFamily = keyof CricketBrandColors;
export type BrandColorShade<TFamily extends BrandColorFamily> = keyof CricketBrandColors[TFamily];

export const semanticColors = {
  success: cricketBrandColors.pitch[500],
  info: cricketBrandColors.boundary[500],
  warning: '#F59E0B',
  danger: cricketBrandColors.leather[500]
} as const;

export type SemanticColors = typeof semanticColors;
