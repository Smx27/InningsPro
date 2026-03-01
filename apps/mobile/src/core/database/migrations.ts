import { sql } from 'drizzle-orm';

import { getDatabase } from './drizzle';

export const runMigrations = async () => {
  const db = getDatabase();

  await db.run(
    sql`CREATE TABLE IF NOT EXISTS matches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      team_a TEXT NOT NULL,
      team_b TEXT NOT NULL,
      overs INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'scheduled'
    );`
  );
};
