
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  ClipboardList,
  CreditCard,
  BarChart3,
  FileText,
  TruckIcon,
  DollarSign,
  Tag,
  Warehouse,
  Package,
  ShoppingBag,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMobile } from "@/hooks/use-mobile";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const isMobile = useMobile();
  const [open, setOpen] = useState(true);

  const navItems: NavItem[] = [
    {
      title: "Overview",
      href: "/",
      icon: Home,
    },
    {
      title: "Order Entry",
      href: "/order-entry",
      icon: ClipboardList,
    },
    {
      title: "Invoice Generator",
      href: "/invoice-generator",
      icon: FileText,
    },
    {
      title: "Customers",
      href: "/customers",
      icon: Users,
    },
    {
      title: "Custom Rates",
      href: "/customer-rates",
      icon: Tag,
    },
    {
      title: "Payments",
      href: "/payments",
      icon: CreditCard,
    },
    {
      title: "Customer Ledger",
      href: "/customer-ledger",
      icon: FileSpreadsheet,
    },
    {
      title: "Track Sheet",
      href: "/track-sheet",
      icon: TruckIcon,
    },
    {
      title: "Expenses",
      href: "/expenses",
      icon: DollarSign,
    },
    {
      title: "Supplier Payments",
      href: "/supplier-payments",
      icon: ShoppingBag,
    },
    {
      title: "Stock Management",
      href: "/stock-management",
      icon: Package,
    },
    {
      title: "Reports",
      href: "/reports",
      icon: BarChart3,
    },
  ];

  return (
    <>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        ></div>
      )}
      <div
        className={cn(
          "fixed z-50 flex h-full flex-col border-r bg-background p-4 transition-all duration-300 md:relative md:z-0",
          isMobile
            ? isOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0 w-60"
        )}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-lg font-semibold">Milk Center Management</h1>
        </div>
        <nav className="space-y-1.5 flex-1 overflow-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={isMobile ? onClose : undefined}
            >
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  location.pathname === item.href &&
                    "bg-accent text-accent-foreground"
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
