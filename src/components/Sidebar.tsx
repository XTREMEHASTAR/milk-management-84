
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutGrid, ClipboardList, Users, CreditCard, 
  BarChart3, FileSpreadsheet, PieChart
} from "lucide-react";

const sidebarItems = [
  { name: "Dashboard", href: "/", icon: LayoutGrid },
  { name: "Order Entry", href: "/order-entry", icon: ClipboardList },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Payments", href: "/payments", icon: CreditCard },
  { name: "Expenses", href: "/expenses", icon: PieChart },
  { name: "Track Sheet", href: "/track-sheet", icon: FileSpreadsheet },
  { name: "Reports", href: "/reports", icon: BarChart3 },
];

export function Sidebar() {
  const location = useLocation();
  
  return (
    <div className="h-full w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
            <span className="text-white font-bold">FM</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800">Fresh Milk</h1>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-auto">
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Fresh Milk Network
        </div>
      </div>
    </div>
  );
}
