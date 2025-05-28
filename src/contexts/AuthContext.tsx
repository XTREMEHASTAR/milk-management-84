
import React, { createContext, useContext, useEffect, useState } from 'react';
import bcryptjs from 'bcryptjs';

// Define types for our auth context
interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Salt rounds for password hashing
const SALT_ROUNDS = 10;

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check if user is already logged in on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Get users from local storage
      const usersJson = localStorage.getItem('users');
      if (!usersJson) return false;
      
      const users = JSON.parse(usersJson);
      const foundUser = users.find((u: any) => u.email === email);
      
      if (!foundUser) return false;
      
      // Compare password hash
      const match = await bcryptjs.compare(password, foundUser.passwordHash);
      
      if (match) {
        // Store user info but not the password
        const userInfo = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email
        };
        
        setUser(userInfo);
        setIsAuthenticated(true);
        localStorage.setItem('currentUser', JSON.stringify(userInfo));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Check if users store exists
      const usersJson = localStorage.getItem('users');
      const users = usersJson ? JSON.parse(usersJson) : [];
      
      // Check if user already exists
      if (users.some((u: any) => u.email === email)) {
        return false;
      }
      
      // Hash password
      const passwordHash = await bcryptjs.hash(password, SALT_ROUNDS);
      
      // Create new user
      const newUser = {
        id: `user_${Date.now()}`,
        name,
        email,
        passwordHash
      };
      
      // Add to users list
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Auto login after signup
      const userInfo = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      };
      
      setUser(userInfo);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(userInfo));
      
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  // Provide auth context to children
  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
