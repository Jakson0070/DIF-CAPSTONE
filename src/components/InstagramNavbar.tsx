import { Heart, MessageCircle, PlusSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InstagramNavbarProps {
  notificationCount?: number;
}

export const InstagramNavbar = ({ notificationCount = 0 }: InstagramNavbarProps) => {
  return (
    <div className="sticky top-0 bg-background border-b border-border z-50 backdrop-blur-sm bg-background/95">
      <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto">
        <div 
          className="text-2xl font-bold bg-gradient-to-r from-[hsl(45_100%_51%)] via-[hsl(315_100%_50%)] to-[hsl(262_83%_58%)] bg-clip-text text-transparent cursor-pointer"
          style={{ fontFamily: 'Billabong, cursive' }}
        >
          Instagram
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 hover:bg-muted/80 transition-colors"
          >
            <PlusSquare className="h-6 w-6" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 hover:bg-muted/80 transition-colors relative"
          >
            <Heart className="h-6 w-6" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 hover:bg-muted/80 transition-colors"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};