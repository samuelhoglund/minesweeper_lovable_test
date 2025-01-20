import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type Theme = {
  unexploredTile: string;
  exploredTile: string;
  name?: string;
};

const presetThemes: Theme[] = [
  {
    name: "Classic",
    unexploredTile: "#8E9196",
    exploredTile: "#f3f3f3"
  },
  {
    name: "Purple",
    unexploredTile: "#9b87f5",
    exploredTile: "#D6BCFA"
  },
  {
    name: "Pastel",
    unexploredTile: "#F2FCE2",
    exploredTile: "#FEF7CD"
  }
];

interface MinesweeperThemeSettingsProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const MinesweeperThemeSettings = ({
  currentTheme,
  onThemeChange
}: MinesweeperThemeSettingsProps) => {
  const [customMode, setCustomMode] = React.useState(false);

  const handleThemeChange = (themeName: string) => {
    if (themeName === "custom") {
      setCustomMode(true);
      return;
    }
    
    setCustomMode(false);
    const theme = presetThemes.find(t => t.name === themeName);
    if (theme) {
      onThemeChange(theme);
    }
  };

  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Theme Settings</h3>
      
      <RadioGroup
        defaultValue="Classic"
        onValueChange={handleThemeChange}
        className="grid gap-4"
      >
        {presetThemes.map((theme) => (
          <div key={theme.name} className="flex items-center space-x-2">
            <RadioGroupItem value={theme.name || ""} id={theme.name} />
            <Label htmlFor={theme.name} className="flex items-center gap-2">
              {theme.name}
              <div className="flex gap-1">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: theme.unexploredTile }}
                />
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: theme.exploredTile }}
                />
              </div>
            </Label>
          </div>
        ))}
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="custom" id="custom" />
          <Label htmlFor="custom">Custom</Label>
        </div>
      </RadioGroup>

      {customMode && (
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="unexplored">Unexplored Tile Color</Label>
            <Input
              id="unexplored"
              type="color"
              value={currentTheme.unexploredTile}
              onChange={(e) =>
                onThemeChange({
                  ...currentTheme,
                  unexploredTile: e.target.value
                })
              }
              className="h-10 w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="explored">Explored Tile Color</Label>
            <Input
              id="explored"
              type="color"
              value={currentTheme.exploredTile}
              onChange={(e) =>
                onThemeChange({
                  ...currentTheme,
                  exploredTile: e.target.value
                })
              }
              className="h-10 w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MinesweeperThemeSettings;