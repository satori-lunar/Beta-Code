import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface ColorPreset {
  name: string;
  colors: string[];
  light: string;
  dark: string;
}

interface ThemeContextType {
  colorPreset: string;
  setColorPreset: (preset: string) => void;
  isDark: boolean;
  toggleDark: () => void;
  colorPresets: Record<string, ColorPreset>;
  primaryColor: string;
}

export const colorPresets: Record<string, ColorPreset> = {
  coral: {
    name: 'Coral',
    colors: ['#f97316', '#ec4899', '#f43f5e'],
    light: '#fff7ed',
    dark: '#ea580c'
  },
  ocean: {
    name: 'Ocean',
    colors: ['#0ea5e9', '#06b6d4', '#14b8a6'],
    light: '#f0f9ff',
    dark: '#0284c7'
  },
  forest: {
    name: 'Forest',
    colors: ['#22c55e', '#10b981', '#84cc16'],
    light: '#f0fdf4',
    dark: '#16a34a'
  },
  sunset: {
    name: 'Sunset',
    colors: ['#f59e0b', '#ef4444', '#f97316'],
    light: '#fffbeb',
    dark: '#d97706'
  },
  lavender: {
    name: 'Lavender',
    colors: ['#a855f7', '#8b5cf6', '#ec4899'],
    light: '#faf5ff',
    dark: '#9333ea'
  },
  midnight: {
    name: 'Midnight',
    colors: ['#6366f1', '#8b5cf6', '#818cf8'],
    light: '#eef2ff',
    dark: '#4f46e5'
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [colorPreset, setColorPresetState] = useState<string>(() => {
    const saved = localStorage.getItem('colorPreset');
    return saved || 'coral';
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('isDark');
    // Default to light mode (false) if no saved preference
    return saved === null ? false : saved === 'true';
  });

  const applyTheme = (presetKey: string) => {
    const preset = colorPresets[presetKey];
    if (preset) {
      document.documentElement.style.setProperty('--theme-primary', preset.colors[0]);
      document.documentElement.style.setProperty('--theme-primary-light', preset.light);
      document.documentElement.style.setProperty('--theme-primary-dark', preset.dark);
      document.documentElement.style.setProperty('--theme-secondary', preset.colors[1]);
      document.documentElement.style.setProperty('--theme-accent', preset.colors[2]);
    }
  };

  useEffect(() => {
    localStorage.setItem('colorPreset', colorPreset);
    applyTheme(colorPreset);
  }, [colorPreset]);

  // Apply theme on initial load
  useEffect(() => {
    applyTheme(colorPreset);
  }, []);

  useEffect(() => {
    console.log('isDark changed to:', isDark);
    localStorage.setItem('isDark', String(isDark));
    document.documentElement.classList.toggle('dark', isDark);
    console.log('HTML element classes after toggle:', document.documentElement.className);
    console.log('localStorage isDark:', localStorage.getItem('isDark'));
  }, [isDark]);

  const setColorPreset = (preset: string) => {
    if (colorPresets[preset]) {
      setColorPresetState(preset);
    }
  };

  const toggleDark = () => {
    console.log('toggleDark called - current isDark:', isDark);
    setIsDark(prev => {
      console.log('Setting isDark from', prev, 'to', !prev);
      return !prev;
    });
  };

  const primaryColor = colorPresets[colorPreset]?.colors[0] || '#f97316';

  return (
    <ThemeContext.Provider value={{ colorPreset, setColorPreset, isDark, toggleDark, colorPresets, primaryColor }}>
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
