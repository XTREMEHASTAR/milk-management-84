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
  Database,
  Settings,
  UserRound,
  Truck,
  Receipt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMobile } from "@/hooks/use-mobile";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const isMobile = useMobile();
  const [open, setOpen] = useState(true);

  const navGroups: NavGroup[] = [
    {
      title: "Dashboard",
      items: [
        {
          title: "Overview",
          href: "/",
          icon: Home,
        }
      ]
    },
    {
      title: "Orders & Billing",
      items: [
        {
          title: "Order Entry",
          href: "/order-entry",
          icon: ClipboardList,
        },
        {
          title: "Invoice Generator",
          href: "/invoice-generator",
          icon: Receipt,
        },
        {
          title: "Track Sheet",
          href: "/track-sheet",
          icon: Truck,
        },
      ]
    },
    {
      title: "Customers",
      items: [
        {
          title: "Customers",
          href: "/customers",
          icon: Users,
        },
        {
          title: "Customer Directory",
          href: "/customer-directory",
          icon: UserRound,
        },
        {
          title: "Customer Rates",
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
      ]
    },
    {
      title: "Inventory",
      items: [
        {
          title: "Stock Management",
          href: "/stock-management",
          icon: Package,
        },
        {
          title: "Products",
          href: "/products",
          icon: Package,
        },
        {
          title: "Product Rates",
          href: "/product-rates",
          icon: Tag,
        },
        {
          title: "Bulk Rate Update",
          href: "/bulk-rates",
          icon: Database,
        },
      ]
    },
    {
      title: "Suppliers",
      items: [
        {
          title: "Suppliers",
          href: "/suppliers",
          icon: Truck,
        },
        {
          title: "Supplier Payments",
          href: "/supplier-payments",
          icon: ShoppingBag,
        },
        {
          title: "Supplier Ledger",
          href: "/supplier-ledger",
          icon: FileSpreadsheet,
        },
        {
          title: "Purchase History",
          href: "/purchase-history",
          icon: ShoppingBag,
        },
      ]
    },
    {
      title: "Finance",
      items: [
        {
          title: "Expenses",
          href: "/expenses",
          icon: DollarSign,
        },
        {
          title: "Reports",
          href: "/reports",
          icon: BarChart3,
        },
      ]
    },
    {
      title: "Finances",
      items: [
        {
          title: "Payments",
          href: "/payments",
          icon: CreditCard,
        },
        {
          title: "Outstanding",
          href: "/outstanding",
          icon: DollarSign,
        },
        {
          title: "Reports",
          href: "/reports",
          icon: FileText,
        },
      ]
    },
    {
      title: "Settings",
      items: [
        {
          title: "Master Module",
          href: "/master",
          icon: Database,
        },
        {
          title: "Product Categories",
          href: "/product-categories",
          icon: Tag,
        },
        {
          title: "Stock Settings",
          href: "/stock-settings",
          icon: Settings,
        },
      ]
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
            : "translate-x-0 w-64"
        )}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-lg font-semibold">Milk Center Management</h1>
        </div>
        <nav className="space-y-1.5 flex-1 overflow-auto">
          {navGroups.map((group, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground ml-2 mb-1">
                {group.title}
              </h3>
              {group.items.map((item) => (
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
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}
