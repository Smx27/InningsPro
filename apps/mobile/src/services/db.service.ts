import { desc, eq } from 'drizzle-orm';

import { getDatabase, matches, Match, NewMatch } from '@core/database';

export class DatabaseService {
  async createMatch(payload: NewMatch): Promise<Match | undefined> {
    const db = getDatabase();
    const [created] = await db.insert(matches).values(payload).returning();

    return created;
  }

  async listMatches(): Promise<Match[]> {
    const db = getDatabase();

    return db.select().from(matches).orderBy(desc(matches.id));
  }

  async updateMatchStatus(id: string, status: Match['status']): Promise<Match | undefined> {
    const db = getDatabase();
    const [updated] = await db
      .update(matches)
      .set({ status })
      .where(eq(matches.id, id))
      .returning();

    return updated;
  }
}

export const databaseService = new DatabaseService();
