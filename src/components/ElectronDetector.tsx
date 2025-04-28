
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export function ElectronDetector() {
  const [isElectron, setIsElectron] = useState<boolean>(false);
  const [appVersion, setAppVersion] = useState<string>('');

  useEffect(() => {
    // Check if we're running in Electron
    const isRunningInElectron = Boolean(window.electron?.isElectron);
    setIsElectron(isRunningInElectron);
    
    if (isRunningInElectron) {
      console.log("Running in Electron desktop environment");
      
      // Get app version if available
      if (window.electron?.appInfo?.getVersion) {
        window.electron.appInfo.getVersion()
          .then((version: string) => {
            setAppVersion(version);
            console.log(`App version: ${version}`);
          })
          .catch((err: any) => {
            console.error('Failed to get app version:', err);
          });
      }
      
      toast.success("Desktop application ready", {
        description: "You are running the full desktop version",
        duration: 3000
      });
    } else {
      console.log("Running in browser environment");
    }
  }, []);

  if (!isElectron) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Badge variant="outline" className="bg-background/90 text-foreground">
        Desktop v{appVersion || '1.0.0'}
      </Badge>
    </div>
  );
}
