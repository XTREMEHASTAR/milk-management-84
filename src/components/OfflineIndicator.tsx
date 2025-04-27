
import { useState, useEffect } from "react";
import { Wifi, WifiOff } from "lucide-react";
import { toast } from "sonner";

export const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Function to update online status
    const updateOnlineStatus = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      
      if (online) {
        toast.success("You are back online");
      } else {
        toast.warning("You are offline. Changes will be saved locally.");
      }
    };

    // Add event listeners
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Clean up event listeners
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 bg-black/90 text-white px-4 py-2 rounded-full shadow-lg">
      <WifiOff className="h-4 w-4 text-red-400" />
      <span className="text-sm font-medium">Offline Mode</span>
    </div>
  );
};
