import { NextResponse } from "next/server";
import { createBlogService, getAllBlogs } from "@/app/services/blogs";
import { getUserFromRequest } from "@/app/services/session";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const blogs = await getAllBlogs(search);
    return NextResponse.json(blogs, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch blogs" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized: valid session or API token required" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { title, author, url } = body;

    if (!title || !author || !url) {
      return NextResponse.json(
        { error: "title, author, and url are required" },
        { status: 400 },
      );
    }

    const newBlog = await createBlogService({
      title,
      author,
      url,
      userId: user.id,
    });

    return NextResponse.json(newBlog, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to create blog" },
      { status: 500 },
    );
  }
}
