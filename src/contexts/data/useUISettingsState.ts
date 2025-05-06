
import { useState, useEffect, useCallback } from 'react';
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
    } catch (error) {
      console.error("Error saving UI settings:", error);
    }
  }, [uiSettings]);

  const updateUISettings = useCallback((settings: Partial<UISettings>) => {
    setUISettings(prev => ({
      ...prev,
      ...settings
    }));
  }, []);

  return {
    uiSettings,
    updateUISettings
  };
}
