import React, { useState, useEffect } from 'react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (email?: string) => void;
  initialMode?: 'splash' | 'onboarding' | 'login';
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'splash',
}) => {
  const [viewMode, setViewMode] = useState<'splash' | 'onboarding' | 'login'>(initialMode);
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState('admin@tabingan.com');
  const [password, setPassword] = useState('••••••••');

  useEffect(() => {
    if (isOpen) {
      setViewMode(initialMode);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const steps = [
    {
      title: 'Kelola Toko Bangunan Lebih Mudah',
      description: 'Sistem POS, Inventaris, dan Laporan Bisnis dalam satu genggaman.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMuCC9kUlMC_R6knor1DAnqS2ICojc68KxevrZ56RmrfTck2mvWoz00vKGuK6jYbxF4dXifbWz5E4sJTC0yQfHNE1uqeso3P6sm2LhQ9eJVW-Ni5tZBK_MPVbNSEt2uRFJMj4-IjyP4ZI5TvL6gcE-u1uOf6WeZLwKRd_s8RZeVFR0hPvdBa8ETPapZ1ydcurVCIMPIibFfwljSV7yCv2WMSJ5h-wRxtR-m0ZRxJ3q4OjL43BD1at5XnH6o5DddxlTdsDFHXZv_eA',
    },
    {
      title: 'Kontrol Stok Akurat',
      description: 'Pantau ribuan SKU barang bangunan dengan sistem peringatan stok rendah otomatis.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC10XkB6h2cSJ6gj8p6kRqd9_TMCKCWCIwP1xPJ4Gc9qWSJQjfACh1BN-VjTidzbh-fNL_HFaidzBxqXtRfvQ8SOg21dZRd4s3BMp8A1vbrOvvBZ_KRircnfqNKdJ4n9BKYopHegamgf7aRvehTm_yxf4YKA4QrCwvkoscsp3baLdGB8r2PzdfMf73rOp_MQGkElkPOISD0JoIpv2SFwZzG6RJrOrTvaQnsH56FmsigQIUoIMsUncTRqNUud4oUNMn5ZzrUar_o1As',
    },
    {
      title: 'Laporan Real-Time',
      description: 'Pantau performa penjualan dan laba rugi cabang kapan saja dan di mana saja.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAd1D5kldbsGIaygtnRrg0Q3YnLV3TVf032pHWPngtxdRllUEmauBZxpG1wQLW3YBK8Yy8jiPThq5cZj5hdnHoB0jazeWj0yN46sxMhyFo0Kn2CK2kN1-ib4jZfCh-ODFObfmBuuMZ4d3SBuKhgK3-IpaGQAfrqefIK7RWDCPE_6hBd0jBuAf6pBXDxYH6dj9Pb6ImILjPHSxSqyhwtdeVGDp9EXs2L3EohoK_NdlL4vuGe2ZLyxVwRRkHUlf7VsrIdyyD1icxzPww',
    }
  ];

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setViewMode('login');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(email);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#f7faf8] overflow-y-auto">
      {/* Universal Close Button */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-[210] w-10 h-10 bg-white/80 backdrop-blur-md text-[#3e4947] hover:bg-white hover:text-[#005c55] rounded-full flex items-center justify-center shadow-md transition-all border border-[#bdc9c6]"
        title="Tutup Modal"
      >
        <span className="material-symbols-outlined text-xl">close</span>
      </button>
      {/* View 1: Splash Screen */}
      {viewMode === 'splash' && (
        <div className="w-full min-h-screen flex flex-col items-center justify-between p-6 max-w-md mx-auto text-center relative">
          <div className="h-4" />

          <div className="flex flex-col items-center justify-center my-auto space-y-6">
            <div className="w-28 h-28 md:w-32 md:h-32 bg-[#005c55] rounded-3xl flex items-center justify-center shadow-xl border border-[#bdc9c6]">
              <span className="material-symbols-outlined text-[#a3faef] text-6xl filled">construction</span>
            </div>

            <div>
              <h1 className="text-3xl font-extrabold text-[#005c55] tracking-tight leading-tight">
                TOKO TABINGAN<br />TEKNIK
              </h1>
              <p className="mt-2 text-xs font-semibold text-[#3e4947] tracking-widest uppercase">
                Digital Management Suite
              </p>
            </div>

            <div className="pt-6 flex flex-col items-center">
              <div className="progress-bar-container mb-3">
                <div className="progress-bar-fill" />
              </div>
              <span className="text-xs text-[#6e7977] font-medium animate-pulse">
                Memuat Sistem POS...
              </span>
            </div>
          </div>

          <div className="pb-6 space-y-2">
            <button
              onClick={() => setViewMode('onboarding')}
              className="px-8 py-3 bg-[#005c55] text-white font-bold rounded-full text-sm shadow-md hover:bg-[#0f766e]"
            >
              Mulai Aplikasi
            </button>
            <p className="text-[10px] text-[#6e7977] uppercase tracking-widest">
              VERSION 2.4.0 • TABINGAN TEKNIK GROUP
            </p>
          </div>
        </div>
      )}

      {/* View 2: Onboarding Carousel */}
      {viewMode === 'onboarding' && (
        <div className="w-full min-h-screen flex flex-col justify-between p-6 max-w-md mx-auto relative bg-[#f7faf8]">
          {/* Skip Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setViewMode('login')}
              className="text-sm font-semibold text-[#6e7977] hover:text-[#005c55] flex items-center gap-1"
            >
              Lewati <span className="material-symbols-outlined text-base">chevron_right</span>
            </button>
          </div>

          {/* Current Step Content */}
          <div className="my-auto text-center flex flex-col items-center py-6">
            <div className="w-full aspect-square max-w-[280px] mb-6 flex items-center justify-center">
              <img
                src={steps[currentStep].image}
                alt={steps[currentStep].title}
                className="w-full h-auto object-contain drop-shadow-xl transition-all duration-300"
              />
            </div>

            <h2 className="text-2xl font-bold text-[#181c1c] mb-3 px-2">
              {steps[currentStep].title}
            </h2>
            <p className="text-sm text-[#3e4947] px-4 leading-relaxed">
              {steps[currentStep].description}
            </p>
          </div>

          {/* Indicators & Action */}
          <div className="pb-8 space-y-6">
            <div className="flex justify-center gap-2">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentStep ? 'w-6 bg-[#005c55]' : 'w-2 bg-[#bdc9c6]'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNextStep}
              className="w-full h-14 bg-[#005c55] text-white rounded-2xl font-bold text-base shadow-lg flex items-center justify-center gap-2 hover:bg-[#0f766e] active:scale-95 transition-all"
            >
              <span>{currentStep === steps.length - 1 ? 'Mulai Sekarang' : 'Selanjutnya'}</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>

            <p className="text-center text-xs text-[#6e7977]">
              TOKO TABINGAN TEKNIK • Versi 2.4.0
            </p>
          </div>
        </div>
      )}

      {/* View 3: Login Screen */}
      {viewMode === 'login' && (
        <div className="w-full min-h-screen flex flex-col items-center justify-center p-6 max-w-md mx-auto">
          {/* Header */}
          <div className="flex flex-col items-center mb-6 text-center">
            <div className="w-16 h-16 bg-[#005c55] rounded-2xl flex items-center justify-center mb-3 shadow-lg">
              <span className="material-symbols-outlined text-white text-3xl filled">construction</span>
            </div>
            <h1 className="text-xl font-bold text-[#005c55] tracking-tight">TOKO TABINGAN TEKNIK</h1>
            <p className="text-xs text-[#3e4947] mt-1">Sistem Manajemen Inventaris & POS</p>
          </div>

          {/* Card */}
          <div className="w-full bg-white rounded-3xl p-6 shadow-2xl border border-[#bdc9c6] space-y-5">
            <div className="text-center space-y-1">
              <h2 className="text-lg font-bold text-[#181c1c]">Selamat Datang</h2>
              <p className="text-xs text-[#6e7977]">Masuk untuk melanjutkan ke dashboard</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#3e4947] mb-1">
                  Email atau WhatsApp
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6e7977]">person</span>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@tabingan.com / 0812..."
                    className="w-full pl-10 pr-4 py-3 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl text-sm focus:outline-none focus:border-[#005c55]"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-[#3e4947]">Password</label>
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-xs text-[#005c55] font-semibold hover:underline">
                    Lupa Password?
                  </a>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6e7977]">lock</span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl text-sm focus:outline-none focus:border-[#005c55]"
                  />
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#6e7977] cursor-pointer">visibility</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#005c55] text-white font-bold rounded-xl text-sm shadow-md hover:bg-[#0f766e] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Masuk Kasir</span>
                <span className="material-symbols-outlined text-lg">login</span>
              </button>
            </form>

            <div className="pt-2 text-center">
              <p className="text-xs text-[#6e7977] mb-3">Atau masuk cepat dengan:</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onLoginSuccess(email);
                    onClose();
                  }}
                  className="py-2.5 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl text-xs font-semibold text-[#3e4947] hover:bg-[#e0e3e1] flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">pin</span> PIN Kasir
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onLoginSuccess(email);
                    onClose();
                  }}
                  className="py-2.5 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl text-xs font-semibold text-[#3e4947] hover:bg-[#e0e3e1] flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">fingerprint</span> Biometrik
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-[#3e4947]">
              Belum punya akun?{' '}
              <button onClick={() => setViewMode('onboarding')} className="text-[#005c55] font-bold hover:underline">
                Daftar Sekarang
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
