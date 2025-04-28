
interface ElectronAPI {
  exportData: (data: string) => Promise<{ success: boolean; filePath?: string }>;
  importData: () => Promise<{ success: boolean; data?: string }>;
  isElectron: boolean;
  onMenuExportData: (callback: () => void) => void;
  onMenuImportData: (callback: () => void) => void;
  appInfo: {
    getVersion: () => Promise<string>;
    getPlatform: () => string;
  };
  updates: {
    checkForUpdates: () => Promise<boolean>;
    downloadUpdate: () => Promise<boolean>;
    installUpdate: () => Promise<void>;
  };
}

declare interface Window {
  electron?: ElectronAPI;
}
