import React, { useEffect, useRef, useState, useCallback } from 'react';
import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType } from '@zxing/library';
import { Product } from '../types';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onScanSuccess: (product: Product) => void;
}

export const ScannerModal: React.FC<ScannerModalProps> = ({
  isOpen,
  onClose,
  products,
  onScanSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'hardware'>('camera');
  const [manualCode, setManualCode] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; success: boolean } | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);
  
  // Camera focus & zoom features
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [maxZoom, setMaxZoom] = useState<number>(1);
  const [minZoom, setMinZoom] = useState<number>(1);
  const [hasZoom, setHasZoom] = useState<boolean>(false);
  const [isRefocusing, setIsRefocusing] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const barcodeBufferRef = useRef<string>('');
  const lastKeyTimeRef = useRef<number>(0);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Sound beep & Vibration feedback
  const playBeep = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);

      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
    } catch {
      // Audio might be blocked by user interaction policy
    }
  }, []);

  // Process decoded string
  const handleDecodedText = useCallback(
    (decodedText: string) => {
      const cleanCode = decodedText.trim();
      if (!cleanCode) return;

      const found = products.find(
        (p) =>
          p.sku.toLowerCase() === cleanCode.toLowerCase() ||
          p.id.toLowerCase() === cleanCode.toLowerCase() ||
          p.sku.toLowerCase().includes(cleanCode.toLowerCase()) ||
          p.name.toLowerCase().includes(cleanCode.toLowerCase())
      );

      playBeep();

      if (found) {
        setFeedbackMsg({
          text: `TERDETEKSI: ${found.name} (SKU: ${found.sku})`,
          success: true,
        });
        onScanSuccess(found);
        setTimeout(() => setFeedbackMsg(null), 2500);
      } else {
        setFeedbackMsg({
          text: `Kode "${cleanCode}" tidak terdaftar di database produk.`,
          success: false,
        });
        setTimeout(() => setFeedbackMsg(null), 3000);
      }
    },
    [products, onScanSuccess, playBeep]
  );

  // Stop camera and stream cleanup
  const stopCameraScan = useCallback(() => {
    setIsScanning(false);
    setIsTorchOn(false);

    if (codeReaderRef.current) {
      try {
        codeReaderRef.current.reset();
      } catch (err) {
        console.error('ZXing reset error:', err);
      }
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Trigger camera autofocus refocus manually
  const triggerRefocus = useCallback(async () => {
    if (!mediaStreamRef.current) return;
    const track = mediaStreamRef.current.getVideoTracks()[0];
    if (!track) return;

    setIsRefocusing(true);
    try {
      // Re-apply continuous focus mode or trigger single auto focus
      const constraints: Record<string, unknown> = {
        advanced: [
          { focusMode: 'continuous' },
          { focusMode: 'single' },
          { focusMode: 'auto' },
        ],
      };
      await (track as unknown as { applyConstraints: (c: unknown) => Promise<void> }).applyConstraints(constraints);
    } catch (e) {
      console.log('Refocus constraint attempt:', e);
    } finally {
      setTimeout(() => setIsRefocusing(false), 800);
    }
  }, []);

  // Handle Zoom change
  const handleZoomChange = async (newZoom: number) => {
    if (!mediaStreamRef.current) return;
    const track = mediaStreamRef.current.getVideoTracks()[0];
    if (track) {
      try {
        await (track as unknown as { applyConstraints: (c: unknown) => Promise<void> }).applyConstraints({
          advanced: [{ zoom: newZoom }],
        });
        setZoomLevel(newZoom);
      } catch (err) {
        console.error('Apply zoom error:', err);
      }
    }
  };

  // Start Camera with ZXing MultiFormat Reader & high-res / continuous focus constraints
  const startCameraScan = useCallback(
    async (deviceId?: string) => {
      stopCameraScan();
      setCameraError(null);

      try {
        // Prepare ZXing Hints for fast 1D/2D Barcode scanning
        const hints = new Map();
        const formats = [
          BarcodeFormat.EAN_13,
          BarcodeFormat.EAN_8,
          BarcodeFormat.CODE_128,
          BarcodeFormat.CODE_39,
          BarcodeFormat.UPC_A,
          BarcodeFormat.UPC_E,
          BarcodeFormat.QR_CODE,
          BarcodeFormat.DATA_MATRIX,
        ];
        hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);

        if (!codeReaderRef.current) {
          codeReaderRef.current = new BrowserMultiFormatReader(hints, 250);
        }

        // List camera video devices
        const videoInputDevices = await codeReaderRef.current.listVideoInputDevices();
        setAvailableCameras(videoInputDevices);

        let targetDeviceId = deviceId;
        if (!targetDeviceId && videoInputDevices.length > 0) {
          // Prefer back camera (environment) if label contains back/rear/environment
          const backCam = videoInputDevices.find((d) =>
            /back|rear|belakang|environment|main/i.test(d.label)
          );
          targetDeviceId = backCam ? backCam.deviceId : videoInputDevices[videoInputDevices.length - 1].deviceId;
        }

        setSelectedCameraId(targetDeviceId || '');

        // Standard getUserMedia constraints with 1080p high-res & auto-focus
        const videoConstraints: MediaTrackConstraints = targetDeviceId
          ? {
              deviceId: { exact: targetDeviceId },
              width: { ideal: 1920, min: 1280 },
              height: { ideal: 1080, min: 720 },
              frameRate: { ideal: 30 },
            }
          : {
              facingMode: { ideal: 'environment' },
              width: { ideal: 1920, min: 1280 },
              height: { ideal: 1080, min: 720 },
              frameRate: { ideal: 30 },
            };

        const stream = await navigator.mediaDevices.getUserMedia({ video: videoConstraints });
        mediaStreamRef.current = stream;

        // Check track capabilities for Focus, Torch, and Zoom
        const track = stream.getVideoTracks()[0];
        if (track && 'getCapabilities' in track) {
          const capabilities = (track as unknown as { getCapabilities: () => Record<string, unknown> }).getCapabilities();
          
          setHasTorch(Boolean(capabilities?.torch));

          if (capabilities?.zoom) {
            const zoomCap = capabilities.zoom as { min?: number; max?: number };
            setHasZoom(true);
            setMinZoom(zoomCap.min || 1);
            setMaxZoom(zoomCap.max || 5);
            setZoomLevel(zoomCap.min || 1);
          } else {
            setHasZoom(false);
          }

          // Try applying continuous autofocus constraint directly
          try {
            await (track as unknown as { applyConstraints: (c: unknown) => Promise<void> }).applyConstraints({
              advanced: [
                { focusMode: 'continuous' },
                { focusDistance: 0.15 },
              ],
            });
          } catch (capErr) {
            console.log('Focus constraint note:', capErr);
          }
        } else {
          setHasTorch(false);
          setHasZoom(false);
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();

          setIsScanning(true);

          // Decode continuously from video element
          codeReaderRef.current.decodeFromVideoElement(videoRef.current, (result) => {
            if (result) {
              handleDecodedText(result.getText());
            }
          });
        }
      } catch (err: unknown) {
        console.error('Camera Scan Error:', err);
        setIsScanning(false);
        const errMsg = err instanceof Error ? err.message : String(err);

        if (errMsg.includes('Permission') || errMsg.includes('NotAllowedError')) {
          setCameraError('Izin kamera ditolak. Silakan izinkan akses kamera di browser Anda.');
        } else if (errMsg.includes('NotFoundError') || errMsg.includes('OverconstrainedError')) {
          setCameraError('Perangkat kamera tidak ditemukan.');
        } else {
          setCameraError('Kamera tidak dapat diakses langsung. Gunakan opsi "Foto / Upload Gambar" atau "Scanner Gun".');
        }
      }
    },
    [handleDecodedText, stopCameraScan]
  );

  // Toggle Torch Light
  const toggleTorch = async () => {
    if (!mediaStreamRef.current) return;
    const track = mediaStreamRef.current.getVideoTracks()[0];
    if (track) {
      try {
        const nextState = !isTorchOn;
        await (track as unknown as { applyConstraints: (c: unknown) => Promise<void> }).applyConstraints({
          advanced: [{ torch: nextState }],
        });
        setIsTorchOn(nextState);
      } catch (e) {
        console.error('Failed to toggle torch:', e);
      }
    }
  };

  // Manage Camera Effect
  useEffect(() => {
    if (isOpen && activeTab === 'camera') {
      const timer = setTimeout(() => {
        startCameraScan(selectedCameraId);
      }, 300);
      return () => {
        clearTimeout(timer);
        stopCameraScan();
      };
    } else {
      stopCameraScan();
    }
  }, [isOpen, activeTab, startCameraScan, stopCameraScan]);

  // Decode from image file
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const imageUrl = event.target?.result as string;
        if (!imageUrl) return;

        try {
          if (!codeReaderRef.current) {
            codeReaderRef.current = new BrowserMultiFormatReader();
          }
          const result = await codeReaderRef.current.decodeFromImageUrl(imageUrl);
          if (result) {
            handleDecodedText(result.getText());
          }
        } catch (scanErr) {
          console.error('Decode image error:', scanErr);
          setFeedbackMsg({
            text: 'Barcode tidak terbaca dari foto. Pastikan gambar jelas, terang, dan tidak buram.',
            success: false,
          });
          setTimeout(() => setFeedbackMsg(null), 3000);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('File load error:', err);
    }
  };

  // Hardware Scanner Listener (Speed Typing)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      const currentTime = Date.now();
      const timeDiff = currentTime - lastKeyTimeRef.current;
      lastKeyTimeRef.current = currentTime;

      if (e.key === 'Enter') {
        if (barcodeBufferRef.current.length >= 2) {
          handleDecodedText(barcodeBufferRef.current);
          barcodeBufferRef.current = '';
        }
      } else if (e.key.length === 1) {
        if (timeDiff > 120) {
          barcodeBufferRef.current = e.key;
        } else {
          barcodeBufferRef.current += e.key;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleDecodedText]);

  if (!isOpen) return null;

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleDecodedText(manualCode);
    setManualCode('');
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-[#2d3130] w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-[#bdc9c6] flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 bg-[#0f766e] text-white flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-2xl">barcode_scanner</span>
            <div>
              <h3 className="font-extrabold text-base leading-tight">Pemindai Barcode & QR</h3>
              <p className="text-[10px] text-teal-100 font-medium">Kamera HP • Foto Barcode • Scanner Gun</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCameraScan();
              onClose();
            }}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-3 p-1.5 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold">
          <button
            onClick={() => setActiveTab('camera')}
            className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'camera'
                ? 'bg-white dark:bg-[#181c1c] text-[#005c55] shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-base">videocam</span>
            <span>Live Camera</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'upload'
                ? 'bg-white dark:bg-[#181c1c] text-[#005c55] shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-base">add_a_photo</span>
            <span>Foto / Gambar</span>
          </button>

          <button
            onClick={() => setActiveTab('hardware')}
            className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'hardware'
                ? 'bg-white dark:bg-[#181c1c] text-[#005c55] shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-base">barcode_reader</span>
            <span>Gun / Manual</span>
          </button>
        </div>

        {/* TAB 1: LIVE VIDEO CAMERA */}
        {activeTab === 'camera' && (
          <div className="relative bg-slate-950 flex flex-col items-center justify-center min-h-[300px] overflow-hidden">
            {/* Native Video Feed */}
            <video
              ref={videoRef}
              playsInline
              autoPlay
              muted
              onClick={triggerRefocus}
              className="w-full h-[300px] object-cover bg-black cursor-pointer"
            />

            {/* Scanning Laser Animation & Frame Guide */}
            {isScanning && !cameraError && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="relative w-64 h-40 border-2 border-dashed border-teal-400/80 rounded-2xl shadow-[0_0_20px_rgba(45,212,191,0.3)]">
                  <div className="absolute inset-x-2 top-1/2 h-0.5 bg-red-500 shadow-[0_0_12px_#ef4444] animate-pulse" />
                  <p className="absolute -bottom-6 left-0 right-0 text-center text-[10px] font-bold text-white/80 bg-black/40 py-0.5 rounded-full backdrop-blur-xs">
                    Sentuh Layar / Tekan Tombol Untuk Fokus
                  </p>
                </div>
              </div>
            )}

            {/* Camera Controls Bar (Device Switch, Refocus, Flash Torch) */}
            <div className="absolute top-2 inset-x-2 z-20 flex items-center justify-between gap-2 bg-black/60 backdrop-blur-md p-2 rounded-2xl">
              {availableCameras.length > 1 ? (
                <div className="flex items-center gap-1.5 text-white text-xs font-semibold flex-1 min-w-0">
                  <span className="material-symbols-outlined text-sm text-teal-300 shrink-0">linked_camera</span>
                  <select
                    value={selectedCameraId}
                    onChange={(e) => {
                      setSelectedCameraId(e.target.value);
                      startCameraScan(e.target.value);
                    }}
                    className="bg-transparent text-white text-xs font-medium focus:outline-none cursor-pointer truncate w-full"
                  >
                    {availableCameras.map((cam) => (
                      <option key={cam.deviceId} value={cam.deviceId} className="bg-slate-900 text-white">
                        {cam.label || `Kamera ${cam.deviceId.slice(0, 5)}...`}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-white text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Kamera High-Res HD</span>
                </div>
              )}

              <div className="flex items-center gap-1">
                {/* Refocus Button */}
                <button
                  type="button"
                  onClick={triggerRefocus}
                  title="Fokus Ulang Kamera"
                  className={`px-2 py-1.5 rounded-xl text-[11px] font-extrabold flex items-center gap-1 transition-all ${
                    isRefocusing
                      ? 'bg-teal-400 text-slate-950 scale-105'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <span className={`material-symbols-outlined text-base ${isRefocusing ? 'animate-spin' : ''}`}>
                    center_focus_weak
                  </span>
                  <span>Fokus</span>
                </button>

                {/* Torch Button */}
                {hasTorch && (
                  <button
                    type="button"
                    onClick={toggleTorch}
                    title="Lampu Kilat / Senter"
                    className={`p-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                      isTorchOn ? 'bg-amber-400 text-slate-950' : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">
                      {isTorchOn ? 'flashlight_on' : 'flashlight_off'}
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Zoom Slider Control (if camera supports zoom) */}
            {hasZoom && maxZoom > minZoom && (
              <div className="absolute bottom-3 inset-x-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2">
                <span className="material-symbols-outlined text-white text-sm">zoom_out</span>
                <input
                  type="range"
                  min={minZoom}
                  max={maxZoom}
                  step="0.1"
                  value={zoomLevel}
                  onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
                  className="w-full accent-teal-400 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                />
                <span className="material-symbols-outlined text-white text-sm">zoom_in</span>
                <span className="text-[10px] font-extrabold text-teal-300 min-w-[28px] text-right">
                  {zoomLevel.toFixed(1)}x
                </span>
              </div>
            )}

            {/* Camera Error Display */}
            {cameraError && (
              <div className="absolute inset-0 bg-slate-900/95 flex flex-col items-center justify-center p-6 text-center text-rose-300 space-y-3 z-30">
                <span className="material-symbols-outlined text-4xl text-rose-400">videocam_off</span>
                <p className="text-xs font-semibold leading-relaxed">{cameraError}</p>
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  <button
                    onClick={() => startCameraScan(selectedCameraId)}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
                  >
                    Coba Ulang Kamera
                  </button>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
                  >
                    Gunakan Foto / Upload
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Focus Tip Helper */}
        {activeTab === 'camera' && !cameraError && (
          <div className="bg-teal-950/80 text-teal-200 px-3 py-1.5 text-[10px] font-medium flex items-center justify-between border-b border-teal-800">
            <span>💡 Jarak ideal barcode HP ~15-20 cm. Sentuh layar / tombol "Fokus" bila buram.</span>
          </div>
        )}

        {/* TAB 2: PHOTO SNAP / FILE UPLOAD */}
        {activeTab === 'upload' && (
          <div className="p-6 space-y-4 bg-slate-50 dark:bg-slate-900 text-center animate-fade-in flex-1">
            <div className="p-5 bg-teal-50 border border-teal-200 rounded-2xl flex flex-col items-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#005c55] text-white flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-3xl">add_a_photo</span>
              </div>
              <div>
                <h4 className="font-extrabold text-[#005c55] text-sm">Ambil Foto / Upload Barcode</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Metode alternatif paling stabil di HP. Ambil foto barcode produk atau pilih gambar dari galeri.
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 px-4 bg-[#005c55] hover:bg-[#0f766e] text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined">photo_camera</span>
                <span>Ambil Foto HP / Pilih Gambar</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: HARDWARE SCANNER / MANUAL ENTRY */}
        {activeTab === 'hardware' && (
          <div className="p-6 space-y-4 bg-slate-50 dark:bg-slate-900 text-center animate-fade-in flex-1">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md animate-bounce">
                <span className="material-symbols-outlined text-2xl">barcode_reader</span>
              </div>
              <h4 className="font-extrabold text-emerald-900 text-sm">Scanner Gun USB / Bluetooth Ready</h4>
              <p className="text-xs text-emerald-700">
                Tembakkan scanner fisik ke barcode produk. Hasil scan akan terdeteksi otomatis.
              </p>
            </div>

            <div className="relative flex items-center">
              <div className="flex-1 border-t border-slate-300 dark:border-slate-700"></div>
              <span className="px-3 text-[11px] font-bold text-slate-400 uppercase">Atau Input Kode SKU</span>
              <div className="flex-1 border-t border-slate-300 dark:border-slate-700"></div>
            </div>

            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Ketik SKU / Barcode produk..."
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className="flex-1 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005c55]"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-[#005c55] text-white text-xs font-bold rounded-xl hover:bg-[#0f766e] transition-colors"
              >
                Cari
              </button>
            </form>
          </div>
        )}

        {/* Dynamic Toast Feedback Overlay */}
        {feedbackMsg && (
          <div
            className={`p-3 text-center text-xs font-bold text-white transition-all animate-bounce ${
              feedbackMsg.success ? 'bg-emerald-600' : 'bg-rose-600'
            }`}
          >
            {feedbackMsg.text}
          </div>
        )}

        {/* Quick Simulation Barcode Testing Footer */}
        <div className="p-4 bg-white dark:bg-[#2d3130] border-t border-slate-200 dark:border-slate-700 space-y-2">
          <p className="text-[11px] font-extrabold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            Tes Barcode Produk (Klik untuk Simulasi):
          </p>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {products.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleDecodedText(p.sku)}
                className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-[#005c55] hover:text-[#005c55] active:scale-95 transition-all text-left truncate max-w-[170px]"
              >
                🏷️ {p.sku} ({p.name})
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
