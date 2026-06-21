import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";

interface ThemeToggleProps {
  size?: "sm" | "default";
  className?: string;
}

const ThemeToggle = ({ size = "sm", className = "" }: ThemeToggleProps) => {
  const { theme, toggle } = useTheme();

  return (
    <Button
      variant="ghost"
      size={size === "sm" ? "icon" : "icon"}
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={`w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground transition-colors ${className}`}
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </Button>
  );
};

export { ThemeToggle };
export default ThemeToggle;
