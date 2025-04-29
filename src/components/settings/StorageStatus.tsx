
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { StorageService } from "@/services/StorageService";

export const StorageStatus = () => {
  const [storageUsage, setStorageUsage] = useState(() => StorageService.getStorageUsage());
  
  // Estimate maximum localStorage capacity (typically 5MB)
  const maxStorage = 5 * 1024; // 5MB in KB
  const usagePercentage = Math.min((storageUsage / maxStorage) * 100, 100);

  const refreshStorageUsage = () => {
    const updatedUsage = StorageService.getStorageUsage();
    setStorageUsage(updatedUsage);
    toast.success("Storage usage updated");
  };

  return (
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
  );
};
