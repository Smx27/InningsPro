import { PropsWithChildren } from 'react';

import { DatabaseProvider } from './DatabaseProvider';

export const AppProviders = ({ children }: PropsWithChildren) => (
  <DatabaseProvider>{children}</DatabaseProvider>
);
