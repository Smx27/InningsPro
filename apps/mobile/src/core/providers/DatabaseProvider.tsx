import { PropsWithChildren, useEffect, useState } from 'react';

import { initializeDatabaseMigrations } from '@core/database/migrations';

export const DatabaseProvider = ({ children }: PropsWithChildren) => {
  const [isDatabaseReady, setIsDatabaseReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    void initializeDatabaseMigrations()
      .then(() => {
        if (isMounted) {
          setIsDatabaseReady(true);
        }
      })
      .catch((error: unknown) => {
        console.error('Failed running migrations', error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isDatabaseReady) {
    return null;
  }

  return children;
};
