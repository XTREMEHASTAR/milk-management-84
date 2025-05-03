
/**
 * Auto-updater module for the Electron app
 * Currently configured for offline-only mode
 */
const { dialog } = require('electron');

class AppUpdater {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    
    // Store reference to updater globally
    global.updater = this;
    
    console.log('AppUpdater initialized in offline-only mode');
  }
  
  async checkForUpdates() {
    console.log('Update checking disabled in offline mode');
    // Always return false in offline mode
    return false;
  }
  
  async downloadUpdate() {
    console.log('Update downloading disabled in offline mode');
    // Always return false in offline mode
    return false;
  }
  
  quitAndInstall() {
    console.log('Update installation disabled in offline mode');
    dialog.showMessageBox(this.mainWindow, {
      type: 'info',
      title: 'Offline Mode',
      message: 'This application is configured for offline use only.',
      detail: 'Please check for new versions manually at the official website.',
      buttons: ['OK']
    });
  }
}

module.exports = AppUpdater;
