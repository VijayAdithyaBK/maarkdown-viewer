
import React, { createContext, useContext, useState, useEffect } from "react";

type FontFamily = "sans" | "serif" | "mono" | "display";
type BackgroundColor = "white" | "dark" | "cream";
type FontWeight = 300 | 400 | 500 | 600 | 700;

interface ThemeContextProps {
  fontSize: number;
  fontFamily: FontFamily;
  backgroundColor: BackgroundColor;
  blueLightFilter: number;
  fontWeight: FontWeight;
  letterSpacing: number;
  lineHeight: number;
  setFontSize: (size: number) => void;
  setFontFamily: (family: FontFamily) => void;
  setBackgroundColor: (color: BackgroundColor) => void;
  setBlueLightFilter: (intensity: number) => void;
  setFontWeight: (weight: FontWeight) => void;
  setLetterSpacing: (spacing: number) => void;
  setLineHeight: (height: number) => void;
}

const defaultTheme: Omit<ThemeContextProps, 
  "setFontSize" | "setFontFamily" | "setBackgroundColor" | "setBlueLightFilter" | 
  "setFontWeight" | "setLetterSpacing" | "setLineHeight"> = {
  fontSize: 16,
  fontFamily: "sans",
  backgroundColor: "white",
  blueLightFilter: 0,
  fontWeight: 400,
  letterSpacing: 0,
  lineHeight: 1.5,
};

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Updated color map to use black instead of blue for dark mode
// Improved contrast for dark mode to ensure button and code block visibility
export const backgroundColorMap = {
  "white": "bg-white text-gray-800",
  "dark": "bg-gray-900 text-gray-100 dark", // Added 'dark' class for better targeting
  "cream": "bg-[#FEF7CD] text-gray-800",
};

export const fontFamilyMap = {
  "sans": "font-sans",
  "serif": "font-serif",
  "mono": "font-mono",
  "display": "font-display",
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to load saved theme preferences from localStorage
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem("markdown-theme");
      return savedTheme ? JSON.parse(savedTheme) : defaultTheme;
    } catch (error) {
      console.error("Error loading theme from localStorage:", error);
      return defaultTheme;
    }
  });

  // Save theme changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("markdown-theme", JSON.stringify(theme));
    } catch (error) {
      console.error("Error saving theme to localStorage:", error);
    }
  }, [theme]);

  const setFontSize = (size: number) => {
    setTheme((prev: any) => ({ ...prev, fontSize: size }));
  };

  const setFontFamily = (family: FontFamily) => {
    setTheme((prev: any) => ({ ...prev, fontFamily: family }));
  };

  const setBackgroundColor = (color: BackgroundColor) => {
    setTheme((prev: any) => ({ ...prev, backgroundColor: color }));
    
    // Apply theme to document body - with improved error handling
    if (backgroundColorMap[color]) {
      try {
        // Reset all classes first
        document.body.className = '';
        
        const bgClasses = backgroundColorMap[color].split(' ');
        if (bgClasses && bgClasses.length > 0) {
          // Apply each class individually
          bgClasses.forEach(cls => {
            if (cls) document.body.classList.add(cls);
          });
          
          // Update buttons and code blocks styling based on theme
          if (color === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      } catch (error) {
        console.error("Error applying background color:", error);
      }
    }
  };

  const setBlueLightFilter = (intensity: number) => {
    setTheme((prev: any) => ({ ...prev, blueLightFilter: intensity }));
    
    // Apply blue light filter globally - improved implementation
    try {
      const filterValue = intensity > 0 
        ? `sepia(${intensity * 0.4}) brightness(1.1) saturate(${1 - intensity * 0.5})` 
        : 'none';
        
      document.documentElement.style.filter = filterValue;
      
      // Add class to body for easier targeting with CSS if needed
      if (intensity > 0) {
        const intensityClass = intensity < 0.3 
          ? 'blue-light-filter-low' 
          : intensity < 0.7 
            ? 'blue-light-filter-medium' 
            : 'blue-light-filter-high';
            
        document.body.classList.add(intensityClass);
        
        // Remove other filter classes
        ['blue-light-filter-low', 'blue-light-filter-medium', 'blue-light-filter-high']
          .filter(c => c !== intensityClass)
          .forEach(c => document.body.classList.remove(c));
      } else {
        // Remove all filter classes
        document.body.classList.remove(
          'blue-light-filter-low', 
          'blue-light-filter-medium', 
          'blue-light-filter-high'
        );
      }
    } catch (error) {
      console.error("Error applying blue light filter:", error);
    }
  };

  const setFontWeight = (weight: FontWeight) => {
    setTheme((prev: any) => ({ ...prev, fontWeight: weight }));
    
    // Apply font weight to the document to affect all headings
    try {
      document.documentElement.style.setProperty('--heading-font-weight', weight.toString());
      
      // Also update any existing elements directly
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach(heading => {
        (heading as HTMLElement).style.fontWeight = weight.toString();
      });
    } catch (error) {
      console.error("Error applying font weight to headings:", error);
    }
  };

  const setLetterSpacing = (spacing: number) => {
    setTheme((prev: any) => ({ ...prev, letterSpacing: spacing }));
  };

  const setLineHeight = (height: number) => {
    setTheme((prev: any) => ({ ...prev, lineHeight: height }));
  };

  // Ensure all theme values have defaults to prevent undefined errors
  const themeValue = {
    fontSize: theme.fontSize ?? defaultTheme.fontSize,
    fontFamily: theme.fontFamily ?? defaultTheme.fontFamily,
    backgroundColor: theme.backgroundColor ?? defaultTheme.backgroundColor,
    blueLightFilter: theme.blueLightFilter ?? defaultTheme.blueLightFilter,
    fontWeight: theme.fontWeight ?? defaultTheme.fontWeight,
    letterSpacing: theme.letterSpacing ?? defaultTheme.letterSpacing,
    lineHeight: theme.lineHeight ?? defaultTheme.lineHeight,
    setFontSize,
    setFontFamily,
    setBackgroundColor,
    setBlueLightFilter,
    setFontWeight,
    setLetterSpacing,
    setLineHeight,
  };

  // Apply theme on initial load and when theme changes
  useEffect(() => {
    // Only call these functions with valid theme values
    if (themeValue.backgroundColor) {
      setBackgroundColor(themeValue.backgroundColor);
    }
    if (themeValue.blueLightFilter !== undefined) {
      setBlueLightFilter(themeValue.blueLightFilter);
    }
    if (themeValue.fontWeight) {
      setFontWeight(themeValue.fontWeight);
    }
  }, []);

  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
    </ThemeContext.Provider>
  );
};
