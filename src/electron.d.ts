
interface ElectronAPI {
  exportData: (data: string) => Promise<{ success: boolean; filePath?: string }>;
  importData: () => Promise<{ success: boolean; data?: string }>;
  isElectron: boolean;
}

declare interface Window {
  electron?: ElectronAPI;
}
