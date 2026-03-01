import { cricketBrandColors, semanticColors } from './colors';

export type ThemeMode = 'light' | 'dark';

export type ThemeColorTokens = Readonly<{
  background: `#${string}`;
  surface: `#${string}`;
  text: `#${string}`;
  mutedText: `#${string}`;
  primary: `#${string}`;
  primaryForeground: `#${string}`;
  accent: `#${string}`;
  success: `#${string}`;
  info: `#${string}`;
  warning: `#${string}`;
  danger: `#${string}`;
  border: `#${string}`;
}>;

export const themeTokens = {
  light: {
    background: cricketBrandColors.neutral[50],
    surface: cricketBrandColors.neutral[0],
    text: cricketBrandColors.neutral[900],
    mutedText: cricketBrandColors.neutral[600],
    primary: cricketBrandColors.boundary[600],
    primaryForeground: cricketBrandColors.neutral[0],
    accent: cricketBrandColors.pitch[500],
    success: semanticColors.success,
    info: semanticColors.info,
    warning: semanticColors.warning,
    danger: semanticColors.danger,
    border: cricketBrandColors.neutral[200]
  },
  dark: {
    background: cricketBrandColors.neutral[950],
    surface: cricketBrandColors.neutral[900],
    text: cricketBrandColors.neutral[100],
    mutedText: cricketBrandColors.neutral[400],
    primary: cricketBrandColors.boundary[400],
    primaryForeground: cricketBrandColors.neutral[950],
    accent: cricketBrandColors.pitch[400],
    success: cricketBrandColors.pitch[400],
    info: cricketBrandColors.boundary[400],
    warning: '#FBBF24',
    danger: cricketBrandColors.leather[400],
    border: cricketBrandColors.neutral[700]
  }
} as const satisfies Readonly<Record<ThemeMode, ThemeColorTokens>>;

export type ThemeTokens = (typeof themeTokens)[ThemeMode];

export const nativeWindColorMapping = {
  colorBg: 'background',
  colorSurface: 'surface',
  colorText: 'text',
  colorMutedText: 'mutedText',
  colorPrimary: 'primary',
  colorPrimaryForeground: 'primaryForeground',
  colorAccent: 'accent',
  colorBorder: 'border',
  colorSuccess: 'success',
  colorInfo: 'info',
  colorWarning: 'warning',
  colorDanger: 'danger'
} as const satisfies Readonly<Record<string, keyof ThemeColorTokens>>;

const hexToRgbChannels = (value: `#${string}`): `${number} ${number} ${number}` => {
  const hex = value.slice(1);
  const normalized = hex.length === 3
    ? hex.split('').map((char) => `${char}${char}`).join('')
    : hex;

  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  return `${red} ${green} ${blue}`;
};

export const toNativeWindThemeVariables = (mode: ThemeMode): Readonly<Record<keyof typeof nativeWindColorMapping, `${number} ${number} ${number}`>> => {
  const tokens = themeTokens[mode];

  return Object.fromEntries(
    Object.entries(nativeWindColorMapping).map(([variableName, tokenName]) => [variableName, hexToRgbChannels(tokens[tokenName])])
  ) as Readonly<Record<keyof typeof nativeWindColorMapping, `${number} ${number} ${number}`>>;
};

export const toCssCustomProperties = (mode: ThemeMode): Readonly<Record<`--${string}`, string>> => {
  const variables = toNativeWindThemeVariables(mode);

  return Object.fromEntries(
    Object.entries(variables).map(([tokenName, value]) => [`--${tokenName}`, value])
  ) as Readonly<Record<`--${string}`, string>>;
};
