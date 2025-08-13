import { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Story } from '@/hooks/useInstagram';

interface StoryViewerProps {
  story: Story;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const StoryViewer = ({ story, onClose, onNext, onPrev }: StoryViewerProps) => {
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const duration = 5000; // 5 seconds per story
    const interval = 50; // Update every 50ms
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          onNext();
          return 0;
        }
        return prev + increment;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isPaused, onNext]);

  const handlePause = () => setIsPaused(true);
  const handleResume = () => setIsPaused(false);

  const storyImage = story.storyImages[0] || "https://picsum.photos/400/600?random=" + story.id;

  return (
    <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center">
      <div className="relative w-full max-w-md h-full bg-black">
        {/* Progress bar */}
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="w-full bg-white/30 rounded-full h-1">
            <div 
              className="bg-white h-1 rounded-full transition-all duration-50 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Header */}
        <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8 ring-2 ring-white">
              <AvatarImage src={story.userImage} />
              <AvatarFallback className="bg-muted text-xs">
                {story.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-white text-sm font-medium">{story.username}</span>
            <span className="text-white/70 text-xs">2h</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white h-8 w-8 hover:bg-white/20"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Story content */}
        <div 
          className="w-full h-full flex items-center justify-center"
          onMouseDown={handlePause}
          onMouseUp={handleResume}
          onTouchStart={handlePause}
          onTouchEnd={handleResume}
        >
          <img
            src={storyImage}
            alt={`${story.username}'s story`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Navigation areas */}
        <div className="absolute inset-0 flex">
          <button
            className="w-1/3 h-full bg-transparent"
            onClick={onPrev}
          />
          <button
            className="w-1/3 h-full bg-transparent"
            onMouseDown={handlePause}
            onMouseUp={handleResume}
            onTouchStart={handlePause}
            onTouchEnd={handleResume}
          />
          <button
            className="w-1/3 h-full bg-transparent"
            onClick={onNext}
          />
        </div>

        {/* Navigation arrows */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white h-10 w-10 hover:bg-white/20"
          onClick={onPrev}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white h-10 w-10 hover:bg-white/20"
          onClick={onNext}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};