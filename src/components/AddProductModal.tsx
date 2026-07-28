import React, { useState, useRef, useEffect, useCallback } from 'react';
import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType } from '@zxing/library';
import { Product } from '../types';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Product) => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
}) => {
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Product['category']>('Bangunan');
  const [price, setPrice] = useState<number | ''>('');
  const [stock, setStock] = useState<number | ''>('');
  const [unit, setUnit] = useState('Pcs');

  // Barcode Scanner Sub-modal State
  const [isScanningSku, setIsScanningSku] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [scannedFeedback, setScannedFeedback] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Sound beep
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
      // Audio policy
    }
  }, []);

  // Stop camera scan
  const stopSkuCamera = useCallback(() => {
    if (codeReaderRef.current) {
      try {
        codeReaderRef.current.reset();
      } catch (err) {
        console.error('Reset error:', err);
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

  // Start Camera Scan for SKU
  const startSkuCamera = useCallback(async () => {
    stopSkuCamera();
    setScanError(null);

    try {
      const hints = new Map();
      const formats = [
        BarcodeFormat.EAN_13,
        BarcodeFormat.EAN_8,
        BarcodeFormat.CODE_128,
        BarcodeFormat.CODE_39,
        BarcodeFormat.UPC_A,
        BarcodeFormat.UPC_E,
        BarcodeFormat.QR_CODE,
      ];
      hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);

      if (!codeReaderRef.current) {
        codeReaderRef.current = new BrowserMultiFormatReader(hints, 250);
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      mediaStreamRef.current = stream;

      // Continuous autofocus
      const track = stream.getVideoTracks()[0];
      if (track && 'applyConstraints' in track) {
        try {
          await (track as unknown as { applyConstraints: (c: unknown) => Promise<void> }).applyConstraints({
            advanced: [{ focusMode: 'continuous' }],
          });
        } catch {
          // focus mode fallback
        }
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        codeReaderRef.current.decodeFromVideoElement(videoRef.current, (result) => {
          if (result) {
            const code = result.getText().trim();
            if (code) {
              playBeep();
              setSku(code);
              setScannedFeedback(`Barcode berhasil dipindai: ${code}`);
              stopSkuCamera();
              setIsScanningSku(false);
              setTimeout(() => setScannedFeedback(null), 3000);
            }
          }
        });
      }
    } catch (err: unknown) {
      console.error('AddProduct SKU camera error:', err);
      setScanError('Tidak dapat membuka kamera. Pastikan izin kamera aktif.');
    }
  }, [playBeep, stopSkuCamera]);

  useEffect(() => {
    if (isScanningSku) {
      startSkuCamera();
    } else {
      stopSkuCamera();
    }
    return () => {
      stopSkuCamera();
    };
  }, [isScanningSku, startSkuCamera, stopSkuCamera]);

  if (!isOpen) return null;

  const handleGenerateRandomSku = () => {
    const generated = 'SKU-' + Math.floor(100000 + Math.random() * 900000);
    setSku(generated);
    setScannedFeedback(`Kode SKU acak dibuat: ${generated}`);
    setTimeout(() => setScannedFeedback(null), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price || stock === '') return;

    const newProd: Product = {
      id: 'p_' + Date.now(),
      sku: sku.trim() || 'SKU-' + Math.floor(10000 + Math.random() * 90000),
      name: name.trim(),
      category,
      price: Number(price),
      stock: Number(stock),
      unit,
      minStock: 5,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAw0dDcnrGBffd7JlLA0e9Jzhv5uV49MHpRfaWf5BJwB_q9-4C04B46zvC4FVQmtrMGW5HLSZyPfytASApQRjpgTTKHV7gvVdqF11eWPb1vS1i7Wy1IEQ6ZpSCwXA99sRyj_8hMnqmV4LUoTARdUMQLCik0zFLF27vQe_t-BTGeAArP2OssAD5EhmY-VPG-A2RmVz0NnlL1hFRJctGkBBmMSXsMlWfRMxOKsrVjd1ivceiSTur7GGOEmrkOrzZz6DgfJP75K0NfeRc',
    };

    onAddProduct(newProd);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#2d3130] w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-[#bdc9c6]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0f766e] text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined">add_box</span>
            <h3 className="font-bold text-lg">Tambah Produk Baru</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Toast feedback */}
        {scannedFeedback && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold text-center animate-bounce">
            {scannedFeedback}
          </div>
        )}

        {/* Camera Scanner Sub-overlay */}
        {isScanningSku && (
          <div className="p-4 bg-slate-900 text-white space-y-3 relative border-b border-teal-600 animate-fade-in">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-teal-300 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">barcode_scanner</span>
                Pindai Barcode Fisik Produk (Kamera HP)
              </span>
              <button
                type="button"
                onClick={() => setIsScanningSku(false)}
                className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold"
              >
                Tutup Kamera
              </button>
            </div>

            <div className="relative h-48 bg-black rounded-2xl overflow-hidden flex items-center justify-center border border-teal-500/50">
              <video ref={videoRef} playsInline autoPlay muted className="w-full h-full object-cover" />
              <div className="absolute inset-x-8 top-1/2 h-0.5 bg-red-500 shadow-[0_0_12px_#ef4444] animate-pulse" />
              <p className="absolute bottom-2 text-[10px] font-bold text-white/90 bg-black/60 px-3 py-1 rounded-full">
                Arahkan Kamera ke Barcode Produk
              </p>
            </div>

            {scanError && <p className="text-xs text-rose-400 text-center font-semibold">{scanError}</p>}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-[#3e4947] uppercase mb-1">
              Nama Produk Alat Teknik / Bangunan
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Semen Tiga Roda 50kg / Palu Tekiro 16oz"
              className="w-full px-4 py-3 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl focus:border-[#005c55] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-[#3e4947] uppercase">
                  Kode SKU / Barcode
                </label>
                <button
                  type="button"
                  onClick={handleGenerateRandomSku}
                  className="text-[10px] font-bold text-[#005c55] hover:underline"
                >
                  + Acak Kode
                </button>
              </div>

              {/* Input field with embedded barcode scan button */}
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="SKU-88291 atau Scan Barcode"
                  className="w-full pl-4 pr-12 py-3 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl focus:border-[#005c55] focus:outline-none font-mono text-xs font-bold text-[#181c1c]"
                />
                <button
                  type="button"
                  onClick={() => setIsScanningSku(!isScanningSku)}
                  title="Pindai Barcode Fisik dengan Kamera"
                  className={`absolute right-1.5 px-2.5 py-1.5 rounded-lg flex items-center gap-1 font-bold text-xs shadow-md transition-all active:scale-95 ${
                    isScanningSku
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-[#005c55] hover:bg-[#0f766e] text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">barcode_scanner</span>
                  <span className="text-[10px] hidden sm:inline">Scan</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3e4947] uppercase mb-1">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Product['category'])}
                className="w-full px-4 py-3 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl focus:border-[#005c55] focus:outline-none"
              >
                <option value="Bangunan">Bangunan</option>
                <option value="Listrik">Listrik</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Cat & Aksesoris">Cat & Aksesoris</option>
                <option value="Perkakas">Perkakas</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#3e4947] uppercase mb-1">
                Harga (Rp)
              </label>
              <input
                type="number"
                required
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                placeholder="85000"
                className="w-full px-3 py-3 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl focus:border-[#005c55] focus:outline-none font-semibold text-[#005c55]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3e4947] uppercase mb-1">
                Stok Awal
              </label>
              <input
                type="number"
                required
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value ? Number(e.target.value) : '')}
                placeholder="50"
                className="w-full px-3 py-3 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl focus:border-[#005c55] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3e4947] uppercase mb-1">
                Satuan
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-3 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl focus:border-[#005c55] focus:outline-none"
              >
                <option value="Pcs">Pcs</option>
                <option value="Unit">Unit</option>
                <option value="Box">Box</option>
                <option value="Roll">Roll</option>
                <option value="Galon">Galon</option>
                <option value="Pail">Pail</option>
                <option value="Set">Set</option>
                <option value="Meter">Meter</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 bg-[#e0e3e1] text-[#3e4947] font-semibold rounded-xl hover:bg-[#bdc9c6]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-3.5 bg-[#005c55] text-white font-bold rounded-xl hover:bg-[#0f766e] shadow-lg active:scale-95 transition-all"
            >
              Simpan Produk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
