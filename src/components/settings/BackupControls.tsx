
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface BackupControlsProps {
  onExport: () => void;
}

export const BackupControls = ({ onExport }: BackupControlsProps) => {
  return (
    <div>
      <h3 className="font-medium mb-2">Backup Data</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Export all your data as a JSON file that can be stored for safekeeping
      </p>
      <Button 
        variant="outline" 
        onClick={onExport}
        className="w-full"
      >
        <Download className="h-4 w-4 mr-2" />
        Export Data
      </Button>
    </div>
  );
};
