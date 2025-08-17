// src/hooks/useInstagram.tsx
import { useState, useCallback, useEffect } from 'react';

export interface Story {
  id: string;
  username: string;
  userImage: string;
  hasNewStory: boolean;
  isViewed: boolean;
  isYourStory?: boolean;
  storyImages: string[];
}

export interface Comment {
  _id: string;
  id: string;
  userId: {
    _id: string;
    username: string;
    profilePicture?: string;
  } | string;
  username: string;
  text: string;
  timeAgo: string;
  createdAt: string;
}

export interface Post {
  id: string;
  _id?: string;
  username: string;
  userImage: string;
  postImage: string;
  mediaUrl?: string;
  likes: number;
  caption: string;
  timeAgo: string;
  isLiked: boolean;
  isSaved: boolean;
  comments: Comment[];
  createdAt?: string;
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

export const useInstagram = () => {
  const [stories, setStories] = useState<Story[]>(initialStories);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to get token
  const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error('No authentication token found');
      setError('Please log in to view posts');
      return null;
    }
    return token;
  };

  // Transform backend post to frontend post format
  const transformPost = (backendPost: any): Post => {
    return {
      id: backendPost._id?.toString() || backendPost.id,
      _id: backendPost._id,
      username: backendPost.userId?.username || backendPost.username || 'Unknown',
      userImage: backendPost.userId?.profilePicture || backendPost.userImage || '',
      postImage: backendPost.mediaUrl || backendPost.postImage || '',
      mediaUrl: backendPost.mediaUrl,
      likes: backendPost.likes || 0,
      caption: backendPost.caption || '',
      timeAgo: backendPost.createdAt
        ? Math.floor((Date.now() - new Date(backendPost.createdAt).getTime()) / (1000 * 60 * 60)) + 'h'
        : backendPost.timeAgo || 'Unknown',
      isLiked: backendPost.isLiked || false,
      isSaved: backendPost.isSaved || false,
      comments: (backendPost.comments || []).map((comment: any) => ({
        _id: comment._id,
        id: comment._id || comment.id,
        userId: comment.userId,
        username: typeof comment.userId === 'object' ? comment.userId.username : comment.username || 'Unknown',
        text: comment.text || comment.content || '',
        timeAgo: comment.createdAt
          ? Math.floor((Date.now() - new Date(comment.createdAt).getTime()) / (1000 * 60)) + 'm'
          : 'now',
        createdAt: comment.createdAt
      })),
      createdAt: backendPost.createdAt
    };
  };

  // Expose fetchPosts for manual refresh
  const fetchPosts = useCallback(async () => {
    console.log('Starting fetchPosts...');
    setLoading(true);
    setError(null);
    
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      console.log('API URL:', apiUrl);
      console.log('Token exists:', !!token);
      
      const res = await fetch(`${apiUrl}/api/posts/feed`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', res.status);
      console.log('Response ok:', res.ok);

      if (res.ok) {
        const data = await res.json();
        console.log('Fetched posts:', data);
        const transformedPosts = data.map(transformPost);
        setPosts(transformedPosts);
        setError(null);
      } else {
        const errorData = await res.json();
        console.error('Failed to fetch posts:', res.status, res.statusText, errorData);
        
        if (res.status === 401) {
          setError('Authentication failed. Please log in again.');
          localStorage.removeItem('token');
        } else if (res.status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(`Error: ${errorData.error || 'Unknown error'}`);
        }
      }
    } catch (err: any) {
      console.error('Error fetching posts:', err);
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchPosts();
    } else {
      console.log('No token found, skipping initial fetch');
    }
  }, [fetchPosts]);

  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  const toggleLike = useCallback(async (postId: string, isCurrentlyLiked: boolean) => {
    console.log(`Toggling like for postId=${postId}, isCurrentlyLiked=${isCurrentlyLiked}`);

    const token = getToken();
    if (!token) return;

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/api/interactions/like`, {
        method: isCurrentlyLiked ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postId }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Like request failed: status=${response.status}, error=${JSON.stringify(errorData)}`);
        if (errorData && errorData.error && errorData.error.includes('Already liked')) {
          await fetchPosts();
        }
        return;
      }
      
      console.log(`Like request successful for postId=${postId}`);
      await fetchPosts();
    } catch (err) {
      console.error(`Failed to toggle like for postId=${postId}:`, err);
    }
  }, [fetchPosts]);

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
    if (currentIndex > 1) {
      const prevStoryData = stories[currentIndex - 1];
      setCurrentStory(prevStoryData);
      setCurrentStoryIndex(0);
    }
  }, [currentStory, stories]);

  const addComment = useCallback(async (postId: string, text: string) => {
    const token = getToken();
    if (!token) return;

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/api/interactions/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postId, text }),
      });
      
      if (res.ok) {
        const data = await res.json();
        // Optimistically add the new comment to the relevant post
        setPosts(prevPosts => prevPosts.map(post => {
          if (post.id === postId) {
            const newComment = {
              _id: data._id,
              id: data._id,
              userId: data.userId || { username: 'You' },
              username: (typeof data.userId === 'object' && data.userId.username) || 'You',
              text,
              timeAgo: 'now',
              createdAt: data.createdAt || new Date().toISOString(),
            };
            return { ...post, comments: [...post.comments, newComment] };
          }
          return post;
        }));
        // Optionally, you can refetch later or on modal close for sync
        // fetchPosts();
      } else {
        const errorData = await res.json();
        console.error('Failed to add comment:', errorData);
      }
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  }, [fetchPosts]);

  return {
    stories,
    posts,
    currentStory,
    currentStoryIndex,
    loading,
    error,
    toggleLike,
    toggleSave,
    viewStory,
    closeStory,
    nextStory,
    prevStory,
    addComment,
    refetchPosts: fetchPosts,
  };
}