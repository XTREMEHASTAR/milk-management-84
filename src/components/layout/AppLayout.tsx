
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-16 md:ml-64 transition-all duration-300">
        <Header />
        <main className="container mx-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
