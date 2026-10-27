"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
    router.refresh();
  };

  const isLoggedIn = status === "authenticated" && !!session?.user;

  return (
    <nav
      role="navigation"
      className="bg-slate-900 text-white shadow-md border-b border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-6">
            <Link
              href="/"
              className="text-lg font-bold tracking-tight text-white hover:text-slate-200"
            >
              BlogApp
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                href="/blogs"
                className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 rounded-md hover:bg-slate-800 transition"
              >
                blogs
              </Link>
              <Link
                href="/users"
                className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 rounded-md hover:bg-slate-800 transition"
              >
                users
              </Link>
              {isLoggedIn && (
                <>
                  <Link
                    href="/blogs/new"
                    className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 rounded-md hover:bg-slate-800 transition"
                  >
                    create new blog
                  </Link>
                  <Link
                    href="/me"
                    className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 rounded-md hover:bg-slate-800 transition"
                  >
                    me
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-slate-400">
                  {session.user.name || session.user.username}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-sm font-medium bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 rounded-md hover:bg-slate-800 transition"
                >
                  login
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md transition"
                >
                  register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
