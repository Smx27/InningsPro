import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync, SQLiteDatabase } from 'expo-sqlite';

import * as schema from './schema';

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export const getDatabase = () => {
  if (!dbInstance) {
    const sqlite: SQLiteDatabase = openDatabaseSync('inningspro.db');
    dbInstance = drizzle(sqlite, { schema });
  }

  return dbInstance;
};
