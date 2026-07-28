import React, { useState } from 'react';
import { TabType } from '../types';

interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar: string;
}

interface NavigationProps {
  activeTab: TabType;
  cartCount: number;
  isLoggedIn?: boolean;
  currentUser?: UserProfile;
  onNavigate: (tab: TabType) => void;
  onOpenOnboarding: () => void;
  onOpenLogin?: () => void;
  onLogout?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  cartCount,
  isLoggedIn = true,
  currentUser = {
    name: 'Admin Utama',
    email: 'admin@tabingan.com',
    role: 'Administrator POS',
    avatar: 'AU',
  },
  onNavigate,
  onOpenOnboarding,
  onOpenLogin,
  onLogout,
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <>
      {/* Top App Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#005c55] text-white z-50 flex items-center justify-between px-4 md:px-8 shadow-md">
        {/* Brand Logo & Name */}
        <div
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 bg-[#6df5e1] text-[#006f64] rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-2xl filled">construction</span>
          </div>
          <div>
            <h1 className="text-sm md:text-base font-extrabold tracking-tight leading-tight">
              Toko H. Tabingan Teknik
            </h1>
            <p className="text-[10px] text-[#a3faef] uppercase tracking-widest font-semibold">
              POS & INVENTORY SUITE
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={onOpenOnboarding}
            className="p-2 rounded-xl text-[#a3faef] hover:bg-white/10 transition-colors flex items-center gap-1 text-xs font-semibold"
            title="Panduan & Onboarding"
          >
            <span className="material-symbols-outlined text-xl">help</span>
            <span className="hidden md:inline">Panduan</span>
          </button>

          <button
            onClick={() => onNavigate('reports')}
            className="p-2 rounded-xl text-[#a3faef] hover:bg-white/10 transition-colors relative"
            title="Notifikasi Operasional"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ffdbce] rounded-full animate-ping" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ffdbce] rounded-full" />
          </button>

          <div className="h-6 w-px bg-white/20 hidden sm:block mx-0.5" />

