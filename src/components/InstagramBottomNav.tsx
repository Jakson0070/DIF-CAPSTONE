import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Search, PlusSquare, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface InstagramBottomNavProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  showCreateTab?: boolean;
}

export const InstagramBottomNav = ({
  activeTab = "home",
  onTabChange,
  showCreateTab = true,
}: InstagramBottomNavProps) => {
  const [currentTab, setCurrentTab] = useState(activeTab);
  const navigate = useNavigate();

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    onTabChange?.(tab);
    if (tab === "home") {
      navigate("/");
    } else if (tab === "profile") {
      navigate("/profile");
    } else if (tab === "search") {
      navigate("/search");
    }
  };

  const tabs = [
    { id: "home", icon: Home, label: "Home" },
    { id: "search", icon: Search, label: "Search" },
    ...(showCreateTab ? [{ id: "create", icon: PlusSquare, label: "Create" }] : []),
    { id: "activity", icon: Heart, label: "Activity" },
    { id: "profile", icon: null, label: "Profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-t border-gray-200 dark:border-zinc-800 z-50">
      <div className="flex items-center justify-around py-3 max-w-[935px] mx-auto px-4 sm:px-6">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            size="icon"
            className={`h-12 w-12 rounded-xl transition-all duration-200 ${
              currentTab === tab.id
                ? "text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
                : "text-gray-500 dark:text-zinc-400 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
            }`}
            onClick={() => handleTabChange(tab.id)}
            aria-label={tab.label}
          >
            {tab.icon ? (
              <tab.icon
                className={`h-6 w-6 ${
                  currentTab === tab.id ? "fill-current" : ""
                }`}
              />
            ) : (
              <Avatar className="h-7 w-7 border-2 border-indigo-200 dark:border-indigo-800">
                <AvatarImage
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                  alt="Profile"
                />
                <AvatarFallback className="bg-gray-200 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 text-xs">
                  U
                </AvatarFallback>
              </Avatar>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};