import { Button } from "@/components/ui/button";
import { SettingsIcon, BellIcon } from "lucide-react";

interface HafalanHeaderProps {
  title?: string;
  username?: string;
  showSettings?: boolean;
  onSettingsClick?: () => void;
  className?: string;
}

export function HafalanHeader({
  title = "Hafalan Quran",
  username = "Unknown",
  showSettings = true,
  onSettingsClick,
  className,
}: HafalanHeaderProps) {
  return (
    <header className={`p-4 flex justify-between items-center ${className}`}>
      <div className="flex items-center space-x-4">
        <div>
          <h1 className="text-xl font-bold">{title}</h1>
          <p className="text-sm text-muted-foreground">Bismillah</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon">
          <BellIcon className="h-5 w-5" />
        </Button>
        {showSettings && (
          <Button variant="ghost" size="icon" onClick={onSettingsClick}>
            <SettingsIcon className="h-5 w-5" />
          </Button>
        )}
      </div>
    </header>
  );
}
