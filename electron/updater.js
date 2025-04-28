
const { dialog } = require('electron');
const { autoUpdater } = require('electron-updater');

// Configure logging
autoUpdater.logger = require('electron-log');
autoUpdater.logger.transports.file.level = 'info';

// Disable auto downloading of updates
autoUpdater.autoDownload = false;

class AppUpdater {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;

    // Check for updates immediately when app starts
    autoUpdater.checkForUpdates();

    // Listen for update available
    autoUpdater.on('update-available', () => {
      dialog.showMessageBox({
        type: 'info',
        title: 'Update Available',
        message: 'A new version is available. Do you want to download it now?',
        buttons: ['Yes', 'No']
      }).then((result) => {
        const buttonIndex = result.response;
        if (buttonIndex === 0) {
          autoUpdater.downloadUpdate();
        }
      });
    });

    // Listen for update downloaded
    autoUpdater.on('update-downloaded', () => {
      dialog.showMessageBox({
        type: 'info',
        title: 'Update Ready',
        message: 'Install and restart now?',
        buttons: ['Yes', 'Later']
      }).then((result) => {
        const buttonIndex = result.response;
        if (buttonIndex === 0) {
          autoUpdater.quitAndInstall(false, true);
        }
      });
    });

    // Check for updates every hour
    setInterval(() => {
      autoUpdater.checkForUpdates();
    }, 60 * 60 * 1000);
  }
}

module.exports = AppUpdater;
