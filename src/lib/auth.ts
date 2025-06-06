import { eq } from 'drizzle-orm';
import { db } from '../db';
import { sessions, users } from '../db/schema';

export type User = typeof users.$inferSelect;

export async function getSession(sessionId: string) {
  const session = await db.query.sessions.findFirst({
    where: eq(sessions.id, sessionId),
    with: {
      user: true,
    },
  });

  if (!session || new Date(session.expiresAt) < new Date()) {
    return null;
  }

  return session;
}

export async function getUser(sessionId: string): Promise<User | null> {
  const session = await getSession(sessionId);
  return session?.user || null;
}

export function generateToken() {
  return crypto.randomUUID();
} 