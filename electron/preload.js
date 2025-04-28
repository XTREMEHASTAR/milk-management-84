
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  // Expose methods for data import/export using native file dialogs
  exportData: (data) => ipcRenderer.invoke('export-data', data),
  importData: () => ipcRenderer.invoke('import-data'),
  isElectron: true,
  // Add event listeners for menu actions
  onMenuExportData: (callback) => {
    ipcRenderer.removeAllListeners('menu-export-data');
    ipcRenderer.on('menu-export-data', () => callback());
  },
  onMenuImportData: (callback) => {
    ipcRenderer.removeAllListeners('menu-import-data');
    ipcRenderer.on('menu-import-data', () => callback());
  }
});
