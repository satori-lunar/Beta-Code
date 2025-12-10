import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
}

interface ThemeContextType {
  theme: 'light' | 'dark';
  colors: ThemeColors;
  setTheme: (theme: 'light' | 'dark') => void;
  setColors: (colors: ThemeColors) => void;
  presets: { name: string; colors: ThemeColors }[];
  applyPreset: (preset: string) => void;
}

const defaultColors: ThemeColors = {
  primary: '#f97316', // coral
  secondary: '#84cc16', // sage
  accent: '#0ea5e9', // sky
};

const colorPresets = [
  { name: 'Coral', colors: { primary: '#f97316', secondary: '#84cc16', accent: '#0ea5e9' } },
  { name: 'Ocean', colors: { primary: '#0ea5e9', secondary: '#14b8a6', accent: '#8b5cf6' } },
  { name: 'Forest', colors: { primary: '#22c55e', secondary: '#84cc16', accent: '#f59e0b' } },
  { name: 'Sunset', colors: { primary: '#f43f5e', secondary: '#f97316', accent: '#eab308' } },
  { name: 'Lavender', colors: { primary: '#8b5cf6', secondary: '#ec4899', accent: '#06b6d4' } },
  { name: 'Midnight', colors: { primary: '#6366f1', secondary: '#8b5cf6', accent: '#ec4899' } },
];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  const [colors, setColorsState] = useState<ThemeColors>(() => {
    const saved = localStorage.getItem('themeColors');
    return saved ? JSON.parse(saved) : defaultColors;
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('themeColors', JSON.stringify(colors));
    // Update CSS variables
    document.documentElement.style.setProperty('--color-primary', colors.primary);
    document.documentElement.style.setProperty('--color-secondary', colors.secondary);
    document.documentElement.style.setProperty('--color-accent', colors.accent);
  }, [colors]);

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
  };

  const setColors = (newColors: ThemeColors) => {
    setColorsState(newColors);
  };

  const applyPreset = (presetName: string) => {
    const preset = colorPresets.find(p => p.name === presetName);
    if (preset) {
      setColorsState(preset.colors);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, colors, setTheme, setColors, presets: colorPresets, applyPreset }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
