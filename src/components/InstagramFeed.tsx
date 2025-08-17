// //src/components/InstagramFeed.tsx
import { useState } from "react";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CommentModal } from "./CommentModal";
import { Post } from "@/hooks/useInstagram";

interface PostCardProps {
  post: Post;
  onToggleLike: (postId: string, isLiked: boolean) => void;
  onToggleSave: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
}

const PostCard = ({ post, onToggleLike, onToggleSave, onAddComment }: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const handleLike = async () => {
    if (likeLoading) return;
    setLikeLoading(true);
    await onToggleLike(post.id, post.isLiked);
    setLikeLoading(false);
  };

  const handleSave = () => {
    onToggleSave(post.id);
  };

  const handleComment = (text: string) => {
    onAddComment(post.id, text);
  };

  return (
    <>
      <Card className="w-full max-w-[614px] mx-auto border border-gray-200 dark:border-zinc-800 shadow-sm rounded-xl overflow-hidden bg-white dark:bg-zinc-900">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 border-2 border-indigo-200 dark:border-indigo-800">
              <AvatarImage
                src={post.userImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.username}`}
                alt={post.username}
              />
              <AvatarFallback className="bg-gray-200 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 text-xs">
                {post.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold text-gray-900 dark:text-zinc-100">
              {post.username}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-600 dark:text-zinc-400 hover:bg-indigo-50 dark:hover:bg-indigo-900 rounded-full"
          >
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>

        <CardContent className="p-0">
          <div className="aspect-square bg-gray-100 dark:bg-zinc-800 relative overflow-hidden">
            <img
              src={post.postImage}
              alt="Post"
              className="w-full h-full object-cover transition-opacity hover:opacity-90"
              loading="lazy"
            />
          </div>

          <div className="px-4 py-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 p-0 hover:scale-110 transition-transform"
                  onClick={handleLike}
                  disabled={likeLoading}
                >
                  <Heart
                    className={`h-6 w-6 transition-colors ${
                      post.isLiked
                        ? "fill-red-500 text-red-500"
                        : "text-gray-600 dark:text-zinc-400 hover:text-indigo-500 dark:hover:text-indigo-400"
                    }`}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 p-0 hover:scale-110 transition-transform"
                  onClick={() => setShowComments(true)}
                >
                  <MessageCircle className="h-6 w-6 text-gray-600 dark:text-zinc-400 hover:text-indigo-500 dark:hover:text-indigo-400" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 p-0 hover:scale-110 transition-transform"
                >
                  <Send className="h-6 w-6 text-gray-600 dark:text-zinc-400 hover:text-indigo-500 dark:hover:text-indigo-400" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0 hover:scale-110 transition-transform"
                onClick={handleSave}
              >
                <Bookmark
                  className={`h-6 w-6 transition-colors ${
                    post.isSaved
                      ? "fill-indigo-500 dark:fill-indigo-400 text-indigo-500 dark:text-indigo-400"
                      : "text-gray-600 dark:text-zinc-400 hover:text-indigo-500 dark:hover:text-indigo-400"
                  }`}
                />
              </Button>
            </div>

            <div className="text-sm font-medium text-gray-900 dark:text-zinc-100 mb-2">
              {post.likes} likes
            </div>

            <div className="text-sm text-gray-800 dark:text-zinc-200">
              <span className="font-semibold">{post.username}</span>{" "}
              <span>{post.caption}</span>
            </div>

            {post.comments.length > 0 && (
              <button
                className="text-sm text-gray-500 dark:text-zinc-400 mt-1 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                onClick={() => setShowComments(true)}
              >
                View all {post.comments.length} comments
              </button>
            )}

            <div className="text-xs text-gray-500 dark:text-zinc-400 mt-2">
              {post.timeAgo}
            </div>
          </div>
        </CardContent>
      </Card>

      <CommentModal
        post={post}
        isOpen={showComments}
        onClose={() => setShowComments(false)}
      />
    </>
  );
};

interface InstagramFeedProps {
  posts: Post[];
  onToggleLike: (postId: string, isLiked: boolean) => void;
  onToggleSave: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
}

export const InstagramFeed = ({ posts, onToggleLike, onToggleSave, onAddComment }: InstagramFeedProps) => {
  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onToggleLike={onToggleLike}
          onToggleSave={onToggleSave}
          onAddComment={onAddComment}
        />
      ))}
    </div>
  );
};