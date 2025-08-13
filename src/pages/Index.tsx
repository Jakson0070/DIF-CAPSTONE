import { useState } from "react";
import { Search, PlusSquare, Heart, User } from "lucide-react";
import { InstagramNavbar } from "@/components/InstagramNavbar";
import { InstagramStories } from "@/components/InstagramStories";
import { InstagramFeed } from "@/components/InstagramFeed";
import { InstagramBottomNav } from "@/components/InstagramBottomNav";
import { StoryViewer } from "@/components/StoryViewer";
import { useInstagram } from "@/hooks/useInstagram";

const Index = () => {
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

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
  };

  return (
    <div className="min-h-screen bg-background">
      <InstagramNavbar notificationCount={notificationCount} />
      
      <main className="max-w-md mx-auto pb-16">
        {currentTab === "home" && (
          <>
            <InstagramStories stories={stories} onViewStory={viewStory} />
            <div className="py-4">
              <InstagramFeed 
                posts={posts}
                onToggleLike={toggleLike}
                onToggleSave={toggleSave}
                onAddComment={addComment}
              />
            </div>
          </>
        )}
        
        {currentTab === "search" && (
          <div className="p-8 text-center text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4" />
            <p>Search functionality coming soon...</p>
          </div>
        )}
        
        {currentTab === "create" && (
          <div className="p-8 text-center text-muted-foreground">
            <PlusSquare className="h-12 w-12 mx-auto mb-4" />
            <p>Create post functionality coming soon...</p>
          </div>
        )}
        
        {currentTab === "activity" && (
          <div className="p-8 text-center text-muted-foreground">
            <Heart className="h-12 w-12 mx-auto mb-4" />
            <p>Activity feed coming soon...</p>
          </div>
        )}
        
        {currentTab === "profile" && (
          <div className="p-8 text-center text-muted-foreground">
            <User className="h-12 w-12 mx-auto mb-4" />
            <p>Profile page coming soon...</p>
          </div>
        )}
      </main>
      
      <InstagramBottomNav 
        activeTab={currentTab} 
        onTabChange={handleTabChange}
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
