import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/services/session";
import {
  addToReadingListService,
  markAsReadService,
} from "@/app/services/blogs";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const blogId = parseInt(body.blogId, 10);
    if (isNaN(blogId)) {
      return NextResponse.json({ error: "Invalid blogId" }, { status: 400 });
    }

    const item = await addToReadingListService(user.id, blogId);
    return NextResponse.json(item, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to add to reading list" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const itemId = parseInt(body.itemId || body.blogId, 10);
    if (isNaN(itemId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const updated = await markAsReadService(user.id, itemId);
    return NextResponse.json(updated, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to mark as read" },
      { status: 500 },
    );
  }
}
