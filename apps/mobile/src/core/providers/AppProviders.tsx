import { PropsWithChildren } from 'react';

import { ErrorBoundary } from '@components/ErrorBoundary';

import { DatabaseProvider } from './DatabaseProvider';

export const AppProviders = ({ children }: PropsWithChildren) => (
  <ErrorBoundary>
    <DatabaseProvider>{children}</DatabaseProvider>
  </ErrorBoundary>
);
