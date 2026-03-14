import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { initializeDatabaseMigrations } from '@core/database/migrations';
import { logError, logInfo } from '@services/logger';

export const DatabaseProvider = ({ children }: PropsWithChildren) => {
  const [isDatabaseReady, setIsDatabaseReady] = useState(false);
  const [migrationError, setMigrationError] = useState<string | null>(null);

  const runMigrations = useCallback(async () => {
    setMigrationError(null);

    try {
      await initializeDatabaseMigrations();
      setIsDatabaseReady(true);
      logInfo('Database migrations completed');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown migration error';
      setMigrationError(message);
      logError(error, { operation: 'initializeDatabaseMigrations' });
    }
  }, []);

  useEffect(() => {
    void runMigrations();
  }, [runMigrations]);

  if (!isDatabaseReady) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-100 px-6 dark:bg-black">
        {migrationError ? (
          <>
            <Text className="text-center text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Database setup failed
            </Text>
            <Text className="mt-3 text-center text-sm text-zinc-600 dark:text-zinc-300">
              {migrationError}
            </Text>
            <Pressable
              onPress={() => {
                void runMigrations();
              }}
              className="mt-6 h-12 min-w-40 items-center justify-center rounded-xl bg-emerald-600 px-5"
            >
              <Text className="text-base font-semibold text-white">Retry</Text>
            </Pressable>
          </>
        ) : (
          <>
            <ActivityIndicator size="large" color="#22c55e" />
            <Text className="mt-4 text-sm text-zinc-600 dark:text-zinc-300">
              Initializing database...
            </Text>
          </>
        )}
      </View>
    );
  }

  return children;
};
