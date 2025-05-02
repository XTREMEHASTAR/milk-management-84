
import { useState, useEffect } from 'react';
import { UISettings } from '@/types';

const defaultUISettings: UISettings = {
  theme: "light",
  accentColor: "teal",
  sidebarStyle: "default",
  sidebarColor: "default",
  tableStyle: "default"
};

export function useUISettingsState() {
  const [uiSettings, setUISettings] = useState<UISettings>(() => {
    const saved = localStorage.getItem("uiSettings");
    return saved ? JSON.parse(saved) : defaultUISettings;
  });

  useEffect(() => {
    localStorage.setItem("uiSettings", JSON.stringify(uiSettings));
  }, [uiSettings]);

  const updateUISettings = (settings: Partial<UISettings>) => {
    setUISettings({
      ...uiSettings,
      ...settings
    });
  };

  return {
    uiSettings,
    updateUISettings
  };
}
