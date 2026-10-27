import { auth } from "@/auth";
import { db } from "@/db";
import { users, type User } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getCurrentUser(): Promise<User | null> {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }
  const userId = parseInt(session.user.id, 10);
  if (isNaN(userId)) {
    return null;
  }
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return user || null;
}

export async function getUserFromRequest(
  request: Request,
): Promise<User | null> {
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    const token = authHeader.substring(7).trim();
    if (token) {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.apiToken, token))
        .limit(1);
      if (user) {
        return user;
      }
    }
  }

  return await getCurrentUser();
}
