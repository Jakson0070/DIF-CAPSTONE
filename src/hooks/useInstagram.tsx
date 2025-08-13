import { useState, useCallback } from 'react';

export interface Story {
  id: string;
  username: string;
  userImage: string;
  hasNewStory: boolean;
  isViewed: boolean;
  isYourStory?: boolean;
  storyImages: string[];
}

export interface Post {
  id: string;
  username: string;
  userImage: string;
  postImage: string;
  likes: number;
  caption: string;
  timeAgo: string;
  isLiked: boolean;
  isSaved: boolean;
  comments: Comment[];
}

export interface Comment {
  id: string;
  username: string;
  text: string;
  timeAgo: string;
}

const initialStories: Story[] = [
  {
    id: "your-story",
    username: "Your Story",
    userImage: "",
    hasNewStory: false,
    isViewed: false,
    isYourStory: true,
    storyImages: [],
  },
  {
    id: "1",
    username: "johndoe",
    userImage: "",
    hasNewStory: true,
    isViewed: false,
    storyImages: ["https://picsum.photos/400/600?random=1"],
  },
  {
    id: "2",
    username: "jane_smith",
    userImage: "",
    hasNewStory: true,
    isViewed: true,
    storyImages: ["https://picsum.photos/400/600?random=2"],
  },
  {
    id: "3",
    username: "travel_addict",
    userImage: "",
    hasNewStory: true,
    isViewed: false,
    storyImages: ["https://picsum.photos/400/600?random=3"],
  },
];

const initialPosts: Post[] = [
  {
    id: "1",
    username: "johndoe",
    userImage: "",
    postImage: "https://picsum.photos/400/400?random=1",
    likes: 142,
    caption: "Beautiful sunset from my balcony 🌅",
    timeAgo: "2 hours ago",
    isLiked: false,
    isSaved: false,
    comments: [
      { id: "c1", username: "jane_smith", text: "Amazing view! 😍", timeAgo: "1h" },
      { id: "c2", username: "travel_lover", text: "Where is this?", timeAgo: "45m" },
    ],
  },
  {
    id: "2",
    username: "jane_smith",
    userImage: "",
    postImage: "https://picsum.photos/400/400?random=2",
    likes: 89,
    caption: "Weekend vibes ✨ #weekend #relax",
    timeAgo: "4 hours ago",
    isLiked: true,
    isSaved: false,
    comments: [
      { id: "c3", username: "foodie_lover", text: "Love this energy!", timeAgo: "2h" },
    ],
  },
  {
    id: "3",
    username: "travel_addict",
    userImage: "",
    postImage: "https://picsum.photos/400/400?random=3",
    likes: 256,
    caption: "Exploring the mountains today! Nature never fails to amaze me 🏔️",
    timeAgo: "6 hours ago",
    isLiked: false,
    isSaved: true,
    comments: [],
  },
];

export const useInstagram = () => {
  const [stories, setStories] = useState<Story[]>(initialStories);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  const toggleLike = useCallback((postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  }, []);

  const toggleSave = useCallback((postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, isSaved: !post.isSaved }
          : post
      )
    );
  }, []);

  const viewStory = useCallback((storyId: string) => {
    const story = stories.find(s => s.id === storyId);
    if (story) {
      setCurrentStory(story);
      setCurrentStoryIndex(0);
      
      // Mark story as viewed
      setStories(prevStories =>
        prevStories.map(s =>
          s.id === storyId ? { ...s, isViewed: true } : s
        )
      );
    }
  }, [stories]);

  const closeStory = useCallback(() => {
    setCurrentStory(null);
    setCurrentStoryIndex(0);
  }, []);

  const nextStory = useCallback(() => {
    if (!currentStory) return;
    
    const currentIndex = stories.findIndex(s => s.id === currentStory.id);
    if (currentIndex < stories.length - 1) {
      const nextStoryData = stories[currentIndex + 1];
      setCurrentStory(nextStoryData);
      setCurrentStoryIndex(0);
      
      // Mark next story as viewed
      setStories(prevStories =>
        prevStories.map(s =>
          s.id === nextStoryData.id ? { ...s, isViewed: true } : s
        )
      );
    } else {
      closeStory();
    }
  }, [currentStory, stories, closeStory]);

  const prevStory = useCallback(() => {
    if (!currentStory) return;
    
    const currentIndex = stories.findIndex(s => s.id === currentStory.id);
    if (currentIndex > 1) { // Skip "Your Story" at index 0
      const prevStoryData = stories[currentIndex - 1];
      setCurrentStory(prevStoryData);
      setCurrentStoryIndex(0);
    }
  }, [currentStory, stories]);

  const addComment = useCallback((postId: string, text: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      username: "you",
      text,
      timeAgo: "now",
    };

    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      )
    );
  }, []);

  return {
    stories,
    posts,
    currentStory,
    currentStoryIndex,
    toggleLike,
    toggleSave,
    viewStory,
    closeStory,
    nextStory,
    prevStory,
    addComment,
  };
};