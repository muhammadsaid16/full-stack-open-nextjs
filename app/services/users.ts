import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function getUserById(id: number) {
  const [user] = await db
    .select({
      id: users.id,
      username: users.username,
      name: users.name,
      apiToken: users.apiToken,
    })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  return user || null;
}

export async function getUserByUsername(username: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  return user || null;
}

export async function getUserByApiToken(token: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.apiToken, token))
    .limit(1);

  return user || null;
}

export async function getAllUsersWithBlogCount() {
  const allUsers = await db.query.users.findMany({
    columns: {
      id: true,
      username: true,
      name: true,
    },
    with: {
      blogs: true,
    },
  });

  return allUsers.map((u) => ({
    id: u.id,
    username: u.username,
    name: u.name,
    blogsCount: u.blogs.length,
    blogs: u.blogs,
  }));
}

export async function getUserWithBlogs(id: number) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
    columns: {
      id: true,
      username: true,
      name: true,
    },
    with: {
      blogs: true,
    },
  });

  return user || null;
}

export async function createUserService(
  username: string,
  name: string,
  password: string,
) {
  const passwordHash = await bcrypt.hash(password, 10);
  const [newUser] = await db
    .insert(users)
    .values({
      username,
      name,
      passwordHash,
    })
    .returning({
      id: users.id,
      username: users.username,
      name: users.name,
    });

  return newUser;
}

export async function generateApiTokenForUser(userId: number) {
  const token = crypto.randomBytes(32).toString("hex");
  const [updatedUser] = await db
    .update(users)
    .set({ apiToken: token })
    .where(eq(users.id, userId))
    .returning({
      id: users.id,
      username: users.username,
      name: users.name,
      apiToken: users.apiToken,
    });

  return updatedUser?.apiToken || token;
}
