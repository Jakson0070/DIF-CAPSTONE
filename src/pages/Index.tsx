// // src/pages/Index.tsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthUser } from "@/hooks/useAuthUser";
import { Search, PlusSquare, Heart, User } from "lucide-react";
import { InstagramNavbar } from "@/components/InstagramNavbar";
import { InstagramStories } from "@/components/InstagramStories";
import { InstagramFeed } from "@/components/InstagramFeed";
import { InstagramBottomNav } from "@/components/InstagramBottomNav";
import { StoryViewer } from "@/components/StoryViewer";
import { useInstagram } from "@/hooks/useInstagram";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const Index = () => {
  const authUser = useAuthUser();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomeRoute = location.pathname === "/";
  const {
    stories,
    posts,
    currentStory,
    toggleLike,
    toggleSave,
    viewStory,
    closeStory,
    nextStory,
    prevStory,
    addComment,
  } = useInstagram();

  const [currentTab, setCurrentTab] = useState("home");
  const [notificationCount] = useState(3);
  const [postText, setPostText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedFiles.length === 0) {
      setPreviewUrls([]);
      return;
    }
    const urls = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);

  useEffect(() => {
    console.log("Posts:", posts);
    console.log("Loading:", loading);
    console.log("Token exists:", !!localStorage.getItem("token"));
  }, [posts, loading]);

  useEffect(() => {
    if (currentTab === "create" && !authUser) {
      setCurrentTab("home");
      navigate("/login");
    }
  }, [currentTab, authUser, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("caption", postText);
      if (selectedFiles.length > 0) {
        formData.append("media", selectedFiles[0]);
      }
      const res = await fetch(`${apiUrl}/api/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (res.ok) {
        setPostText("");
        setSelectedFiles([]);
        setCurrentTab("home");
        if (typeof window !== "undefined" && window.location.pathname === "/") {
          window.location.reload();
        }
      } else {
        alert("Failed to create post");
      }
    } catch (err) {
      alert("Error creating post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-950 transition-colors duration-300">
      <InstagramNavbar notificationCount={notificationCount} />

      <main className="max-w-[935px] mx-auto px-4 sm:px-6 pb-20 pt-16">
        {loading && (
          <div className="flex justify-center items-center h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}
        {!loading && currentTab === "home" && (
          <>
            <InstagramStories stories={stories} onViewStory={viewStory} />
            <div className="py-4">
              <InstagramFeed
                posts={posts}
                onToggleLike={(postId, isLiked) => toggleLike(postId, isLiked)}
                onToggleSave={toggleSave}
                onAddComment={addComment}
              />
            </div>
          </>
        )}
        {currentTab === "search" && (
          <div className="flex flex-col items-center justify-center py-12">
            <Search className="h-16 w-16 text-gray-400 dark:text-zinc-500 mb-4" />
            <p className="text-gray-500 dark:text-zinc-400 text-sm font-medium">
              Search functionality coming soon...
            </p>
          </div>
        )}
        {isHomeRoute && currentTab === "create" && authUser && (
          <Dialog open={currentTab === "create"} onOpenChange={() => setCurrentTab("home")}>
            <DialogContent className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-zinc-100">
                  Create a Post
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-500 dark:text-zinc-400">
                  Share a photo, video, or your thoughts.
                </DialogDescription>
              </DialogHeader>
              <form className="space-y-4" onSubmit={handleCreatePost}>
                <Textarea
                  placeholder="What's on your mind?"
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  maxLength={2200}
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 min-h-[100px] resize-y transition-all duration-200"
                />
                <div className="relative">
                  <Input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleFileChange}
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-zinc-700 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-indigo-500 file:text-white file:hover:bg-indigo-600 transition-all duration-200"
                  />
                  {previewUrls.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-2">
                      {previewUrls.map((url, idx) => (
                        <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800">
                          <img
                            src={url}
                            alt={`Preview ${idx+1}`}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {selectedFiles.map((file, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-200 px-3 py-1.5 rounded-lg truncate max-w-[150px]"
                    >
                      {file.name}
                    </span>
                  ))}
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={loading || (!postText && selectedFiles.length === 0)}
                    className="w-full py-3 px-4 bg-indigo-500 dark:bg-indigo-600 text-white text-sm font-semibold rounded-xl shadow-md hover:bg-indigo-600 dark:hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
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
                        Posting...
                      </span>
                    ) : (
                      "Post"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
        {currentTab === "activity" && (
          <div className="flex flex-col items-center justify-center py-12">
            <Heart className="h-16 w-16 text-gray-400 dark:text-zinc-500 mb-4" />
            <p className="text-gray-500 dark:text-zinc-400 text-sm font-medium">
              Activity feed coming soon...
            </p>
          </div>
        )}
        {currentTab === "profile" && (
          <div className="flex flex-col items-center justify-center py-12">
            <User className="h-16 w-16 text-gray-400 dark:text-zinc-500 mb-4" />
            <p className="text-gray-500 dark:text-zinc-400 text-sm font-medium">
              Profile page coming soon...
            </p>
          </div>
        )}
      </main>

      <InstagramBottomNav
        activeTab={currentTab}
        onTabChange={handleTabChange}
        showCreateTab={!!authUser && isHomeRoute}
      />

      {currentStory && (
        <StoryViewer
          story={currentStory}
          onClose={closeStory}
          onNext={nextStory}
          onPrev={prevStory}
        />
      )}
    </div>
  );
};

export default Index;