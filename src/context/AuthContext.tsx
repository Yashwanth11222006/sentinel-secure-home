
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  faceData?: string; // Base64 encoded face image for biometric matching
  enrollmentDate?: Date;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, faceData?: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  updateFaceData: (faceData: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('ai-guardian-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - check if user exists in localStorage
    const existingUsers = JSON.parse(localStorage.getItem('ai-guardian-users') || '[]');
    const foundUser = existingUsers.find((u: User) => u.email === email);
    
    if (foundUser && password.length >= 6) {
      setUser(foundUser);
      localStorage.setItem('ai-guardian-user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string, faceData?: string): Promise<boolean> => {
    if (password.length >= 6) {
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        faceData,
        enrollmentDate: new Date()
      };
      
      // Save to users list
      const existingUsers = JSON.parse(localStorage.getItem('ai-guardian-users') || '[]');
      existingUsers.push(newUser);
      localStorage.setItem('ai-guardian-users', JSON.stringify(existingUsers));
      
      setUser(newUser);
      localStorage.setItem('ai-guardian-user', JSON.stringify(newUser));
      return true;
    }
    return false;
  };

  const updateFaceData = (faceData: string) => {
    if (user) {
      const updatedUser = { ...user, faceData, enrollmentDate: new Date() };
      setUser(updatedUser);
      localStorage.setItem('ai-guardian-user', JSON.stringify(updatedUser));
      
      // Update in users list
      const existingUsers = JSON.parse(localStorage.getItem('ai-guardian-users') || '[]');
      const updatedUsers = existingUsers.map((u: User) => 
        u.id === user.id ? updatedUser : u
      );
      localStorage.setItem('ai-guardian-users', JSON.stringify(updatedUsers));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ai-guardian-user');
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    updateFaceData
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
