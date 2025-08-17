import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

export default function Search() {
  const [query, setQuery] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [postResults, setPostResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const usersRes = await fetch(`${apiUrl}/api/search/users?q=${encodeURIComponent(query)}`);
      const users = usersRes.ok ? await usersRes.json() : [];
      setUserResults(users);
      const postsRes = await fetch(`${apiUrl}/api/search/hashtags?q=${encodeURIComponent(query)}`);
      const posts = postsRes.ok ? await postsRes.json() : [];
      setPostResults(posts);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-950 transition-colors duration-300">
      <div className="max-w-[935px] mx-auto px-4 sm:px-6 py-6">
        <form onSubmit={handleSearch} className="mb-6 flex gap-3">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users or hashtags..."
            className="flex-1 px-4 py-2.5 text-sm border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 transition-all duration-200"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl font-semibold text-sm shadow-md hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                  ></path>
                </svg>
                Searching...
              </span>
            ) : (
              "Search"
            )}
          </button>
        </form>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}

        {!loading && (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-zinc-100 mb-3">
                Users
              </h2>
              {userResults.length === 0 ? (
                <div className="text-gray-500 dark:text-zinc-400 text-sm">
                  No users found.
                </div>
              ) : (
                <ul className="space-y-3">
                  {userResults.map((user: any) => (
                    <li
                      key={user._id}
                      className="flex items-center gap-3 py-2 border-b border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors duration-200 rounded-lg px-2"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={user.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                          alt={user.username}
                        />
                        <AvatarFallback className="bg-gray-200 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 text-xs">
                          {user.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <Link
                        to={`/profile/${user.username}`}
                        className="font-semibold text-gray-900 dark:text-zinc-100 text-sm hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                      >
                        {user.username}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-zinc-100 mb-3">
                Posts
              </h2>
              {postResults.length === 0 ? (
                <div className="text-gray-500 dark:text-zinc-400 text-sm">
                  No posts found.
                </div>
              ) : (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {postResults.map((post: any) => (
                    <li
                      key={post._id}
                      className="border border-gray-200 dark:border-zinc-800 rounded-xl p-3 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      {post.postImage && (
                        <img
                          src={post.postImage}
                          alt="Post"
                          className="w-full h-48 object-cover rounded-lg mb-3 transition-opacity hover:opacity-90"
                          loading="lazy"
                        />
                      )}
                      <div className="text-sm text-gray-500 dark:text-zinc-400 mb-1">
                        By{" "}
                        <Link
                          to={`/profile/${post.userId.username}`}
                          className="font-semibold text-gray-900 dark:text-zinc-100 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                        >
                          {post.userId.username}
                        </Link>
                      </div>
                      <div className="text-sm text-gray-800 dark:text-zinc-200 line-clamp-2">
                        {post.caption || post.text || "No caption"}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}