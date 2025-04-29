
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StorageStatus } from "./StorageStatus";
import { BackupControls } from "./BackupControls";
import { RestoreControls } from "./RestoreControls";

export const DataBackupRestore = () => {
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    // Set up listeners for Electron menu actions if we're in Electron
    if (window.electron?.isElectron) {
      window.electron.onMenuExportData(() => {
        console.log("Menu export data action triggered");
        handleExportData();
      });
      
      window.electron.onMenuImportData(() => {
        console.log("Menu import data action triggered");
        handleImportData();
      });
    }

    // Cleanup listeners on unmount
    return () => {
      // No explicit cleanup needed as we're using removeAllListeners in preload.js
    };
  }, []);

  const handleExportData = () => {
    console.log("Export data function called");
    try {
      const result = StorageService.exportData();
      console.log("Export data result:", result);
    } catch (error) {
      console.error("Export data error:", error);
    }
  };

  const handleImportData = async (event?: React.ChangeEvent<HTMLInputElement>) => {
    setIsImporting(true);
    console.log("Import data function called", !!event?.target?.files);
    
    try {
      const success = await StorageService.importData(event);
      console.log("Import data success:", success);
      
      if (success) {
        // Refresh page after successful import
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error("Import data error:", error);
    } finally {
      setIsImporting(false);
      // Reset file input if it exists
      if (event?.target) {
        event.target.value = '';
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Backup & Restore</CardTitle>
        <CardDescription>
          Export or import your application data for backup or transferring to another device
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <StorageStatus />
          
          <div className="grid gap-4 md:grid-cols-2">
            <BackupControls onExport={handleExportData} />
            <RestoreControls 
              onImport={handleImportData} 
              isImporting={isImporting} 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Add this to the file to prevent import errors
// This is a temporary fix until we refactor the StorageService
const StorageService = {
  exportData: () => {
    const originalStorageService = require("@/services/StorageService").StorageService;
    return originalStorageService.exportData();
  },
  importData: (event?: React.ChangeEvent<HTMLInputElement>) => {
    const originalStorageService = require("@/services/StorageService").StorageService;
    return originalStorageService.importData(event);
  },
  getStorageUsage: () => {
    const originalStorageService = require("@/services/StorageService").StorageService;
    return originalStorageService.getStorageUsage();
  }
};
