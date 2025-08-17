//src/components/CommentModal.tsx
import { useState, useRef } from 'react';
import { Send, Heart, MessageCircle, Share } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Post, Comment } from '@/hooks/useInstagram';
import { useInstagram } from '@/hooks/useInstagram';
import { useToast } from '@/hooks/use-toast';

interface CommentModalProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
}

interface CommentDialogProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
}

export const CommentModal = ({ post, isOpen, onClose }: CommentModalProps) => {
  const { toggleLike, toggleSave, addComment } = useInstagram();
  const { toast } = useToast();
  const [showCommentDialog, setShowCommentDialog] = useState(false);

  const [likeLoading, setLikeLoading] = useState(false);

  const handleLike = async () => {
    if (likeLoading) return;
    setLikeLoading(true);
    await toggleLike(post.id, post.isLiked);
    setLikeLoading(false);
  };

  const handleCommentClick = () => {
    setShowCommentDialog(true); // Open the comment dialog
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl w-full h-[80vh] p-0 overflow-hidden bg-white dark:bg-zinc-950">
            <DialogHeader>
              <DialogTitle>Comments</DialogTitle>
              <DialogDescription>View and add comments for this post.</DialogDescription>
            </DialogHeader>
          {/* Header */}
          <div className="flex items-center p-4 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.userImage} alt={`${post.username}'s profile picture`} />
              <AvatarFallback className="bg-gray-200 dark:bg-zinc-700 text-xs">
                {post.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="ml-3 text-sm font-semibold text-gray-900 dark:text-zinc-100">
              {post.username}
            </span>
          </div>

          {/* Post Content */}
          <div className="flex flex-col h-[calc(80vh-56px)] bg-black">
            <div className="flex items-center justify-center w-full" style={{ maxHeight: '60vh', minHeight: '300px', overflow: 'hidden' }}>
              <img
                src={post.postImage}
                alt={`${post.username}'s post`}
                className="max-h-full max-w-full object-contain"
                style={{ maxHeight: '60vh', width: 'auto', height: 'auto' }}
              />
            </div>
            {/* Caption below image, above actions */}
            <div className="px-4 pt-2 bg-white dark:bg-zinc-900">
              <div className="text-sm text-gray-900 dark:text-zinc-100">
                <span className="font-semibold">{post.username}</span> {post.caption}
              </div>
            </div>
            <div className="px-4 pb-2 bg-white dark:bg-zinc-900">
              {/* Actions */}
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLike}
                  aria-label={post.isLiked ? 'Unlike post' : 'Like post'}
                  className="h-8 w-8 p-0 hover:bg-transparent"
                  disabled={likeLoading}
                >
                  <Heart
                    className={`h-6 w-6 transition-colors ${
                      post.isLiked ? 'fill-red-500 text-red-500' : 'text-gray-900 dark:text-zinc-100'
                    }`}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCommentClick}
                  aria-label="View and add comments"
                  className="h-8 w-8 p-0 hover:bg-transparent"
                >
                  <MessageCircle
                    className={`h-6 w-6 ${
                      showCommentDialog ? 'text-blue-500 dark:text-blue-400' : 'text-gray-900 dark:text-zinc-100'
                    }`}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Share post"
                  className="h-8 w-8 p-0 hover:bg-transparent"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href + '?post=' + post.id);
                    toast({ title: 'Post link copied to clipboard!' });
                  }}
                >
                  <Share className="h-6 w-6 text-gray-900 dark:text-zinc-100" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={post.isSaved ? 'Unsave post' : 'Save post'}
                  className="h-8 w-8 p-0 ml-auto hover:bg-transparent"
                  onClick={() => toggleSave(post.id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill={post.isSaved ? 'currentColor' : 'none'}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-6 w-6 text-gray-900 dark:text-zinc-100"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"
                    />
                  </svg>
                </Button>
              </div>
              {/* Likes */}
              <div className="text-sm font-semibold text-gray-900 dark:text-zinc-100 mt-2">
                {post.likes.toLocaleString()} {post.likes === 1 ? 'like' : 'likes'}
              </div>
              {/* Caption */}
              <div className="mt-2 text-sm text-gray-900 dark:text-zinc-100">
                <span className="font-semibold">{post.username}</span> {post.caption}
              </div>
              {/* Timestamp */}
              <div className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                {post.timeAgo}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Comment Dialog */}
      <CommentDialog
        post={post}
        isOpen={showCommentDialog}
        onClose={() => setShowCommentDialog(false)}
      />
    </>
  );
};

