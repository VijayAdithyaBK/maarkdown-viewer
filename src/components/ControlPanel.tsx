
import React, { useState, useEffect } from "react";
import { Settings, Check, RotateCcw, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { useTheme, backgroundColorMap } from "./ThemeProvider";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Options for all dropdowns
const fontStyleOptions = [
  { value: "sans", label: "Sans Serif" },
  { value: "serif", label: "Serif" },
  { value: "mono", label: "Monospace" },
];

const weightOptions = [
  { value: "300", label: "Light" },
  { value: "400", label: "Regular" },
  { value: "500", label: "Medium" },
  { value: "600", label: "Semibold" },
  { value: "700", label: "Bold" },
];

const lineHeightOptions = [
  { value: "1.2", label: "Compact" },
  { value: "1.5", label: "Normal" },
  { value: "1.8", label: "Relaxed" },
  { value: "2.2", label: "Loose" },
];

const spacingOptions = [
  { value: "-1", label: "Tight" },
  { value: "0", label: "Normal" },
  { value: "1", label: "Wide" },
  { value: "3", label: "Extra Wide" },
];

export const ControlPanel: React.FC<{ portalContainer?: HTMLElement | null }> = ({ portalContainer }) => {
  const {
    fontSize,
    setFontSize,
    fontFamily,
    setFontFamily,
    backgroundColor,
    setBackgroundColor,
    fontWeight,
    setFontWeight,
    letterSpacing,
    setLetterSpacing,
    lineHeight,
    setLineHeight,
    resetTheme
  } = useTheme();

  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  // Font size handlers
  const incrementFontSize = () => setFontSize(Math.min(72, fontSize + 1));
  const decrementFontSize = () => setFontSize(Math.max(8, fontSize - 1));
  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val >= 8 && val <= 72) {
      setFontSize(val);
    }
  };

  // Find closest option
  const getClosestOption = (options: { value: string }[], currentValue: number): string => {
    return options.reduce((prev, curr) =>
      Math.abs(parseFloat(curr.value) - currentValue) < Math.abs(parseFloat(prev.value) - currentValue)
        ? curr : prev
    ).value;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 px-0" title="Reading Settings">
          <Settings className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3" align="end" container={portalContainer}>
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Preferences</h4>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
              onClick={resetTheme}
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset
            </Button>
          </div>

          <Separator />

          {/* Font Style - Inline */}
          <div className="flex items-center justify-between">
            <Label className="text-xs">Font</Label>
            <Select value={fontFamily} onValueChange={(val) => setFontFamily(val as any)}>
              <SelectTrigger className="h-7 w-28 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent container={portalContainer}>
                {fontStyleOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Font Size - Inline */}
          <div className="flex items-center justify-between">
            <Label className="text-xs">Size</Label>
            <div className="flex items-center gap-0.5">
              <Button variant="outline" size="icon" className="h-7 w-7" onClick={decrementFontSize} disabled={fontSize <= 8}>
                <Minus className="h-3 w-3" />
              </Button>
              <Input
                type="number"
                value={fontSize}
                onChange={handleFontSizeChange}
                className="h-7 w-12 text-center text-xs px-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                min={8}
                max={72}
              />
              <Button variant="outline" size="icon" className="h-7 w-7" onClick={incrementFontSize} disabled={fontSize >= 72}>
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Weight - Inline */}
          <div className="flex items-center justify-between">
            <Label className="text-xs">Weight</Label>
            <Select value={String(fontWeight)} onValueChange={(val) => setFontWeight(Number(val) as any)}>
              <SelectTrigger className="h-7 w-28 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent container={portalContainer}>
                {weightOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Line Height - Inline */}
          <div className="flex items-center justify-between">
            <Label className="text-xs">Line Height</Label>
            <Select value={getClosestOption(lineHeightOptions, lineHeight)} onValueChange={(val) => setLineHeight(parseFloat(val))}>
              <SelectTrigger className="h-7 w-28 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent container={portalContainer}>
                {lineHeightOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Letter Spacing - Inline */}
          <div className="flex items-center justify-between">
            <Label className="text-xs">Spacing</Label>
            <Select value={getClosestOption(spacingOptions, letterSpacing)} onValueChange={(val) => setLetterSpacing(parseFloat(val))}>
              <SelectTrigger className="h-7 w-28 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent container={portalContainer}>
                {spacingOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Theme - Inline */}
          <div className="flex items-center justify-between">
            <Label className="text-xs">Theme</Label>
            <div className="flex gap-1.5">
              {Object.entries(backgroundColorMap).map(([key, value]) => {
                const bgClass = value.split(' ')[0];
                const isSelected = backgroundColor === key;
                return (
                  <button
                    key={key}
                    onClick={() => setBackgroundColor(key as any)}
                    className={`
                      h-6 w-6 rounded border flex items-center justify-center transition-all
                      ${bgClass}
                      ${isSelected ? 'ring-2 ring-primary ring-offset-1' : 'hover:ring-1 hover:ring-ring/50'}
                    `}
                    title={key.charAt(0).toUpperCase() + key.slice(1)}
                  >
                    {isSelected && <Check className={`h-3 w-3 ${key === 'dark' ? 'text-white' : 'text-black'}`} />}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </PopoverContent>
    </Popover>
  );
};
