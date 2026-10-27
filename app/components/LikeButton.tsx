"use client";

import { useState, useTransition } from "react";
import { likeBlogAction } from "@/app/actions/blogs";

export function LikeButton({
  blogId,
  initialLikes,
}: {
  blogId: number;
  initialLikes: number;
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [isPending, startTransition] = useTransition();

  const handleLike = () => {
    setLikes((prev) => prev + 1);
    startTransition(async () => {
      const res = await likeBlogAction(blogId);
      if (res && res.success && typeof res.likes === "number") {
        setLikes(res.likes);
      }
    });
  };

  return (
    <div className="flex items-center gap-4">
      <span
        data-testid="likes-count"
        className="text-slate-700 font-medium text-sm"
      >
        <span data-testid="blog-likes">{likes} likes</span>
      </span>
      <button
        type="button"
        data-testid="like-button"
        onClick={handleLike}
        disabled={isPending}
        className="px-3.5 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-sm font-medium hover:bg-blue-100 transition disabled:opacity-50"
      >
        Like
      </button>
    </div>
  );
}
