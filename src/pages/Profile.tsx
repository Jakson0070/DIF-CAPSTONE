// src/pages/Profile.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  Grid3X3,
  Bookmark,
  User,
  Plus,
  Camera,
  MessageCircle,
  UserPlus,
} from "lucide-react";
import { InstagramNavbar } from "@/components/InstagramNavbar";
import { InstagramBottomNav } from "@/components/InstagramBottomNav";
import { useInstagram } from "@/hooks/useInstagram";
import { useAuthUser } from "@/hooks/useAuthUser";
import ProfileEditForm from "@/components/ProfileEditForm";
import { useParams } from "react-router-dom";
import { CommentModal } from "@/components/CommentModal";

export default function Profile() {
  const { posts, stories, toggleLike } = useInstagram();
  const authUser = useAuthUser();
  const { username } = useParams<{ username?: string }>();
  const [activeTab, setActiveTab] = useState("posts");
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [profileUser, setProfileUser] = useState<any>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);

  // Fetch if current user is following the profile user
  useEffect(() => {
    const checkIsFollowing = async () => {
      if (!authUser || !profileUser || !profileUser._id || !authUser._id) {
        setIsFollowing(false);
        return;
      }
      const apiUrl = import.meta.env.VITE_API_URL;
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${apiUrl}/api/interactions/followers/${profileUser._id}/is-following`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setIsFollowing(!!data.isFollowing);
        } else {
          setIsFollowing(false);
        }
      } catch {
        setIsFollowing(false);
      }
    };
    checkIsFollowing();
  }, [authUser, profileUser]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const apiUrl = import.meta.env.VITE_API_URL;
        let res;
        if (username) {
          res = await fetch(`${apiUrl}/api/auth/profile/${username}`);
        } else {
          res = await fetch(`${apiUrl}/api/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
        if (res.ok) {
          const data = await res.json();
          setProfileUser(data);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [username]);

  const user = profileUser || authUser;

  // Mock highlights array for demonstration. Replace with real data as needed.
  const highlights = user?.highlights || [
    {
      id: '1',
      title: 'Welcome',
      image: user?.profilePicture || user?.profileImage || 'https://placehold.co/80x80',
    },
  ];

  const profileData = {
    username: user?.username || "",
    displayName: user?.displayName || user?.username || "",
    bio: user?.bio || "",
    website: user?.website || "",
    postsCount: userPosts.length,
    isVerified: user?.isVerified || false,
    isPrivate: user?.isPrivate || false,
    profileImage: user?.profilePicture || user?.profileImage || "",
  };  const fetchFollowersCount = async () => {
    const userId = user && (user._id || user.id);
    if (!userId) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/api/interactions/followers/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setFollowersCount(data.followersCount || 0);
      }
    } catch (e) {
      setFollowersCount(0);
    }
  };

  const fetchFollowingCount = async () => {
    const userId = user && (user._id || user.id);
    if (!userId) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/api/interactions/followers/following/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setFollowingCount(data.followingCount || 0);
      }
    } catch (e) {
      setFollowingCount(0);
    }
  };

  useEffect(() => {
    fetchFollowersCount();
  }, [user]);

  useEffect(() => {
    fetchFollowingCount();
  }, [user]);
  // const [userPosts, setUserPosts] = useState<any[]>([]);

// src/pages/Profile.tsx
const fetchUserPosts = async () => {
  if (!user || !user._id) return;
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    const res = await fetch(`${apiUrl}/api/posts/user/${user._id}`);
    if (res.ok) {
      const data = await res.json();
      // Transform posts to match Post interface
      const transformedPosts = data.map((post: any) => ({
        ...post,
        id: post.id || post._id.toString(),
        toggleLike: (id: string, isLiked: boolean) => toggleLike(id, isLiked),
        username: post.userId?.username || 'Unknown',
        userImage: post.userId?.profilePicture || '',
        postImage: post.mediaUrl || '',
        likes: post.likes || 0,
        caption: post.caption || '',
        timeAgo: post.createdAt
          ? Math.floor((Date.now() - new Date(post.createdAt).getTime()) / (1000 * 60 * 60)) + 'h'
          : 'Unknown',
        isLiked: post.isLiked || false,
        isSaved: post.isSaved || false,
        comments: post.comments || [],
      }));
      setUserPosts(transformedPosts);
    } else {
      console.error('Failed to fetch user posts:', res.status, res.statusText);
      setUserPosts([]);
    }
  } catch (err) {
    console.error('Error fetching user posts:', err);
    setUserPosts([]);
  }
};

