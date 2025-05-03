
/**
 * API Registry for Electron IPC handlers
 */

const fs = require('fs');
const path = require('path');
const { dialog, clipboard, shell, app } = require('electron');
const os = require('os');
const log = require('electron-log');

// Configure electron-log
log.transports.file.level = 'info';
log.transports.console.level = 'info';
log.info('API Registry initialization');

// Registry of all API handlers
class APIRegistry {
  static registerAll(ipcMain) {
    log.info('Registering API handlers');
    
    // File system operations
    ipcMain.handle('export-data', async (event, data) => {
      try {
        log.info('Export data requested');
        const { filePath, canceled } = await dialog.showSaveDialog({
          title: 'Export Data',
          defaultPath: path.join(app.getPath('documents'), `milk-center-backup-${new Date().toISOString().split('T')[0]}.json`),
          filters: [{ name: 'JSON Files', extensions: ['json'] }],
          properties: ['createDirectory', 'showOverwriteConfirmation']
        });
        
        if (canceled || !filePath) {
          log.info('Export cancelled by user');
          return { success: false, error: 'Export cancelled' };
        }
        
        fs.writeFileSync(filePath, data);
        log.info(`Data exported successfully to ${filePath}`);
        return { success: true, filePath };
      } catch (error) {
        log.error('Export data error:', error);
        return { success: false, error: error.message };
      }
    });

    ipcMain.handle('import-data', async () => {
      try {
        log.info('Import data requested');
        const { filePaths, canceled } = await dialog.showOpenDialog({
          title: 'Import Data',
          filters: [{ name: 'JSON Files', extensions: ['json'] }],
          properties: ['openFile']
        });
        
        if (canceled || filePaths.length === 0) {
          log.info('Import cancelled by user');
          return { success: false, error: 'Import cancelled' };
        }
        
        const filePath = filePaths[0];
        log.info(`Reading imported data from ${filePath}`);
        const data = fs.readFileSync(filePath, 'utf8');
        
        // Validate JSON format
        try {
          JSON.parse(data);
        } catch (err) {
          log.error('Invalid JSON format:', err);
          return { success: false, error: 'Invalid file format. The file does not contain valid JSON data.' };
        }
        
        log.info('Data import successful');
        return { success: true, data };
      } catch (error) {
        log.error('Import data error:', error);
        return { success: false, error: error.message };
      }
    });

    ipcMain.handle('save-log', async (event, logData) => {
      try {
        log.info('Save log requested');
        const { filePath, canceled } = await dialog.showSaveDialog({
          title: 'Save Log',
          defaultPath: path.join(app.getPath('documents'), `milk-center-log-${new Date().toISOString().replace(/:/g, '-')}.txt`),
          filters: [{ name: 'Text Files', extensions: ['txt'] }],
          properties: ['createDirectory', 'showOverwriteConfirmation']
        });
        
        if (canceled || !filePath) {
          log.info('Save log cancelled by user');
          return { success: false, error: 'Save cancelled' };
        }
        
        fs.writeFileSync(filePath, logData);
        log.info(`Log saved successfully to ${filePath}`);
        return { success: true, path: filePath };
      } catch (error) {
        log.error('Save log error:', error);
        return { success: false, error: error.message };
      }
    });

    // App information
    ipcMain.handle('get-version', () => {
      try {
        const version = app.getVersion();
        log.info(`App version requested: ${version}`);
        return version;
      } catch (error) {
        log.error('Error getting app version:', error);
        return '1.0.0';
      }
    });

    ipcMain.handle('get-system-info', () => {
      log.info('System info requested');
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

    // App paths
    ipcMain.handle('get-app-paths', () => {
      log.info('App paths requested');
      return {
        userData: app.getPath('userData'),
        documents: app.getPath('documents'),
        downloads: app.getPath('downloads'),
        appData: app.getPath('appData')
      };
    });

    // System utilities
    ipcMain.handle('open-external', async (event, url) => {
      try {
        log.info(`Opening external URL: ${url}`);
        await shell.openExternal(url);
        return true;
      } catch (error) {
        log.error('Error opening external URL:', error);
        return false;
      }
    });

    ipcMain.handle('open-path', async (event, filePath) => {
      try {
        log.info(`Opening path: ${filePath}`);
        await shell.openPath(filePath);
        return true;
      } catch (error) {
        log.error('Error opening path:', error);
        return false;
      }
    });

    ipcMain.handle('copy-to-clipboard', (event, text) => {
      try {
        log.info('Copying text to clipboard');
        clipboard.writeText(text);
        return true;
      } catch (error) {
        log.error('Error copying to clipboard:', error);
        return false;
      }
    });

    ipcMain.handle('read-from-clipboard', () => {
      try {
        log.info('Reading from clipboard');
        return clipboard.readText();
      } catch (error) {
        log.error('Error reading from clipboard:', error);
        return '';
      }
    });

    ipcMain.handle('is-platform', (event, platform) => {
      return os.platform() === platform;
    });
    
    log.info('API handlers registration completed');
  }
}

module.exports = APIRegistry;