          {/* User Profile Avatar / Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/10 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-[#6df5e1]"
              title="Menu Pengguna"
              id="user-profile-menu-button"
            >
              <div className="w-8 h-8 rounded-full bg-[#6df5e1] text-[#006f64] flex items-center justify-center font-bold text-xs border border-white/30 shadow-xs">
                {isLoggedIn ? currentUser.avatar : '?'}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold leading-tight text-white flex items-center gap-1">
                  {isLoggedIn ? currentUser.name : 'Belum Masuk'}
                  <span className="material-symbols-outlined text-xs text-[#a3faef]">
                    {isProfileMenuOpen ? 'expand_less' : 'expand_more'}
                  </span>
                </span>
                <span className="text-[10px] text-[#a3faef] leading-none">
                  {isLoggedIn ? currentUser.role : 'Tamu'}
                </span>
              </div>
            </button>

            {/* Dropdown Menu */}
            {isProfileMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsProfileMenuOpen(false)}
                />
                <div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-[#bdc9c6] py-2 z-50 text-[#181c1c] animate-in fade-in zoom-in-95 duration-150"
                  id="user-profile-dropdown"
                >
                  {/* User Profile Card Header */}
                  <div className="px-4 py-3 bg-[#f1f4f3] mx-2 rounded-xl mb-2 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#005c55] text-[#a3faef] flex items-center justify-center font-bold text-sm shrink-0">
                      {isLoggedIn ? currentUser.avatar : '?'}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold text-[#181c1c] truncate">
                        {isLoggedIn ? currentUser.name : 'Tamu / Kasir'}
                      </p>
                      <p className="text-xs text-[#6e7977] truncate">
                        {isLoggedIn ? currentUser.email : 'Belum terautentikasi'}
                      </p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isLoggedIn ? 'bg-[#005c55]' : 'bg-[#ba1a1a]'
                          }`}
                        />
                        <span className="text-[10px] font-bold text-[#005c55]">
                          {isLoggedIn ? currentUser.role : 'Akses Terbatas'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#bdc9c6]/50 my-1" />

                  {/* Operational Menu Links */}
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onNavigate('customers');
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-semibold text-[#3e4947] hover:bg-[#f1f4f3] flex items-center gap-2.5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg text-[#005c55]">
                      group
                    </span>
                    <span>Pelanggan & Kontraktor</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onNavigate('warehouse');
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-semibold text-[#3e4947] hover:bg-[#f1f4f3] flex items-center gap-2.5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg text-[#005c55]">
                      warehouse
                    </span>
                    <span>Lokasi Gudang & Transfer</span>
                  </button>

                  <div className="border-t border-[#bdc9c6]/50 my-1" />

                  {/* Menu Options */}
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onOpenOnboarding();
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-semibold text-[#3e4947] hover:bg-[#f1f4f3] flex items-center gap-2.5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg text-[#005c55]">
                      help_outline
                    </span>
                    <span>Panduan Aplikasi & Modul</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      if (onOpenLogin) onOpenLogin();
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs font-semibold text-[#3e4947] hover:bg-[#f1f4f3] flex items-center gap-2.5 transition-colors"
                    id="menu-login-button"
                  >
                    <span className="material-symbols-outlined text-lg text-[#005c55]">
                      login
                    </span>
                    <span>{isLoggedIn ? 'Ganti Akun / Masuk' : 'Masuk (Login)'}</span>
                  </button>

                  {isLoggedIn && (
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        if (onLogout) onLogout();
                      }}
                      className="w-full px-4 py-2.5 text-left text-xs font-bold text-[#ba1a1a] hover:bg-[#ffdad6]/40 flex items-center gap-2.5 transition-colors mt-1 border-t border-[#bdc9c6]/30 pt-2"
                      id="menu-logout-button"
                    >
                      <span className="material-symbols-outlined text-lg text-[#ba1a1a]">
                        logout
                      </span>
                      <span>Keluar (Logout)</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Bottom Sticky Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-[#bdc9c6] z-50 flex items-center justify-around px-2 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <button
          onClick={() => onNavigate('dashboard')}
          className={`flex flex-col items-center justify-center w-full h-full gap-0.5 transition-colors ${
            activeTab === 'dashboard' ? 'text-[#005c55] font-bold' : 'text-[#6e7977] hover:text-[#005c55]'
          }`}
        >
          <span
            className={`material-symbols-outlined text-2xl ${
              activeTab === 'dashboard' ? 'filled text-[#005c55]' : ''
            }`}
          >
            dashboard
          </span>
          <span className="text-[10px] tracking-tight">Dashboard</span>
        </button>

        <button
          onClick={() => onNavigate('pos')}
          className={`flex flex-col items-center justify-center w-full h-full gap-0.5 transition-colors ${
            activeTab === 'pos' ? 'text-[#005c55] font-bold' : 'text-[#6e7977] hover:text-[#005c55]'
          }`}
        >
          <span
            className={`material-symbols-outlined text-2xl ${
              activeTab === 'pos' ? 'filled text-[#005c55]' : ''
            }`}
          >
            point_of_sale
          </span>
          <span className="text-[10px] tracking-tight">Kasir (POS)</span>
        </button>

        <button
          onClick={() => onNavigate('cart')}
          className={`flex flex-col items-center justify-center w-full h-full gap-0.5 transition-colors relative ${
            activeTab === 'cart' || activeTab === 'checkout' || activeTab === 'receipt'
              ? 'text-[#005c55] font-bold'
              : 'text-[#6e7977] hover:text-[#005c55]'
          }`}
        >
          <div className="relative">
            <span
              className={`material-symbols-outlined text-2xl ${
                activeTab === 'cart' ? 'filled text-[#005c55]' : ''
              }`}
            >
              shopping_cart
            </span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#ba1a1a] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Keranjang</span>
        </button>

        <button
          onClick={() => onNavigate('inventory')}
          className={`flex flex-col items-center justify-center w-full h-full gap-0.5 transition-colors ${
            activeTab === 'inventory' ? 'text-[#005c55] font-bold' : 'text-[#6e7977] hover:text-[#005c55]'
          }`}
        >
          <span
            className={`material-symbols-outlined text-xl md:text-2xl ${
              activeTab === 'inventory' ? 'filled text-[#005c55]' : ''
            }`}
          >
            inventory_2
          </span>
          <span className="text-[10px] tracking-tight">Stok</span>
        </button>

        <button
          onClick={() => onNavigate('customers')}
          className={`flex flex-col items-center justify-center w-full h-full gap-0.5 transition-colors ${
            activeTab === 'customers' ? 'text-[#005c55] font-bold' : 'text-[#6e7977] hover:text-[#005c55]'
          }`}
        >
          <span
            className={`material-symbols-outlined text-xl md:text-2xl ${
              activeTab === 'customers' ? 'filled text-[#005c55]' : ''
            }`}
          >
            group
          </span>
          <span className="text-[10px] tracking-tight">Pelanggan</span>
        </button>

        <button
          onClick={() => onNavigate('warehouse')}
          className={`flex flex-col items-center justify-center w-full h-full gap-0.5 transition-colors ${
            activeTab === 'warehouse' ? 'text-[#005c55] font-bold' : 'text-[#6e7977] hover:text-[#005c55]'
          }`}
        >
          <span
            className={`material-symbols-outlined text-xl md:text-2xl ${
              activeTab === 'warehouse' ? 'filled text-[#005c55]' : ''
            }`}
          >
            warehouse
          </span>
          <span className="text-[10px] tracking-tight">Gudang</span>
        </button>

        <button
          onClick={() => onNavigate('reports')}
          className={`flex flex-col items-center justify-center w-full h-full gap-0.5 transition-colors ${
            activeTab === 'reports' ? 'text-[#005c55] font-bold' : 'text-[#6e7977] hover:text-[#005c55]'
          }`}
        >
          <span
            className={`material-symbols-outlined text-2xl ${
              activeTab === 'reports' ? 'filled text-[#005c55]' : ''
            }`}
          >
            bar_chart
          </span>
          <span className="text-[10px] tracking-tight">Laporan</span>
        </button>
      </nav>
    </>
  );
};
