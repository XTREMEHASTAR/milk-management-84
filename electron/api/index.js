
import { ipcMain, dialog, clipboard, shell } from 'electron';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import API modules
import appInfo from './appInfo.js';
import fileSystem from './fileSystem.js';
import system from './system.js';

/**
 * API Registry for centralizing all IPC handlers
 */
const APIRegistry = {
  /**
   * Registers all IPC handlers for the application
   * @param {Electron.IpcMain} ipcMain - The Electron IPC main instance
   */
  registerAll(ipcMain) {
    // Register app info APIs
    ipcMain.handle('get-version', () => appInfo.getVersion());
    ipcMain.handle('get-system-info', () => appInfo.getSystemInfo());
    
    // Register file system APIs
    ipcMain.handle('export-data', (event, data) => fileSystem.exportData(data));
    ipcMain.handle('import-data', () => fileSystem.importData());
    ipcMain.handle('save-log', (event, logData) => fileSystem.saveLog(logData));
    
    // Register system APIs
    ipcMain.handle('open-external', (event, url) => system.openExternal(url));
    ipcMain.handle('open-path', (event, path) => system.openPath(path));
    ipcMain.handle('copy-to-clipboard', (event, text) => system.copyToClipboard(text));
    ipcMain.handle('read-from-clipboard', () => system.readFromClipboard());
    ipcMain.handle('is-platform', (event, platform) => system.isPlatform(platform));
    
    console.log('All API handlers registered successfully');
  }
};

export default APIRegistry;
