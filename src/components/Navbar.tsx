
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Shield, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-blue-500" />
          <h1 className="text-2xl font-bold text-white">AI-GUARDIAN</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Lock className="h-5 w-5 text-green-400" />
            <span className="text-sm text-gray-300">Secured</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-300">Welcome, {user?.name}</span>
            <button
              onClick={logout}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg text-white text-sm transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
