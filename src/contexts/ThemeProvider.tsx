
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

type Theme = 'dark' | 'light' | 'system';
type AccentColor = 'teal' | 'blue' | 'purple' | 'pink' | 'orange' | 'green';

type ThemeProviderProps = {
  children: ReactNode;
};

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
  applyTheme: (theme: Theme, accent: AccentColor) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  setTheme: () => null,
  accentColor: 'teal',
  setAccentColor: () => null,
  applyTheme: () => null,
});

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [accentColor, setAccentColor] = useState<AccentColor>('teal');

  // Load theme and accent color from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedAccentColor = localStorage.getItem('accentColor') as AccentColor;
    
    if (savedTheme) {
      setTheme(savedTheme);
    }
    
    if (savedAccentColor) {
      setAccentColor(savedAccentColor);
    }
  }, []);

  // Apply theme and accent color
  const applyTheme = (newTheme: Theme, newAccentColor: AccentColor) => {
    // Save to state
    setTheme(newTheme);
    setAccentColor(newAccentColor);
    
    // Save to localStorage
    localStorage.setItem('theme', newTheme);
    localStorage.setItem('accentColor', newAccentColor);
    
    // Apply theme to root element
    if (newTheme === 'dark' || (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    
    // Apply accent color
    applyAccentColorToRoot(newAccentColor);
  };
  
  // Function to apply accent color CSS variables
  const applyAccentColorToRoot = (color: AccentColor) => {
    let accentHue = "164"; // Teal default
    let accentSaturation = "70%";
    let accentLightness = "58%";
    
    switch (color) {
      case "teal":
        accentHue = "164";
        accentSaturation = "70%";
        accentLightness = "58%";
        break;
      case "blue":
        accentHue = "217";
        accentSaturation = "91%";
        accentLightness = "70%";
        break;
      case "purple":
        accentHue = "259";
        accentSaturation = "94%";
        accentLightness = "61%";
        break;
      case "pink":
        accentHue = "330";
        accentSaturation = "90%";
        accentLightness = "66%";
        break;
      case "orange":
        accentHue = "24";
        accentSaturation = "95%";
        accentLightness = "63%";
        break;
      case "green":
        accentHue = "142";
        accentSaturation = "71%";
        accentLightness = "45%";
        break;
    }
    
    document.documentElement.style.setProperty('--accent-hue', accentHue);
    document.documentElement.style.setProperty('--accent-saturation', accentSaturation);
    document.documentElement.style.setProperty('--accent-lightness', accentLightness);
  };

  // Apply theme whenever it changes
  useEffect(() => {
    applyTheme(theme, accentColor);
  }, [theme, accentColor]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, accentColor, setAccentColor, applyTheme }}>
      <NextThemesProvider attribute="class" defaultTheme={theme} enableSystem>
        {children}
      </NextThemesProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
