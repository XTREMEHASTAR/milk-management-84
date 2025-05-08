
import React from 'react';
import { Label } from '@/components/ui/label';

const COLOR_PRESETS = [
  { name: "Indigo", value: "#8B5CF6" },
  { name: "Pink", value: "#D946EF" },
  { name: "Orange", value: "#F97316" },
  { name: "Blue", value: "#0EA5E9" },
  { name: "Green", value: "#16A34A" },
  { name: "Gray", value: "#3F3F46" }
];

const BACKGROUND_STYLES = [
  { name: "None", value: "none" },
  { name: "Gradient", value: "gradient" },
  { name: "Pattern", value: "pattern" }
];

interface ColorSchemeSelectorProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  selectedBackground: string;
  onBackgroundChange: (style: string) => void;
}

export default function ColorSchemeSelector({
  selectedColor = COLOR_PRESETS[0].value,
  onColorChange,
  selectedBackground = BACKGROUND_STYLES[0].value,
  onBackgroundChange
}: ColorSchemeSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Primary Color</Label>
        <div className="grid grid-cols-6 gap-2 mt-2">
          {COLOR_PRESETS.map(color => (
            <div 
              key={color.value}
              className={`h-8 rounded-md cursor-pointer border-2 ${
                color.value === selectedColor ? 'border-primary' : 'border-transparent'
              }`}
              style={{ backgroundColor: color.value }}
              onClick={() => onColorChange(color.value)}
              title={color.name}
            />
          ))}
        </div>
      </div>
      
      <div>
        <Label>Background Style</Label>
        <div className="grid grid-cols-3 gap-4 mt-2">
          {BACKGROUND_STYLES.map(style => (
            <div 
              key={style.value}
              className={`h-12 rounded-md cursor-pointer border-2 flex items-center justify-center ${
                style.value === selectedBackground ? 'border-primary bg-muted' : 'border-transparent bg-muted/50'
              }`}
              onClick={() => onBackgroundChange(style.value)}
            >
              {style.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