useEffect(() => {
  fetchUserPosts();
}, [user]);

  const savedPosts = [
    { id: "s1", image: "https://picsum.photos/400/400?random=20", isVideo: false },
    { id: "s2", image: "https://picsum.photos/400/400?random=21", isVideo: true },
    { id: "s3", image: "https://picsum.photos/400/400?random=22", isVideo: false },
  ];

  const taggedPosts = [
    { id: "t1", image: "https://picsum.photos/400/400?random=30", isVideo: false },
    { id: "t2", image: "https://picsum.photos/400/400?random=31", isVideo: false },
  ];

  const handleFollowToggle = async () => {
    const token = localStorage.getItem("token");
    if (!user || !user._id) return;
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      let res;
      if (isFollowing) {
        res = await fetch(`${apiUrl}/api/interactions/follow`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ followedId: user._id }),
        });
      } else {
        res = await fetch(`${apiUrl}/api/interactions/follow`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ followedId: user._id }),
        });
      }
      if (res.ok) {
        setIsFollowing(!isFollowing);
        await fetchFollowersCount();
        await fetchFollowingCount();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update follow status");
      }
    } catch (e) {
      alert("Network error while updating follow status");
    }
  };

  // State for modal
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  // Handler to open modal
  const handleOpenPostModal = (post: any) => {
    setSelectedPost(post);
    setIsPostModalOpen(true);
  };
  const handleClosePostModal = () => {
    setIsPostModalOpen(false);
    setSelectedPost(null);
  };

  const handleAddComment = async (text: string) => {
    if (!selectedPost) return;
    // Add the comment via the hook
    await useInstagram().addComment(selectedPost.id, text);
    // Refetch user posts to get latest comments
    await fetchUserPosts();
    // Find the updated post
    const refreshed = userPosts.find((p) => p.id === selectedPost.id);
    if (refreshed) setSelectedPost(refreshed);
  };

  // Render grid
  const renderPostGrid = (postsData: any[]) => (
    <div className="grid grid-cols-3 gap-1">
      {postsData.map((post, idx) => (
        <div key={post.id || post._id || idx} className="aspect-square relative bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
          {post.mediaUrl || post.image || post.postImage ? (
            <img
              src={post.mediaUrl || post.image || post.postImage}
              alt="Post"
              className="w-full h-full object-cover transition-opacity hover:opacity-90 cursor-pointer"
            />
          ) : (
            <span className="text-gray-500 dark:text-zinc-400 text-center p-2 w-full break-words">
              {post.text || post.caption || "No image"}
            </span>
          )}
          {post.isVideo && (
            <div className="absolute top-2 right-2">
              <Camera className="h-5 w-5 text-white drop-shadow-md" />
            </div>
          )}
          <div
            className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-200 cursor-pointer"
            onClick={() => { console.log('Post clicked', post); handleOpenPostModal(post); }}
          />
        </div>
      ))}
    </div>
  );

  // Prepare post object for modal
  const modalPost = selectedPost
    ? {
          ...selectedPost,
          postImage: selectedPost.mediaUrl || selectedPost.image || selectedPost.postImage,
          userImage: profileUser?.profileImage || '',
          username: profileUser?.username || '',
          comments: selectedPost.comments || [],
          likes: selectedPost.likes || 0,
          isLiked: selectedPost.isLiked || false,
          timeAgo: selectedPost.timeAgo || '',
      }
    : null;

  return (
    <>
      <div className="min-h-screen bg-gray-100 dark:bg-zinc-950 transition-colors duration-300">
      <InstagramNavbar notificationCount={5} />

      <main className="pt-16 pb-20 max-w-[935px] mx-auto px-4 sm:px-6">
        {loading ? (
          <div className="flex justify-center items-center h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            {/* Profile Header */}
            <div className="py-6 sm:py-8">
              <div className="flex flex-col sm:flex-row sm:items-start gap-6 sm:gap-10">
                <div className="flex-shrink-0">
                  <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-2 border-indigo-500 dark:border-indigo-400">
                    <AvatarImage src={profileData.profileImage} />
                    <AvatarFallback className="bg-gray-200 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 text-xl sm:text-2xl">
                      {profileData.displayName
                        ? profileData.displayName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)
                        : profileData.username?.slice(0, 2).toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-zinc-100">
                        {profileData.username}
                      </h1>
                      {profileData.isVerified && (
                        <Badge
                          variant="secondary"
                          className="bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs px-1.5"
                        >
                          ✓
                        </Badge>
                      )}
                    </div>
                    {authUser && authUser._id === profileUser?._id && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-200 hover:bg-indigo-50 dark:hover:bg-indigo-900 rounded-xl"
                        onClick={() => setEditMode((m) => !m)}
                      >
                        {editMode ? "Cancel" : "Edit Profile"}
                      </Button>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex gap-6 sm:gap-10 text-sm text-gray-900 dark:text-zinc-100 mb-4">
                    <div className="text-center">
                      <strong className="font-semibold">{profileData.postsCount}</strong>{" "}
                      <span className="text-gray-600 dark:text-zinc-400">posts</span>
                    </div>
                    <div className="text-center">
                      <strong className="font-semibold">{followersCount}</strong>{" "}
                      <span className="text-gray-600 dark:text-zinc-400">followers</span>
                    </div>
                    <div className="text-center">
                      <strong className="font-semibold">{followingCount}</strong>{" "}
                      <span className="text-gray-600 dark:text-zinc-400">following</span>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-2 text-sm">
                    <p className="font-medium text-gray-900 dark:text-zinc-100">
                      {profileData.displayName}
                    </p>
                    <div className="text-gray-600 dark:text-zinc-400 whitespace-pre-line">
                      {profileData.bio}
                    </div>
                    {profileData.website && (
                      <div className="flex items-center gap-1.5 text-indigo-500 dark:text-indigo-400">
                        <a
                          href={profileData.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm hover:underline"
                        >
                          {profileData.website.replace(/^https?:\/\//, "")}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {authUser && profileUser && authUser._id !== profileUser._id && (
                    <div className="flex gap-3 mt-4">
                      <Button
                        variant={isFollowing ? "outline" : "default"}
                        size="sm"
                        className={`flex-1 rounded-xl ${
                          isFollowing
                            ? "border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-200 hover:bg-indigo-50 dark:hover:bg-indigo-900"
                            : "bg-indigo-500 dark:bg-indigo-600 text-white hover:bg-indigo-600 dark:hover:bg-indigo-700"
                        }`}
                        onClick={handleFollowToggle}
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-200 hover:bg-indigo-50 dark:hover:bg-indigo-900 rounded-xl"
                      >
                        Message
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-200 hover:bg-indigo-50 dark:hover:bg-indigo-900 rounded-xl"
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {editMode && (
                <div className="mt-6">
                  <ProfileEditForm onSuccess={() => setEditMode(false)} />
                </div>
              )}
            </div>

            {/* Highlights */}
            <div className="py-4">
              <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
                {highlights.map((highlight, idx) => (
                  <div key={highlight.id || idx} className="flex flex-col items-center min-w-0">
                    <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full border-2 border-indigo-200 dark:border-indigo-800 p-0.5 mb-1 relative group">
                      <img
                        src={highlight.image}
                        alt={highlight.title}
                        className="w-full h-full rounded-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <span className="text-xs text-gray-600 dark:text-zinc-400 text-center truncate w-16 sm:w-20">
                      {highlight.title}
                    </span>
                  </div>
                ))}
                <div className="flex flex-col items-center min-w-0">
                  <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full border-2 border-dashed border-gray-300 dark:border-zinc-600 flex items-center justify-center mb-1">
                    <Plus className="h-6 w-6 text-gray-500 dark:text-zinc-400" />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-zinc-400 text-center">New</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-12 bg-transparent border-t border-gray-200 dark:border-zinc-800">
                <TabsTrigger
                  value="posts"
                  className="data-[state=active]:border-t-2 data-[state=active]:border-indigo-500 dark:data-[state=active]:border-indigo-400 data-[state=active]:text-indigo-500 dark:data-[state=active]:text-indigo-400 rounded-none h-full text-gray-600 dark:text-zinc-400"
                >
                  <Grid3X3 className="h-5 w-5" />
                </TabsTrigger>
                <TabsTrigger
                  value="saved"
                  className="data-[state=active]:border-t-2 data-[state=active]:border-indigo-500 dark:data-[state=active]:border-indigo-400 data-[state=active]:text-indigo-500 dark:data-[state=active]:text-indigo-400 rounded-none h-full text-gray-600 dark:text-zinc-400"
                >
                  <Bookmark className="h-5 w-5" />
                </TabsTrigger>
                <TabsTrigger
                  value="tagged"
                  className="data-[state=active]:border-t-2 data-[state=active]:border-indigo-500 dark:data-[state=active]:border-indigo-400 data-[state=active]:text-indigo-500 dark:data-[state=active]:text-indigo-400 rounded-none h-full text-gray-600 dark:text-zinc-400"
                >
                  <User className="h-5 w-5" />
                </TabsTrigger>
              </TabsList>

              <TabsContent value="posts" className="mt-0">
                {userPosts.length > 0 ? (
                  renderPostGrid(userPosts)
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Camera className="h-12 w-12 text-gray-400 dark:text-zinc-500 mb-4" />
                    <p className="text-gray-500 dark:text-zinc-400 text-sm">No posts yet</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="saved" className="mt-0">
                {savedPosts.length > 0 ? (
                  renderPostGrid(savedPosts)
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Bookmark className="h-12 w-12 text-gray-400 dark:text-zinc-500 mb-4" />
                    <p className="text-gray-500 dark:text-zinc-400 text-sm">No saved posts</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="tagged" className="mt-0">
                {taggedPosts.length > 0 ? (
                  renderPostGrid(taggedPosts)
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <User className="h-12 w-12 text-gray-400 dark:text-zinc-500 mb-4" />
                    <p className="text-gray-500 dark:text-zinc-400 text-sm">No tagged posts</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>

      <InstagramBottomNav activeTab="profile" />
      {modalPost && (
        <CommentModal
          post={modalPost}
          isOpen={isPostModalOpen}
          onClose={handleClosePostModal}
        />
      )}
    </div>
  </>
  );
}