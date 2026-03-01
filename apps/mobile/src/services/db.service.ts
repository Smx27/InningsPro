import { desc, eq } from 'drizzle-orm';

import { getDatabase } from '@core/database/drizzle';
import { NewMatch, matches } from '@core/database/schema';

export const dbService = {
  async createMatch(payload: NewMatch) {
    const db = getDatabase();
    const [created] = await db.insert(matches).values(payload).returning();
    return created;
  },

  async listMatches() {
    const db = getDatabase();
    return db.select().from(matches).orderBy(desc(matches.id));
  },

  async updateMatchStatus(id: number, status: string) {
    const db = getDatabase();
    const [updated] = await db
      .update(matches)
      .set({ status })
      .where(eq(matches.id, id))
      .returning();

    return updated;
  }
};
