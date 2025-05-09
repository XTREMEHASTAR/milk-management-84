
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
  UserRound,
  Database,
  Tag,
  Warehouse,
  FileSpreadsheet,
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
          active={isActive('/customer') || isActive('/customers') || isActive('/customer-directory') || isActive('/customer-rates') || isActive('/customer-ledger')}
          expanded={expanded}
        >
          <SidebarItem
            icon={Users}
            title="Customers"
            path="/customers"
            active={isActive('/customers')}
            expanded={expanded}
          />
          <SidebarItem
            icon={UserRound}
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
            icon={FileSpreadsheet}
            title="Customer Ledger"
            path="/customer-ledger"
            active={isActive('/customer-ledger')}
            expanded={expanded}
          />
          <SidebarItem
            icon={FileText}
            title="Customer Statement"
            path="/customer-statement"
            active={isActive('/customer-statement')}
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
            title="Order Entry"
            path="/order-entry"
            active={isActive('/order-entry')}
            expanded={expanded}
          />
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
          active={isActive('/delivery') || isActive('/vehicle-tracking') || isActive('/track-sheet')}
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
          active={isActive('/stock') || isActive('/stock-management') || isActive('/supplier') || isActive('/product')}
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
            icon={Package}
            title="Products"
            path="/products"
            active={isActive('/products')}
            expanded={expanded}
          />
          <SidebarItem
            icon={Tag}
            title="Product Rates"
            path="/product-rates"
            active={isActive('/product-rates')}
            expanded={expanded}
          />
          <SidebarItem
            icon={Tag}
            title="Product Categories"
            path="/product-categories"
            active={isActive('/product-categories')}
            expanded={expanded}
          />
          <SidebarItem
            icon={Tag}
            title="Bulk Rates"
            path="/bulk-rates"
            active={isActive('/bulk-rates')}
            expanded={expanded}
          />
          <SidebarItem
            icon={Warehouse}
            title="Stock Settings"
            path="/stock-settings"
            active={isActive('/stock-settings')}
            expanded={expanded}
          />
          <SidebarItem
            icon={Truck}
            title="Suppliers"
            path="/suppliers"
            active={isActive('/suppliers')}
            expanded={expanded}
          />
          <SidebarItem
            icon={UserRound}
            title="Supplier Directory"
            path="/supplier-directory"
            active={isActive('/supplier-directory')}
            expanded={expanded}
          />
          <SidebarItem
            icon={FileSpreadsheet}
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
          <SidebarItem
            icon={CreditCard}
            title="Supplier Payments"
            path="/supplier-payments"
            active={isActive('/supplier-payments')}
            expanded={expanded}
          />
        </SidebarItem>
        
        <SidebarItem
          icon={Receipt}
          title="Invoices"
          active={isActive('/invoice') || isActive('/invoice-generator') || isActive('/invoice-history') || isActive('/invoice-create') || isActive('/invoice-list')}
          expanded={expanded}
        >
          <SidebarItem
            icon={Receipt}
            title="Invoice Generator"
            path="/invoice-generator"
            active={isActive('/invoice-generator')}
            expanded={expanded}
          />
          <SidebarItem
            icon={Receipt}
            title="Invoice History"
            path="/invoice-history"
            active={isActive('/invoice-history')}
            expanded={expanded}
          />
          <SidebarItem
            icon={FileText}
            title="Create Invoice"
            path="/invoice-create"
            active={isActive('/invoice-create')}
            expanded={expanded}
          />
          <SidebarItem
            icon={Receipt}
            title="Invoice List"
            path="/invoice-list"
            active={isActive('/invoice-list')}
            expanded={expanded}
          />
        </SidebarItem>
        
        <SidebarItem
          icon={CreditCard}
          title="Payments"
          active={isActive('/payments') || isActive('/payment-list') || isActive('/payment-create') || isActive('/payment-history') || isActive('/outstanding') || isActive('/outstanding-dues')}
          expanded={expanded}
        >
          <SidebarItem
            icon={CreditCard}
            title="Payments"
            path="/payments"
            active={isActive('/payments')}
            expanded={expanded}
          />
          <SidebarItem
            icon={CreditCard}
            title="Payment List"
            path="/payment-list"
            active={isActive('/payment-list')}
            expanded={expanded}
          />
          <SidebarItem
            icon={CreditCard}
            title="Payment History"
            path="/payment-history"
            active={isActive('/payment-history')}
            expanded={expanded}
          />
          <SidebarItem
            icon={CreditCard}
            title="Create Payment"
            path="/payment-create"
            active={isActive('/payment-create')}
            expanded={expanded}
          />
          <SidebarItem
            icon={DollarSign}
            title="Outstanding"
            path="/outstanding"
            active={isActive('/outstanding')}
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
            title="All Reports"
            path="/reports"
            active={isActive('/reports')}
            expanded={expanded}
          />
          <SidebarItem
            icon={BarChart4}
            title="Sales Reports"
            path="/reports/sales"
            active={isActive('/reports/sales')}
            expanded={expanded}
          />
          <SidebarItem
            icon={BarChart4}
            title="Customer Reports"
            path="/reports/customers"
            active={isActive('/reports/customers')}
            expanded={expanded}
          />
        </SidebarItem>
        
        <SidebarItem
          icon={Database}
          title="Master"
          active={isActive('/master')}
          expanded={expanded}
        >
          <SidebarItem
            icon={Database}
            title="Master Module"
            path="/master"
            active={isActive('/master')}
            expanded={expanded}
          />
          <SidebarItem
            icon={Users}
            title="User Access"
            path="/user-access"
            active={isActive('/user-access')}
            expanded={expanded}
          />
          <SidebarItem
            icon={FileText}
            title="Financial Year"
            path="/financial-year"
            active={isActive('/financial-year')}
            expanded={expanded}
          />
          <SidebarItem
            icon={FileText}
            title="Communication"
            path="/communication"
            active={isActive('/communication')}
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
        <SidebarItem
          icon={FileText}
          title="Company Profile"
          path="/company-profile"
          active={isActive('/company-profile')}
          expanded={expanded}
        />
      </div>
    </div>
  );
};

export default Sidebar;
