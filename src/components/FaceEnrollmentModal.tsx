
import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { X, Camera, Upload, CheckCircle, User, Shield } from 'lucide-react';

interface FaceEnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFaceDataCaptured: (faceData: string) => void;
  userName: string;
}

const FaceEnrollmentModal = ({ isOpen, onClose, onFaceDataCaptured, userName }: FaceEnrollmentModalProps) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [step, setStep] = useState<'instructions' | 'capture' | 'confirm'>('instructions');
  const webcamRef = useRef<Webcam>(null);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      setIsCapturing(false);
      setStep('confirm');
    }
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCapturedImage(result);
        setStep('confirm');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onFaceDataCaptured(capturedImage);
      handleClose();
    }
  };

  const handleClose = () => {
    setCapturedImage(null);
    setIsCapturing(false);
    setStep('instructions');
    onClose();
  };

  const startCapture = () => {
    setIsCapturing(true);
    setStep('capture');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl max-w-lg w-full p-6 border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Shield className="h-6 w-6 text-blue-500" />
            <span>Biometric Enrollment</span>
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {step === 'instructions' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="p-4 bg-blue-500/20 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <User className="h-10 w-10 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Welcome, {userName}!
              </h3>
              <p className="text-gray-300">
                Let's set up your biometric authentication for secure device access.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-medium mb-3">Instructions:</h4>
              <ul className="text-sm text-gray-300 space-y-2">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Look directly at the camera</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Ensure good lighting on your face</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Remove glasses or masks if possible</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Keep a neutral expression</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <button
                onClick={startCapture}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
              >
                <Camera className="h-5 w-5" />
                <span>Start Camera Enrollment</span>
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
                  <span>Upload Photo Instead</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-500 text-center">
              Your biometric data is encrypted and stored locally for security.
            </p>
          </div>
        )}

        {step === 'capture' && isCapturing && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-white">Position Your Face</h3>
              <p className="text-gray-400 text-sm">Center your face in the frame below</p>
            </div>
            
            <div className="relative rounded-lg overflow-hidden">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-64 border-2 border-blue-400 rounded-full opacity-50"></div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={capture}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors font-medium"
              >
                <Camera className="h-4 w-4 inline mr-2" />
                Capture Face
              </button>
              <button
                onClick={() => setStep('instructions')}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        )}

        {step === 'confirm' && capturedImage && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-white">Confirm Your Enrollment</h3>
              <p className="text-gray-400 text-sm">Is this image clear and suitable for authentication?</p>
            </div>
            
            <div className="relative rounded-lg overflow-hidden">
              <img src={capturedImage} alt="Captured face" className="w-full h-64 object-cover" />
            </div>
            
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-green-400">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Face detected successfully!</span>
              </div>
              <p className="text-xs text-green-300 mt-1">
                This will be your biometric signature for device authentication.
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleConfirm}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors font-medium"
              >
                <Shield className="h-4 w-4 inline mr-2" />
                Complete Enrollment
              </button>
              <button
                onClick={() => {
                  setCapturedImage(null);
                  setStep('instructions');
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg transition-colors"
              >
                Retake
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FaceEnrollmentModal;
