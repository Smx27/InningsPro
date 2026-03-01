import { PropsWithChildren, useEffect } from 'react';

import { runMigrations } from '@core/database/migrations';

export const AppProviders = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    runMigrations().catch((error) => {
      console.error('Failed running migrations', error);
    });
  }, []);

  return children;
};
