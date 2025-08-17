import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [theme, setTheme] = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="ml-2"
    >
      {theme === "dark" ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
    </Button>
  );
}
