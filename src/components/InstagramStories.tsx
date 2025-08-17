// // src/components/intagramStories.tsx

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
      return "ring-2 ring-gray-300 dark:ring-zinc-600";
    }
    if (story.hasNewStory && !story.isViewed) {
      return "ring-2 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[2px]";
    }
    return "ring-2 ring-gray-300 dark:ring-zinc-600";
  };

  return (
    <div className="flex flex-col items-center space-y-1.5 min-w-[80px]">
      <div
        className={`relative rounded-full cursor-pointer transition-transform hover:scale-105 ${getRingClass()}`}
        onClick={handleClick}
      >
        <Avatar className="h-16 w-16 sm:h-20 sm:w-20 ring-2 ring-white dark:ring-zinc-900">
          <AvatarImage
            src={story.userImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${story.username}`}
            alt={story.username}
          />
          <AvatarFallback className="bg-gray-200 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 text-sm sm:text-base">
            {story.isYourStory ? "+" : story.username[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {story.isYourStory && (
          <div className="absolute -bottom-1 -right-1 bg-indigo-500 dark:bg-indigo-600 rounded-full p-1.5 shadow-md">
            <Plus className="h-4 w-4 text-white" />
          </div>
        )}
      </div>
      <span className="text-xs text-gray-600 dark:text-zinc-400 text-center truncate w-16 sm:w-20 font-medium">
        {story.isYourStory ? "Your Story" : story.username}
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
    <div className="border-b border-gray-200 dark:border-zinc-800 py-4 bg-white dark:bg-zinc-900">
      <ScrollArea className="w-full">
        <div className="flex space-x-4 px-4 sm:px-6">
          {stories.map((story) => (
            <StoryAvatar key={story.id} story={story} onViewStory={onViewStory} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};