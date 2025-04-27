
interface ElectronAPI {
  exportData: (data: string) => Promise<{ success: boolean; filePath?: string }>;
  importData: () => Promise<{ success: boolean; data?: string }>;
  isElectron: boolean;
  onMenuExportData: (callback: () => void) => void;
  onMenuImportData: (callback: () => void) => void;
}

declare interface Window {
  electron?: ElectronAPI;
}
