import Link from "next/link";
import { auth } from "@/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-8 sm:p-12 text-white shadow-xl">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Full Stack Open: Blog Application
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-blue-100 max-w-3xl leading-relaxed">
          Welcome to the Full Stack Open Next.js (Part 14) course project. Built
          with Next.js App Router, React 19 Server Components, Drizzle ORM,
          PostgreSQL, NextAuth v5, and Tailwind CSS.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/blogs"
            className="px-6 py-3 bg-white text-blue-700 hover:bg-blue-50 font-semibold rounded-lg shadow transition"
          >
            Explore Blogs
          </Link>
          {session ? (
            <Link
              href="/blogs/new"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition"
            >
              Create New Blog
            </Link>
          ) : (
            <Link
              href="/register"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-2xl mb-2">📚</div>
          <h2 className="text-lg font-bold text-slate-800">Browse & Discover</h2>
          <p className="text-sm text-slate-600 mt-2">
            Read interesting blogs shared by developers, like your favorites, and
            filter by topics or authors.
          </p>
          <Link
            href="/blogs"
            className="inline-block mt-4 text-sm font-semibold text-blue-600 hover:underline"
          >
            Go to blogs &rarr;
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-2xl mb-2">🔖</div>
          <h2 className="text-lg font-bold text-slate-800">Reading List</h2>
          <p className="text-sm text-slate-600 mt-2">
            Save blogs to your personal reading list, keep track of what you’ve
            read, and mark items as completed.
          </p>
          <Link
            href="/me"
            className="inline-block mt-4 text-sm font-semibold text-blue-600 hover:underline"
          >
            View your profile &rarr;
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-2xl mb-2">🔑</div>
          <h2 className="text-lg font-bold text-slate-800">API Tokens</h2>
          <p className="text-sm text-slate-600 mt-2">
            Generate personal API tokens to programmatically interact with the
            platform via REST endpoints.
          </p>
          <Link
            href="/me"
            className="inline-block mt-4 text-sm font-semibold text-blue-600 hover:underline"
          >
            Manage tokens &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
