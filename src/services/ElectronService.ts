
/**
 * Service for interacting with Electron APIs
 * Provides a consistent interface for both Electron and web environments
 */
export class ElectronService {
  /**
   * Check if running in Electron
   */
  static isElectron(): boolean {
    return !!window.electron?.isElectron;
  }

  /**
   * Export data to file
   */
  static async exportData(data: string): Promise<{ success: boolean; filePath?: string; error?: string }> {
    if (this.isElectron()) {
      return await window.electron!.exportData(data);
    } else {
      try {
        // Fallback for web: download as file
        const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(data)}`;
        const exportFileDefaultName = `milk-center-backup-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        return { success: true };
      } catch (error) {
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error during export'
        };
      }
    }
  }

  /**
   * Import data from file
   */
  static async importData(): Promise<{ success: boolean; data?: string; error?: string }> {
    if (this.isElectron()) {
      return await window.electron!.importData();
    } else {
      return { success: false, error: 'Import via dialog is only available in Electron app' };
    }
  }

  /**
   * Save log to file
   */
  static async saveLog(logData: string): Promise<{ success: boolean; path?: string; error?: string }> {
    if (this.isElectron()) {
      return await window.electron!.saveLog(logData);
    } else {
      try {
        // Fallback for web: download as file
        const dataUri = `data:text/plain;charset=utf-8,${encodeURIComponent(logData)}`;
        const filename = `app-log-${new Date().toISOString().replace(/:/g, '-')}.txt`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', filename);
        linkElement.click();
        
        return { success: true };
      } catch (error) {
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error during log save'
        };
      }
    }
  }

  /**
   * Get app version
   */
  static async getAppVersion(): Promise<string> {
    if (this.isElectron()) {
      return await window.electron!.appInfo.getVersion();
    } else {
      return 'web-version'; // Fallback for web
    }
  }

  /**
   * Get system info
   */
  static async getSystemInfo(): Promise<Record<string, any> | null> {
    if (this.isElectron()) {
      return await window.electron!.appInfo.getSystemInfo();
    } else {
      return null; // Not available in web
    }
  }

  /**
   * Open external URL
   */
  static async openExternal(url: string): Promise<boolean> {
    if (this.isElectron()) {
      return await window.electron!.system.openExternal(url);
    } else {
      try {
        window.open(url, '_blank', 'noopener,noreferrer');
        return true;
      } catch (error) {
        console.error('Error opening external URL:', error);
        return false;
      }
    }
  }

  /**
   * Copy text to clipboard
   */
  static async copyToClipboard(text: string): Promise<boolean> {
    if (this.isElectron()) {
      return await window.electron!.system.copyToClipboard(text);
    } else {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        return false;
      }
    }
  }

  /**
   * Check if running on a specific platform
   */
  static async isPlatform(platform: 'win32' | 'darwin' | 'linux'): Promise<boolean> {
    if (this.isElectron()) {
      return await window.electron!.system.isPlatform(platform);
    } else {
      return false; // Not running in Electron
    }
  }
}
