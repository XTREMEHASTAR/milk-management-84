
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
      try {
        console.log('Exporting data via Electron');
        return await window.electron!.exportData(data);
      } catch (error) {
        console.error('Electron export error:', error);
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error during export' 
        };
      }
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
      try {
        console.log('Importing data via Electron');
        return await window.electron!.importData();
      } catch (error) {
        console.error('Electron import error:', error);
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Error accessing native file dialog' 
        };
      }
    } else {
      return { success: false, error: 'Import via dialog is only available in Electron app' };
    }
  }

  /**
   * Save log to file
   */
  static async saveLog(logData: string): Promise<{ success: boolean; path?: string; error?: string }> {
    if (this.isElectron()) {
      try {
        console.log('Saving log via Electron');
        return await window.electron!.saveLog(logData);
      } catch (error) {
        console.error('Electron log save error:', error);
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Error saving log file' 
        };
      }
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
      try {
        return await window.electron!.appInfo.getVersion();
      } catch (error) {
        console.error('Error getting app version:', error);
        return 'unknown';
      }
    } else {
      return 'web-version'; // Fallback for web
    }
  }

  /**
   * Get system info
   */
  static async getSystemInfo(): Promise<Record<string, any> | null> {
    if (this.isElectron()) {
      try {
        return await window.electron!.appInfo.getSystemInfo();
      } catch (error) {
        console.error('Error getting system info:', error);
        return null;
      }
    } else {
      return null; // Not available in web
    }
  }

  /**
   * Get app paths
   */
  static async getAppPaths(): Promise<Record<string, string> | null> {
    if (this.isElectron()) {
      try {
        return await window.electron!.appInfo.getAppPaths();
      } catch (error) {
        console.error('Error getting app paths:', error);
        return null;
      }
    } else {
      return null; // Not available in web
    }
  }

  /**
   * Open external URL
   */
  static async openExternal(url: string): Promise<boolean> {
    if (this.isElectron()) {
      try {
        return await window.electron!.system.openExternal(url);
      } catch (error) {
        console.error('Error opening external URL:', error);
        return false;
      }
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
      try {
        return await window.electron!.system.copyToClipboard(text);
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        return false;
      }
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
      try {
        return await window.electron!.system.isPlatform(platform);
      } catch (error) {
        console.error('Error checking platform:', error);
        return false;
      }
    } else {
      return false; // Not running in Electron
    }
  }
}