const CommentDialog = ({ post, isOpen, onClose }: CommentDialogProps) => {
  const { addComment } = useInstagram();
  const [commentText, setCommentText] = useState('');
  const commentInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      addComment(post.id, commentText);
      setCommentText('');
    }
  };

  // Focus input when dialog opens
  const handleDialogOpenChange = (open: boolean) => {
    if (open) {
      setTimeout(() => {
        commentInputRef.current?.focus();
      }, 0);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="max-w-md w-full p-4 bg-white dark:bg-zinc-900 rounded-lg">
        <DialogHeader>
          <DialogTitle>Post Comments</DialogTitle>
          <DialogDescription>Read and write comments for this post.</DialogDescription>
          <div className="flex items-center space-x-2 mt-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.userImage} alt={`${post.username}'s profile picture`} />
              <AvatarFallback className="bg-gray-200 dark:bg-zinc-700 text-xs">
                {post.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold text-gray-900 dark:text-zinc-100">
              {post.username}
            </span>
          </div>
        </DialogHeader>
        <ScrollArea className="max-h-[50vh] my-4 space-y-4">
          {post.comments.length > 0 ? (
            post.comments.map((comment) => (
              <CommentItem key={comment._id || comment.id} comment={comment} />
            ))
          ) : (
            <div className="text-sm text-gray-500 dark:text-zinc-400 text-center py-4">
              No comments yet
            </div>
          )}
        </ScrollArea>
        <form onSubmit={handleSubmit} className="flex items-center pt-2 border-t border-gray-200 dark:border-zinc-800">
          <Input
            id="comment-input"
            ref={commentInputRef}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 text-sm text-gray-900 dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-400"
            aria-label="Add a comment"
          />
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            disabled={!commentText.trim()}
            className="text-blue-500 disabled:text-gray-300 dark:disabled:text-zinc-600 hover:bg-transparent"
            aria-label="Post comment"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const CommentItem = ({ comment }: { comment: Comment }) => {
  // userId can be string or { _id, username, profilePicture }
  let avatarSrc = '';
  let username = comment.username;
  if (typeof comment.userId === 'object' && comment.userId !== null) {
    avatarSrc = comment.userId.profilePicture || '';
    username = comment.userId.username || comment.username;
  }
  return (
    <div className="flex items-start space-x-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatarSrc} />
        <AvatarFallback className="bg-gray-200 dark:bg-zinc-700 text-xs text-gray-900 dark:text-zinc-100">
          {username?.[0]?.toUpperCase() || '?'}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="text-sm text-gray-900 dark:text-zinc-100">
          <span className="font-semibold">{username}</span> {comment.text}
        </div>
        <div className="flex items-center space-x-4 mt-1">
          <span className="text-xs text-gray-500 dark:text-zinc-400">{comment.timeAgo}</span>
          <Button
            variant="ghost"
            className="h-auto p-0 text-xs text-gray-500 dark:text-zinc-400 hover:bg-transparent hover:text-gray-700 dark:hover:text-zinc-200"
            aria-label={`Reply to ${username}'s comment`}
          >
            Reply
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-auto w-auto p-0"
            aria-label="Like comment"
          >
            <Heart className="h-3 w-3 text-gray-500 dark:text-zinc-400" />
          </Button>
        </div>
      </div>
    </div>
  );
};