
import { StorageService } from './StorageService';

/**
 * Service for managing offline data synchronization and storage
 */
export class OfflineStorageService {
  private static readonly OFFLINE_QUEUE_KEY = 'offline_action_queue';
  private static readonly SYNC_STATUS_KEY = 'last_sync_status';
  private static readonly DATA_VERSION_KEY = 'data_version';

  /**
   * Initialize the offline storage system
   */
  public static initialize(): void {
    // Set up online/offline event listeners to manage sync state
    window.addEventListener('online', this.handleOnlineStatus);
    window.addEventListener('offline', this.handleOfflineStatus);
    
    // Initialize data version if not set
    if (!localStorage.getItem(this.DATA_VERSION_KEY)) {
      localStorage.setItem(this.DATA_VERSION_KEY, '1.0');
    }
    
    console.log('OfflineStorageService initialized');
  }
  
  /**
   * Clean up event listeners
   */
  public static cleanup(): void {
    window.removeEventListener('online', this.handleOnlineStatus);
    window.removeEventListener('offline', this.handleOfflineStatus);
    console.log('OfflineStorageService cleaned up');
  }

  /**
   * Handle online status change
   */
  private static handleOnlineStatus = async (): Promise<void> => {
    console.log('Network status: Online');
    const status = {
      isOnline: true,
      lastSyncAttempt: new Date().toISOString(),
      lastSuccessfulSync: null
    };
    
    try {
      // Process offline queue when back online
      await this.processOfflineQueue();
      status.lastSuccessfulSync = new Date().toISOString();
    } catch (error) {
      console.error('Failed to process offline queue:', error);
    }
    
    StorageService.saveData(this.SYNC_STATUS_KEY, status);
  }
  
  /**
   * Handle offline status change
   */
  private static handleOfflineStatus = (): void => {
    console.log('Network status: Offline');
    const status = {
      isOnline: false,
      lastSyncAttempt: new Date().toISOString(),
      lastSuccessfulSync: null
    };
    
    StorageService.saveData(this.SYNC_STATUS_KEY, status);
  }

  /**
   * Queue an action to be performed when back online
   */
  public static queueOfflineAction(action: {
    type: string; 
    entity: string;
    data: any;
    timestamp: string;
  }): void {
    const queue = this.getOfflineQueue();
    queue.push({
      ...action,
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date().toISOString()
    });
    
    StorageService.saveData(this.OFFLINE_QUEUE_KEY, queue);
    console.log(`Action queued for offline processing: ${action.type} - ${action.entity}`);
  }
  
  /**
   * Get the offline action queue
   */
  public static getOfflineQueue(): Array<{
    type: string;
    entity: string;
    data: any;
    id: string;
    timestamp: string;
  }> {
    return StorageService.loadData(this.OFFLINE_QUEUE_KEY, []);
  }
  
  /**
   * Clear the offline action queue
   */
  public static clearOfflineQueue(): void {
    StorageService.saveData(this.OFFLINE_QUEUE_KEY, []);
    console.log('Offline action queue cleared');
  }
  
  /**
   * Process the offline action queue when back online
   */
  private static async processOfflineQueue(): Promise<void> {
    const queue = this.getOfflineQueue();
    if (queue.length === 0) {
      console.log('No actions in offline queue');
      return;
    }
    
    console.log(`Processing ${queue.length} offline actions`);
    const processedActions = [];
    const failedActions = [];
    
    for (const action of queue) {
      try {
        // In a real app, this would call API endpoints or other services
        // For now, we'll just assume all actions succeed
        console.log(`Processing action: ${action.type} - ${action.entity}`);
        processedActions.push(action.id);
      } catch (error) {
        console.error(`Failed to process action ${action.id}:`, error);
        failedActions.push(action.id);
      }
    }
    
    // Remove processed actions from queue
    const updatedQueue = queue.filter(
      action => !processedActions.includes(action.id)
    );
    
    StorageService.saveData(this.OFFLINE_QUEUE_KEY, updatedQueue);
    console.log(`Processed ${processedActions.length} actions, ${failedActions.length} failed, ${updatedQueue.length} remaining`);
  }
  
  /**
   * Check if the application is online
   */
  public static isOnline(): boolean {
    return navigator.onLine;
  }
  
  /**
   * Get the last sync status
   */
  public static getSyncStatus(): {
    isOnline: boolean;
    lastSyncAttempt: string | null;
    lastSuccessfulSync: string | null;
  } {
    return StorageService.loadData(this.SYNC_STATUS_KEY, {
      isOnline: navigator.onLine,
      lastSyncAttempt: null,
      lastSuccessfulSync: null
    });
  }
  
  /**
   * Manually trigger synchronization
   */
  public static async synchronize(): Promise<boolean> {
    if (!this.isOnline()) {
      console.log('Cannot synchronize while offline');
      return false;
    }
    
    try {
      await this.processOfflineQueue();
      
      const status = {
        isOnline: true,
        lastSyncAttempt: new Date().toISOString(),
        lastSuccessfulSync: new Date().toISOString()
      };
      
      StorageService.saveData(this.SYNC_STATUS_KEY, status);
      console.log('Synchronization completed successfully');
      return true;
    } catch (error) {
      console.error('Synchronization failed:', error);
      
      const status = {
        isOnline: true,
        lastSyncAttempt: new Date().toISOString(),
        lastSuccessfulSync: StorageService.loadData(this.SYNC_STATUS_KEY, {}).lastSuccessfulSync
      };
      
      StorageService.saveData(this.SYNC_STATUS_KEY, status);
      return false;
    }
  }
}
