
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import DeviceCard from '../components/DeviceCard';
import FaceAuthModal from '../components/FaceAuthModal';
import AlertPopup from '../components/AlertPopup';
import { Shield, Activity, Clock, Wifi, WifiOff, Settings, Bell, TrendingUp, Eye, Lock } from 'lucide-react';

interface Device {
  id: string;
  name: string;
  type: 'laptop' | 'door' | 'garage';
  isLocked: boolean;
  isOnline: boolean;
  batteryLevel?: number;
  lastActivity: Date;
  location?: string;
}

interface AlertLog {
  id: string;
  deviceName: string;
  timestamp: Date;
  type: 'failure' | 'success' | 'offline' | 'battery_low';
  description: string;
}

interface SecurityStats {
  totalAttempts: number;
  successfulAuths: number;
  failedAttempts: number;
  devicesOnline: number;
}

const DashboardPage = () => {
  const [devices, setDevices] = useState<Device[]>([
    { 
      id: '1', 
      name: 'MacBook Pro', 
      type: 'laptop', 
      isLocked: true, 
      isOnline: true, 
      batteryLevel: 87,
      lastActivity: new Date(Date.now() - 5 * 60000),
      location: 'Home Office'
    },
    { 
      id: '2', 
      name: 'Front Door', 
      type: 'door', 
      isLocked: true, 
      isOnline: true,
      lastActivity: new Date(Date.now() - 30 * 60000),
      location: 'Main Entrance'
    },
    { 
      id: '3', 
      name: 'Garage Door', 
      type: 'garage', 
      isLocked: true, 
      isOnline: false,
      batteryLevel: 15,
      lastActivity: new Date(Date.now() - 2 * 60 * 60000),
      location: 'Garage'
    },
  ]);

  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertLogs, setAlertLogs] = useState<AlertLog[]>([]);
  const [securityStats, setSecurityStats] = useState<SecurityStats>({
    totalAttempts: 0,
    successfulAuths: 0,
    failedAttempts: 0,
    devicesOnline: 3
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate device status changes
      setDevices(prev => prev.map(device => ({
        ...device,
        isOnline: Math.random() > 0.1, // 90% uptime
        batteryLevel: device.batteryLevel ? Math.max(0, device.batteryLevel - Math.random() * 0.5) : undefined
      })));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleAuthenticate = (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    if (device) {
      setSelectedDevice(device);
      setShowAuthModal(true);
    }
  };

  const handleToggleLock = (deviceId: string, shouldLock: boolean) => {
    setDevices(prev => 
      prev.map(device => 
        device.id === deviceId 
          ? { ...device, isLocked: shouldLock, lastActivity: new Date() }
          : device
      )
    );

    // Log the manual lock/unlock action
    const device = devices.find(d => d.id === deviceId);
    if (device) {
      const newAlert: AlertLog = {
        id: Date.now().toString(),
        deviceName: device.name,
        timestamp: new Date(),
        type: 'success',
        description: `Device ${shouldLock ? 'locked' : 'unlocked'} manually`
      };
      setAlertLogs(prev => [newAlert, ...prev.slice(0, 49)]); // Keep last 50 logs
    }
  };

  const handleAuthSuccess = () => {
    if (selectedDevice) {
      setDevices(prev => 
        prev.map(device => 
          device.id === selectedDevice.id 
            ? { ...device, isLocked: false, lastActivity: new Date() }
            : device
        )
      );

      // Update stats and logs
      setSecurityStats(prev => ({
        ...prev,
        totalAttempts: prev.totalAttempts + 1,
        successfulAuths: prev.successfulAuths + 1
      }));

      const newAlert: AlertLog = {
        id: Date.now().toString(),
        deviceName: selectedDevice.name,
        timestamp: new Date(),
        type: 'success',
        description: 'Biometric authentication successful'
      };
      setAlertLogs(prev => [newAlert, ...prev.slice(0, 49)]);
    }
    setShowAuthModal(false);
    setSelectedDevice(null);
  };

  const handleAuthFailure = () => {
    if (selectedDevice) {
      // Update stats and logs
      setSecurityStats(prev => ({
        ...prev,
        totalAttempts: prev.totalAttempts + 1,
        failedAttempts: prev.failedAttempts + 1
      }));

      const newAlert: AlertLog = {
        id: Date.now().toString(),
        deviceName: selectedDevice.name,
        timestamp: new Date(),
        type: 'failure',
        description: 'Biometric authentication failed - Unauthorized access attempt'
      };
      setAlertLogs(prev => [newAlert, ...prev.slice(0, 49)]);
      setShowAlert(true);
    }
    setShowAuthModal(false);
    setSelectedDevice(null);
  };

  const getSecurityStatus = () => {
    const lockedDevices = devices.filter(d => d.isLocked).length;
    const totalDevices = devices.length;
    const onlineDevices = devices.filter(d => d.isOnline).length;
    
    if (lockedDevices === totalDevices && onlineDevices === totalDevices) {
      return { status: 'Fully Secured', color: 'text-green-400', bgColor: 'bg-green-500/20' };
    } else if (lockedDevices === 0) {
      return { status: 'All Unlocked', color: 'text-red-400', bgColor: 'bg-red-500/20' };
    } else if (onlineDevices < totalDevices) {
      return { status: 'Partial Coverage', color: 'text-orange-400', bgColor: 'bg-orange-500/20' };
    } else {
      return { status: 'Partially Secured', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' };
    }
  };

  const securityStatus = getSecurityStatus();
  const onlineDevices = devices.filter(d => d.isOnline).length;
  const criticalAlerts = alertLogs.filter(log => log.type === 'failure').length;

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Security Command Center</h1>
              <p className="text-gray-400">Real-time monitoring and control of your connected devices</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-lg border border-gray-700 transition-colors">
                <Settings className="h-5 w-5" />
              </button>
              <button className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-lg border border-gray-700 transition-colors relative">
                <Bell className="h-5 w-5" />
                {criticalAlerts > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {criticalAlerts}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
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

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Devices Online</p>
                <p className="text-xl font-bold text-blue-400">{onlineDevices}/{devices.length}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-500/20">
                {onlineDevices === devices.length ? (
                  <Wifi className="h-6 w-6 text-blue-400" />
                ) : (
                  <WifiOff className="h-6 w-6 text-orange-400" />
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Auth Success Rate</p>
                <p className="text-xl font-bold text-green-400">
                  {securityStats.totalAttempts > 0 
                    ? Math.round((securityStats.successfulAuths / securityStats.totalAttempts) * 100)
                    : 100}%
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-500/20">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Security Alerts</p>
                <p className="text-xl font-bold text-red-400">{criticalAlerts}</p>
              </div>
              <div className="p-3 rounded-full bg-red-500/20">
                <Eye className="h-6 w-6 text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Activity Feed */}
        {alertLogs.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Live Activity Feed</span>
            </h2>
            <div className="bg-gray-800 rounded-xl border border-gray-700 max-h-48 overflow-y-auto">
              {alertLogs.slice(0, 10).map(alert => (
                <div key={alert.id} className="p-4 border-b border-gray-700 last:border-b-0 hover:bg-gray-750 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        alert.type === 'success' ? 'bg-green-500/20' :
                        alert.type === 'failure' ? 'bg-red-500/20' :
                        alert.type === 'offline' ? 'bg-orange-500/20' :
                        'bg-yellow-500/20'
                      }`}>
                        {alert.type === 'success' ? (
                          <Shield className="h-4 w-4 text-green-400" />
                        ) : alert.type === 'failure' ? (
                          <Lock className="h-4 w-4 text-red-400" />
                        ) : (
                          <Activity className="h-4 w-4 text-orange-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{alert.description}</p>
                        <p className="text-gray-400 text-xs">{alert.deviceName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-xs">
                        {alert.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Devices Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Connected Devices</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {devices.map(device => (
              <DeviceCard
                key={device.id}
                {...device}
                onAuthenticate={handleAuthenticate}
                onToggleLock={handleToggleLock}
              />
            ))}
          </div>
        </div>

        {/* Detailed Security Logs */}
        {alertLogs.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Security Event History</span>
            </h2>
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="max-h-96 overflow-y-auto">
                {alertLogs.map(alert => (
                  <div key={alert.id} className="p-4 border-b border-gray-700 last:border-b-0 hover:bg-gray-750 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${
                          alert.type === 'success' ? 'bg-green-500/20' :
                          alert.type === 'failure' ? 'bg-red-500/20' :
                          alert.type === 'offline' ? 'bg-orange-500/20' :
                          'bg-yellow-500/20'
                        }`}>
                          {alert.type === 'success' ? (
                            <Shield className="h-4 w-4 text-green-400" />
                          ) : alert.type === 'failure' ? (
                            <Lock className="h-4 w-4 text-red-400" />
                          ) : (
                            <Activity className="h-4 w-4 text-orange-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium">{alert.description}</p>
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
