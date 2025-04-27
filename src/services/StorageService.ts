
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
  static exportData(): void {
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
      
      // Check if running in Electron
      if (window.electron?.isElectron) {
        // Use Electron's native dialog
        window.electron.exportData(dataStr)
          .then((result: { success: boolean; filePath?: string }) => {
            if (result.success) {
              console.log('Data exported successfully to:', result.filePath);
            } else {
              console.log('Data export cancelled');
            }
          })
          .catch((error: Error) => {
            console.error('Error exporting data', error);
            alert('Error exporting data. Please try again.');
          });
      } else {
        // Fallback to browser download
        const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
        const exportFileDefaultName = `milk-center-backup-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        console.log('Data exported successfully via browser download');
      }
    } catch (error) {
      console.error('Error exporting data', error);
      alert('Error exporting data. Please try again.');
    }
  }
  
  /**
   * Import app data from a JSON file
   */
  static importData(jsonData?: string): Promise<boolean> {
    return new Promise(async (resolve) => {
      try {
        let data: Record<string, unknown>;
        
        if (window.electron?.isElectron && !jsonData) {
          // Use Electron's native dialog
          const result = await window.electron.importData();
          if (!result.success) {
            console.log('Import cancelled');
            resolve(false);
            return;
          }
          data = JSON.parse(result.data);
        } else if (jsonData) {
          // Use provided JSON string (browser file input)
          data = JSON.parse(jsonData);
        } else {
          resolve(false);
          return;
        }
        
        // Clear existing data first
        localStorage.clear();
        
        // Import all data from the JSON
        Object.entries(data).forEach(([key, value]) => {
          localStorage.setItem(key, JSON.stringify(value));
        });
        
        console.log('Data imported successfully');
        resolve(true);
      } catch (error) {
        console.error('Error importing data', error);
        alert('Invalid backup file format. Please select a valid backup file.');
        resolve(false);
      }
    });
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
}
