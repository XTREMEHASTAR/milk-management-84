
import { useEffect, useState, memo } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

// Using memo to prevent unnecessary re-renders
export const ElectronDetector = memo(function ElectronDetector() {
  const [isElectron, setIsElectron] = useState<boolean>(false);
  const [appVersion, setAppVersion] = useState<string>('');

  useEffect(() => {
    // Check if we're running in Electron - only run once
    const detectElectron = async () => {
      const isRunningInElectron = Boolean(window.electron?.isElectron);
      setIsElectron(isRunningInElectron);
      
      if (!isRunningInElectron) return;
      
      console.log("Running in Electron desktop environment");
      
      try {
        // Get app version if available
        if (window.electron?.appInfo?.getVersion) {
          const version = await window.electron.appInfo.getVersion();
          setAppVersion(version);
          console.log(`App version: ${version}`);
        }
        
        // Show toast notification only once at startup
        toast.success("Desktop application ready", {
          description: "You are running the full desktop version",
          duration: 3000
        });
      } catch (err) {
        console.error('Failed to get app version:', err);
      }
    };

    detectElectron();
  }, []);

  // Don't render anything if not in Electron
  if (!isElectron) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Badge variant="outline" className="bg-background/90 text-foreground">
        Desktop v{appVersion || '1.0.0'}
      </Badge>
    </div>
  );
});
