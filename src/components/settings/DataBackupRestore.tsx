
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { StorageService } from "@/services/StorageService";
import { UploadCloud, Download, RefreshCw, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const DataBackupRestore = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [storageUsage, setStorageUsage] = useState(() => StorageService.getStorageUsage());

  useEffect(() => {
    // Set up listeners for Electron menu actions if we're in Electron
    if (window.electron?.isElectron) {
      window.electron.onMenuExportData(() => {
        handleExportData();
      });
      
      window.electron.onMenuImportData(() => {
        handleImportData();
      });
    }
  }, []);

  const handleExportData = () => {
    try {
      StorageService.exportData();
      toast.success("Data export initiated");
    } catch (error) {
      toast.error("Failed to export data");
      console.error(error);
    }
  };

  const handleImportData = async (event?: React.ChangeEvent<HTMLInputElement>) => {
    // If we're using Electron's file dialog (no event) or we have a file from browser input
    const hasFile = event?.target?.files && event.target.files.length > 0;
    const isElectron = Boolean(window.electron?.isElectron);
    
    if (!hasFile && !isElectron) return;
    
    setIsImporting(true);
    
    try {
      let success = false;
      
      // Handle browser file input
      if (hasFile && event?.target?.files) {
        const file = event.target.files[0];
        const reader = new FileReader();
        
        success = await new Promise((resolve) => {
          reader.onload = async (e) => {
            try {
              const jsonData = e.target?.result as string;
              const result = await StorageService.importData(jsonData);
              resolve(result);
            } catch {
              resolve(false);
            }
          };
          reader.onerror = () => resolve(false);
          reader.readAsText(file);
        });
      } else if (isElectron) {
        // Use Electron's native dialog through StorageService
        success = await StorageService.importData();
      }
      
      if (success) {
        toast.success("Data imported successfully. Reloading app...");
        // Refresh storage usage
        setStorageUsage(StorageService.getStorageUsage());
        
        // Wait a moment before refreshing to let the user see the success message
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error("Failed to import data or operation cancelled");
      }
    } catch (error) {
      toast.error("Error reading backup file");
      console.error(error);
    } finally {
      setIsImporting(false);
      // Reset file input if it exists
      if (event?.target) {
        event.target.value = '';
      }
    }
  };

  const refreshStorageUsage = () => {
    setStorageUsage(StorageService.getStorageUsage());
    toast.success("Storage usage updated");
  };

  // Estimate maximum localStorage capacity (typically 5MB)
  const maxStorage = 5 * 1024; // 5MB in KB
  const usagePercentage = Math.min((storageUsage / maxStorage) * 100, 100);

  const isElectron = Boolean(window.electron?.isElectron);

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
          <div className="space-y-2">
            <h3 className="font-medium">Local Storage Status</h3>
            <div className="flex justify-between text-sm mb-2">
              <span>Usage: {storageUsage} KB</span>
              <span>Estimated Max: {maxStorage} KB</span>
            </div>
            <Progress value={usagePercentage} className="h-2" />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-muted-foreground">
                {usagePercentage > 80 ? 
                  <span className="flex items-center text-amber-500">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Storage almost full
                  </span> : 
                  "Storage usage"
                }
              </span>
              <Button variant="ghost" size="sm" onClick={refreshStorageUsage}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-medium mb-2">Backup Data</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Export all your data as a JSON file that can be stored for safekeeping
              </p>
              <Button 
                variant="outline" 
                onClick={handleExportData}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Restore Data</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Import previously exported data. This will replace all current data.
              </p>
              <div className="flex items-center">
                {isElectron ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleImportData()}
                    disabled={isImporting}
                  >
                    {isImporting ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <UploadCloud className="h-4 w-4 mr-2" />
                        Import Data
                      </>
                    )}
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => document.getElementById('file-upload')?.click()}
                      disabled={isImporting}
                    >
                      {isImporting ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Importing...
                        </>
                      ) : (
                        <>
                          <UploadCloud className="h-4 w-4 mr-2" />
                          Import Data
                        </>
                      )}
                    </Button>
                    <input
                      type="file"
                      id="file-upload"
                      accept=".json"
                      className="hidden"
                      onChange={handleImportData}
                      disabled={isImporting}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
