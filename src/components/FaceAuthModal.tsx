
import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { X, Camera, Upload, CheckCircle, XCircle, Shield, AlertTriangle, Scan } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface FaceAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onFailure: () => void;
  deviceName: string;
}

const FaceAuthModal = ({ isOpen, onClose, onSuccess, onFailure, deviceName }: FaceAuthModalProps) => {
  const { user } = useAuth();
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [authResult, setAuthResult] = useState<'success' | 'failure' | null>(null);
  const [matchingPercentage, setMatchingPercentage] = useState<number>(0);
  const webcamRef = useRef<Webcam>(null);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      setIsCapturing(false);
    }
  }, []);

  const simulateBiometricMatching = async (capturedFace: string, enrolledFace: string): Promise<{ match: boolean; confidence: number }> => {
    // Simulate advanced biometric processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock matching algorithm - in reality this would use AI/ML for face comparison
    const baseMatch = Math.random();
    let confidence = 0;
    
    // Simulate higher match probability if faces are "similar" (in reality, this would be actual face comparison)
    if (enrolledFace && capturedFace) {
      // Mock: if images have similar length (simple mock), higher chance of match
      const lengthSimilarity = Math.abs(enrolledFace.length - capturedFace.length) / Math.max(enrolledFace.length, capturedFace.length);
      confidence = Math.max(0.3, 0.9 - lengthSimilarity) * 100;
      
      // 75% chance of successful match for demo purposes
      const match = baseMatch > 0.25;
      return { match, confidence: Math.round(confidence) };
    }
    
    return { match: false, confidence: 0 };
  };

  const processAuthentication = async () => {
    if (!capturedImage || !user?.faceData) {
      setAuthResult('failure');
      setTimeout(() => {
        onFailure();
        handleClose();
      }, 1500);
      return;
    }

    setIsProcessing(true);
    setMatchingPercentage(0);

    // Simulate progressive matching
    const progressInterval = setInterval(() => {
      setMatchingPercentage(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      const { match, confidence } = await simulateBiometricMatching(capturedImage, user.faceData);
      
      clearInterval(progressInterval);
      setMatchingPercentage(100);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAuthResult(match ? 'success' : 'failure');
      setIsProcessing(false);
      
      setTimeout(() => {
        if (match) {
          onSuccess();
        } else {
          onFailure();
        }
        handleClose();
      }, 2000);
    } catch (error) {
      clearInterval(progressInterval);
      setAuthResult('failure');
      setIsProcessing(false);
      setTimeout(() => {
        onFailure();
        handleClose();
      }, 1500);
    }
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
    setMatchingPercentage(0);
    onClose();
  };

  if (!isOpen) return null;

  if (!user?.faceData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 rounded-xl max-w-md w-full p-6 border border-gray-700">
          <div className="text-center space-y-4">
            <AlertTriangle className="h-16 w-16 text-orange-500 mx-auto" />
            <h2 className="text-xl font-bold text-white">Biometric Not Enrolled</h2>
            <p className="text-gray-300">
              You need to enroll your biometric data first to use this authentication method.
            </p>
            <button
              onClick={handleClose}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl max-w-md w-full p-6 border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Shield className="h-6 w-6 text-blue-500" />
            <span>Biometric Authentication</span>
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="text-center mb-6">
          <p className="text-gray-300">
            Authenticate to unlock <span className="text-blue-400 font-medium">{deviceName}</span>
          </p>
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
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-blue-400 rounded-full opacity-50"></div>
              </div>
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
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Scan className="h-4 w-4" />
                <span>Authenticate</span>
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
            <div className="relative mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"></div>
              <Scan className="h-8 w-8 text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-white mb-2">Analyzing biometric data...</p>
            <div className="bg-gray-800 rounded-lg p-3 mb-4">
              <div className="flex justify-between text-sm text-gray-300 mb-1">
                <span>Matching Progress</span>
                <span>{Math.round(matchingPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${matchingPercentage}%` }}
                ></div>
              </div>
            </div>
            <p className="text-gray-400 text-sm">Processing facial features and patterns...</p>
          </div>
        )}

        {authResult && (
          <div className="text-center py-8">
            {authResult === 'success' ? (
              <>
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <p className="text-green-400 text-lg font-medium">Authentication Successful!</p>
                <p className="text-gray-400 text-sm mt-2">Biometric match confirmed - Access granted</p>
              </>
            ) : (
              <>
                <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <p className="text-red-400 text-lg font-medium">Authentication Failed!</p>
                <p className="text-gray-400 text-sm mt-2">Biometric mismatch detected - Access denied</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FaceAuthModal;
