import { useState } from 'react';
import { Send, Heart } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Post, Comment } from '@/hooks/useInstagram';

interface CommentModalProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
  onAddComment: (text: string) => void;
}

export const CommentModal = ({ post, isOpen, onClose, onAddComment }: CommentModalProps) => {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onAddComment(commentText);
      setCommentText('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[80vh] p-0 overflow-hidden">
        <div className="flex h-full">
          {/* Post image */}
          <div className="flex-1 bg-black flex items-center justify-center">
            <img
              src={post.postImage}
              alt="Post"
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Comments section */}
          <div className="w-80 flex flex-col">
            {/* Header */}
            <div className="flex items-center p-4 border-b border-border">
              <Avatar className="h-8 w-8">
                <AvatarImage src={post.userImage} />
                <AvatarFallback className="bg-muted text-xs">
                  {post.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="ml-3 text-sm font-medium">{post.username}</span>
            </div>

            {/* Caption */}
            <div className="p-4 border-b border-border">
              <div className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={post.userImage} />
                  <AvatarFallback className="bg-muted text-xs">
                    {post.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="text-sm">
                    <span className="font-medium">{post.username}</span>{" "}
                    <span>{post.caption}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {post.timeAgo}
                  </div>
                </div>
              </div>
            </div>

            {/* Comments */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {post.comments.map((comment) => (
                  <CommentItem key={comment.id} comment={comment} />
                ))}
              </div>
            </ScrollArea>

            {/* Actions and input */}
            <div className="border-t border-border">
              <div className="flex items-center justify-between p-4 pb-2">
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                    <Heart className={`h-6 w-6 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                </div>
              </div>
              
              <div className="px-4 pb-2">
                <div className="text-sm font-medium">
                  {post.likes} likes
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex items-center p-4 pt-2">
                <Input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 border-0 bg-transparent focus-visible:ring-0 text-sm"
                />
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  disabled={!commentText.trim()}
                  className="text-primary disabled:text-muted-foreground"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const CommentItem = ({ comment }: { comment: Comment }) => (
  <div className="flex items-start space-x-3">
    <Avatar className="h-6 w-6">
      <AvatarImage src="" />
      <AvatarFallback className="bg-muted text-xs">
        {comment.username[0].toUpperCase()}
      </AvatarFallback>
    </Avatar>
    <div className="flex-1">
      <div className="text-sm">
        <span className="font-medium">{comment.username}</span>{" "}
        <span>{comment.text}</span>
      </div>
      <div className="flex items-center space-x-4 mt-1">
        <span className="text-xs text-muted-foreground">{comment.timeAgo}</span>
        <Button variant="ghost" className="h-auto p-0 text-xs text-muted-foreground hover:bg-transparent">
          Reply
        </Button>
        <Button variant="ghost" size="icon" className="h-auto w-auto p-0">
          <Heart className="h-3 w-3" />
        </Button>
      </div>
    </div>
  </div>
);