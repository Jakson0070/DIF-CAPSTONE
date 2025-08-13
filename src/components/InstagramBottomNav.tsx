import { useState } from "react";
import { Home, Search, PlusSquare, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface InstagramBottomNavProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const InstagramBottomNav = ({ activeTab = "home", onTabChange }: InstagramBottomNavProps) => {
  const [currentTab, setCurrentTab] = useState(activeTab);

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    onTabChange?.(tab);
  };

  const tabs = [
    { id: "home", icon: Home, label: "Home" },
    { id: "search", icon: Search, label: "Search" },
    { id: "create", icon: PlusSquare, label: "Create" },
    { id: "activity", icon: Heart, label: "Activity" },
    { id: "profile", icon: null, label: "Profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-50">
      <div className="flex items-center justify-around py-2 max-w-md mx-auto">
        {tabs.map((tab) => (
          <Button 
            key={tab.id}
            variant="ghost" 
            size="icon" 
            className={`h-12 w-12 transition-colors ${
              currentTab === tab.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.icon ? (
              <tab.icon className={`h-6 w-6 ${currentTab === tab.id ? 'fill-current' : ''}`} />
            ) : (
              <Avatar className="h-6 w-6">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
                <AvatarFallback className="bg-muted text-xs">
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