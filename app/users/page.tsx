import Link from "next/link";
import { getAllUsersWithBlogCount } from "@/app/services/users";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const users = await getAllUsersWithBlogCount();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Users</h1>
        <p className="text-sm text-slate-500 mt-1">
          Registered developers and contributors
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
              >
                Username
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
              >
                Blogs Created
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-8 text-center text-sm text-slate-500"
                >
                  No registered users yet.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    <Link
                      href={`/users/${user.id}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {user.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    @{user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-700">
                    {user.blogsCount}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
