const { app, BrowserWindow, ipcMain, dialog, Menu, shell, autoUpdater } = require('electron');
const path = require('path');
const fs = require('fs');
const isDev = process.env.NODE_ENV === 'development';
const isMac = process.platform === 'darwin';

// Keep a global reference of the window object to avoid garbage collection
let mainWindow;

// App name
const APP_NAME = 'Milk Center Management';

// Update server URLs - update with your actual URL when you have it
const updateServerUrl = 'https://your-update-server.com';

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, '../public/icon-512x512.png'),
    show: false, // Don't show until ready
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
    // In production, load the built files
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
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

  // Emitted when the window is closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Set window title
  mainWindow.setTitle(APP_NAME);
}

// Create application menu
function createMenu() {
  const template = [
    // App menu (macOS only)
    ...(isMac ? [{
      label: APP_NAME,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] : []),
    // File menu
    {
      label: 'File',
      submenu: [
        {
          label: 'Export Data',
          click: async () => {
            if (mainWindow) {
              mainWindow.webContents.send('menu-export-data');
            }
          }
        },
        {
          label: 'Import Data',
          click: async () => {
            if (mainWindow) {
              mainWindow.webContents.send('menu-import-data');
            }
          }
        },
        { type: 'separator' },
        isMac ? { role: 'close' } : { role: 'quit' }
      ]
    },
    // Edit menu
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        ...(isMac ? [
          { role: 'pasteAndMatchStyle' },
          { role: 'delete' },
          { role: 'selectAll' },
        ] : [
          { role: 'delete' },
          { type: 'separator' },
          { role: 'selectAll' }
        ])
      ]
    },
    // View menu
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    // Window menu
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac ? [
          { type: 'separator' },
          { role: 'front' },
          { type: 'separator' },
          { role: 'window' }
        ] : [
          { role: 'close' }
        ])
      ]
    },
    // Help menu
    {
      label: 'Help',
      submenu: [
        {
          label: 'About ' + APP_NAME,
          click: async () => {
            const version = app.getVersion();
            await dialog.showMessageBox(mainWindow, {
              title: 'About ' + APP_NAME,
              message: APP_NAME,
              detail: `Version: ${version}\n© 2025 Milk Center Management`,
              buttons: ['OK']
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Setup auto-updates
function setupAutoUpdates() {
  if (isDev) {
    console.log('Auto-updates disabled in development mode');
    return;
  }

  if (process.platform === 'darwin') {
    // macOS updates
    autoUpdater.setFeedURL({
      url: `${updateServerUrl}/update/mac/${app.getVersion()}`
    });
  } else if (process.platform === 'win32') {
    // Windows updates
    autoUpdater.setFeedURL({
      url: `${updateServerUrl}/update/win/${app.getVersion()}`
    });
  }

  // Check for updates
  autoUpdater.checkForUpdates();

  // Listen for update events
  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    const dialogOpts = {
      type: 'info',
      buttons: ['Restart', 'Later'],
      title: 'Application Update',
      message: releaseName,
      detail: 'A new version has been downloaded. Restart the application to apply the updates.'
    };

    dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) autoUpdater.quitAndInstall();
    });
  });

  autoUpdater.on('error', (error) => {
    console.error('There was a problem updating the application', error);
  });

  // Check for updates every 4 hours
  setInterval(() => {
    autoUpdater.checkForUpdates();
  }, 4 * 60 * 60 * 1000);
}

// Create the window when Electron has finished initializing
app.whenReady().then(() => {
  createWindow();
  createMenu();
  setupAutoUpdates();

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
