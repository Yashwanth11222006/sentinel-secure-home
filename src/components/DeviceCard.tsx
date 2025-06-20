
import React, { useState } from 'react';
import { Laptop, DoorClosed, DoorOpen, Garage, Lock, Unlock } from 'lucide-react';

interface DeviceCardProps {
  id: string;
  name: string;
  type: 'laptop' | 'door' | 'garage';
  isLocked: boolean;
  onAuthenticate: (deviceId: string) => void;
}

const DeviceCard = ({ id, name, type, isLocked, onAuthenticate }: DeviceCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const getDeviceIcon = () => {
    switch (type) {
      case 'laptop':
        return <Laptop className="h-12 w-12" />;
      case 'door':
        return isLocked ? <DoorClosed className="h-12 w-12" /> : <DoorOpen className="h-12 w-12" />;
      case 'garage':
        return <Garage className="h-12 w-12" />;
      default:
        return <Lock className="h-12 w-12" />;
    }
  };

  const handleAuthenticate = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
    onAuthenticate(id);
    setIsLoading(false);
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
      <div className="flex flex-col items-center space-y-4">
        <div className={`p-4 rounded-full ${isLocked ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
          {getDeviceIcon()}
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white">{name}</h3>
          <div className="flex items-center justify-center space-x-2 mt-2">
            {isLocked ? (
              <Lock className="h-4 w-4 text-red-400" />
            ) : (
              <Unlock className="h-4 w-4 text-green-400" />
            )}
            <span className={`text-sm ${isLocked ? 'text-red-400' : 'text-green-400'}`}>
              {isLocked ? 'Locked' : 'Unlocked'}
            </span>
          </div>
        </div>
        
        <button
          onClick={handleAuthenticate}
          disabled={isLoading || !isLocked}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            isLocked
              ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg hover:shadow-blue-500/30'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Authenticating...</span>
            </div>
          ) : isLocked ? (
            'Authenticate'
          ) : (
            'Authenticated'
          )}
        </button>
      </div>
    </div>
  );
};

export default DeviceCard;
