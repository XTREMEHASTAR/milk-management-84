
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

    // Log startup
    log.info('Starting AppUpdater');
    
    // Configure error handling for the updater
    autoUpdater.on('error', (error) => {
      log.error('Error in auto-updater:', error);
    });

    // Check for updates when app starts, but with a slight delay
    // to improve startup performance
    setTimeout(() => {
      this.checkForUpdates().catch(err => {
        log.error('Initial update check failed:', err);
      });
    }, 10000); // 10 second delay

    // Listen for update available
    autoUpdater.on('update-available', (info) => {
      log.info('Update available:', info);
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
      }).catch(err => {
        log.error('Error showing update dialog:', err);
      });
    });

    // Listen for update downloaded
    autoUpdater.on('update-downloaded', (info) => {
      log.info('Update downloaded:', info);
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
      }).catch(err => {
        log.error('Error showing install dialog:', err);
      });
    });

    // Check for updates periodically
    setInterval(() => {
      this.checkForUpdates().catch(err => {
        log.error('Periodic update check failed:', err);
      });
    }, 4 * 60 * 60 * 1000); // Every 4 hours
  }

  // Check for updates
  async checkForUpdates() {
    try {
      log.info('Checking for updates...');
      return await autoUpdater.checkForUpdates();
    } catch (error) {
      log.error('Error checking for updates:', error);
      return false;
    }
  }

  // Download update
  async downloadUpdate() {
    try {
      log.info('Downloading update...');
      return await autoUpdater.downloadUpdate();
    } catch (error) {
      log.error('Error downloading update:', error);
      return false;
    }
  }

  // Install update
  quitAndInstall() {
    log.info('Installing update...');
    autoUpdater.quitAndInstall(false, true);
  }
}

module.exports = AppUpdater;
