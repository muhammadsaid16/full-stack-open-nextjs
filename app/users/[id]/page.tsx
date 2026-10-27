import { notFound } from "next/navigation";
import Link from "next/link";
import { getUserWithBlogs } from "@/app/services/users";

export const dynamic = "force-dynamic";

interface UserDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params;
  const userId = parseInt(id, 10);
  if (isNaN(userId)) {
    notFound();
  }

  const user = await getUserWithBlogs(userId);
  if (!user) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        href="/users"
        className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline"
      >
        &larr; Back to all users
      </Link>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
        <p className="text-sm text-slate-500 mt-1">@{user.username}</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800">
          Added Blogs ({user.blogs.length})
        </h2>

        {user.blogs.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500">
            This user has not added any blogs yet.
          </div>
        ) : (
          <div className="space-y-3">
            {user.blogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between"
              >
                <div>
                  <Link
                    href={`/blogs/${blog.id}`}
                    className="font-bold text-blue-600 hover:underline text-base"
                  >
                    {blog.title}
                  </Link>
                  <p className="text-xs text-slate-500 mt-0.5">
                    by {blog.author}
                  </p>
                </div>
                <span className="text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                  {blog.likes} likes
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
