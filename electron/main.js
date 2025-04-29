const { app, BrowserWindow, ipcMain, dialog, Menu, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const isDev = process.env.NODE_ENV === 'development';
const isMac = process.platform === 'darwin';
const AppUpdater = require('./updater');
const menuBuilder = require('./menuBuilder');

// Keep a global reference of the window object to avoid garbage collection
let mainWindow;

// App name
const APP_NAME = 'Milk Center Management';

// Create an optimized window
function createWindow() {
  // Create the browser window with optimized settings
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      // Optimize memory usage
      backgroundThrottling: false,
      // Improve rendering performance 
      offscreen: false
    },
    icon: path.join(__dirname, '../public/icon-512x512.png'),
    show: false, // Don't show until ready to prevent white flash
    backgroundColor: '#0C0D10', // Match app background color
    titleBarStyle: isMac ? 'hiddenInset' : 'default',
    // Make it look more native
    frame: true,
    autoHideMenuBar: false, // Show menu
  });

  // Load the app
  if (isDev) {
    // In development, load from the dev server
    mainWindow.loadURL('http://localhost:8080');
    // Open DevTools automatically in development
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load the built index.html file
    // Fix path resolution for packaged apps
    const indexPath = path.join(__dirname, '../dist/index.html');
    console.log('Loading from:', indexPath);
    mainWindow.loadFile(indexPath);
    
    // Optimize for production
    mainWindow.webContents.setVisualZoomLevelLimits(1, 3);
  }

  // Show window once ready to avoid white flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  // Open external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Memory optimization: Clean up references when window is closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Set window title
  mainWindow.setTitle(APP_NAME);
  
  // Initialize menu
  menuBuilder.buildMenu(mainWindow);
  
  // Initialize updater in production
  if (!isDev) {
    new AppUpdater(mainWindow);
  }
}

// Create the window when Electron has finished initializing
app.whenReady().then(() => {
  createWindow();

  // On macOS, recreate window when dock icon is clicked and no windows are open
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS where it's common
// for applications to stay open until explicitly quit with Cmd + Q
app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit();
  }
});

// Handle data export
ipcMain.handle('export-data', async (event, data) => {
  const { filePath } = await dialog.showSaveDialog({
    title: 'Export Data',
    defaultPath: `milk-center-backup-${new Date().toISOString().split('T')[0]}.json`,
    filters: [{ name: 'JSON Files', extensions: ['json'] }],
  });
  
  if (filePath) {
    fs.writeFileSync(filePath, data);
    return { success: true, filePath };
  }
  
  return { success: false };
});

// Handle data import
ipcMain.handle('import-data', async () => {
  const { filePaths } = await dialog.showOpenDialog({
    title: 'Import Data',
    filters: [{ name: 'JSON Files', extensions: ['json'] }],
    properties: ['openFile'],
  });
  
  if (filePaths && filePaths.length > 0) {
    const data = fs.readFileSync(filePaths[0], 'utf8');
    return { success: true, data };
  }
  
  return { success: false };
});

// Add version info accessor
ipcMain.handle('get-version', () => {
  return app.getVersion();
});

// Add update check handlers
ipcMain.handle('check-for-updates', async () => {
  if (isDev) return false;
  const updater = global.updater;
  if (!updater) return false;
  
  try {
    return await updater.checkForUpdates();
  } catch (err) {
    console.error('Failed to check for updates:', err);
    return false;
  }
});

ipcMain.handle('download-update', async () => {
  if (isDev) return false;
  const updater = global.updater;
  if (!updater) return false;
  
  try {
    return await updater.downloadUpdate();
  } catch (err) {
    console.error('Failed to download update:', err);
    return false;
  }
});

ipcMain.handle('install-update', async () => {
  if (isDev) return;
  const updater = global.updater;
  if (!updater) return;
  
  try {
    updater.quitAndInstall();
  } catch (err) {
    console.error('Failed to install update:', err);
  }
});

// Optimize memory usage with routine garbage collection
setInterval(() => {
  if (global.gc) {
    global.gc();
  }
}, 30 * 60 * 1000); // Run every 30 minutes
