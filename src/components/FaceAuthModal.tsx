
import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { X, Camera, Upload, CheckCircle, XCircle } from 'lucide-react';

interface FaceAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onFailure: () => void;
  deviceName: string;
}

const FaceAuthModal = ({ isOpen, onClose, onSuccess, onFailure, deviceName }: FaceAuthModalProps) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [authResult, setAuthResult] = useState<'success' | 'failure' | null>(null);
  const webcamRef = useRef<Webcam>(null);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      setIsCapturing(false);
    }
  }, []);

  const processAuthentication = async () => {
    setIsProcessing(true);
    
    // Simulate biometric processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock authentication result (70% success rate)
    const isSuccess = Math.random() > 0.3;
    
    setAuthResult(isSuccess ? 'success' : 'failure');
    setIsProcessing(false);
    
    setTimeout(() => {
      if (isSuccess) {
        onSuccess();
      } else {
        onFailure();
      }
      handleClose();
    }, 1500);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => {
    setCapturedImage(null);
    setIsCapturing(false);
    setIsProcessing(false);
    setAuthResult(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl max-w-md w-full p-6 border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Biometric Authentication</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="text-center mb-6">
          <p className="text-gray-300">Authenticate to unlock <span className="text-blue-400 font-medium">{deviceName}</span></p>
        </div>

        {!capturedImage && !isCapturing && (
          <div className="space-y-4">
            <button
              onClick={() => setIsCapturing(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            >
              <Camera className="h-5 w-5" />
              <span>Use Camera</span>
            </button>
            
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                <Upload className="h-5 w-5" />
                <span>Upload Image</span>
              </button>
            </div>
          </div>
        )}

        {isCapturing && (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                className="w-full h-64 object-cover"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={capture}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Capture
              </button>
              <button
                onClick={() => setIsCapturing(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {capturedImage && !isProcessing && authResult === null && (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden">
              <img src={capturedImage} alt="Captured" className="w-full h-64 object-cover" />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={processAuthentication}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Authenticate
              </button>
              <button
                onClick={() => setCapturedImage(null)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Retake
              </button>
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-white">Processing biometric data...</p>
            <p className="text-gray-400 text-sm mt-2">Analyzing facial features</p>
          </div>
        )}

        {authResult && (
          <div className="text-center py-8">
            {authResult === 'success' ? (
              <>
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <p className="text-green-400 text-lg font-medium">Authentication Successful!</p>
                <p className="text-gray-400 text-sm mt-2">Access granted</p>
              </>
            ) : (
              <>
                <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <p className="text-red-400 text-lg font-medium">Authentication Failed!</p>
                <p className="text-gray-400 text-sm mt-2">Access denied</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FaceAuthModal;
