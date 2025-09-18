'use client';

import type { PropsWithChildren } from 'react';

import { ThemeProvider } from '@workspace/ui/hooks/use-theme';

const THEME_CONFIG = {
  attribute: 'class',
  defaultTheme: 'dark',
  enableSystem: true,
  disableTransitionOnChange: true,
} as const;

export function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider {...THEME_CONFIG}>
      {children}
    </ThemeProvider>
  );
}
