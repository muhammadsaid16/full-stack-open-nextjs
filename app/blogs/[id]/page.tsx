import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogById } from "@/app/services/blogs";
import { getCurrentUser } from "@/app/services/session";
import { LikeButton } from "@/app/components/LikeButton";
import { AddToReadingListButton } from "@/app/components/ReadingListControls";
import { deleteBlogAction } from "@/app/actions/blogs";

export const dynamic = "force-dynamic";

interface BlogDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { id } = await params;
  const blogId = parseInt(id, 10);
  if (isNaN(blogId)) {
    notFound();
  }

  const blog = await getBlogById(blogId);
  if (!blog) {
    notFound();
  }

  const currentUser = await getCurrentUser();
  const isCreator = currentUser && currentUser.id === blog.userId;

  const handleDelete = async () => {
    "use server";
    await deleteBlogAction(blog.id);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href="/blogs"
        className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline"
      >
        &larr; Back to all blogs
      </Link>

      <div
        data-testid="blog-detail"
        className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6"
      >
        <div>
          <h1
            data-testid="blog-title"
            className="text-3xl font-extrabold text-slate-900 tracking-tight"
          >
            {blog.title}
          </h1>
          <p className="text-base text-slate-600 mt-2">
            by{" "}
            <span
              data-testid="blog-author"
              className="font-semibold text-slate-900"
            >
              {blog.author}
            </span>
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
          <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
            Source URL
          </span>
          <a
            data-testid="blog-url"
            href={blog.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline break-all"
          >
            {blog.url}
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <LikeButton blogId={blog.id} initialLikes={blog.likes} />

          <div className="flex items-center gap-3">
            {currentUser && (
              <AddToReadingListButton blogId={blog.id} />
            )}

            {isCreator && (
              <form action={handleDelete}>
                <button
                  type="submit"
                  data-testid="delete-button"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-semibold transition shadow-sm"
                >
                  Delete blog
                </button>
              </form>
            )}
          </div>
        </div>

        {blog.user && (
          <div className="pt-4 border-t border-slate-100 text-xs text-slate-400">
            Added by {blog.user.name} (@{blog.user.username})
          </div>
        )}
      </div>
    </div>
  );
}
