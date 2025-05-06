
import { useState, useEffect } from 'react';
import { UISettings } from '@/types';

const defaultUISettings: UISettings = {
  theme: "light",
  accentColor: "teal",
  sidebarStyle: "default",
  sidebarColor: "default",
  tableStyle: "default",
  compactMode: false,
  paymentReminders: true,
  lowStockAlerts: true
};

export function useUISettingsState() {
  const [uiSettings, setUISettings] = useState<UISettings>(() => {
    try {
      const saved = localStorage.getItem("uiSettings");
      return saved ? JSON.parse(saved) : defaultUISettings;
    } catch (error) {
      console.error("Error loading UI settings:", error);
      return defaultUISettings;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("uiSettings", JSON.stringify(uiSettings));
      
      // Apply theme to document
      if (uiSettings.theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      
    } catch (error) {
      console.error("Error saving UI settings:", error);
    }
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
