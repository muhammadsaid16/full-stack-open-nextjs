import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/services/session";
import { getReadingListForUser } from "@/app/services/blogs";
import { ReadingListManager, type ReadingListItemData } from "@/app/components/ReadingListControls";
import { ApiTokenManager } from "@/app/components/ApiTokenManager";

export const dynamic = "force-dynamic";

export default async function MePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const readingListData = await getReadingListForUser(user.id);
  const formattedItems: ReadingListItemData[] = readingListData.all.map((item) => ({
    id: item.id,
    userId: item.userId,
    blogId: item.blogId,
    read: item.read,
    blog: {
      id: item.blog.id,
      title: item.blog.title,
      author: item.blog.author,
      url: item.blog.url,
      likes: item.blog.likes,
    },
  }));

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* User Profile Section */}
      <div
        data-testid="user-profile"
        className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
      >
        <h1 className="text-2xl font-bold text-slate-800 mb-4">User Profile</h1>
        <div className="space-y-2">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
              Full Name
            </span>
            <p
              data-testid="user-name"
              className="text-lg font-semibold text-slate-900"
            >
              {user.name}
            </p>
          </div>
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
              Username
            </span>
            <p
              data-testid="user-username"
              className="text-sm font-medium text-slate-600"
            >
              {user.username}
            </p>
          </div>
        </div>
      </div>

      {/* Reading List Section */}
      <ReadingListManager initialItems={formattedItems} />

      {/* Personal API Token Section */}
      <ApiTokenManager initialToken={user.apiToken} />
    </div>
  );
}
