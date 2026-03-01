import { PropsWithChildren, useEffect } from 'react';

import { useDatabaseMigrations } from '@core/database/migrations';

export const AppProviders = ({ children }: PropsWithChildren) => {
  const { error } = useDatabaseMigrations();

  useEffect(() => {
    if (error) {
      console.error('Failed running migrations', error);
    }
  }, [error]);

  return children;
};
