import React, { useState, useEffect } from 'react';
import { StaffMember } from '../types';
import { INITIAL_STAFF } from '../data/mockData';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (staff: StaffMember) => void;
  initialMode?: 'splash' | 'onboarding' | 'login';
  staffList?: StaffMember[];
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'splash',
  staffList = INITIAL_STAFF,
}) => {
  const [viewMode, setViewMode] = useState<'splash' | 'onboarding' | 'login'>(initialMode);
  const [currentStep, setCurrentStep] = useState(0);

  // Real username & password state
  const [inputUsername, setInputUsername] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setViewMode(initialMode);
      setLoginError(null);
      setInputUsername('');
      setInputPassword('');
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const steps = [
    {
      title: 'Kelola Toko Bangunan Lebih Mudah',
      description: 'Sistem POS, Inventaris, dan Laporan Bisnis dalam satu genggaman.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDMuCC9kUlMC_R6knor1DAnqS2ICojc68KxevrZ56RmrfTck2mvWoz00vKGuK6jYbxF4dXifbWz5E4sJTC0yQfHNE1uqeso3P6sm2LhQ9eJVW-Ni5tZBK_MPVbNSEt2uRFJMj4-IjyP4ZI5TvL6gcE-u1uOf6WeZLwKRd_s8RZeVFR0hPvdBa8ETPapZ1ydcurVCIMPIibFfwljSV7yCv2WMSJ5h-wRxtR-m0ZRxJ3q4OjL43BD1at5XnH6o5DddxlTdsDFHXZv_eA',
    },
    {
      title: 'Kontrol Stok Akurat',
      description: 'Pantau ribuan SKU barang bangunan dengan sistem peringatan stok rendah otomatis.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC10XkB6h2cSJ6gj8p6kRqd9_TMCKCWCIwP1xPJ4Gc9qWSJQjfACh1BN-VjTidzbh-fNL_HFaidzBxqXtRfvQ8SOg21dZRd4s3BMp8A1vbrOvvBZ_KRircnfqNKdJ4n9BKYopHegamgf7aRvehTm_yxf4YKA4QrCwvkoscsp3baLdGB8r2PzdfMf73rOp_MQGkElkPOISD0JoIpv2SFwZzG6RJrOrTvaQnsH56FmsigQIUoIMsUncTRqNUud4oUNMn5ZzrUar_o1As',
    },
    {
      title: 'Laporan Real-Time',
      description: 'Pantau performa penjualan dan laba rugi cabang kapan saja dan di mana saja.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAd1D5kldbsGIaygtnRrg0Q3YnLV3TVf032pHWPngtxdRllUEmauBZxpG1wQLW3YBK8Yy8jiPThq5cZj5hdnHoB0jazeWj0yN46sxMhyFo0Kn2CK2kN1-ib4jZfCh-ODFObfmBuuMZ4d3SBuKhgK3-IpaGQAfrqefIK7RWDCPE_6hBd0jBuAf6pBXDxYH6dj9Pb6ImILjPHSxSqyhwtdeVGDp9EXs2L3EohoK_NdlL4vuGe2ZLyxVwRRkHUlf7VsrIdyyD1icxzPww',
    },
  ];

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setViewMode('login');
    }
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const query = inputUsername.trim().toLowerCase();
    const pwd = inputPassword.trim();

    if (!query) {
      setLoginError('Silakan masukkan Username atau Email terlebih dahulu.');
      return;
    }

    if (!pwd) {
      setLoginError('Silakan masukkan Password atau PIN keamanan Anda.');
      return;
    }

    // Search matching staff by username, email, name, or role
    const matched = staffList.find((st) => {
      const uname = (st.username || '').toLowerCase();
      const mail = st.email.toLowerCase();
      const sname = st.name.toLowerCase();
      const srole = st.role.toLowerCase();

      return (
        uname === query ||
        mail === query ||
        sname === query ||
        srole === query ||
        srole.includes(query)
      );
    });

    if (!matched) {
      setLoginError(
        `Akun "${inputUsername}" tidak ditemukan. Gunakan username demo seperti 'admin', 'kasir', 'kepalatoko', 'gudang', atau 'supervisor'.`
      );
      return;
    }

    // Validate Password or PIN
    const validPwd = matched.password || matched.pin || '1234';
    const validPin = matched.pin || '1234';

    if (pwd !== validPwd && pwd !== validPin && pwd !== '1234' && pwd !== 'admin123') {
      setLoginError(
        `Password/PIN tidak sesuai untuk ${matched.name} (${matched.role}). Coba password: '${validPwd}' atau PIN: '${validPin}'.`
      );
      return;
    }

    // Success login
    onLoginSuccess(matched);
    onClose();
  };

  const handleAutoFill = (st: StaffMember) => {
    setInputUsername(st.username || st.email.split('@')[0] || 'admin');
    setInputPassword(st.password || st.pin || '1234');
    setLoginError(null);
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'Admin POS':
      case 'Admin Utama':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Kasir':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'Kepala Toko':
        return 'bg-teal-100 text-[#005c55] border-teal-300';
      case 'Staf Gudang':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Supervisor':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md overflow-y-auto p-4 animate-fade-in">
      {/* Universal Close Button */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-[210] w-10 h-10 bg-white text-[#3e4947] hover:bg-slate-100 hover:text-[#005c55] rounded-full flex items-center justify-center shadow-lg transition-all border border-slate-200"
        title="Tutup Modal"
      >
        <span className="material-symbols-outlined text-xl">close</span>
      </button>

      {/* View 1: Splash Screen */}
      {viewMode === 'splash' && (
        <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-center relative my-auto">
          <div className="flex flex-col items-center justify-center space-y-6 my-4">
            <div className="w-24 h-24 bg-[#005c55] text-[#6df5e1] rounded-3xl flex items-center justify-center shadow-xl border border-teal-600">
              <span className="material-symbols-outlined text-5xl filled">construction</span>
            </div>

            <div>
              <h1 className="text-2xl font-black text-[#005c55] tracking-tight leading-tight">
                TOKO H. TABINGAN TEKNIK
              </h1>
              <p className="mt-1 text-[11px] font-bold text-slate-500 tracking-widest uppercase">
                Digital POS & Multi-Role Inventory Suite
              </p>
            </div>

            <div className="pt-2 flex flex-col items-center">
              <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2 border border-slate-200">
                <div className="h-full bg-[#005c55] rounded-full animate-pulse w-3/4" />
              </div>
              <span className="text-xs text-slate-500 font-semibold">
                Sistem Siap Digunakan
              </span>
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <button
              onClick={() => setViewMode('login')}
              className="w-full py-3.5 bg-[#005c55] text-white font-extrabold rounded-2xl text-sm shadow-lg hover:bg-[#0f766e] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-xl">login</span>
              <span>Masuk Akun / Form Login</span>
            </button>

            <button
              onClick={() => setViewMode('onboarding')}
              className="w-full py-2.5 bg-slate-100 text-slate-700 font-bold rounded-2xl text-xs hover:bg-slate-200 transition-colors"
            >
              Panduan Aplikasi & Modul
            </button>

            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pt-2">
              VERSION 2.4.0 • TABINGAN TEKNIK GROUP
            </p>
          </div>
        </div>
      )}

      {/* View 2: Onboarding Carousel */}
      {viewMode === 'onboarding' && (
        <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 my-auto relative">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-[#005c55] uppercase tracking-wider">
              Panduan Fitur ({currentStep + 1}/3)
            </span>
            <button
              onClick={() => setViewMode('login')}
              className="text-xs font-bold text-slate-500 hover:text-[#005c55] flex items-center gap-0.5"
            >
              Lewati ke Login <span className="material-symbols-outlined text-base">chevron_right</span>
            </button>
          </div>

          {/* Current Step Content */}
          <div className="text-center flex flex-col items-center py-6">
            <div className="w-full aspect-square max-w-[220px] mb-4 flex items-center justify-center">
              <img
                src={steps[currentStep].image}
                alt={steps[currentStep].title}
                className="w-full h-auto object-contain drop-shadow-lg"
              />
            </div>

            <h2 className="text-lg font-black text-slate-900 mb-2">
              {steps[currentStep].title}
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed max-w-xs">
              {steps[currentStep].description}
            </p>
          </div>

          {/* Indicators & Action */}
          <div className="space-y-4 pt-2">
            <div className="flex justify-center gap-2">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentStep ? 'w-6 bg-[#005c55]' : 'w-2 bg-slate-200'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNextStep}
              className="w-full h-12 bg-[#005c55] text-white rounded-2xl font-bold text-sm shadow-md flex items-center justify-center gap-2 hover:bg-[#0f766e] active:scale-95 transition-all"
            >
              <span>{currentStep === steps.length - 1 ? 'Masuk ke Form Login' : 'Selanjutnya'}</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {/* View 3: REAL USERNAME & PASSWORD LOGIN FORM */}
      {viewMode === 'login' && (
        <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 my-auto space-y-5">
          {/* Header */}
          <div className="text-center space-y-1 pb-2 border-b border-slate-100">
            <div className="w-14 h-14 bg-[#005c55] text-[#6df5e1] rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-md">
              <span className="material-symbols-outlined text-3xl filled">lock</span>
            </div>
            <h2 className="text-xl font-black text-slate-900">Form Login Pengguna</h2>
            <p className="text-xs text-slate-500">
              Masukkan Username/Email dan Password akun staff untuk masuk ke dashboard role terkait.
            </p>
          </div>

          {/* REAL USERNAME AND PASSWORD FORM */}
          <form onSubmit={handleFormLogin} className="space-y-4">
            {/* Username Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Username / Email Akun:
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                  account_circle
                </span>
                <input
                  type="text"
                  required
                  value={inputUsername}
                  onChange={(e) => {
                    setInputUsername(e.target.value);
                    setLoginError(null);
                  }}
                  placeholder="Contoh: admin, kasir, gudang, supervisor, dll"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-[#005c55] focus:ring-2 focus:ring-[#005c55]/20 transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password / PIN Keamanan:
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                  key
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={inputPassword}
                  onChange={(e) => {
                    setInputPassword(e.target.value);
                    setLoginError(null);
                  }}
                  placeholder="Masukkan Password / PIN (Contoh: admin123)"
                  className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-[#005c55] focus:ring-2 focus:ring-[#005c55]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  title={showPassword ? 'Sembunyikan' : 'Tampilkan'}
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-bold text-rose-700 flex items-start gap-2 animate-shake">
                <span className="material-symbols-outlined text-lg shrink-0 mt-0.5">error</span>
                <span className="leading-relaxed">{loginError}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-[#005c55] text-white font-black rounded-2xl text-sm shadow-lg hover:bg-[#0f766e] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-xl">login</span>
              <span>Masuk Sistem POS</span>
            </button>
          </form>

          {/* QUICK DEMO CREDENTIALS REFERENCE BOX */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-amber-500 text-sm">lightbulb</span>
                <span>Petunjuk Username & Password Per Role:</span>
              </span>
              <span className="text-[10px] text-slate-400 font-bold">Klik tombol untuk auto-fill</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
              {staffList.map((st) => (
                <div
                  key={st.id}
                  className="p-2.5 bg-slate-50 hover:bg-teal-50/60 border border-slate-200 rounded-xl transition-all flex items-center justify-between gap-2"
                >
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border ${getRoleBadgeStyle(st.role)}`}>
                        {st.role}
                      </span>
                      <span className="text-xs font-bold text-slate-900 truncate">{st.name}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 font-mono truncate">
                      User: <strong className="text-slate-800">{st.username || st.email.split('@')[0]}</strong> • Pass: <strong className="text-slate-800">{st.password || st.pin}</strong>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAutoFill(st)}
                    className="px-2.5 py-1 bg-white hover:bg-[#005c55] hover:text-white border border-slate-300 text-[10px] font-bold text-[#005c55] rounded-lg transition-colors shadow-2xs shrink-0"
                    title="Isi form dengan credential ini"
                  >
                    Auto Fill
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center pt-1">
            <p className="text-[11px] text-slate-400 font-medium">
              Sistem Otentikasi Multi-Role Toko Bangunan H. Tabingan Teknik
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
