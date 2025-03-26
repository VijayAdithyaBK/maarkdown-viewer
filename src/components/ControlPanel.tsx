
import React, { useState, useEffect } from "react";
import { Settings, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { useTheme, backgroundColorMap, fontFamilyMap } from "./ThemeProvider";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export const ControlPanel: React.FC = () => {
  const { 
    fontSize, 
    setFontSize, 
    fontFamily, 
    setFontFamily, 
    backgroundColor, 
    setBackgroundColor,
    blueLightFilter,
    setBlueLightFilter,
    fontWeight,
    setFontWeight,
    letterSpacing,
    setLetterSpacing,
    lineHeight,
    setLineHeight
  } = useTheme();
  
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Listen for fullscreen change to hide control panel
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  // Hide control panel in fullscreen mode
  if (isFullScreen) {
    return null;
  }

  const handleFontSizeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 12) {
      setFontSize(value);
    }
  };

  const increaseFontSize = () => {
    setFontSize(fontSize + 1);
  };

  const decreaseFontSize = () => {
    if (fontSize > 12) {
      setFontSize(fontSize - 1);
    }
  };

  const increaseFontWeight = () => {
    const weights: number[] = [300, 400, 500, 600, 700];
    const currentIndex = weights.indexOf(fontWeight);
    if (currentIndex < weights.length - 1) {
      setFontWeight(weights[currentIndex + 1] as 300 | 400 | 500 | 600 | 700);
    }
  };

  const decreaseFontWeight = () => {
    const weights: number[] = [300, 400, 500, 600, 700];
    const currentIndex = weights.indexOf(fontWeight);
    if (currentIndex > 0) {
      setFontWeight(weights[currentIndex - 1] as 300 | 400 | 500 | 600 | 700);
    }
  };

  const increaseLetterSpacing = () => {
    setLetterSpacing(Math.min(10, letterSpacing + 0.5));
  };

  const decreaseLetterSpacing = () => {
    setLetterSpacing(Math.max(-2, letterSpacing - 0.5));
  };

  const increaseLineHeight = () => {
    setLineHeight(Math.min(3, lineHeight + 0.1));
  };

  const decreaseLineHeight = () => {
    setLineHeight(Math.max(1, lineHeight - 0.1));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 rounded-full h-10 w-10 sm:h-12 sm:w-12 shadow-lg hover:shadow-xl transition-all duration-300 border-2 z-10"
        >
          <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 sm:w-72 p-3 animate-zoom-in glass-effect">
        <ScrollArea className="h-[340px] pr-3">
          <div className="space-y-3">
            <h3 className="font-medium text-base mb-1">Reading Settings</h3>
            
            <Separator className="my-1" />
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">Font Size</Label>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={decreaseFontSize}
                    disabled={fontSize <= 12}
                    className="h-6 w-6"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  
                  <Input 
                    type="number" 
                    value={fontSize} 
                    onChange={handleFontSizeInputChange}
                    min={12}
                    className="w-12 h-6 text-center text-xs p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={increaseFontSize}
                    className="h-6 w-6"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">Font Weight</Label>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={decreaseFontWeight}
                    disabled={fontWeight <= 300}
                    className="h-6 w-6"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  
                  <div className="w-12 h-6 text-center text-xs flex items-center justify-center">
                    {fontWeight}
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={increaseFontWeight}
                    disabled={fontWeight >= 700}
                    className="h-6 w-6"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">Letter Spacing</Label>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={decreaseLetterSpacing}
                    disabled={letterSpacing <= -2}
                    className="h-6 w-6"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  
                  <div className="w-12 h-6 text-center text-xs flex items-center justify-center">
                    {letterSpacing.toFixed(1)}
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={increaseLetterSpacing}
                    disabled={letterSpacing >= 10}
                    className="h-6 w-6"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">Line Height</Label>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={decreaseLineHeight}
                    disabled={lineHeight <= 1}
                    className="h-6 w-6"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  
                  <div className="w-12 h-6 text-center text-xs flex items-center justify-center">
                    {lineHeight.toFixed(1)}
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={increaseLineHeight}
                    disabled={lineHeight >= 3}
                    className="h-6 w-6"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
              <Label className="text-xs font-medium">Font Style</Label>
              <div className="space-y-1">
                <div 
                  className={`font-style-option font-sans ${fontFamily === 'sans' ? 'selected' : ''}`}
                  onClick={() => setFontFamily('sans')}
                >
                  <span className="text-xs">Sans Serif</span>
                </div>
                <div 
                  className={`font-style-option font-serif ${fontFamily === 'serif' ? 'selected' : ''}`}
                  onClick={() => setFontFamily('serif')}
                >
                  <span className="text-xs">Serif</span>
                </div>
                <div 
                  className={`font-style-option font-mono ${fontFamily === 'mono' ? 'selected' : ''}`}
                  onClick={() => setFontFamily('mono')}
                >
                  <span className="text-xs">Monospace</span>
                </div>
                <div 
                  className={`font-style-option font-display ${fontFamily === 'display' ? 'selected' : ''}`}
                  onClick={() => setFontFamily('display')}
                >
                  <span className="text-xs">Display</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
              <Label className="text-xs font-medium">Theme</Label>
              <div className="grid grid-cols-3 gap-1">
                {Object.entries(backgroundColorMap).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => setBackgroundColor(key as any)}
                    className={`w-full h-8 rounded-md ${value.split(' ')[0]} border transition-transform ${
                      backgroundColor === key ? 'ring-1 ring-primary scale-105' : 'ring-0 hover:scale-105'
                    }`}
                    aria-label={`Set background color to ${key}`}
                    title={key}
                  />
                ))}
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">Blue Light Filter</Label>
                <span className="text-xs">{Math.round(blueLightFilter * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={blueLightFilter}
                onChange={(e) => setBlueLightFilter(parseFloat(e.target.value))}
                className="w-full h-1.5"
              />
            </div>
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
