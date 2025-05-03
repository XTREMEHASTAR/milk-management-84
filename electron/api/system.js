
import { shell, clipboard } from 'electron';

/**
 * System integration API
 */
class SystemAPI {
  /**
   * Open an external URL
   * @param {Object} event - IPC event
   * @param {string} url - URL to open
   * @returns {boolean} Success status
   */
  static openExternal(event, url) {
    try {
      if (url && typeof url === 'string') {
        shell.openExternal(url);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Open external error:', error);
      return false;
    }
  }

  /**
   * Open a path in file explorer
   * @param {Object} event - IPC event
   * @param {string} path - Path to open
   * @returns {boolean} Success status
   */
  static openPath(event, path) {
    try {
      if (path && typeof path === 'string') {
        shell.openPath(path);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Open path error:', error);
      return false;
    }
  }

  /**
   * Copy text to clipboard
   * @param {Object} event - IPC event
   * @param {string} text - Text to copy
   * @returns {boolean} Success status
   */
  static copyToClipboard(event, text) {
    try {
      if (text && typeof text === 'string') {
        clipboard.writeText(text);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Copy to clipboard error:', error);
      return false;
    }
  }

  /**
   * Read text from clipboard
   * @returns {string} Clipboard text
   */
  static readFromClipboard() {
    try {
      return clipboard.readText();
    } catch (error) {
      console.error('Read from clipboard error:', error);
      return '';
    }
  }
  
  /**
   * Check if running on specific platform
   * @param {string} platform - Platform to check (win32, darwin, linux)
   * @returns {boolean} Is running on specified platform
   */
  static isPlatform(platform) {
    return process.platform === platform;
  }
}

export default SystemAPI;
