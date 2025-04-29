
import { ElectronService } from './ElectronService';

/**
 * Service for handling local storage operations with improved error handling and data management
 */
export class StorageService {
  /**
   * Save data to local storage with error handling
   */
  static saveData<T>(key: string, data: T): void {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(key, serializedData);
      console.log(`Data successfully saved to localStorage: ${key}`);
    } catch (error) {
      console.error(`Error saving data to localStorage: ${key}`, error);
      // Show user friendly error if localStorage is full
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        alert('Storage is full. Please delete some data to continue.');
      }
    }
  }

  /**
   * Load data from local storage with error handling and default value
   */
  static loadData<T>(key: string, defaultValue: T): T {
    try {
      const serializedData = localStorage.getItem(key);
      if (serializedData === null) {
        return defaultValue;
      }
      return JSON.parse(serializedData) as T;
    } catch (error) {
      console.error(`Error loading data from localStorage: ${key}`, error);
      return defaultValue;
    }
  }

  /**
   * Remove data from local storage
   */
  static removeData(key: string): void {
    try {
      localStorage.removeItem(key);
      console.log(`Data successfully removed from localStorage: ${key}`);
    } catch (error) {
      console.error(`Error removing data from localStorage: ${key}`, error);
    }
  }

  /**
   * Clear all app data from local storage
   */
  static clearAllData(): void {
    try {
      localStorage.clear();
      console.log('All data cleared from localStorage');
    } catch (error) {
      console.error('Error clearing all data from localStorage', error);
    }
  }

  /**
   * Export all app data as a JSON file for backup
   */
  static async exportData(): Promise<boolean> {
    try {
      const exportData: Record<string, unknown> = {};
      
      // Get all keys with app prefix to avoid exporting non-app data
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key);
          if (value) {
            exportData[key] = JSON.parse(value);
          }
        }
      }
      
      const dataStr = JSON.stringify(exportData, null, 2);
      
      // Use ElectronService for export
      const result = await ElectronService.exportData(dataStr);
      
      if (result.success) {
        console.log('Data exported successfully');
        return true;
      } else {
        console.error('Export failed:', result.error);
        alert('Error exporting data: ' + (result.error || 'Unknown error'));
        return false;
      }
    } catch (error) {
      console.error('Error exporting data', error);
      alert('Error exporting data. Please try again.');
      return false;
    }
  }
  
  /**
   * Import app data from a JSON file
   */
  static async importData(jsonData?: string | React.ChangeEvent<HTMLInputElement>): Promise<boolean> {
    try {
      let data: Record<string, unknown>;
      
      if (typeof jsonData === 'string') {
        // Use provided JSON string
        data = JSON.parse(jsonData);
      } else if (jsonData && 'target' in jsonData && jsonData.target.files && jsonData.target.files[0]) {
        // Handle file input event
        const file = jsonData.target.files[0];
        const text = await file.text();
        data = JSON.parse(text);
      } else if (ElectronService.isElectron()) {
        // Use Electron's native dialog
        const result = await ElectronService.importData();
        if (!result.success) {
          console.log('Import cancelled');
          return false;
        }
        data = JSON.parse(result.data!);
      } else {
        return false;
      }
      
      // Clear existing data first
      localStorage.clear();
      
      // Import all data from the JSON
      Object.entries(data).forEach(([key, value]) => {
        localStorage.setItem(key, JSON.stringify(value));
      });
      
      console.log('Data imported successfully');
      return true;
    } catch (error) {
      console.error('Error importing data', error);
      alert('Invalid backup file format. Please select a valid backup file.');
      return false;
    }
  }
  
  /**
   * Calculate the approximate size of localStorage usage in KB
   */
  static getStorageUsage(): number {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          total += key.length + value.length;
        }
      }
    }
    // Convert to KB
    return Math.round(total / 1024);
  }
  
  /**
   * Save app logs to file
   */
  static async saveLogsToFile(logs: string[]): Promise<boolean> {
    try {
      const formattedLogs = logs.join('\n\n');
      const result = await ElectronService.saveLog(formattedLogs);
      
      return result.success;
    } catch (error) {
      console.error('Error saving logs', error);
      return false;
    }
  }
}
