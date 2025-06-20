
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import DeviceCard from '../components/DeviceCard';
import FaceAuthModal from '../components/FaceAuthModal';
import AlertPopup from '../components/AlertPopup';
import { Shield, Activity, Clock } from 'lucide-react';

interface Device {
  id: string;
  name: string;
  type: 'laptop' | 'door' | 'garage';
  isLocked: boolean;
}

interface AlertLog {
  id: string;
  deviceName: string;
  timestamp: Date;
  type: 'failure';
}

const DashboardPage = () => {
  const [devices, setDevices] = useState<Device[]>([
    { id: '1', name: 'MacBook Pro', type: 'laptop', isLocked: true },
    { id: '2', name: 'Front Door', type: 'door', isLocked: true },
    { id: '3', name: 'Garage Door', type: 'garage', isLocked: true },
  ]);

  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertLogs, setAlertLogs] = useState<AlertLog[]>([]);

  const handleAuthenticate = (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    if (device) {
      setSelectedDevice(device);
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = () => {
    if (selectedDevice) {
      setDevices(prev => 
        prev.map(device => 
          device.id === selectedDevice.id 
            ? { ...device, isLocked: false }
            : device
        )
      );
    }
    setShowAuthModal(false);
    setSelectedDevice(null);
  };

  const handleAuthFailure = () => {
    if (selectedDevice) {
      const newAlert: AlertLog = {
        id: Date.now().toString(),
        deviceName: selectedDevice.name,
        timestamp: new Date(),
        type: 'failure'
      };
      setAlertLogs(prev => [newAlert, ...prev]);
      setShowAlert(true);
    }
    setShowAuthModal(false);
    setSelectedDevice(null);
  };

  const getSecurityStatus = () => {
    const lockedDevices = devices.filter(d => d.isLocked).length;
    const totalDevices = devices.length;
    
    if (lockedDevices === totalDevices) {
      return { status: 'Secure', color: 'text-green-400', bgColor: 'bg-green-500/20' };
    } else if (lockedDevices === 0) {
      return { status: 'All Unlocked', color: 'text-orange-400', bgColor: 'bg-orange-500/20' };
    } else {
      return { status: 'Partial', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' };
    }
  };

  const securityStatus = getSecurityStatus();

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Security Dashboard</h1>
          <p className="text-gray-400">Monitor and control your connected devices</p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Security Status</p>
                <p className={`text-xl font-bold ${securityStatus.color}`}>
                  {securityStatus.status}
                </p>
              </div>
              <div className={`p-3 rounded-full ${securityStatus.bgColor}`}>
                <Shield className={`h-6 w-6 ${securityStatus.color}`} />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Devices</p>
                <p className="text-xl font-bold text-blue-400">{devices.length}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-500/20">
                <Activity className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Recent Alerts</p>
                <p className="text-xl font-bold text-red-400">{alertLogs.length}</p>
              </div>
              <div className="p-3 rounded-full bg-red-500/20">
                <Clock className="h-6 w-6 text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Devices Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Connected Devices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {devices.map(device => (
              <DeviceCard
                key={device.id}
                {...device}
                onAuthenticate={handleAuthenticate}
              />
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        {alertLogs.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-6">Recent Security Alerts</h2>
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="max-h-64 overflow-y-auto">
                {alertLogs.map(alert => (
                  <div key={alert.id} className="p-4 border-b border-gray-700 last:border-b-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-red-500/20 rounded-full">
                          <Shield className="h-4 w-4 text-red-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Authentication Failed</p>
                          <p className="text-gray-400 text-sm">{alert.deviceName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 text-sm">
                          {alert.timestamp.toLocaleTimeString()}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {alert.timestamp.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <FaceAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        onFailure={handleAuthFailure}
        deviceName={selectedDevice?.name || ''}
      />

      <AlertPopup
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        deviceName={alertLogs[0]?.deviceName || ''}
        timestamp={alertLogs[0]?.timestamp || new Date()}
      />
    </div>
  );
};

export default DashboardPage;
