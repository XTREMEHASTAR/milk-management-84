
const { contextBridge, ipcRenderer } = require('electron');

// Use a more efficient way to expose methods
const API = {
  // Data import/export
  exportData: (data) => ipcRenderer.invoke('export-data', data),
  importData: () => ipcRenderer.invoke('import-data'),
  isElectron: true,
  
  // Event listeners for menu actions
  onMenuExportData: (callback) => {
    ipcRenderer.removeAllListeners('menu-export-data');
    ipcRenderer.on('menu-export-data', () => callback());
  },
  onMenuImportData: (callback) => {
    ipcRenderer.removeAllListeners('menu-import-data');
    ipcRenderer.on('menu-import-data', () => callback());
  },
  
  // App info
  appInfo: {
    getVersion: () => ipcRenderer.invoke('get-version'),
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
contextBridge.exposeInMainWorld('electron', API);
