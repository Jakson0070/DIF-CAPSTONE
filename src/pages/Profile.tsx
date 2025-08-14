import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Grid3X3, 
  Bookmark, 
  User, 
  Settings, 
  MoreHorizontal,
  MapPin,
  Link,
  Camera,
  Plus,
  MessageCircle,
  UserPlus,
  ChevronDown
} from "lucide-react";
import { InstagramNavbar } from "@/components/InstagramNavbar";
import { InstagramBottomNav } from "@/components/InstagramBottomNav";
import { useInstagram } from "@/hooks/useInstagram";

export default function Profile() {
  const { posts, stories } = useInstagram();
  const [activeTab, setActiveTab] = useState("posts");
  const [followersCount, setFollowersCount] = useState(1234);
  const [followingCount, setFollowingCount] = useState(567);
  const [isFollowing, setIsFollowing] = useState(false);

  const profileData = {
    username: "johndoe",
    displayName: "John Doe",
    bio: "✨ Content Creator\n📍 San Francisco, CA\n🎨 Digital Artist & Designer\n📧 hello@johndoe.com",
    website: "johndoe.com",
    postsCount: posts.length,
    isVerified: true,
    isPrivate: false,
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=johndoe",
  };

  const highlights = [
    { id: "1", title: "Travel", image: "https://picsum.photos/100/100?random=10", stories: 5 },
    { id: "2", title: "Food", image: "https://picsum.photos/100/100?random=11", stories: 8 },
    { id: "3", title: "Work", image: "https://picsum.photos/100/100?random=12", stories: 3 },
    { id: "4", title: "Art", image: "https://picsum.photos/100/100?random=13", stories: 12 },
    { id: "5", title: "Events", image: "https://picsum.photos/100/100?random=14", stories: 6 },
  ];

  const savedPosts = [
    { id: "s1", image: "https://picsum.photos/400/400?random=20", isVideo: false },
    { id: "s2", image: "https://picsum.photos/400/400?random=21", isVideo: true },
    { id: "s3", image: "https://picsum.photos/400/400?random=22", isVideo: false },
  ];

  const taggedPosts = [
    { id: "t1", image: "https://picsum.photos/400/400?random=30", isVideo: false },
    { id: "t2", image: "https://picsum.photos/400/400?random=31", isVideo: false },
  ];

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    setFollowersCount(prev => isFollowing ? prev - 1 : prev + 1);
  };

  const renderPostGrid = (postsData: any[]) => (
    <div className="grid grid-cols-3 gap-1">
      {postsData.map((post) => (
        <div key={post.id} className="aspect-square relative bg-muted">
          <img
            src={typeof post.image === 'string' ? post.image : post.postImage}
            alt="Post"
            className="w-full h-full object-cover"
          />
          {post.isVideo && (
            <div className="absolute top-2 right-2">
              <Camera className="h-4 w-4 text-white" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors cursor-pointer" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <InstagramNavbar notificationCount={5} />
      
      <main className="pt-16 pb-20 max-w-md mx-auto">
        {/* Profile Header */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profileData.profileImage} />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 ml-6">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-xl font-semibold">{profileData.username}</h1>
                {profileData.isVerified && (
                  <Badge variant="secondary" className="text-xs px-1">✓</Badge>
                )}
              </div>
              
              <div className="flex gap-4 text-sm mb-3">
                <span><strong>{profileData.postsCount}</strong> posts</span>
                <span><strong>{followersCount}</strong> followers</span>
                <span><strong>{followingCount}</strong> following</span>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant={isFollowing ? "outline" : "default"} 
                  size="sm" 
                  className="flex-1"
                  onClick={handleFollowToggle}
                >
                  {isFollowing ? "Following" : "Follow"}
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Message
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <UserPlus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="ml-2">
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-1 text-sm">
            <p className="font-semibold">{profileData.displayName}</p>
            <div className="whitespace-pre-line text-muted-foreground">
              {profileData.bio}
            </div>
            {profileData.website && (
              <div className="flex items-center gap-1 text-primary">
                <Link className="h-3 w-3" />
                <span className="text-sm">{profileData.website}</span>
              </div>
            )}
          </div>
        </div>

        {/* Highlights */}
        <div className="px-4 py-2">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {highlights.map((highlight) => (
              <div key={highlight.id} className="flex flex-col items-center min-w-0">
                <div className="h-16 w-16 rounded-full border-2 border-border p-0.5 mb-1">
                  <img
                    src={highlight.image}
                    alt={highlight.title}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <span className="text-xs text-center truncate w-16">{highlight.title}</span>
              </div>
            ))}
            <div className="flex flex-col items-center min-w-0">
              <div className="h-16 w-16 rounded-full border-2 border-dashed border-muted-foreground/50 flex items-center justify-center mb-1">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <span className="text-xs text-center text-muted-foreground">New</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-12 bg-transparent border-t border-border">
            <TabsTrigger 
              value="posts" 
              className="data-[state=active]:border-t-2 data-[state=active]:border-primary rounded-none h-full"
            >
              <Grid3X3 className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger 
              value="saved" 
              className="data-[state=active]:border-t-2 data-[state=active]:border-primary rounded-none h-full"
            >
              <Bookmark className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger 
              value="tagged" 
              className="data-[state=active]:border-t-2 data-[state=active]:border-primary rounded-none h-full"
            >
              <User className="h-5 w-5" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-0">
            {posts.length > 0 ? (
              renderPostGrid(posts)
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <Camera className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No posts yet</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved" className="mt-0">
            {savedPosts.length > 0 ? (
              renderPostGrid(savedPosts)
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <Bookmark className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No saved posts</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="tagged" className="mt-0">
            {taggedPosts.length > 0 ? (
              renderPostGrid(taggedPosts)
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <User className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No tagged posts</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <InstagramBottomNav activeTab="profile" />
    </div>
  );
}
