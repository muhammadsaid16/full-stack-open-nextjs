"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useNotification } from "@/app/components/Notification";

export default function NewBlogPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { showNotification } = useNotification();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (status !== "authenticated" || !session?.user) {
      setError("You must be logged in to create a blog.");
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author, url }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to create blog");
        setLoading(false);
        return;
      }

      showNotification("Blog created successfully", "success");
      router.push("/blogs?notify=Blog+created+successfully");
      router.refresh();
    } catch {
      setError("An unexpected error occurred while creating the blog");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-8 bg-white p-8 rounded-xl shadow-md border border-slate-200">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Create blog</h1>

      {status === "unauthenticated" && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-md">
          You are currently not logged in. You will need to{" "}
          <Link href="/login" className="underline font-semibold">
            log in
          </Link>{" "}
          before creating a blog.
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-slate-700 mb-1"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g. Clean Code Principles"
            className="w-full px-3.5 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="author"
            className="block text-sm font-semibold text-slate-700 mb-1"
          >
            Author
          </label>
          <input
            id="author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            placeholder="e.g. Robert C. Martin"
            className="w-full px-3.5 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="url"
            className="block text-sm font-semibold text-slate-700 mb-1"
          >
            URL
          </label>
          <input
            id="url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            placeholder="e.g. https://example.com/article"
            className="w-full px-3.5 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          data-testid="create-blog-button"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
}
