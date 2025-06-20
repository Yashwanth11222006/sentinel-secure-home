
import React, { useState } from 'react';
import { Laptop, DoorClosed, DoorOpen, Car, Lock, Unlock, Shield, AlertTriangle } from 'lucide-react';

interface DeviceCardProps {
  id: string;
  name: string;
  type: 'laptop' | 'door' | 'garage';
  isLocked: boolean;
  isOnline: boolean;
  batteryLevel?: number;
  lastActivity?: Date;
  onAuthenticate: (deviceId: string) => void;
  onToggleLock: (deviceId: string, shouldLock: boolean) => void;
}

const DeviceCard = ({ 
  id, 
  name, 
  type, 
  isLocked, 
  isOnline, 
  batteryLevel, 
  lastActivity, 
  onAuthenticate, 
  onToggleLock 
}: DeviceCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const getDeviceIcon = () => {
    switch (type) {
      case 'laptop':
        return <Laptop className="h-12 w-12" />;
      case 'door':
        return isLocked ? <DoorClosed className="h-12 w-12" /> : <DoorOpen className="h-12 w-12" />;
      case 'garage':
        return <Car className="h-12 w-12" />;
      default:
        return <Lock className="h-12 w-12" />;
    }
  };

  const handleAuthenticate = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onAuthenticate(id);
    setIsLoading(false);
  };

  const handleToggleLock = async (shouldLock: boolean) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    onToggleLock(id, shouldLock);
    setIsLoading(false);
  };

  const getLastActivityText = () => {
    if (!lastActivity) return 'No recent activity';
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Active now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className={`bg-gray-800 rounded-xl p-6 border transition-all duration-300 hover:shadow-lg ${
      isOnline 
        ? 'border-gray-700 hover:border-blue-500 hover:shadow-blue-500/20' 
        : 'border-red-500/50 hover:border-red-500'
    }`}>
      <div className="flex flex-col space-y-4">
        {/* Device Header */}
        <div className="flex items-center justify-between">
          <div className={`p-4 rounded-full ${isLocked ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
            {getDeviceIcon()}
          </div>
          
          <div className="flex flex-col items-end space-y-1">
            <div className={`flex items-center space-x-2 px-2 py-1 rounded-full text-xs ${
              isOnline ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span>{isOnline ? 'Online' : 'Offline'}</span>
            </div>
            
            {batteryLevel !== undefined && (
              <div className={`text-xs px-2 py-1 rounded ${
                batteryLevel > 20 ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'
              }`}>
                {batteryLevel}% battery
              </div>
            )}
          </div>
        </div>

        {/* Device Info */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white">{name}</h3>
          <div className="flex items-center justify-center space-x-2 mt-2">
            {isLocked ? (
              <Lock className="h-4 w-4 text-red-400" />
            ) : (
              <Unlock className="h-4 w-4 text-green-400" />
            )}
            <span className={`text-sm ${isLocked ? 'text-red-400' : 'text-green-400'}`}>
              {isLocked ? 'Secured' : 'Unlocked'}
            </span>
          </div>
          
          <p className="text-xs text-gray-400 mt-1">{getLastActivityText()}</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {isLocked ? (
            <button
              onClick={handleAuthenticate}
              disabled={isLoading || !isOnline}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                isOnline
                  ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg hover:shadow-blue-500/30'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Authenticating...</span>
                </div>
              ) : (
                <>
                  <Shield className="h-4 w-4 inline mr-2" />
                  Unlock with Biometric
                </>
              )}
            </button>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2 text-green-400 bg-green-500/10 py-2 px-4 rounded-lg">
                <Shield className="h-4 w-4" />
                <span className="text-sm">Device Unlocked</span>
              </div>
              
              <button
                onClick={() => handleToggleLock(true)}
                disabled={isLoading || !isOnline}
                className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                  isOnline
                    ? 'bg-orange-600 hover:bg-orange-700 text-white'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                    <span>Locking...</span>
                  </div>
                ) : (
                  <>
                    <Lock className="h-3 w-3 inline mr-2" />
                    Secure Device
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {!isOnline && (
          <div className="flex items-center justify-center space-x-2 text-red-400 bg-red-500/10 py-2 px-3 rounded-lg">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-xs">Device Offline</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeviceCard;
