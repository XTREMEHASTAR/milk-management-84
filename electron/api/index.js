
const FileSystemAPI = require('./fileSystem');
const AppInfoAPI = require('./appInfo');
const SystemAPI = require('./system');

/**
 * API registry for all Electron APIs
 */
class APIRegistry {
  /**
   * Register all APIs with the IPC main
   * @param {electron.IpcMain} ipcMain - Electron IPC main instance
   */
  static registerAll(ipcMain) {
    // File system APIs
    ipcMain.handle('export-data', FileSystemAPI.exportData);
    ipcMain.handle('import-data', FileSystemAPI.importData);
    ipcMain.handle('save-log', FileSystemAPI.saveLog);
    
    // App information APIs
    ipcMain.handle('get-version', () => AppInfoAPI.getVersion());
    ipcMain.handle('get-system-info', () => AppInfoAPI.getSystemInfo());
    ipcMain.handle('get-app-paths', () => AppInfoAPI.getAppPaths());
    
    // System APIs
    ipcMain.handle('open-external', SystemAPI.openExternal);
    ipcMain.handle('open-path', SystemAPI.openPath);
    ipcMain.handle('copy-to-clipboard', SystemAPI.copyToClipboard);
    ipcMain.handle('read-from-clipboard', () => SystemAPI.readFromClipboard());
    ipcMain.handle('is-platform', (event, platform) => SystemAPI.isPlatform(platform));
    
    console.log('All Electron APIs registered successfully');
  }
}

module.exports = APIRegistry;
