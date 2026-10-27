import { NextResponse } from "next/server";
import {
  deleteBlogService,
  getBlogById,
  updateBlogService,
} from "@/app/services/blogs";
import { getUserFromRequest } from "@/app/services/session";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const blogId = parseInt(id, 10);
    if (isNaN(blogId)) {
      return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
    }

    const body = await request.json();
    const updated = await updateBlogService(blogId, body);
    if (!updated) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to update blog" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const blogId = parseInt(id, 10);
    if (isNaN(blogId)) {
      return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
    }

    const blog = await getBlogById(blogId);
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    if (blog.userId !== user.id) {
      return NextResponse.json(
        { error: "Forbidden: Not the owner" },
        { status: 403 },
      );
    }

    await deleteBlogService(blogId);
    return NextResponse.json({ message: "Blog deleted" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to delete blog" },
      { status: 500 },
    );
  }
}
