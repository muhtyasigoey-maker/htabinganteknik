import React, { useState, useEffect } from 'react';
import { Transaction, TabType } from '../types';
import { StockActionType } from './StockActionModal';

type UserRole = 'Admin Utama' | 'Kasir' | 'Kepala Toko' | 'Staf Gudang' | 'Supervisor';

interface UserProfileProps {
  name: string;
  email: string;
  role: string;
  avatar: string;
  shift?: string;
  phone?: string;
}

interface DashboardViewProps {
  transactions: Transaction[];
  userName?: string;
  currentUser?: UserProfileProps;
  onNavigate: (tab: TabType) => void;
  onOpenAddProduct: () => void;
  onOpenStockAction?: (action: StockActionType) => void;
  onOpenLogin?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  transactions,
  userName = 'Admin Utama',
  currentUser,
  onNavigate,
  onOpenAddProduct,
  onOpenStockAction,
  onOpenLogin,
}) => {
  const normalizeRole = (roleStr?: string): UserRole => {
    if (!roleStr) return 'Admin Utama';
    if (roleStr.includes('Admin') || roleStr.includes('Owner') || roleStr.includes('Administrator'))
      return 'Admin Utama';
    if (roleStr.includes('Kasir')) return 'Kasir';
    if (roleStr.includes('Kepala Toko')) return 'Kepala Toko';
    if (roleStr.includes('Gudang')) return 'Staf Gudang';
    if (roleStr.includes('Supervisor')) return 'Supervisor';
    return 'Admin Utama';
  };

  const currentRole = normalizeRole(currentUser?.role);

  const [chartPeriod, setChartPeriod] = useState('7 Hari Terakhir');
  const [activeBar, setActiveBar] = useState<number | null>(6);
  const [isMetricsVisible, setIsMetricsVisible] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showShopSelector, setShowShopSelector] = useState(false);
  const [selectedShop, setSelectedShop] = useState('Toko H. Tabingan (Pusat - Jakarta)');

  const rolesMetaData: Record<
    UserRole,
    { label: string; icon: string; bg: string; text: string; desc: string }
  > = {
    'Admin Utama': {
      label: 'Admin / Owner',
      icon: 'admin_panel_settings',
      bg: 'bg-amber-500',
      text: 'text-amber-600',
      desc: 'Akses penuh laporan keuangan, analitik omset, target cabang, dan konfigurasi sistem.',
    },
    Kasir: {
      label: 'Kasir POS',
      icon: 'point_of_sale',
      bg: 'bg-rose-500',
      text: 'text-rose-600',
      desc: 'Fokus transaksi POS, kas shift hari ini, pencetakan struk, dan riwayat penjualan.',
    },
    'Kepala Toko': {
      label: 'Kepala Toko',
      icon: 'storefront',
      bg: 'bg-[#005c55]',
      text: 'text-[#005c55]',
      desc: 'Monitor target omset cabang, kehadiran kasir, otorisasi diskon, dan stok outlet.',
    },
    'Staf Gudang': {
      label: 'Staf Gudang',
      icon: 'warehouse',
      bg: 'bg-blue-600',
      text: 'text-blue-600',
      desc: 'Kelola barang masuk/keluar, stock opname audit, kapasitas gudang & transfer stok.',
    },
    Supervisor: {
      label: 'Supervisor',
      icon: 'insights',
      bg: 'bg-purple-600',
      text: 'text-purple-600',
      desc: 'Pengawasan transaksi, evaluasi kinerja staff, margin keuntungan, dan audit vendor.',
    },
  };

  const activeRoleData = rolesMetaData[currentRole];

  const weeklyData = [
    { day: 'Sen', amount: '18.2M', height: '60%' },
    { day: 'Sel', amount: '20.1M', height: '75%' },
    { day: 'Rab', amount: '15.4M', height: '45%' },
    { day: 'Kam', amount: '22.8M', height: '85%' },
    { day: 'Jum', amount: '23.9M', height: '95%' },
    { day: 'Sab', amount: '14.1M', height: '40%' },
    { day: 'Min', amount: '24.5M (Hari Ini)', height: '100%', isToday: true },
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="pt-16 pb-32 min-h-screen bg-[#f4f6f8] animate-fade-in">
      {/* 1. SEAMLESS TOP HEADER BANNER */}
      <div className="bg-[#005c55] text-white pt-6 pb-20 px-4 md:px-8 shadow-md relative">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Shop Selector Button */}
            <div className="relative">
              <button
                onClick={() => setShowShopSelector(!showShopSelector)}
                className="bg-white/15 hover:bg-white/25 transition-colors border border-white/20 rounded-full px-4 py-2 flex items-center gap-2 text-xs md:text-sm font-semibold text-white focus:outline-none"
              >
                <span className="material-symbols-outlined text-lg">storefront</span>
                <span className="truncate max-w-[200px] md:max-w-none">{selectedShop}</span>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>

              {showShopSelector && (
                <div className="absolute top-12 left-0 w-72 bg-white text-[#181c1c] rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 text-xs animate-in zoom-in-95">
                  <div className="p-2 font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                    Pilih Cabang / Toko Operasional
                  </div>
                  {[
                    'Toko H. Tabingan (Pusat - Jakarta)',
                    'Toko H. Tabingan (Cabang Bekasi)',
                    'Toko H. Tabingan (BSD Tangerang)',
                    'Outlet Proyek Depok',
                  ].map((shop) => (
                    <button
                      key={shop}
                      onClick={() => {
                        setSelectedShop(shop);
                        setShowShopSelector(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl font-medium flex items-center justify-between hover:bg-slate-100 ${
                        selectedShop === shop ? 'bg-teal-50 text-[#005c55] font-bold' : ''
                      }`}
                    >
                      <span className="truncate">{shop}</span>
                      {selectedShop === shop && (
                        <span className="material-symbols-outlined text-sm">check</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Bell & Profile Quick Info */}
            <div className="relative flex items-center gap-3">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 bg-white/15 hover:bg-white/25 rounded-full text-white transition-colors focus:outline-none"
                title="Notifikasi"
              >
                <span className="material-symbols-outlined text-xl">notifications</span>
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center border border-[#005c55]">
                  3
                </span>
              </button>

              {showNotifications && (
                <div className="absolute top-12 right-0 w-80 bg-white text-[#181c1c] rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 text-xs animate-in zoom-in-95">
                  <div className="flex items-center justify-between border-b pb-2 mb-3">
                    <span className="font-bold text-sm">Notifikasi Peringatan</span>
                    <span className="text-[10px] text-[#005c55] bg-teal-50 px-2 py-0.5 rounded-full font-bold">
                      3 Baru
                    </span>
                  </div>
                  <div className="space-y-2.5 max-h-60 overflow-y-auto">
                    <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200">
                      <p className="font-bold text-amber-900">Stok Kritis</p>
                      <p className="text-amber-700 text-[11px]">Busi Champion sisa 4 unit di gudang.</p>
                    </div>
                    <div className="p-2.5 bg-teal-50 rounded-xl border border-teal-200">
                      <p className="font-bold text-[#005c55]">Barang Masuk</p>
                      <p className="text-teal-800 text-[11px]">
                        PO-20231022 telah diterima di Gudang Utama.
                      </p>
                    </div>
                    <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
                      <p className="font-bold text-emerald-900">Laporan Penjualan</p>
                      <p className="text-emerald-700 text-[11px]">Laporan harian kemarin selesai dibuat.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* REAL LOGGED IN USER PROFILE BANNER */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#6df5e1] text-[#005c55] font-black text-base flex items-center justify-center shadow-md border border-white/30 shrink-0">
                {currentUser?.avatar || 'AU'}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base md:text-lg font-black text-white leading-tight">
                    {currentUser?.name || userName}
                  </h2>
                  <span className="text-[10px] font-extrabold bg-[#6df5e1] text-[#006f64] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                    {currentUser?.role || 'Admin POS'}
                  </span>
                </div>
                <p className="text-xs text-[#a3faef] mt-0.5 font-medium">
                  Email: {currentUser?.email || 'admin@tabingan.com'} • Shift: {currentUser?.shift || 'Full Time'}
                </p>
              </div>
            </div>

            <button
              onClick={onOpenLogin}
              className="bg-white text-[#005c55] hover:bg-[#6df5e1] font-black text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md active:scale-95 shrink-0 self-end sm:self-auto"
              title="Ganti Akun atau Role Staff"
            >
              <span className="material-symbols-outlined text-base">swap_horiz</span>
              <span>Ganti Akun / Switch Role</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT CONTAINER WITH NEGATIVE TOP MARGIN */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 -mt-12 space-y-6 relative z-10">
        {/* ROLE DESCRIPTION BANNER */}
        <div className="bg-white rounded-3xl p-5 shadow-xl border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-2xl ${activeRoleData.bg} text-white flex items-center justify-center shrink-0 shadow-md`}>
              <span className="material-symbols-outlined text-2xl">{activeRoleData.icon}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-slate-400">Tampilan Terautentikasi</span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 ${activeRoleData.text}`}>
                  {currentRole}
                </span>
              </div>
              <h2 className="text-lg font-black text-slate-900 leading-tight">
                Dashboard Operasional Peran: {currentRole}
              </h2>
              <p className="text-xs text-slate-500 max-w-xl mt-0.5 font-medium">
                {activeRoleData.desc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setIsMetricsVisible(!isMetricsVisible)}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-base">
                {isMetricsVisible ? 'visibility' : 'visibility_off'}
              </span>
              <span>{isMetricsVisible ? 'Sembunyikan Angka' : 'Tampilkan Angka'}</span>
            </button>
          </div>
        </div>

        {/* 2. DYNAMIC ROLE-SPECIFIC TODAY'S METRICS GRID */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-600 font-bold">query_stats</span>
              <h3 className="text-base font-bold text-slate-800">
                Ringkasan Kinerja Hari Ini ({currentRole})
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-semibold">Real-time Sync</span>
          </div>

          {/* DYNAMIC METRIC CARDS BASED ON ROLE */}
          {currentRole === 'Admin Utama' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl">
                <p className="text-xs font-bold text-emerald-800">Total Omset Hari Ini</p>
                <p className="text-2xl font-black text-emerald-900 mt-1">
                  {isMetricsVisible ? 'Rp 24.500.000' : '••••••••'}
                </p>
                <span className="text-[10px] text-emerald-700 font-bold">↑ +14% vs kemarin</span>
              </div>

              <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl">
                <p className="text-xs font-bold text-blue-800">Estimasi Laba Kotor</p>
                <p className="text-2xl font-black text-blue-900 mt-1">
                  {isMetricsVisible ? 'Rp 4.250.000' : '••••••••'}
                </p>
                <span className="text-[10px] text-blue-700 font-bold">Margin 17.3%</span>
              </div>

              <div className="p-4 bg-teal-50/70 border border-teal-100 rounded-2xl">
                <p className="text-xs font-bold text-[#005c55]">Total Transaksi</p>
                <p className="text-2xl font-black text-[#005c55] mt-1">
                  {isMetricsVisible ? `${transactions.length} Struk` : '••'}
                </p>
                <span className="text-[10px] text-teal-700 font-bold">Rata2 Rp 580rb / trx</span>
              </div>

              <div className="p-4 bg-amber-50/70 border border-amber-100 rounded-2xl">
                <p className="text-xs font-bold text-amber-800">Pencapaian Target</p>
                <p className="text-2xl font-black text-amber-900 mt-1">
                  {isMetricsVisible ? '92%' : '••'}
                </p>
                <span className="text-[10px] text-amber-700 font-bold">Target Rp 500Jt/bln</span>
              </div>
            </div>
          )}

          {currentRole === 'Kasir' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-rose-50/70 border border-rose-100 rounded-2xl">
                <p className="text-xs font-bold text-rose-800">Shift Penjualan Kasir</p>
                <p className="text-2xl font-black text-rose-900 mt-1">
                  {isMetricsVisible ? 'Rp 8.750.000' : '••••••••'}
                </p>
                <span className="text-[10px] text-rose-700 font-bold">Shift Pagi (Aktif)</span>
              </div>

              <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl">
                <p className="text-xs font-bold text-emerald-800">Setoran Tunai (Cash)</p>
                <p className="text-2xl font-black text-emerald-900 mt-1">
                  {isMetricsVisible ? 'Rp 4.200.000' : '••••••••'}
                </p>
                <span className="text-[10px] text-emerald-700 font-bold">Modal Laci: Rp 500rb</span>
              </div>

              <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl">
                <p className="text-xs font-bold text-blue-800">Pembayaran QRIS / Non-Tunai</p>
                <p className="text-2xl font-black text-blue-900 mt-1">
                  {isMetricsVisible ? 'Rp 4.550.000' : '••••••••'}
                </p>
                <span className="text-[10px] text-blue-700 font-bold">18 Transaksi QRIS</span>
              </div>

              <div className="p-4 bg-slate-100 border border-slate-200 rounded-2xl">
                <p className="text-xs font-bold text-slate-700">Total Struk Shift Ini</p>
                <p className="text-2xl font-black text-slate-900 mt-1">
                  {isMetricsVisible ? '28 Struk' : '••'}
                </p>
                <span className="text-[10px] text-slate-600 font-bold">Kecepatan 1.2 mnt/trx</span>
              </div>
            </div>
          )}

          {currentRole === 'Kepala Toko' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-teal-50/70 border border-teal-100 rounded-2xl">
                <p className="text-xs font-bold text-[#005c55]">Omset Cabang Hari Ini</p>
                <p className="text-2xl font-black text-[#005c55] mt-1">
                  {isMetricsVisible ? 'Rp 16.200.000' : '••••••••'}
                </p>
                <span className="text-[10px] text-teal-700 font-bold">Target Harian: Rp 15Jt</span>
              </div>

              <div className="p-4 bg-amber-50/70 border border-amber-100 rounded-2xl">
                <p className="text-xs font-bold text-amber-800">Kehadiran Staff Shift</p>
                <p className="text-2xl font-black text-amber-900 mt-1">
                  {isMetricsVisible ? '6 / 6 Orang' : '••'}
                </p>
                <span className="text-[10px] text-amber-700 font-bold">100% On-Time</span>
              </div>

              <div className="p-4 bg-purple-50/70 border border-purple-100 rounded-2xl">
                <p className="text-xs font-bold text-purple-800">Otorisasi Void / Retur</p>
                <p className="text-2xl font-black text-purple-900 mt-1">
                  {isMetricsVisible ? '2 Pengajuan' : '••'}
                </p>
                <span className="text-[10px] text-purple-700 font-bold">Butuh Persetujuan</span>
              </div>

              <div className="p-4 bg-slate-100 border border-slate-200 rounded-2xl">
                <p className="text-xs font-bold text-slate-700">Stok Outlet Kritis</p>
                <p className="text-2xl font-black text-rose-600 mt-1">
                  {isMetricsVisible ? '8 SKU' : '••'}
                </p>
                <span className="text-[10px] text-slate-600 font-bold">Perlu Reorder PO</span>
              </div>
            </div>
          )}

          {currentRole === 'Staf Gudang' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl">
                <p className="text-xs font-bold text-blue-800">Barang Masuk (Inbound)</p>
                <p className="text-2xl font-black text-blue-900 mt-1">
                  {isMetricsVisible ? '142 Item' : '••••'}
                </p>
                <span className="text-[10px] text-blue-700 font-bold">3 Pengiriman PO</span>
              </div>

              <div className="p-4 bg-amber-50/70 border border-amber-100 rounded-2xl">
                <p className="text-xs font-bold text-amber-800">Barang Keluar (Outbound)</p>
                <p className="text-2xl font-black text-amber-900 mt-1">
                  {isMetricsVisible ? '380 Item' : '••••'}
                </p>
                <span className="text-[10px] text-amber-700 font-bold">Penjualan + Transfer</span>
              </div>

              <div className="p-4 bg-[#005c55]/10 border border-[#005c55]/20 rounded-2xl">
                <p className="text-xs font-bold text-[#005c55]">Kapasitas Gudang</p>
                <p className="text-2xl font-black text-[#005c55] mt-1">
                  {isMetricsVisible ? '78%' : '••%'}
                </p>
                <span className="text-[10px] text-teal-700 font-bold">Gudang Utama Jakarta</span>
              </div>

              <div className="p-4 bg-rose-50/70 border border-rose-100 rounded-2xl">
                <p className="text-xs font-bold text-rose-800">Stock Opname Pending</p>
                <p className="text-2xl font-black text-rose-900 mt-1">
                  {isMetricsVisible ? '3 Rak' : '••'}
                </p>
                <span className="text-[10px] text-rose-700 font-bold">Jadwal Hari Ini</span>
              </div>
            </div>
          )}

          {currentRole === 'Supervisor' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-purple-50/70 border border-purple-100 rounded-2xl">
                <p className="text-xs font-bold text-purple-800">Audit Transaksi POS</p>
                <p className="text-2xl font-black text-purple-900 mt-1">
                  {isMetricsVisible ? '100% Clean' : '••'}
                </p>
                <span className="text-[10px] text-purple-700 font-bold">Tidak ada selisih kas</span>
              </div>

              <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl">
                <p className="text-xs font-bold text-emerald-800">Margin Produk Rata2</p>
                <p className="text-2xl font-black text-emerald-900 mt-1">
                  {isMetricsVisible ? '21.4%' : '••%'}
                </p>
                <span className="text-[10px] text-emerald-700 font-bold">Di atas target (20%)</span>
              </div>

              <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl">
                <p className="text-xs font-bold text-blue-800">Rating Pemasok / Vendor</p>
                <p className="text-2xl font-black text-blue-900 mt-1">
                  {isMetricsVisible ? '4.8 / 5.0' : '••'}
                </p>
                <span className="text-[10px] text-blue-700 font-bold">6 Supplier Utama</span>
              </div>

              <div className="p-4 bg-amber-50/70 border border-amber-100 rounded-2xl">
                <p className="text-xs font-bold text-amber-800">Evaluasi Kasir Shift</p>
                <p className="text-2xl font-black text-amber-900 mt-1">
                  {isMetricsVisible ? 'Sangat Baik' : '••'}
                </p>
                <span className="text-[10px] text-amber-700 font-bold">0 Komplain Pelanggan</span>
              </div>
            </div>
          )}
        </div>

        {/* 3. ROLE-TAILORED QUICK ACTIONS & OPERATIONAL TOOLS */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6">
          <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-teal-600">bolt</span>
            <span>Aksi Cepat & Navigasi Operasional ({currentRole})</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {currentRole === 'Admin Utama' && (
              <>
                <button
                  onClick={() => onNavigate('reports')}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-teal-50 hover:border-teal-300 transition-all flex flex-col items-center text-center gap-2 group"
                >
                  <span className="material-symbols-outlined text-3xl text-teal-700 group-hover:scale-110 transition-transform">
                    analytics
                  </span>
                  <span className="text-xs font-bold text-slate-800">Laporan Finansial</span>
                </button>
                <button
                  onClick={() => onNavigate('stores')}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-teal-50 hover:border-teal-300 transition-all flex flex-col items-center text-center gap-2 group"
                >
                  <span className="material-symbols-outlined text-3xl text-amber-600 group-hover:scale-110 transition-transform">
                    storefront
                  </span>
                  <span className="text-xs font-bold text-slate-800">Manajemen Cabang</span>
                </button>
                <button
                  onClick={() => onNavigate('staff')}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-teal-50 hover:border-teal-300 transition-all flex flex-col items-center text-center gap-2 group"
                >
                  <span className="material-symbols-outlined text-3xl text-blue-600 group-hover:scale-110 transition-transform">
                    badge
                  </span>
                  <span className="text-xs font-bold text-slate-800">Kelola Staff & Role</span>
                </button>
                <button
                  onClick={() => onNavigate('suppliers')}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-teal-50 hover:border-teal-300 transition-all flex flex-col items-center text-center gap-2 group"
                >
                  <span className="material-symbols-outlined text-3xl text-purple-600 group-hover:scale-110 transition-transform">
                    local_shipping
                  </span>
                  <span className="text-xs font-bold text-slate-800">Pemasok & PO</span>
                </button>
              </>
            )}

            {currentRole === 'Kasir' && (
              <>
                <button
                  onClick={() => onNavigate('pos')}
                  className="p-4 rounded-2xl bg-[#005c55] text-white hover:bg-[#0f766e] transition-all flex flex-col items-center text-center gap-2 shadow-md group col-span-2"
                >
                  <span className="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform">
                    point_of_sale
                  </span>
                  <span className="text-sm font-black">Buka Mesin Kasir POS</span>
                </button>
                <button
                  onClick={() => onNavigate('receipt')}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-teal-50 transition-all flex flex-col items-center text-center gap-2 group"
                >
                  <span className="material-symbols-outlined text-3xl text-rose-600 group-hover:scale-110 transition-transform">
                    receipt_long
                  </span>
                  <span className="text-xs font-bold text-slate-800">Cetak Ulang Struk</span>
                </button>
                <button
                  onClick={() => onNavigate('customers')}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-teal-50 transition-all flex flex-col items-center text-center gap-2 group"
                >
                  <span className="material-symbols-outlined text-3xl text-blue-600 group-hover:scale-110 transition-transform">
                    person_add
                  </span>
                  <span className="text-xs font-bold text-slate-800">Cari Pelanggan</span>
                </button>
              </>
            )}

            {currentRole === 'Kepala Toko' && (
              <>
                <button
                  onClick={() => onNavigate('pos')}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-teal-50 transition-all flex flex-col items-center text-center gap-2 group"
                >
                  <span className="material-symbols-outlined text-3xl text-[#005c55] group-hover:scale-110 transition-transform">
                    point_of_sale
                  </span>
                  <span className="text-xs font-bold text-slate-800">Mesin Kasir</span>
                </button>
                <button
                  onClick={() => onNavigate('staff')}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-teal-50 transition-all flex flex-col items-center text-center gap-2 group"
                >
                  <span className="material-symbols-outlined text-3xl text-amber-600 group-hover:scale-110 transition-transform">
                    badge
                  </span>
                  <span className="text-xs font-bold text-slate-800">Presensi Shift Kasir</span>
                </button>
                <button
                  onClick={() => onNavigate('inventory')}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-teal-50 transition-all flex flex-col items-center text-center gap-2 group"
                >
                  <span className="material-symbols-outlined text-3xl text-purple-600 group-hover:scale-110 transition-transform">
                    inventory_2
                  </span>
                  <span className="text-xs font-bold text-slate-800">Otorisasi Harga</span>
                </button>
                <button
                  onClick={() => onNavigate('reports')}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-teal-50 transition-all flex flex-col items-center text-center gap-2 group"
                >
                  <span className="material-symbols-outlined text-3xl text-emerald-600 group-hover:scale-110 transition-transform">
                    insert_chart
                  </span>
                  <span className="text-xs font-bold text-slate-800">Laporan Outlet</span>
                </button>
              </>
            )}

            {currentRole === 'Staf Gudang' && (
              <>
                <button
                  onClick={() => onOpenStockAction && onOpenStockAction('stock_in')}
                  className="p-4 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all flex flex-col items-center text-center gap-2 shadow-md group"
                >
                  <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform">
                    add_box
                  </span>
                  <span className="text-xs font-extrabold">Input Barang Masuk</span>
                </button>
                <button
                  onClick={() => onOpenStockAction && onOpenStockAction('stock_out')}
                  className="p-4 rounded-2xl bg-amber-600 text-white hover:bg-amber-700 transition-all flex flex-col items-center text-center gap-2 shadow-md group"
                >
                  <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform">
                    indeterminate_check_box
                  </span>
                  <span className="text-xs font-extrabold">Input Barang Keluar</span>
                </button>
                <button
                  onClick={() => onNavigate('warehouse')}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-teal-50 transition-all flex flex-col items-center text-center gap-2 group"
                >
                  <span className="material-symbols-outlined text-3xl text-blue-600 group-hover:scale-110 transition-transform">
                    warehouse
                  </span>
                  <span className="text-xs font-bold text-slate-800">Lokasi & Transfer</span>
                </button>
                <button
                  onClick={() => onNavigate('suppliers')}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-teal-50 transition-all flex flex-col items-center text-center gap-2 group"
                >
                  <span className="material-symbols-outlined text-3xl text-purple-600 group-hover:scale-110 transition-transform">
                    local_shipping
                  </span>
                  <span className="text-xs font-bold text-slate-800">Daftar Pemasok</span>
                </button>
              </>
            )}

            {currentRole === 'Supervisor' && (
              <>
                <button
                  onClick={() => onNavigate('reports')}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-teal-50 transition-all flex flex-col items-center text-center gap-2 group"
                >
                  <span className="material-symbols-outlined text-3xl text-purple-600 group-hover:scale-110 transition-transform">
                    fact_check
                  </span>
                  <span className="text-xs font-bold text-slate-800">Audit Transaksi</span>
                </button>
                <button
                  onClick={() => onNavigate('inventory')}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-teal-50 transition-all flex flex-col items-center text-center gap-2 group"
                >
                  <span className="material-symbols-outlined text-3xl text-[#005c55] group-hover:scale-110 transition-transform">
                    published_with_changes
                  </span>
                  <span className="text-xs font-bold text-slate-800">Audit Stok Harian</span>
                </button>
                <button
                  onClick={() => onNavigate('suppliers')}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-teal-50 transition-all flex flex-col items-center text-center gap-2 group"
                >
                  <span className="material-symbols-outlined text-3xl text-amber-600 group-hover:scale-110 transition-transform">
                    rate_review
                  </span>
                  <span className="text-xs font-bold text-slate-800">Evaluasi Vendor</span>
                </button>
                <button
                  onClick={() => onNavigate('customers')}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-teal-50 transition-all flex flex-col items-center text-center gap-2 group"
                >
                  <span className="material-symbols-outlined text-3xl text-blue-600 group-hover:scale-110 transition-transform">
                    engineering
                  </span>
                  <span className="text-xs font-bold text-slate-800">Pelanggan Kontraktor</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* 4. WEEKLY SALES CHART */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-600">bar_chart</span>
                <span>Tren Penjualan Mingguan ({selectedShop})</span>
              </h3>
              <p className="text-xs text-slate-500">Omset dalam jutaan Rupiah</p>
            </div>

            <div className="flex items-center gap-2">
              {['7 Hari Terakhir', 'Bulan Ini'].map((p) => (
                <button
                  key={p}
                  onClick={() => setChartPeriod(p)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    chartPeriod === p
                      ? 'bg-[#005c55] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="h-48 flex items-end justify-between gap-2 pt-6 px-2 border-b border-slate-100">
            {weeklyData.map((d, idx) => (
              <div
                key={idx}
                onClick={() => setActiveBar(idx)}
                className="flex-1 flex flex-col items-center gap-2 h-full justify-end cursor-pointer group"
              >
                {activeBar === idx && (
                  <span className="text-[10px] font-black bg-[#005c55] text-white px-1.5 py-0.5 rounded-md animate-bounce">
                    {d.amount}
                  </span>
                )}
                <div
                  style={{ height: d.height }}
                  className={`w-full max-w-[36px] rounded-t-xl transition-all duration-300 ${
                    d.isToday
                      ? 'bg-[#005c55] shadow-md group-hover:bg-[#0f766e]'
                      : activeBar === idx
                      ? 'bg-teal-600'
                      : 'bg-slate-200 group-hover:bg-slate-300'
                  }`}
                />
                <span
                  className={`text-xs font-bold ${
                    d.isToday ? 'text-[#005c55]' : 'text-slate-400'
                  }`}
                >
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
