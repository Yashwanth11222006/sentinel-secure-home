
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, LogOut, User, Settings, Bell, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  if (!isAuthenticated) return null;

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-4 py-3 sticky top-0 z-40 backdrop-blur-sm bg-gray-900/95">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-blue-500" />
            <div>
              <h1 className="text-2xl font-bold text-white">AI-GUARDIAN</h1>
              <p className="text-xs text-gray-400 hidden sm:block">Security Command Center</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Security Status Indicator */}
          <div className="hidden md:flex items-center space-x-2 bg-green-500/20 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-400 font-medium">System Secure</span>
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <div className="hidden sm:block text-right">
                <p className="text-sm text-white font-medium">{user?.name}</p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-xl border border-gray-700 shadow-2xl py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{user?.name}</p>
                      <p className="text-gray-400 text-sm">{user?.email}</p>
                      {user?.enrollmentDate && (
                        <p className="text-green-400 text-xs">
                          Biometric enrolled: {user.enrollmentDate.toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="py-2">
                  <button className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center space-x-3">
                    <User className="h-4 w-4" />
                    <span>Profile Settings</span>
                  </button>
                  <button className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center space-x-3">
                    <Settings className="h-4 w-4" />
                    <span>Security Settings</span>
                  </button>
                  <button className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center space-x-3">
                    <Shield className="h-4 w-4" />
                    <span>Biometric Management</span>
                  </button>
                </div>

                <div className="border-t border-gray-700 pt-2">
                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors flex items-center space-x-3"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
          >
            {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-gray-800 mt-3 pt-3">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-2 rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-400 font-medium">System Secure</span>
            </div>
            <button className="w-full text-left p-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
              Profile Settings
            </button>
            <button className="w-full text-left p-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
              Security Settings
            </button>
            <button
              onClick={() => {
                logout();
                setShowMobileMenu(false);
              }}
              className="w-full text-left p-3 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
