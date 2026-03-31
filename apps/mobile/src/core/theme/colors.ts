import { darkTokens, lightTokens, ThemeTokens } from './tokens';

export const themeByScheme: Record<'light' | 'dark', ThemeTokens> = {
  light: lightTokens,
  dark: darkTokens,
};
