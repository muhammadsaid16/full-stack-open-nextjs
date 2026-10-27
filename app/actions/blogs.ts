"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/app/services/session";
import {
  addToReadingListService,
  createBlogService,
  deleteBlogService,
  getBlogById,
  likeBlogService,
  markAsReadService,
} from "@/app/services/blogs";

export type BlogActionState = {
  error?: string;
  success?: boolean;
};

export async function createBlogAction(
  prevState: BlogActionState,
  formData: FormData,
): Promise<BlogActionState> {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect("/login");
  }

  const title = (formData.get("title") as string)?.trim() || "";
  const author = (formData.get("author") as string)?.trim() || "";
  const url = (formData.get("url") as string)?.trim() || "";

  if (!title || !author || !url) {
    return { error: "All fields are required" };
  }

  try {
    await createBlogService({
      title,
      author,
      url,
      userId: currentUser.id,
    });
  } catch (err: any) {
    return { error: err.message || "Failed to create blog" };
  }

  revalidatePath("/blogs");
  redirect("/blogs?notify=Blog+created+successfully");
}

export async function likeBlogAction(blogId: number) {
  try {
    const updated = await likeBlogService(blogId);
    revalidatePath("/blogs");
    revalidatePath(`/blogs/${blogId}`);
    return { success: true, likes: updated?.likes ?? 0 };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteBlogAction(blogId: number) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { success: false, error: "Unauthorized" };
  }

  const blog = await getBlogById(blogId);
  if (!blog) {
    return { success: false, error: "Blog not found" };
  }

  if (blog.userId !== currentUser.id) {
    return { success: false, error: "Forbidden: You are not the creator of this blog" };
  }

  await deleteBlogService(blogId);
  revalidatePath("/blogs");
  redirect("/blogs?notify=Blog+deleted+successfully");
}

export async function addToReadingListAction(blogId: number) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await addToReadingListService(currentUser.id, blogId);
    revalidatePath(`/blogs/${blogId}`);
    revalidatePath("/me");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function markAsReadAction(itemIdOrBlogId: number) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await markAsReadService(currentUser.id, itemIdOrBlogId);
    revalidatePath("/me");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
