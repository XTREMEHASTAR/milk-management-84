
/**
 * API Registry for Electron IPC handlers
 */

const fs = require('fs');
const path = require('path');
const { dialog, clipboard, shell } = require('electron');
const os = require('os');

// Registry of all API handlers
class APIRegistry {
  static registerAll(ipcMain) {
    // File system operations
    ipcMain.handle('export-data', async (event, data) => {
      try {
        const { filePath, canceled } = await dialog.showSaveDialog({
          title: 'Export Data',
          defaultPath: `milk-center-backup-${new Date().toISOString().split('T')[0]}.json`,
          filters: [{ name: 'JSON Files', extensions: ['json'] }],
          properties: ['createDirectory', 'showOverwriteConfirmation']
        });
        
        if (canceled || !filePath) {
          return { success: false, error: 'Export cancelled' };
        }
        
        fs.writeFileSync(filePath, data);
        return { success: true, filePath };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    ipcMain.handle('import-data', async () => {
      try {
        const { filePaths, canceled } = await dialog.showOpenDialog({
          title: 'Import Data',
          filters: [{ name: 'JSON Files', extensions: ['json'] }],
          properties: ['openFile']
        });
        
        if (canceled || filePaths.length === 0) {
          return { success: false, error: 'Import cancelled' };
        }
        
        const data = fs.readFileSync(filePaths[0], 'utf8');
        return { success: true, data };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    ipcMain.handle('save-log', async (event, logData) => {
      try {
        const { filePath, canceled } = await dialog.showSaveDialog({
          title: 'Save Log',
          defaultPath: `milk-center-log-${new Date().toISOString().replace(/:/g, '-')}.txt`,
          filters: [{ name: 'Text Files', extensions: ['txt'] }],
          properties: ['createDirectory', 'showOverwriteConfirmation']
        });
        
        if (canceled || !filePath) {
          return { success: false, error: 'Save cancelled' };
        }
        
        fs.writeFileSync(filePath, logData);
        return { success: true, path: filePath };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    // App information
    ipcMain.handle('get-version', () => {
      try {
        const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf8'));
        return packageJson.version || '1.0.0';
      } catch (error) {
        console.error('Error getting app version:', error);
        return '1.0.0';
      }
    });

    ipcMain.handle('get-system-info', () => {
      return {
        platform: os.platform(),
        release: os.release(),
        arch: os.arch(),
        totalMem: Math.round(os.totalmem() / (1024 * 1024 * 1024)), // GB
        freeMem: Math.round(os.freemem() / (1024 * 1024 * 1024)), // GB
        cpuCount: os.cpus().length,
        hostname: os.hostname()
      };
    });

    // System utilities
    ipcMain.handle('open-external', async (event, url) => {
      try {
        await shell.openExternal(url);
        return true;
      } catch (error) {
        console.error('Error opening external URL:', error);
        return false;
      }
    });

    ipcMain.handle('open-path', async (event, filePath) => {
      try {
        await shell.openPath(filePath);
        return true;
      } catch (error) {
        console.error('Error opening path:', error);
        return false;
      }
    });

    ipcMain.handle('copy-to-clipboard', (event, text) => {
      try {
        clipboard.writeText(text);
        return true;
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        return false;
      }
    });

    ipcMain.handle('read-from-clipboard', () => {
      try {
        return clipboard.readText();
      } catch (error) {
        console.error('Error reading from clipboard:', error);
        return '';
      }
    });

    ipcMain.handle('is-platform', (event, platform) => {
      return os.platform() === platform;
    });
  }
}

module.exports = APIRegistry;
