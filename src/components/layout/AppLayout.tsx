
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";
import { useState } from "react";
import { useMobile } from "@/hooks/use-mobile";

export default function AppLayout() {
  const isMobile = useMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="flex h-screen overflow-hidden bg-[#0c0d10]">
      <Sidebar isOpen={isMobile ? sidebarOpen : true} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 overflow-auto p-6">
        <Outlet />
      </div>
    </div>
  );
}
