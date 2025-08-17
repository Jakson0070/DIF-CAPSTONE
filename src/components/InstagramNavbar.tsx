import { Camera, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

interface InstagramNavbarProps {
  notificationCount?: number;
}

export const InstagramNavbar = ({ notificationCount = 0 }: InstagramNavbarProps) => {
  return (
    <div className="sticky top-0 bg-white/95 dark:bg-zinc-900/95 border-b border-gray-200 dark:border-zinc-800 z-50 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 max-w-[935px] mx-auto">
        {/* Camera Icon (Left) */}
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-xl text-gray-900 dark:text-zinc-100 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200"
          aria-label="Open camera"
        >
          <Camera className="h-8 w-8" />
        </Button>

        {/* Instagram Logo (Center) */}
        <div className="flex items-center justify-center flex-1">
          {/* Light mode logo */}
          <img
            src="/Instagram Logo.png"
            alt="Instagram Logo"
            className="h-12 w-auto dark:hidden"
          />
          {/* Dark mode logo */}
          <img
            src="/Instagram Light.png"
            alt="Instagram Logo Light"
            className="h-12 w-auto hidden dark:block"
          />
        </div>

        {/* Send Message Icon (Right) */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-xl text-gray-900 dark:text-zinc-100 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200 relative"
            aria-label="Direct messages"
          >
            <Send className="h-8 w-8" />
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};