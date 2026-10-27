import { NextResponse } from "next/server";
import { db } from "@/db";
import { blogs, readingList, users } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function DELETE() {
  try {
    try {
      await db.execute(
        sql`TRUNCATE TABLE reading_list, blogs, users RESTART IDENTITY CASCADE`,
      );
    } catch {
      await db.delete(readingList);
      await db.delete(blogs);
      await db.delete(users);
    }

    return NextResponse.json({ message: "Database reset" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to reset database" },
      { status: 500 },
    );
  }
}
