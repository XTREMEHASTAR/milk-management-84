
const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const isDev = require('electron-is-dev'); // Using the proper module
const isMac = process.platform === 'darwin';
const AppUpdater = require('./updater');
const MenuBuilder = require('./menuBuilder');
const APIRegistry = require('./api');

// Keep a global reference of the window object to avoid garbage collection
let mainWindow;

// App name
const APP_NAME = 'Milk Center Management';

// Create an optimized window
function createWindow() {
  console.log('Creating main window...');
  
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
    console.log('Running in development mode, loading from dev server...');
    mainWindow.loadURL('http://localhost:8080');
    // Open DevTools automatically in development
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load the built index.html file
    try {
      // Fix path resolution for packaged apps
      const indexPath = path.join(__dirname, '../dist/index.html');
      console.log('Running in production mode, loading from:', indexPath);
      
      if (!fs.existsSync(indexPath)) {
        console.error(`ERROR: Could not find index.html at ${indexPath}`);
        dialog.showErrorBox('Application Error', 'Could not load application files. Please reinstall the application.');
        app.quit();
        return;
      }
      
      mainWindow.loadFile(indexPath);
    } catch (error) {
      console.error('Failed to load index.html:', error);
      dialog.showErrorBox('Application Error', `Failed to load application: ${error.message}`);
      app.quit();
      return;
    }
    
    // Optimize for production
    mainWindow.webContents.setVisualZoomLevelLimits(1, 3);
  }

  // Show window once ready to avoid white flash
  mainWindow.once('ready-to-show', () => {
    console.log('Window ready to show');
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
  MenuBuilder.buildMenu(mainWindow);
  
  // Initialize updater in production
  if (!isDev) {
    new AppUpdater(mainWindow);
  }
  
  console.log('Window created successfully');
}

// Register all APIs
function registerAPIs() {
  console.log('Registering API handlers...');
  // Register all APIs using the registry
  APIRegistry.registerAll(ipcMain);
  
  // Add any special case handlers here if needed
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
  
  // Add data directory API
  ipcMain.handle('get-app-paths', () => {
    return {
      userData: app.getPath('userData'),
      documents: app.getPath('documents'),
      downloads: app.getPath('downloads'),
      appData: app.getPath('appData')
    };
  });
  
  console.log('API handlers registered successfully');
}

// Create the window when Electron has finished initializing
app.whenReady().then(() => {
  console.log('Application ready, initializing...');
  
  // Register all IPC handlers
  registerAPIs();
  
  // Create the main window
  createWindow();

  // On macOS, recreate window when dock icon is clicked and no windows are open
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
  
  console.log('Application initialization complete');
}).catch(error => {
  console.error('Failed to initialize application:', error);
  dialog.showErrorBox('Application Error', `Failed to initialize application: ${error.message}`);
  app.quit();
});

// Quit when all windows are closed, except on macOS where it's common
// for applications to stay open until explicitly quit with Cmd + Q
app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit();
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  dialog.showErrorBox('Application Error', `An unexpected error occurred: ${error.message}`);
});

// Optimize memory usage with routine garbage collection
setInterval(() => {
  if (global.gc) {
    global.gc();
  }
}, 30 * 60 * 1000); // Run every 30 minutes
