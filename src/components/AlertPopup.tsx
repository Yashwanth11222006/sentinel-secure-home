
import React, { useEffect, useState } from 'react';
import { AlertTriangle, X, Clock } from 'lucide-react';

interface AlertPopupProps {
  isOpen: boolean;
  onClose: () => void;
  deviceName: string;
  timestamp: Date;
}

const AlertPopup = ({ isOpen, onClose, deviceName, timestamp }: AlertPopupProps) => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Play alert sound
      playAlertSound();
      
      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  const playAlertSound = () => {
    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(context);
      
      // Create a simple siren-like sound
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      oscillator.frequency.setValueAtTime(800, context.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, context.currentTime + 0.5);
      oscillator.frequency.exponentialRampToValueAtTime(800, context.currentTime + 1);
      
      gainNode.gain.setValueAtTime(0.3, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 1);
      
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 1);
    } catch (error) {
      console.log('Audio not supported:', error);
    }
  };

  useEffect(() => {
    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [audioContext]);

  if (!isOpen) return null;

  return (
    <>
      {/* Red overlay */}
      <div className="fixed inset-0 bg-red-600 bg-opacity-20 animate-pulse z-40" />
      
      {/* Alert modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-red-900 border-2 border-red-500 rounded-xl max-w-md w-full p-6 animate-scale-in shadow-2xl">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-8 w-8 text-red-400 animate-bounce" />
              <h2 className="text-xl font-bold text-white">SECURITY ALERT</h2>
            </div>
            <button
              onClick={onClose}
              className="text-red-400 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-red-800 rounded-lg p-4">
              <p className="text-red-200 font-medium">
                Unauthorized access attempt detected!
              </p>
              <p className="text-red-300 text-sm mt-1">
                Device: <span className="font-medium">{deviceName}</span>
              </p>
            </div>

            <div className="flex items-center space-x-2 text-red-300">
              <Clock className="h-4 w-4" />
              <span className="text-sm">
                {timestamp.toLocaleString()}
              </span>
            </div>

            <div className="bg-red-800 rounded-lg p-3">
              <p className="text-red-200 text-sm">
                • Biometric authentication failed
              </p>
              <p className="text-red-200 text-sm">
                • Device remains locked
              </p>
              <p className="text-red-200 text-sm">
                • Incident has been logged
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Acknowledge Alert
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AlertPopup;
