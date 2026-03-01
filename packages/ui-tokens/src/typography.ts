export type FontSizeTokenMap = Readonly<Record<string, readonly [`${number}rem`, Readonly<{ lineHeight: `${number}rem`; letterSpacing?: `${number}em` }> ]>>;

export const fontFamily = {
  sans: "Inter, 'Noto Sans', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace"
} as const;

export const fontSize = {
  xs: ['0.75rem', { lineHeight: '1rem' }],
  sm: ['0.875rem', { lineHeight: '1.25rem' }],
  base: ['1rem', { lineHeight: '1.5rem' }],
  lg: ['1.125rem', { lineHeight: '1.75rem' }],
  xl: ['1.25rem', { lineHeight: '1.75rem' }],
  '2xl': ['1.5rem', { lineHeight: '2rem' }],
  '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.01em' }],
  '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.01em' }]
} as const satisfies FontSizeTokenMap;

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700
} as const;

export type FontFamilyToken = keyof typeof fontFamily;
export type FontSizeToken = keyof typeof fontSize;
export type FontWeightToken = keyof typeof fontWeight;
