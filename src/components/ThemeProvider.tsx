
import React, { createContext, useContext, useState, useEffect } from "react";

type FontFamily = "sans" | "serif" | "mono" | "display";
type BackgroundColor = "white" | "dark" | "cream";
type FontWeight = 300 | 400 | 500 | 600 | 700;

interface ThemeContextProps {
  fontSize: number;
  fontFamily: FontFamily;
  backgroundColor: BackgroundColor;
  fontWeight: FontWeight;
  letterSpacing: number;
  lineHeight: number;
  setFontSize: (size: number) => void;
  setFontFamily: (family: FontFamily) => void;
  setBackgroundColor: (color: BackgroundColor) => void;
  setFontWeight: (weight: FontWeight) => void;
  setLetterSpacing: (spacing: number) => void;
  setLineHeight: (height: number) => void;
  resetTheme: () => void;
}

const defaultTheme: Omit<ThemeContextProps,
  "setFontSize" | "setFontFamily" | "setBackgroundColor" |
  "setFontWeight" | "setLetterSpacing" | "setLineHeight" | "resetTheme"> = {
  fontSize: 16,
  fontFamily: "sans",
  backgroundColor: "white",
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

// Updated color map to use proper button contrast in dark mode
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
    // Theme is now applied only to preview pane via MarkdownViewer component
    // No global document.body changes
  };

  const resetTheme = () => {
    setTheme(defaultTheme);
    // Theme is applied only to preview pane - no global DOM cleanup needed
  };



  const setFontWeight = (weight: FontWeight) => {
    setTheme((prev: any) => ({ ...prev, fontWeight: weight }));
    // CSS variable for headings is handled better in the viewer component or via global CSS
    document.documentElement.style.setProperty('--heading-font-weight', weight.toString());
  };

  const setLetterSpacing = (spacing: number) => {
    setTheme((prev: any) => ({ ...prev, letterSpacing: spacing }));
  };

  const setLineHeight = (height: number) => {
    setTheme((prev: any) => ({ ...prev, lineHeight: height }));
  };

  const themeValue = {
    ...theme,
    fontSize: theme.fontSize ?? defaultTheme.fontSize,
    fontFamily: theme.fontFamily ?? defaultTheme.fontFamily,
    backgroundColor: theme.backgroundColor ?? defaultTheme.backgroundColor,
    fontWeight: theme.fontWeight ?? defaultTheme.fontWeight,
    letterSpacing: theme.letterSpacing ?? defaultTheme.letterSpacing,
    lineHeight: theme.lineHeight ?? defaultTheme.lineHeight,

    setFontSize,
    setFontFamily,
    setBackgroundColor,
    setFontWeight,
    setLetterSpacing,
    setLineHeight,
    resetTheme,
  };

  // Theme values are consumed by MarkdownViewer for preview pane only
  // No global DOM manipulation needed on initial load

  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
    </ThemeContext.Provider>
  );
};
