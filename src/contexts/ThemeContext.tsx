import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface ColorPreset {
  name: string;
  colors: string[];
}

interface ThemeContextType {
  colorPreset: string;
  setColorPreset: (preset: string) => void;
  isDark: boolean;
  toggleDark: () => void;
  colorPresets: Record<string, ColorPreset>;
}

export const colorPresets: Record<string, ColorPreset> = {
  coral: { name: 'Coral', colors: ['#f97316', '#ec4899', '#f43f5e'] },
  ocean: { name: 'Ocean', colors: ['#0ea5e9', '#06b6d4', '#14b8a6'] },
  forest: { name: 'Forest', colors: ['#22c55e', '#10b981', '#84cc16'] },
  sunset: { name: 'Sunset', colors: ['#f59e0b', '#ef4444', '#f97316'] },
  lavender: { name: 'Lavender', colors: ['#a855f7', '#8b5cf6', '#ec4899'] },
  midnight: { name: 'Midnight', colors: ['#6366f1', '#8b5cf6', '#1e293b'] },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [colorPreset, setColorPresetState] = useState<string>(() => {
    const saved = localStorage.getItem('colorPreset');
    return saved || 'coral';
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('isDark');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('colorPreset', colorPreset);
    const preset = colorPresets[colorPreset];
    if (preset) {
      document.documentElement.style.setProperty('--color-primary', preset.colors[0]);
      document.documentElement.style.setProperty('--color-secondary', preset.colors[1]);
      document.documentElement.style.setProperty('--color-accent', preset.colors[2]);
    }
  }, [colorPreset]);

  useEffect(() => {
    localStorage.setItem('isDark', String(isDark));
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const setColorPreset = (preset: string) => {
    if (colorPresets[preset]) {
      setColorPresetState(preset);
    }
  };

  const toggleDark = () => {
    setIsDark(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ colorPreset, setColorPreset, isDark, toggleDark, colorPresets }}>
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
