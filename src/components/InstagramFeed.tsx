import { useState } from "react";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CommentModal } from "./CommentModal";
import { Post } from "@/hooks/useInstagram";

interface PostCardProps {
  post: Post;
  onToggleLike: (postId: string) => void;
  onToggleSave: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
}

const PostCard = ({ post, onToggleLike, onToggleSave, onAddComment }: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    onToggleLike(post.id);
  };

  const handleSave = () => {
    onToggleSave(post.id);
  };

  const handleComment = (text: string) => {
    onAddComment(post.id, text);
  };

  return (
    <>
      <Card className="w-full max-w-md mx-auto border-0 shadow-none">
        <div className="flex items-center justify-between p-4 pb-0">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.userImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.username}`} />
              <AvatarFallback className="bg-muted text-xs">
                {post.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{post.username}</span>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        
        <CardContent className="p-0">
          <div className="aspect-square bg-muted overflow-hidden">
            <img
              src={post.postImage}
              alt="Post"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 p-0 hover:scale-110 transition-transform"
                  onClick={handleLike}
                >
                  <Heart className={`h-6 w-6 transition-colors ${
                    post.isLiked ? 'fill-red-500 text-red-500' : 'hover:text-muted-foreground'
                  }`} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 p-0 hover:scale-110 transition-transform"
                  onClick={() => setShowComments(true)}
                >
                  <MessageCircle className="h-6 w-6 hover:text-muted-foreground" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 p-0 hover:scale-110 transition-transform"
                >
                  <Send className="h-6 w-6 hover:text-muted-foreground" />
                </Button>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 p-0 hover:scale-110 transition-transform"
                onClick={handleSave}
              >
                <Bookmark className={`h-6 w-6 transition-colors ${
                  post.isSaved ? 'fill-current' : 'hover:text-muted-foreground'
                }`} />
              </Button>
            </div>
            
            <div className="text-sm font-medium mb-1">
              {post.likes} likes
            </div>
            
            <div className="text-sm">
              <span className="font-medium">{post.username}</span>{" "}
              <span>{post.caption}</span>
            </div>

            {post.comments.length > 0 && (
              <button
                className="text-sm text-muted-foreground mt-1 hover:text-foreground transition-colors"
                onClick={() => setShowComments(true)}
              >
                View all {post.comments.length} comments
              </button>
            )}
            
            <div className="text-xs text-muted-foreground mt-2">
              {post.timeAgo}
            </div>
          </div>
        </CardContent>
      </Card>

      <CommentModal
        post={post}
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        onAddComment={handleComment}
      />
    </>
  );
};

interface InstagramFeedProps {
  posts: Post[];
  onToggleLike: (postId: string) => void;
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