import React, { useState } from 'react';
import { Transaction, TabType } from '../types';
import { StockActionType } from './StockActionModal';

interface DashboardViewProps {
  transactions: Transaction[];
  userName?: string;
  onNavigate: (tab: TabType) => void;
  onOpenAddProduct: () => void;
  onOpenStockAction?: (action: StockActionType) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  transactions,
  userName = 'Admin Utama',
  onNavigate,
  onOpenAddProduct,
  onOpenStockAction,
}) => {
  const [chartPeriod, setChartPeriod] = useState('7 Hari Terakhir');
  const [activeBar, setActiveBar] = useState<number | null>(6);
  const [isMetricsVisible, setIsMetricsVisible] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showShopSelector, setShowShopSelector] = useState(false);
  const [selectedShop, setSelectedShop] = useState('Spare Parts Shop');

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
      {/* 1. BLUE HEADER CONTAINER (Matching Screenshot) */}
      <div className="bg-[#1d4ed8] text-white pt-6 pb-20 px-4 md:px-8 shadow-md relative">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {/* Shop Selector Button (Left) */}
          <div className="relative">
            <button
              onClick={() => setShowShopSelector(!showShopSelector)}
              className="bg-white/15 hover:bg-white/25 transition-colors border border-white/20 rounded-full px-4 py-2 flex items-center gap-2 text-xs md:text-sm font-semibold text-white focus:outline-none"
            >
              <span className="material-symbols-outlined text-lg">storefront</span>
              <span>{selectedShop}</span>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>

            {showShopSelector && (
              <div className="absolute top-12 left-0 w-64 bg-white text-[#181c1c] rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 text-xs animate-in zoom-in-95">
                <div className="p-2 font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                  Pilih Cabang / Toko
                </div>
                {['Spare Parts Shop', 'Toko Tabingan Pusat', 'Gudang Utama - Jakarta'].map((shop) => (
                  <button
                    key={shop}
                    onClick={() => {
                      setSelectedShop(shop);
                      setShowShopSelector(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl font-medium flex items-center justify-between hover:bg-slate-100 ${
                      selectedShop === shop ? 'bg-blue-50 text-blue-700 font-bold' : ''
                    }`}
                  >
                    <span>{shop}</span>
                    {selectedShop === shop && (
                      <span className="material-symbols-outlined text-sm">check</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Header Right Actions: Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 bg-white/15 hover:bg-white/25 rounded-full text-white transition-colors focus:outline-none"
              title="Notifikasi"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center border border-blue-700">
                3
              </span>
            </button>

            {showNotifications && (
              <div className="absolute top-12 right-0 w-80 bg-white text-[#181c1c] rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 text-xs animate-in zoom-in-95">
                <div className="flex items-center justify-between border-b pb-2 mb-3">
                  <span className="font-bold text-sm">Notifikasi Peringatan</span>
                  <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-bold">
                    3 Baru
                  </span>
                </div>
                <div className="space-y-2.5 max-h-60 overflow-y-auto">
                  <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200">
                    <p className="font-bold text-amber-900">Stok Kritis</p>
                    <p className="text-amber-700 text-[11px]">Busi Champion sisa 4 unit di gudang.</p>
                  </div>
                  <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="font-bold text-blue-900">Barang Masuk</p>
                    <p className="text-blue-700 text-[11px]">
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
      </div>

      {/* MAIN CONTENT CONTAINER WITH NEGATIVE TOP MARGIN TO OVERLAP HEADER */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 -mt-14 space-y-6 relative z-10">
        {/* 2. TODAY'S DATA CARD (Exact screenshot reproduction) */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-5 md:p-6 transition-all">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base md:text-lg font-bold text-slate-800">Today's Data</h2>
            <button
              onClick={() => setIsMetricsVisible(!isMetricsVisible)}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
              title="Sembunyikan / Tampilkan Angka"
            >
              <span className="material-symbols-outlined text-xl">
                {isMetricsVisible ? 'visibility' : 'visibility_off'}
              </span>
            </button>
          </div>

          {/* 2x2 Metrics Grid */}
          <div className="grid grid-cols-2 gap-y-5 gap-x-4 mb-6">
            {/* Metric 1: Stock In */}
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1">Stock In</p>
              <p className="text-2xl md:text-3xl font-extrabold text-emerald-600">
                {isMetricsVisible ? '17' : '••'}
              </p>
            </div>

            {/* Metric 2: Stock Out */}
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1">Stock Out</p>
              <p className="text-2xl md:text-3xl font-extrabold text-rose-600">
                {isMetricsVisible ? '42' : '••'}
              </p>
            </div>

            {/* Metric 3: Revenue */}
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1">Revenue</p>
              <p className="text-xl md:text-2xl font-extrabold text-slate-900">
                {isMetricsVisible ? 'Rp 24.500.000' : '••••••••'}
              </p>
            </div>

            {/* Metric 4: Profit */}
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1">Profit</p>
              <p className="text-xl md:text-2xl font-extrabold text-slate-900">
                {isMetricsVisible ? 'Rp 4.250.000' : '••••••••'}
              </p>
            </div>
          </div>

          {/* View Report Button */}
          <button
            onClick={() => onNavigate('reports')}
            className="w-full bg-[#eef2ff] hover:bg-[#e0e7ff] text-[#3730a3] font-bold text-sm py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            <span>View Report</span>
            <span className="material-symbols-outlined text-base">chevron_right</span>
          </button>
        </div>

        {/* 3. STOCK SECTION (Exact layout with 5 square icons matching colors) */}
        <div className="bg-white rounded-3xl shadow-md border border-slate-100 p-6">
          <h3 className="text-center font-bold text-slate-800 text-base mb-6">Stock</h3>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-y-6 gap-x-2 text-center">
            {/* Item 1: Stock In */}
            <button
              onClick={() => (onOpenStockAction ? onOpenStockAction('stock_in') : onNavigate('inventory'))}
              className="flex flex-col items-center gap-2.5 group focus:outline-none"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#e6f4ea] text-[#16a34a] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-2xl font-bold">move_to_inbox</span>
              </div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">
                Stock In
              </span>
            </button>

            {/* Item 2: Stock Out */}
            <button
              onClick={() => (onOpenStockAction ? onOpenStockAction('stock_out') : onNavigate('inventory'))}
              className="flex flex-col items-center gap-2.5 group focus:outline-none"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#fce8e6] text-[#dc2626] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-2xl font-bold">outbox</span>
              </div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-rose-700">
                Stock Out
              </span>
            </button>

            {/* Item 3: Audit */}
            <button
              onClick={() => (onOpenStockAction ? onOpenStockAction('audit') : onNavigate('inventory'))}
              className="flex flex-col items-center gap-2.5 group focus:outline-none"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#fef7e0] text-[#d97706] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-2xl font-bold">assignment_turned_in</span>
              </div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-amber-700">
                Audit
              </span>
            </button>

            {/* Item 4: Transfer */}
            <button
              onClick={() => (onOpenStockAction ? onOpenStockAction('transfer') : onNavigate('warehouse'))}
              className="flex flex-col items-center gap-2.5 group focus:outline-none"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#e8f0fe] text-[#2563eb] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-2xl font-bold">swap_horiz</span>
              </div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-blue-700">
                Transfer
              </span>
            </button>

            {/* Item 5: POS */}
            <button
              onClick={() => onNavigate('pos')}
              className="flex flex-col items-center gap-2.5 group focus:outline-none"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#fce8e6] text-[#e11d48] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-2xl font-bold">point_of_sale</span>
              </div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-rose-800">
                POS
              </span>
            </button>
          </div>
        </div>

        {/* 4. OPERATIONAL SECTION */}
        <div className="bg-white rounded-3xl shadow-md border border-slate-100 p-6">
          <h3 className="text-center font-bold text-slate-800 text-base mb-6">Operational</h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button
              onClick={() => onNavigate('inventory')}
              className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200/70 flex items-center gap-3 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">inventory_2</span>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Data Barang</p>
                <p className="text-[10px] text-slate-500">Katalog & Stok</p>
              </div>
            </button>

            <button
              onClick={() => onNavigate('customers')}
              className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200/70 flex items-center gap-3 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">group</span>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Pelanggan</p>
                <p className="text-[10px] text-slate-500">Mitra & Kasir</p>
              </div>
            </button>

            <button
              onClick={() => onNavigate('warehouse')}
              className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200/70 flex items-center gap-3 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">warehouse</span>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Gudang</p>
                <p className="text-[10px] text-slate-500">4 Lokasi Aktif</p>
              </div>
            </button>

            <button
              onClick={() => onNavigate('reports')}
              className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200/70 flex items-center gap-3 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">description</span>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Laporan Rekap</p>
                <p className="text-[10px] text-slate-500">Keuangan & Penjualan</p>
              </div>
            </button>
          </div>
        </div>

        {/* 5. WEEKLY SALES CHART & QUICK ACTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Sales Chart */}
          <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">Grafik Penjualan Mingguan</h3>
                <p className="text-xs text-slate-500">Performa transaksi 18 - 24 Mei</p>
              </div>
              <select
                value={chartPeriod}
                onChange={(e) => setChartPeriod(e.target.value)}
                className="bg-slate-100 border-none text-xs font-bold rounded-full px-3 py-2 text-blue-700 focus:ring-2 focus:ring-blue-600 outline-none"
              >
                <option>7 Hari Terakhir</option>
                <option>30 Hari Terakhir</option>
              </select>
            </div>

            {/* Chart Canvas */}
            <div className="h-56 flex items-end justify-between gap-3 px-2 relative pt-8">
              <div className="absolute inset-x-0 top-0 h-px bg-slate-100" />
              <div className="absolute inset-x-0 top-1/4 h-px bg-slate-100" />
              <div className="absolute inset-x-0 top-2/4 h-px bg-slate-100" />
              <div className="absolute inset-x-0 top-3/4 h-px bg-slate-100" />

              {weeklyData.map((item, idx) => (
                <div
                  key={item.day}
                  onClick={() => setActiveBar(idx)}
                  className="flex-1 flex flex-col items-center gap-2 group cursor-pointer relative h-full justify-end"
                >
                  {activeBar === idx && (
                    <div className="absolute -top-7 bg-slate-900 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap shadow-xl z-20 animate-fade-in">
                      Rp {item.amount}
                    </div>
                  )}
                  <div
                    style={{ height: item.height }}
                    className={`w-full rounded-t-xl transition-all duration-500 ${
                      item.isToday
                        ? 'bg-blue-600 shadow-[0_-4px_12px_rgba(37,99,235,0.3)]'
                        : 'bg-blue-200 group-hover:bg-blue-400'
                    }`}
                  />
                  <span
                    className={`text-xs font-semibold ${
                      item.isToday ? 'text-blue-700 font-bold' : 'text-slate-400'
                    }`}
                  >
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions & AI Card */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-700 to-indigo-800 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none">
                <span className="material-symbols-outlined text-[120px]">auto_awesome</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-sm filled text-amber-300">
                  auto_awesome
                </span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-blue-200">
                  AI INSIGHTS
                </span>
              </div>
              <p className="text-xs font-medium leading-relaxed mb-4 text-blue-50">
                "Stok Busi Champ & Oli Shell Helix menipis, segera buat pesanan ulang untuk menjaga kelancaran toko."
              </p>
              <button
                onClick={() => onNavigate('inventory')}
                className="w-full bg-white text-blue-900 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-50 active:scale-95 transition-all shadow-sm"
              >
                RESTOCK SEKARANG
              </button>
            </div>
          </div>
        </div>

        {/* 6. LATEST TRANSACTIONS TABLE */}
        <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-5 flex items-center justify-between border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Transaksi Terbaru</h3>
              <p className="text-xs text-slate-500">Daftar penjualan terpopuler hari ini</p>
            </div>
            <button
              onClick={() => onNavigate('reports')}
              className="text-blue-600 text-xs font-bold hover:underline"
            >
              Lihat Semua
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                  <th className="px-5 py-3">ID Transaksi</th>
                  <th className="px-5 py-3">Waktu</th>
                  <th className="px-5 py-3">Pelanggan</th>
                  <th className="px-5 py-3">Metode</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {transactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-blue-700">{trx.id}</td>
                    <td className="px-5 py-3.5 text-slate-500">{trx.time}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-800">{trx.customerName}</td>
                    <td className="px-5 py-3.5">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-semibold uppercase text-[10px]">
                        {trx.paymentMethod}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {trx.status === 'Selesai' ? (
                        <span className="text-emerald-600 flex items-center gap-1 font-bold">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full" /> Selesai
                        </span>
                      ) : (
                        <span className="text-rose-600 flex items-center gap-1 font-bold">
                          <span className="w-2 h-2 bg-rose-500 rounded-full" /> Dibatalkan
                        </span>
                      )}
                    </td>
                    <td
                      className={`px-5 py-3.5 text-right font-bold ${
                        trx.status === 'Dibatalkan' ? 'line-through text-slate-400' : 'text-slate-900'
                      }`}
                    >
                      {formatCurrency(trx.totalAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

