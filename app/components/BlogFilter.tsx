"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function BlogFilter() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("search") || "";
  const [filter, setFilter] = useState(initialQuery);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      const trimmed = filter.trim();
      if (trimmed) {
        router.push(`/blogs?search=${encodeURIComponent(trimmed)}`);
      } else {
        router.push("/blogs");
      }
    });
  };

  const handleClear = () => {
    setFilter("");
    startTransition(() => {
      router.push("/blogs");
    });
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-md">
      <input
        type="text"
        data-testid="filter-input"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Search blogs by title or author..."
        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <button
        type="submit"
        data-testid="search-button"
        disabled={isPending}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
      >
        {isPending ? "Searching..." : "Search"}
      </button>
      {initialQuery && (
        <button
          type="button"
          onClick={handleClear}
          className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium rounded-lg transition"
        >
          Clear
        </button>
      )}
    </form>
  );
}
