import { useState, useEffect, useRef } from 'react';
import { Camera, X, Check, RefreshCw, AlertCircle, Barcode } from 'lucide-react';

export default function BarcodeScannerModal({ isOpen, onClose, onScanComplete }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [detectedCode, setDetectedCode] = useState('');
  const [scanningStatus, setScanningStatus] = useState('Initializing camera...');

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setCameraError('');
    setDetectedCode('');
    setScanningStatus('Requesting camera permission...');

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser environment');
      }

      const constraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      setCameraActive(true);
      setScanningStatus('Align barcode inside frame to scan...');
      startBarcodeDetection();
    } catch (err) {
      console.warn('Camera access warning/error:', err.message);
      setCameraError(err.message || 'Could not access device camera');
      setScanningStatus('Camera permission denied or camera not available');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const startBarcodeDetection = () => {
    // Check for native BarcodeDetector API support
    if ('BarcodeDetector' in window) {
      try {
        const barcodeDetector = new window.BarcodeDetector({
          formats: ['upc_a', 'upc_e', 'ean_13', 'ean_8', 'code_128', 'qr_code']
        });

        const detectInterval = setInterval(async () => {
          if (videoRef.current && videoRef.current.readyState === 4 && streamRef.current) {
            try {
              const barcodes = await barcodeDetector.detect(videoRef.current);
              if (barcodes.length > 0) {
                const code = barcodes[0].rawValue;
                setDetectedCode(code);
                setScanningStatus(`Barcode Detected: ${code}`);
                clearInterval(detectInterval);
              }
            } catch (e) {
              // Detection iteration error
            }
          } else if (!streamRef.current) {
            clearInterval(detectInterval);
          }
        }, 400);
      } catch (e) {
        console.log('Native BarcodeDetector initialization fallback');
      }
    }
  };

  const handleSimulateCapture = () => {
    // Fallback barcode capture sample
    const sampleBarcodes = ['078742226490', '011110087458', '300450444108', '036000291452'];
    const randomCode = sampleBarcodes[Math.floor(Math.random() * sampleBarcodes.length)];
    setDetectedCode(randomCode);
    setScanningStatus(`Barcode Captured: ${randomCode}`);
  };

  const handleConfirmCode = () => {
    if (detectedCode) {
      onScanComplete(detectedCode);
      stopCamera();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2 text-slate-100 font-bold text-base">
            <Camera className="text-sky-400" size={20} />
            <span>Camera Barcode Scanner</span>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Viewfinder Video Frame */}
        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
          <video
            ref={videoRef}
            playsInline
            muted
            className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
          />

          {/* Scanner Overlay Frame */}
          {cameraActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="w-64 h-36 border-2 border-sky-400 rounded-xl relative shadow-[0_0_30px_rgba(52,152,219,0.5)] bg-sky-500/10">
                {/* Laser scan line animation */}
                <div className="w-full h-0.5 bg-sky-400 shadow-[0_0_8px_#3498db] animate-pulse absolute top-1/2 -translate-y-1/2"></div>

                {/* Corners */}
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-amber-500 rounded-tl"></div>
                <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-amber-500 rounded-tr"></div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-amber-500 rounded-bl"></div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-amber-500 rounded-br"></div>
              </div>
            </div>
          )}

          {/* Fallback Camera Error / Permission state */}
          {cameraError && (
            <div className="p-6 text-center text-slate-300 flex flex-col items-center gap-3">
              <AlertCircle size={36} className="text-amber-400" />
              <p className="text-sm font-medium max-w-xs">{cameraError}</p>
              <button
                onClick={startCamera}
                className="mt-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white rounded-lg border border-slate-700 flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw size={14} /> Retry Camera Permission
              </button>
            </div>
          )}
        </div>

        {/* Status & Barcode Detection Display */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col gap-3">
          <div className="text-xs text-center text-slate-400 font-medium">
            {scanningStatus}
          </div>

          {detectedCode ? (
            <div className="flex items-center justify-between p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-xl">
              <div className="flex items-center gap-2 text-emerald-300 font-mono text-sm font-semibold">
                <Barcode size={18} />
                <span>UPC: {detectedCode}</span>
              </div>
              <button
                onClick={handleConfirmCode}
                className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <Check size={14} /> Use Barcode
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleSimulateCapture}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Barcode size={14} className="text-sky-400" />
                <span>Capture / Test Sample Barcode</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
