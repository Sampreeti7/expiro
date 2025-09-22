import React, { useRef, useState, useCallback } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Camera, RefreshCw, Check, X } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (text: string) => void;
  onCancel: () => void;
  type: 'medicine-name' | 'expiry-date';
}

export function CameraCapture({ onCapture, onCancel, type }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState<string>('');

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Use back camera for better text capture
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreamActive(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check your permissions.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreamActive(false);
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageData);
        stopCamera();
        processImage(imageData);
      }
    }
  }, [stopCamera]);

  const processImage = async (imageData: string) => {
    setIsProcessing(true);
    
    // Simulate OCR processing time
    setTimeout(() => {
      // Mock OCR results based on type
      let mockText = '';
      
      if (type === 'medicine-name') {
        const medicines = [
          'Aspirin 325mg',
          'Tylenol Extra Strength',
          'Ibuprofen 200mg',
          'Vitamin D3 1000IU',
          'Metformin 500mg',
          'Lisinopril 10mg',
          'Atorvastatin 20mg',
          'Amlodipine 5mg'
        ];
        mockText = medicines[Math.floor(Math.random() * medicines.length)];
      } else if (type === 'expiry-date') {
        // Generate a random future expiry date
        const futureDate = new Date();
        futureDate.setMonth(futureDate.getMonth() + Math.floor(Math.random() * 24) + 6);
        mockText = futureDate.toISOString().split('T')[0];
      }
      
      setExtractedText(mockText);
      setIsProcessing(false);
    }, 2000);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setExtractedText('');
    startCamera();
  };

  const confirmText = () => {
    onCapture(extractedText);
  };

  const getTitle = () => {
    return type === 'medicine-name' 
      ? 'Capture Medicine Name' 
      : 'Capture Expiry Date';
  };

  const getInstructions = () => {
    return type === 'medicine-name'
      ? 'Point your camera at the medicine label and capture a clear photo of the medicine name.'
      : 'Point your camera at the expiry date on the medicine package. Make sure the date is clearly visible.';
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="text-center mb-4">
          <h3 className="font-semibold mb-2">{getTitle()}</h3>
          <p className="text-sm text-gray-600">{getInstructions()}</p>
        </div>

        <div className="space-y-4">
          {!isStreamActive && !capturedImage && (
            <div className="text-center">
              <Button onClick={startCamera} className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Start Camera
              </Button>
            </div>
          )}

          {isStreamActive && (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full rounded-lg shadow-lg"
                style={{ maxHeight: '400px' }}
              />
              <div className="absolute inset-0 border-2 border-dashed border-white/50 rounded-lg pointer-events-none">
                <div className="absolute inset-4 border border-white/75 rounded flex items-center justify-center">
                  <p className="text-white text-sm bg-black/50 px-2 py-1 rounded">
                    {type === 'medicine-name' ? 'Align medicine name here' : 'Align expiry date here'}
                  </p>
                </div>
              </div>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                <Button onClick={capturePhoto} size="lg" className="bg-white text-black hover:bg-gray-100">
                  <Camera className="h-5 w-5" />
                </Button>
                <Button onClick={() => { stopCamera(); onCancel(); }} variant="outline" size="lg" className="bg-white/90">
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {capturedImage && (
            <div className="space-y-4">
              <div className="relative">
                <img 
                  src={capturedImage} 
                  alt="Captured" 
                  className="w-full rounded-lg shadow-lg max-h-64 object-cover"
                />
              </div>

              {isProcessing && (
                <div className="text-center py-4">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Processing image and extracting text...
                  </p>
                </div>
              )}

              {extractedText && !isProcessing && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2">Extracted Text:</h4>
                  <p className="text-green-800 bg-white px-3 py-2 rounded border">
                    {extractedText}
                  </p>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={confirmText} className="flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      Use This Text
                    </Button>
                    <Button onClick={retakePhoto} variant="outline" className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Retake Photo
                    </Button>
                  </div>
                </div>
              )}

              {!isProcessing && !extractedText && (
                <div className="flex gap-2">
                  <Button onClick={retakePhoto} className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Retake Photo
                  </Button>
                  <Button onClick={onCancel} variant="outline">
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </CardContent>
    </Card>
  );
}
