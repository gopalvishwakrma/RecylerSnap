
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeWasteImage } from '../services/geminiService';
import { ScanResult, WasteCategory } from '../types';

interface ScannerPageProps {
  onScanComplete: (result: ScanResult) => void;
}

const ScannerPage: React.FC<ScannerPageProps> = ({ onScanComplete }) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
        setError(null);
        setPermissionDenied(false);
      }
    } catch (err) {
      console.error("Camera access failed", err);
      setError("Unable to access camera. Please check permissions.");
      setPermissionDenied(true);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const processImage = async (base64: string) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const analysis = await analyzeWasteImage(base64);
      const result: ScanResult = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        itemName: analysis.itemName,
        category: analysis.category,
        isRecyclable: analysis.isRecyclable,
        instructions: analysis.instructions,
        impactInfo: analysis.impactInfo,
        imageUrl: base64
      };
      onScanComplete(result);
      navigate('/result');
    } catch (err) {
      setError("Analysis failed. Please try a clearer picture.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const base64 = canvas.toDataURL('image/jpeg', 0.8);
        stopCamera();
        processImage(base64);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          processImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-4">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden min-h-[500px] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-emerald-600 text-white">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <i className="fa-solid fa-camera"></i>
            Scan Waste
          </h2>
          <p className="text-emerald-100 text-sm opacity-90">
            Identify your item and learn how to recycle it responsibly.
          </p>
        </div>

        {/* Viewport */}
        <div className="flex-grow bg-slate-100 relative min-h-[300px] flex items-center justify-center">
          {isAnalyzing ? (
            <div className="flex flex-col items-center gap-4 p-8 text-center animate-pulse">
              <div className="w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Analyzing Item...</h3>
                <p className="text-sm text-slate-500">Our AI is identifying the material</p>
              </div>
            </div>
          ) : isCameraActive ? (
            <div className="w-full h-full relative">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover bg-black"
              />
              <div className="absolute inset-0 pointer-events-none border-[40px] border-black/40 border-dashed m-10 rounded-2xl"></div>
            </div>
          ) : (
            <div className="p-10 text-center flex flex-col items-center gap-6">
              <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-2">
                <i className="fa-solid fa-camera-retro text-4xl"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Ready to Scan?</h3>
                <p className="text-slate-500 mb-6">Capture a clear photo or upload an image of your waste item.</p>
                <button 
                  onClick={startCamera}
                  className="bg-emerald-600 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 w-full mb-3"
                >
                  Turn on Camera
                </button>
                <label className="block w-full text-emerald-700 border-2 border-emerald-100 px-8 py-3 rounded-full font-bold hover:bg-emerald-50 cursor-pointer">
                  Upload from Gallery
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                </label>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute bottom-4 left-4 right-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-sm flex items-center gap-2">
              <i className="fa-solid fa-circle-exclamation"></i>
              {error}
            </div>
          )}
        </div>

        {/* Controls */}
        {isCameraActive && !isAnalyzing && (
          <div className="p-8 bg-white flex justify-center items-center gap-8 border-t border-slate-100">
            <button onClick={stopCamera} className="w-12 h-12 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200">
              <i className="fa-solid fa-xmark"></i>
            </button>
            <button 
              onClick={capturePhoto} 
              className="w-20 h-20 bg-emerald-600 rounded-full border-8 border-emerald-50 flex items-center justify-center text-white shadow-xl hover:scale-105 transition-transform"
            >
              <div className="w-full h-full rounded-full border-2 border-white/20"></div>
            </button>
            <div className="w-12 h-12"></div> {/* Spacer */}
          </div>
        )}
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-100 p-6 rounded-2xl flex gap-4 items-start">
        <i className="fa-solid fa-circle-info text-blue-500 mt-1"></i>
        <div>
          <h4 className="font-bold text-blue-900 mb-1">Privacy Notice</h4>
          <p className="text-sm text-blue-700 leading-relaxed">
            We use your camera only for image analysis. Photos are processed by Gemini AI to identify materials and are not stored permanently on our public servers without your consent.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;
