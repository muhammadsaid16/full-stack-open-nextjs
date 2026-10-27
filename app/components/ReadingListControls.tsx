"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useNotification } from "./Notification";
import { addToReadingListAction, markAsReadAction } from "@/app/actions/blogs";

export function AddToReadingListButton({ blogId }: { blogId: number }) {
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  const handleAdd = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reading-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogId }),
      });

      if (res.ok) {
        setAdded(true);
        showNotification("Blog added to reading list!", "success");
      }
    } catch {
      await addToReadingListAction(blogId);
      setAdded(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      data-testid="add-to-reading-list-button"
      onClick={handleAdd}
      disabled={loading || added}
      className={`px-4 py-2 rounded-md text-sm font-semibold transition ${
        added
          ? "bg-green-100 text-green-800 border border-green-300"
          : "bg-emerald-600 hover:bg-emerald-700 text-white"
      } disabled:opacity-75`}
    >
      {added ? "In your reading list" : loading ? "Adding..." : "Add to reading list"}
    </button>
  );
}

export type ReadingListItemData = {
  id: number;
  userId: number;
  blogId: number;
  read: boolean;
  blog: {
    id: number;
    title: string;
    author: string;
    url: string;
    likes: number;
  };
};

export function ReadingListManager({
  initialItems,
}: {
  initialItems: ReadingListItemData[];
}) {
  const [items, setItems] = useState<ReadingListItemData[]>(initialItems);
  const router = useRouter();
  const [, startTransition] = useTransition();

  const unreadItems = items.filter((i) => !i.read);
  const readItems = items.filter((i) => i.read);

  const handleMarkAsRead = async (item: ReadingListItemData) => {
    // Optimistic update
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, read: true } : i)),
    );

    try {
      await fetch("/api/reading-list", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: item.id, blogId: item.blogId }),
      });
    } catch {
      await markAsReadAction(item.id);
    }

    startTransition(() => {
      router.refresh();
    });
  };

  if (items.length === 0) {
    return (
      <div data-testid="reading-list-section" className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Reading List</h2>
        <p data-testid="empty-reading-list" className="text-slate-500">
          Your reading list is empty. Add blogs from the blog detail pages.
        </p>
      </div>
    );
  }

  return (
    <div data-testid="reading-list-section" className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 space-y-6">
      <h2 className="text-xl font-bold text-slate-800">Reading List</h2>

      {/* Unread Section */}
      <div data-testid="unread-section" className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-700 border-b pb-2">
          Unread Blogs ({unreadItems.length})
        </h3>
        {unreadItems.length === 0 ? (
          <p data-testid="no-unread-blogs" className="text-slate-500 py-2">
            No unread blogs in your list!
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {unreadItems.map((item) => (
              <li
                key={item.id}
                className="py-3 flex items-center justify-between gap-4"
              >
                <div>
                  <Link
                    href={`/blogs/${item.blog.id}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {item.blog.title}
                  </Link>
                  <p className="text-xs text-slate-500">
                    by {item.blog.author}
                  </p>
                </div>
                <button
                  type="button"
                  data-testid={`mark-read-${item.id}`}
                  onClick={() => handleMarkAsRead(item)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded transition"
                >
                  Mark as read
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Read Section */}
      <div data-testid="read-section" className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-700 border-b pb-2">
          Read Blogs ({readItems.length})
        </h3>
        {readItems.length === 0 ? (
          <p className="text-slate-500 py-2 text-sm">No read blogs yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {readItems.map((item) => (
              <li key={item.id} className="py-2.5">
                <Link
                  href={`/blogs/${item.blog.id}`}
                  className="font-medium text-slate-700 hover:text-blue-600 transition"
                >
                  {item.blog.title}
                </Link>
                <p className="text-xs text-slate-400">
                  by {item.blog.author}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
