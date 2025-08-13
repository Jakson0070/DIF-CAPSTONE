import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { Story } from "@/hooks/useInstagram";

interface StoryAvatarProps {
  story: Story;
  onViewStory: (storyId: string) => void;
}

const StoryAvatar = ({ story, onViewStory }: StoryAvatarProps) => {
  const handleClick = () => {
    if (!story.isYourStory && story.hasNewStory) {
      onViewStory(story.id);
    }
  };

  const getRingClass = () => {
    if (story.isYourStory) {
      return "ring-1 ring-muted-foreground";
    }
    if (story.hasNewStory && !story.isViewed) {
      return "ring-2 bg-gradient-to-tr from-[hsl(45_100%_51%)] via-[hsl(315_100%_50%)] to-[hsl(262_83%_58%)] p-[2px]";
    }
    return "ring-1 ring-muted-foreground";
  };

  return (
    <div className="flex flex-col items-center space-y-2 min-w-[70px]">
      <div 
        className={`relative rounded-full cursor-pointer transition-transform hover:scale-105 ${getRingClass()}`}
        onClick={handleClick}
      >
        <Avatar className="h-14 w-14 ring-2 ring-background">
          <AvatarImage src={story.userImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${story.username}`} />
          <AvatarFallback className="bg-muted text-sm">
            {story.isYourStory ? "+" : story.username[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {story.isYourStory && (
          <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1">
            <Plus className="h-3 w-3 text-primary-foreground" />
          </div>
        )}
      </div>
      <span className="text-xs text-center max-w-[70px] truncate">
        {story.username}
      </span>
    </div>
  );
};

interface InstagramStoriesProps {
  stories: Story[];
  onViewStory: (storyId: string) => void;
}

export const InstagramStories = ({ stories, onViewStory }: InstagramStoriesProps) => {
  return (
    <div className="border-b border-border pb-4">
      <ScrollArea className="w-full">
        <div className="flex space-x-4 p-4">
          {stories.map((story) => (
            <StoryAvatar key={story.id} story={story} onViewStory={onViewStory} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};