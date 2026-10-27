import { db } from "@/db";
import { blogs, readingList, type Blog } from "@/db/schema";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";

export async function getAllBlogs(search?: string) {
  let query = db.query.blogs.findMany({
    where: search
      ? or(
          ilike(blogs.title, `%${search}%`),
          ilike(blogs.author, `%${search}%`),
        )
      : undefined,
    with: {
      user: {
        columns: {
          id: true,
          username: true,
          name: true,
        },
      },
    },
    orderBy: [desc(blogs.likes), desc(blogs.id)],
  });

  return await query;
}

export async function getBlogById(id: number) {
  return await db.query.blogs.findFirst({
    where: eq(blogs.id, id),
    with: {
      user: {
        columns: {
          id: true,
          username: true,
          name: true,
        },
      },
    },
  });
}

export async function createBlogService(data: {
  title: string;
  author: string;
  url: string;
  userId: number;
}): Promise<Blog> {
  const [newBlog] = await db
    .insert(blogs)
    .values({
      title: data.title,
      author: data.author,
      url: data.url,
      userId: data.userId,
    })
    .returning();

  return newBlog;
}

export async function updateBlogService(
  id: number,
  data: Partial<Pick<Blog, "title" | "author" | "url" | "likes">>,
) {
  const [updated] = await db
    .update(blogs)
    .set(data)
    .where(eq(blogs.id, id))
    .returning();

  return updated || null;
}

export async function likeBlogService(id: number) {
  const [updated] = await db
    .update(blogs)
    .set({
      likes: sql`${blogs.likes} + 1`,
    })
    .where(eq(blogs.id, id))
    .returning();

  return updated || null;
}

export async function deleteBlogService(id: number) {
  const [deleted] = await db
    .delete(blogs)
    .where(eq(blogs.id, id))
    .returning();

  return deleted || null;
}

export async function addToReadingListService(
  userId: number,
  blogId: number,
) {
  const existing = await db
    .select()
    .from(readingList)
    .where(
      and(
        eq(readingList.userId, userId),
        eq(readingList.blogId, blogId),
      ),
    )
    .limit(1);

  if (existing.length > 0) {
    return existing[0];
  }

  const [item] = await db
    .insert(readingList)
    .values({
      userId,
      blogId,
      read: false,
    })
    .returning();

  return item;
}

export async function getReadingListForUser(userId: number) {
  const items = await db.query.readingList.findMany({
    where: eq(readingList.userId, userId),
    with: {
      blog: true,
    },
    orderBy: [desc(readingList.id)],
  });

  return {
    all: items,
    unread: items.filter((item) => !item.read),
    read: items.filter((item) => item.read),
  };
}

export async function markAsReadService(
  userId: number,
  itemIdOrBlogId: number,
) {
  const [updated] = await db
    .update(readingList)
    .set({ read: true })
    .where(
      and(
        eq(readingList.userId, userId),
        or(
          eq(readingList.id, itemIdOrBlogId),
          eq(readingList.blogId, itemIdOrBlogId),
        ),
      ),
    )
    .returning();

  return updated || null;
}
