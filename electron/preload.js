
const { contextBridge, ipcRenderer } = require('electron');

// Log initialization to help diagnose issues
console.log('Preload script initializing...');

// Use a more efficient way to expose methods
const API = {
  // Data import/export
  exportData: (data) => ipcRenderer.invoke('export-data', data),
  importData: () => ipcRenderer.invoke('import-data'),
  isElectron: true,
  
  // Event listeners for menu actions
  onMenuExportData: (callback) => {
    console.log('Registering menu-export-data handler');
    ipcRenderer.removeAllListeners('menu-export-data');
    ipcRenderer.on('menu-export-data', () => {
      console.log('Received menu-export-data event');
      callback();
    });
  },
  onMenuImportData: (callback) => {
    console.log('Registering menu-import-data handler');
    ipcRenderer.removeAllListeners('menu-import-data');
    ipcRenderer.on('menu-import-data', () => {
      console.log('Received menu-import-data event');
      callback();
    });
  },
  
  // App info
  appInfo: {
    getVersion: () => {
      console.log('Getting app version');
      return ipcRenderer.invoke('get-version');
    },
    getPlatform: () => process.platform,
  },
  
  // Updates
  updates: {
    checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
    downloadUpdate: () => ipcRenderer.invoke('download-update'),
    installUpdate: () => ipcRenderer.invoke('install-update'),
  }
};

// Expose protected methods in one single operation for better performance
try {
  console.log('Exposing Electron API to renderer process');
  contextBridge.exposeInMainWorld('electron', API);
  console.log('Electron API exposed successfully');
} catch (error) {
  console.error('Failed to expose Electron API:', error);
}
