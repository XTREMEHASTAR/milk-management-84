
import { useState, useEffect } from 'react';
import { UISettings } from '@/types';

const defaultUISettings: UISettings = {
  theme: "dark",
  accentColor: "purple",
  sidebarStyle: "gradient",
  sidebarColor: "purple",
  tableStyle: "striped",  // Changed from "modern" to "striped"
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
      
      // Apply accent color as CSS variable
      let accentHue = "259"; // Purple default
      let accentSaturation = "94%";
      let accentLightness = "61%"; // Increased from 51% for better visibility
      
      switch (uiSettings.accentColor) {
        case "teal":
          accentHue = "164";
          accentSaturation = "70%"; // Increased from 54%
          accentLightness = "58%"; // Increased from 48%
          break;
        case "blue":
          accentHue = "217";
          accentSaturation = "91%";
          accentLightness = "70%"; // Increased from 60%
          break;
        case "purple":
          accentHue = "259";
          accentSaturation = "94%";
          accentLightness = "61%"; // Increased from 51%
          break;
        case "pink":
          accentHue = "330";
          accentSaturation = "90%";
          accentLightness = "66%"; // Increased from 56%
          break;
        case "orange":
          accentHue = "24";
          accentSaturation = "95%";
          accentLightness = "63%"; // Increased from 53%
          break;
      }
      
      document.documentElement.style.setProperty('--accent-hue', accentHue);
      document.documentElement.style.setProperty('--accent-saturation', accentSaturation);
      document.documentElement.style.setProperty('--accent-lightness', accentLightness);
      
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
