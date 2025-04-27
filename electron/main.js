const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const isDev = process.env.NODE_ENV === 'development';
const isMac = process.platform === 'darwin';

// Keep a global reference of the window object to avoid garbage collection
let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, '../public/icon-512x512.png'),
    show: false, // Don't show until ready
  });

  // Load the app
  if (isDev) {
    // In development, load from the dev server
    mainWindow.loadURL('http://localhost:8080');
    // Open DevTools automatically
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load the built files
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Show window once ready to avoid white flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Emitted when the window is closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Set window title
  mainWindow.setTitle('Milk Center Management System');
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
