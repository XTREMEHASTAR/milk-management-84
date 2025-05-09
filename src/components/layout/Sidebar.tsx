
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Truck,
  Package,
  Receipt,
  CreditCard,
  Settings,
  ChevronRight,
  ChevronDown,
  Map,
  FileText,
  DollarSign,
  Clock,
  Percent,
  AlertCircle,
  ChevronLeft,
  Home,
  BarChart4,
} from 'lucide-react';

interface SidebarItemProps {
  icon: React.ElementType;
  title: string;
  path?: string;
  active?: boolean;
  children?: React.ReactNode;
  expanded?: boolean;
  onClick?: () => void;
}

interface SidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  title,
  path,
  active,
  children,
  expanded,
  onClick
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (children) {
    return (
      <div className="space-y-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center w-full rounded-lg px-3 py-2 text-sm transition-colors text-left",
            active
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          )}
        >
          <Icon className="h-4 w-4 mr-3" />
          {expanded && (
            <>
              <span className="flex-1">{title}</span>
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </>
          )}
        </button>
        {isOpen && expanded && (
          <div className="pl-8 pt-1 space-y-1">
            {children}
          </div>
        )}
      </div>
    );
  }

  if (path) {
    return (
      <Link
        to={path}
        className={cn(
          "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
          active
            ? "bg-primary text-primary-foreground"
            : "hover:bg-muted"
        )}
      >
        <Icon className="h-4 w-4 mr-3" />
        {expanded && <span>{title}</span>}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center rounded-lg px-3 py-2 text-sm transition-colors w-full text-left",
        active
          ? "bg-primary text-primary-foreground"
          : "hover:bg-muted"
      )}
    >
      <Icon className="h-4 w-4 mr-3" />
      {expanded && <span>{title}</span>}
    </button>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ collapsed, toggleSidebar }) => {
  const location = useLocation();
  const expanded = !collapsed;

  // Function to check if a path is active (exact match or starts with for nested routes)
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div 
      className={cn(
        "h-screen fixed top-0 left-0 z-40 flex flex-col border-r bg-background transition-all duration-300",
        expanded ? "w-64" : "w-16"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b">
        {expanded ? (
          <h2 className="text-lg font-semibold">Milk Center</h2>
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
            M
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="h-8 w-8"
        >
          {expanded ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <SidebarItem
          icon={Home}
          title="Dashboard"
          path="/"
          active={isActive('/')}
          expanded={expanded}
        />
        
        <SidebarItem
          icon={Users}
          title="Customers"
          active={isActive('/customers') || isActive('/customer-directory')}
          expanded={expanded}
        >
          <SidebarItem
            icon={Users}
            title="Customer Directory"
            path="/customer-directory"
            active={isActive('/customer-directory')}
            expanded={expanded}
          />
          <SidebarItem
            icon={Percent}
            title="Customer Rates"
            path="/customer-rates"
            active={isActive('/customer-rates')}
            expanded={expanded}
          />
          <SidebarItem
            icon={FileText}
            title="Customer Ledger"
            path="/customer-ledger"
            active={isActive('/customer-ledger')}
            expanded={expanded}
          />
        </SidebarItem>
        
        <SidebarItem
          icon={ShoppingCart}
          title="Orders"
          active={isActive('/orders') || isActive('/order-entry')}
          expanded={expanded}
        >
          <SidebarItem
            icon={ShoppingCart}
            title="Order List"
            path="/orders"
            active={isActive('/orders')}
            expanded={expanded}
          />
          <SidebarItem
            icon={Map}
            title="Area Management"
            path="/area-management"
            active={isActive('/area-management')}
            expanded={expanded}
          />
        </SidebarItem>
        
        <SidebarItem
          icon={Truck}
          title="Delivery"
          active={isActive('/delivery')}
          expanded={expanded}
        >
          <SidebarItem
            icon={Truck}
            title="Vehicle Tracking"
            path="/vehicle-tracking"
            active={isActive('/vehicle-tracking')}
            expanded={expanded}
          />
          <SidebarItem
            icon={Clock}
            title="Track Sheet"
            path="/track-sheet"
            active={isActive('/track-sheet')}
            expanded={expanded}
          />
        </SidebarItem>
        
        <SidebarItem
          icon={Package}
          title="Stock"
          active={isActive('/stock-management')}
          expanded={expanded}
        >
          <SidebarItem
            icon={Package}
            title="Stock Management"
            path="/stock-management"
            active={isActive('/stock-management')}
            expanded={expanded}
          />
          <SidebarItem
            icon={Truck}
            title="Suppliers"
            path="/supplier-directory"
            active={isActive('/supplier-directory')}
            expanded={expanded}
          />
          <SidebarItem
            icon={FileText}
            title="Supplier Ledger"
            path="/supplier-ledger"
            active={isActive('/supplier-ledger')}
            expanded={expanded}
          />
          <SidebarItem
            icon={ShoppingCart}
            title="Purchase History"
            path="/purchase-history"
            active={isActive('/purchase-history')}
            expanded={expanded}
          />
        </SidebarItem>
        
        <SidebarItem
          icon={Receipt}
          title="Invoices"
          active={isActive('/invoice')}
          expanded={expanded}
        >
          <SidebarItem
            icon={Receipt}
            title="Invoice List"
            path="/invoice-list"
            active={isActive('/invoice-list')}
            expanded={expanded}
          />
          <SidebarItem
            icon={FileText}
            title="Create Invoice"
            path="/invoice-create"
            active={isActive('/invoice-create')}
            expanded={expanded}
          />
        </SidebarItem>
        
        <SidebarItem
          icon={CreditCard}
          title="Payments"
          active={isActive('/payments')}
          expanded={expanded}
        >
          <SidebarItem
            icon={CreditCard}
            title="Payment History"
            path="/payment-history"
            active={isActive('/payment-history')}
            expanded={expanded}
          />
          <SidebarItem
            icon={DollarSign}
            title="Outstanding Dues"
            path="/outstanding-dues"
            active={isActive('/outstanding-dues')}
            expanded={expanded}
          />
          <SidebarItem
            icon={AlertCircle}
            title="Expenses"
            path="/expenses"
            active={isActive('/expenses')}
            expanded={expanded}
          />
        </SidebarItem>
        
        <SidebarItem
          icon={BarChart4}
          title="Reports"
          active={isActive('/reports')}
          expanded={expanded}
        >
          <SidebarItem
            icon={BarChart4}
            title="Sales Report"
            path="/reports/sales"
            active={isActive('/reports/sales')}
            expanded={expanded}
          />
          <SidebarItem
            icon={BarChart4}
            title="Customer Report"
            path="/reports/customers"
            active={isActive('/reports/customers')}
            expanded={expanded}
          />
        </SidebarItem>
      </div>
      
      <div className="p-4 border-t">
        <SidebarItem
          icon={Settings}
          title="Settings"
          path="/settings"
          active={isActive('/settings')}
          expanded={expanded}
        />
      </div>
    </div>
  );
};

export default Sidebar;
