import { Suspense } from "react";
import Link from "next/link";
import { getAllBlogs } from "@/app/services/blogs";
import { BlogFilter } from "../components/BlogFilter";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

interface BlogsPageProps {
  searchParams: Promise<{ search?: string }>;
}

async function BlogsList({ search }: { search?: string }) {
  const blogs = await getAllBlogs(search);

  if (blogs.length === 0) {
    return (
      <div
        data-testid="blogs-list"
        className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500"
      >
        {search
          ? `No blogs found matching "${search}".`
          : "No blogs added yet. Be the first to share one!"}
      </div>
    );
  }

  return (
    <div data-testid="blogs-list" className="space-y-4">
      {blogs.map((blog) => (
        <div
          key={blog.id}
          data-testid="blog-item"
          className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="space-y-1">
            <Link
              href={`/blogs/${blog.id}`}
              data-testid="blog-title"
              className="text-lg font-bold text-blue-600 hover:text-blue-800 hover:underline block"
            >
              {blog.title}
            </Link>
            <p className="text-sm text-slate-600">
              by <span data-testid="blog-author" className="font-medium text-slate-800">{blog.author}</span>
            </p>
            {blog.user && (
              <p className="text-xs text-slate-400">
                Added by {blog.user.name} (@{blog.user.username})
              </p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span
              data-testid="likes-count"
              className="text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full"
            >
              {blog.likes} likes
            </span>
            <Link
              href={`/blogs/${blog.id}`}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
            >
              View details &rarr;
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const params = await searchParams;
  const search = params?.search;
  const session = await auth();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Blogs</h1>
          <p className="text-sm text-slate-500 mt-1">
            Explore interesting articles shared by the community
          </p>
        </div>
        {session && (
          <Link
            href="/blogs/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition"
          >
            + Create new blog
          </Link>
        )}
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <Suspense fallback={<div>Loading filter...</div>}>
          <BlogFilter />
        </Suspense>
      </div>

      <Suspense
        fallback={
          <div className="p-8 text-center text-slate-500">
            Loading blogs...
          </div>
        }
      >
        <BlogsList search={search} />
      </Suspense>
    </div>
  );
}
