
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import { useMobile } from "@/hooks/use-mobile";

// Create a simple error boundary component
const ErrorFallback = ({ error }: { error: Error }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900">
      <div className="text-center p-6 bg-white/10 backdrop-blur-md rounded-lg shadow-xl max-w-md text-white">
        <h2 className="text-2xl font-bold text-red-400 mb-4">Layout Error</h2>
        <p className="text-gray-200 mb-4">{error.message}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
};

export function Layout() {
  const [error, setError] = useState<Error | null>(null);
  const isMobile = useMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  useEffect(() => {
    console.log("Layout component mounted");
    
    // Log any initialization errors
    try {
      // Add any initialization code here if needed
      console.log("Layout initialization successful");
    } catch (err) {
      console.error("Layout initialization error:", err);
      setError(err instanceof Error ? err : new Error("Unknown error in Layout"));
    }
    
    return () => {
      console.log("Layout component unmounted");
    };
  }, []);

  // If we have an error, show the error fallback
  if (error) {
    return <ErrorFallback error={error} />;
  }

  try {
    console.log("Rendering Layout component");
    return (
      <div className="flex h-screen overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-purple-800">
        <Sidebar isOpen={isMobile ? sidebarOpen : true} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </div>
    );
  } catch (err) {
    console.error("Error rendering Layout:", err);
    setError(err instanceof Error ? err : new Error("Unknown error rendering Layout"));
    return <ErrorFallback error={err instanceof Error ? err : new Error("Unknown error rendering Layout")} />;
  }
}
