
import { useState, useEffect, ReactNode } from "react";
import Sidebar from "../Sidebar";
import { useMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Menu, Bell, Moon, Sun, User, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const isMobile = useMobile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  // Toggle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery) {
      toast({
        title: "Search",
        description: `Searching for "${searchQuery}"`,
      });
      // In a real app, you would perform the actual search here
      setSearchQuery('');
      setShowSearch(false);
    }
  };
  
  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setTimeout(() => {
        document.getElementById('search-input')?.focus();
      }, 100);
    }
  };

  // Sample notifications
  const notifications = [
    {
      id: 1,
      title: "Unassigned Orders",
      message: "5 orders need vehicle assignment",
      time: "10 minutes ago",
      link: "/orders",
      isUnread: true,
    },
    {
      id: 2,
      title: "New Customer",
      message: "Sharma Dairy has been added",
      time: "2 hours ago",
      link: "/customers",
      isUnread: true,
    },
    {
      id: 3,
      title: "Payment Received",
      message: "₹15,000 received from ABC Enterprises",
      time: "Yesterday",
      link: "/payments",
      isUnread: false,
    },
  ];
  
  return (
    <div className="flex h-screen overflow-hidden bg-background transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b bg-card transition-all duration-200">
          <div className="flex items-center space-x-4">
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <h2 className="font-medium text-lg hidden sm:block">Milk Center</h2>
            
            {/* Search Bar - expanded on larger screens, collapsed on mobile */}
            <div className={`transition-all duration-300 ${showSearch ? 'w-full sm:w-80' : 'w-auto'}`}>
              {showSearch ? (
                <form onSubmit={handleSearch} className="relative">
                  <Input
                    id="search-input"
                    placeholder="Search orders, customers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8"
                  />
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1.5"
                    onClick={() => setShowSearch(false)}
                  >
                    Cancel
                  </Button>
                </form>
              ) : (
                <Button variant="ghost" size="icon" onClick={toggleSearch} className="text-muted-foreground">
                  <Search className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => setIsDarkMode(!isDarkMode)}>
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            {/* Notifications Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.map(notification => (
                  <DropdownMenuItem key={notification.id} className="cursor-pointer" onSelect={() => navigate(notification.link)}>
                    <div className="flex items-start gap-2 py-1">
                      <div className={`h-2 w-2 rounded-full mt-2 ${notification.isUnread ? 'bg-blue-500' : 'bg-transparent'}`}></div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{notification.title}</p>
                        <p className="text-xs text-muted-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center cursor-pointer" onSelect={() => toast({ title: "Notifications marked as read" })}>
                  Mark all as read
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-indigo-500">
                  <User className="h-5 w-5 text-white" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => navigate('/settings')}>
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => navigate('/company-profile')}>
                  Company Profile
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => navigate('/user-access')}>
                  User Access
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => navigate('/login')}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6 bg-background">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="py-4 px-6 border-t bg-card text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Milk Center. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
