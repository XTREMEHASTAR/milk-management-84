
const { dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

// Configure logging
log.transports.file.level = 'info';
autoUpdater.logger = log;

// Disable auto downloading of updates
autoUpdater.autoDownload = false;

class AppUpdater {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    global.updater = this;

    // Check for updates when app starts, but with a slight delay
    // to improve startup performance
    setTimeout(() => {
      this.checkForUpdates();
    }, 10000); // 10 second delay

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
          this.downloadUpdate();
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
          this.quitAndInstall();
        }
      });
    });

    // Check for updates periodically, but less frequently
    // to reduce resource usage
    setInterval(() => {
      this.checkForUpdates();
    }, 4 * 60 * 60 * 1000); // Every 4 hours
  }

  // Check for updates
  async checkForUpdates() {
    try {
      return await autoUpdater.checkForUpdates();
    } catch (error) {
      log.error('Error checking for updates:', error);
      return false;
    }
  }

  // Download update
  async downloadUpdate() {
    try {
      return await autoUpdater.downloadUpdate();
    } catch (error) {
      log.error('Error downloading update:', error);
      return false;
    }
  }

  // Install update
  quitAndInstall() {
    autoUpdater.quitAndInstall(false, true);
  }
}

module.exports = AppUpdater;
