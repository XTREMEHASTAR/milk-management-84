
import React from "react";

interface LoginLayoutProps {
  children: React.ReactNode;
}

export default function LoginLayout({ children }: LoginLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#131519] to-[#1e2227]">
      <div className="w-full max-w-md p-8 space-y-8 bg-black/30 backdrop-blur-md rounded-lg shadow-xl">
        {children}
      </div>
    </div>
  );
}
