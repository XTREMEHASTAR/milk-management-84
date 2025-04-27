
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function ElectronDetector() {
  const [isElectron, setIsElectron] = useState<boolean>(false);

  useEffect(() => {
    // Check if we're running in Electron
    const isRunningInElectron = Boolean(window.electron?.isElectron);
    setIsElectron(isRunningInElectron);
    
    if (isRunningInElectron) {
      console.log("Running in Electron desktop environment");
    } else {
      console.log("Running in browser environment");
    }
  }, []);

  return null; // This component doesn't render anything
}
