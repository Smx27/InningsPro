import { migrate, useMigrations } from 'drizzle-orm/expo-sqlite/migrator';

import { getDatabase } from './drizzle';
import bundledMigrations from './drizzle/migrations';

export type DatabaseMigrationState = ReturnType<typeof useMigrations>;

export class DatabaseMigrationError extends Error {
  public override readonly cause: unknown;

  public constructor(message: string, cause: unknown) {
    super(message);
    this.name = 'DatabaseMigrationError';
    this.cause = cause;
  }
}

let migrationPromise: Promise<void> | null = null;
let migrationsApplied = false;

export const useDatabaseMigrations = (): DatabaseMigrationState => {
  const db = getDatabase();

  return useMigrations(db, bundledMigrations);
};

export const initializeDatabaseMigrations = async (): Promise<void> => {
  if (migrationsApplied) {
    return;
  }

  if (!migrationPromise) {
    const db = getDatabase();

    migrationPromise = migrate(db, bundledMigrations)
      .then(() => {
        migrationsApplied = true;
      })
      .catch((error: unknown) => {
        throw new DatabaseMigrationError('Failed to apply database migrations', error);
      })
      .finally(() => {
        if (!migrationsApplied) {
          migrationPromise = null;
        }
      });
  }

  return migrationPromise;
};
