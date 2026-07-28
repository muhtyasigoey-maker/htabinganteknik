import React, { useState } from 'react';
import { Product, Warehouse, StockActivity } from '../types';
import { StockActionType } from './StockActionModal';

interface InventoryViewProps {
  products: Product[];
  warehouses: Warehouse[];
  activities: StockActivity[];
  onOpenAddProduct: () => void;
  onOpenScanner: () => void;
  onOpenStockAction?: (action: StockActionType) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  products,
  warehouses,
  activities,
  onOpenAddProduct,
  onOpenScanner,
  onOpenStockAction,
}) => {
  const [activeTab, setActiveTab] = useState<'stok' | 'gudang' | 'riwayat'>('stok');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [searchFilter, setSearchQuery] = useState('');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="pt-20 px-4 md:px-8 pb-32 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Top Header Controls */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-[#bdc9c6] shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-[#181c1c]">Stok & Gudang</h1>
          <p className="text-xs text-[#6e7977]">Manajemen inventaris fisik Toko H. Tabingan Teknik</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onOpenScanner}
            className="p-2.5 bg-[#f1f4f3] hover:bg-[#e0e3e1] text-[#005c55] rounded-xl flex items-center gap-1 font-bold text-xs"
          >
            <span className="material-symbols-outlined text-lg">barcode_scanner</span>
            <span className="hidden sm:inline">Scan SKU</span>
          </button>
          <button
            onClick={onOpenAddProduct}
            className="p-2.5 bg-[#005c55] text-white hover:bg-[#0f766e] rounded-xl flex items-center gap-1 font-bold text-xs shadow-md"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            <span>Tambah</span>
          </button>
        </div>
      </div>

      {/* Quick Stock Actions Bar */}
      {onOpenStockAction && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3 rounded-2xl border border-[#bdc9c6] shadow-xs">
          <button
            onClick={() => onOpenStockAction('stock_in')}
            className="p-3 bg-[#e6f4ea] hover:bg-emerald-200 text-[#16a34a] rounded-xl flex items-center justify-center gap-2 font-bold text-xs transition-colors"
          >
            <span className="material-symbols-outlined text-lg">move_to_inbox</span>
            <span>Stock In (+)</span>
          </button>

          <button
            onClick={() => onOpenStockAction('stock_out')}
            className="p-3 bg-[#fce8e6] hover:bg-rose-200 text-[#dc2626] rounded-xl flex items-center justify-center gap-2 font-bold text-xs transition-colors"
          >
            <span className="material-symbols-outlined text-lg">outbox</span>
            <span>Stock Out (-)</span>
          </button>

          <button
            onClick={() => onOpenStockAction('audit')}
            className="p-3 bg-[#fef7e0] hover:bg-amber-200 text-[#d97706] rounded-xl flex items-center justify-center gap-2 font-bold text-xs transition-colors"
          >
            <span className="material-symbols-outlined text-lg">assignment_turned_in</span>
            <span>Audit / Opname</span>
          </button>

          <button
            onClick={() => onOpenStockAction('transfer')}
            className="p-3 bg-[#e8f0fe] hover:bg-blue-200 text-[#2563eb] rounded-xl flex items-center justify-center gap-2 font-bold text-xs transition-colors"
          >
            <span className="material-symbols-outlined text-lg">swap_horiz</span>
            <span>Transfer Stok</span>
          </button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-4 border-b border-[#bdc9c6] pb-2 overflow-x-auto hide-scrollbar">
        <button
          onClick={() => setActiveTab('stok')}
          className={`pb-2 px-3 font-bold text-sm transition-all whitespace-nowrap ${
            activeTab === 'stok'
              ? 'text-[#005c55] border-b-2 border-[#005c55]'
              : 'text-[#6e7977] hover:text-[#005c55]'
          }`}
        >
          Katalog Stok ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('gudang')}
          className={`pb-2 px-3 font-bold text-sm transition-all whitespace-nowrap ${
            activeTab === 'gudang'
              ? 'text-[#005c55] border-b-2 border-[#005c55]'
              : 'text-[#6e7977] hover:text-[#005c55]'
          }`}
        >
          Gudang Cabang ({warehouses.length})
        </button>
        <button
          onClick={() => setActiveTab('riwayat')}
          className={`pb-2 px-3 font-bold text-sm transition-all whitespace-nowrap ${
            activeTab === 'riwayat'
              ? 'text-[#005c55] border-b-2 border-[#005c55]'
              : 'text-[#6e7977] hover:text-[#005c55]'
          }`}
        >
          Riwayat Audit ({activities.length})
        </button>
      </div>

      {/* Inventory Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#bdc9c6] shadow-sm flex flex-col justify-between space-y-2">
          <span className="text-[11px] font-bold text-[#6e7977] uppercase tracking-wider">
            Total Item Unik
          </span>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-black text-[#005c55]">{products.length.toLocaleString('id-ID')}</span>
            <span className="bg-[#0f766e]/20 text-[#0f766e] px-2.5 py-0.5 rounded-full text-xs font-bold">
              +12%
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#bdc9c6] shadow-sm flex flex-col justify-between space-y-2">
          <span className="text-[11px] font-bold text-[#6e7977] uppercase tracking-wider">
            Nilai Inventaris
          </span>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-black text-[#005c55]">Rp 4.2M</span>
            <span className="text-[11px] text-[#6e7977] font-medium">Updated 2m ago</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#bdc9c6] shadow-sm flex flex-col justify-between space-y-2">
          <span className="text-[11px] font-bold text-[#6e7977] uppercase tracking-wider">
            Butuh Restock
          </span>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-black text-[#ba1a1a]">
              {products.filter(p => p.stock <= 5).length} Items
            </span>
            <span className="material-symbols-outlined text-[#ba1a1a] filled">warning</span>
          </div>
        </div>
      </div>

      {/* TAB 1: STOK KATALOG */}
      {activeTab === 'stok' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="relative w-full sm:w-72 bg-white border border-[#bdc9c6] rounded-xl flex items-center px-3 py-2">
              <span className="material-symbols-outlined text-[#6e7977] mr-2">search</span>
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari SKU / nama barang..."
                className="w-full bg-transparent border-none text-xs outline-none"
              />
            </div>

            <div className="flex bg-[#e5e9e7] rounded-xl p-1 gap-1 self-end">
              <button
                onClick={() => setLayoutMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  layoutMode === 'grid' ? 'bg-white text-[#005c55] shadow-xs' : 'text-[#6e7977]'
                }`}
              >
                <span className="material-symbols-outlined text-base">grid_view</span>
              </button>
              <button
                onClick={() => setLayoutMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  layoutMode === 'list' ? 'bg-white text-[#005c55] shadow-xs' : 'text-[#6e7977]'
                }`}
              >
                <span className="material-symbols-outlined text-base">view_list</span>
              </button>
            </div>
          </div>

          {layoutMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-white border border-[#bdc9c6] rounded-2xl overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-square bg-[#f1f4f3] overflow-hidden">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    <div
                      className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.stock === 0
                          ? 'bg-[#ba1a1a] text-white'
                          : p.stock <= 5
                          ? 'bg-[#ba1a1a] text-white'
                          : 'bg-[#006b5f] text-white'
                      }`}
                    >
                      {p.stock === 0 ? 'OUT' : `STOCK: ${p.stock}`}
                    </div>
                  </div>

                  <div className="p-3 space-y-1">
                    <span className="text-[10px] text-[#6e7977] uppercase tracking-wider block">
                      SKU: {p.sku}
                    </span>
                    <h3 className="font-bold text-xs text-[#181c1c] line-clamp-2 h-8 leading-tight">
                      {p.name}
                    </h3>
                    <p className="font-extrabold text-sm text-[#005c55] pt-1">
                      {formatCurrency(p.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-[#bdc9c6] rounded-2xl divide-y divide-[#bdc9c6]/40 overflow-hidden shadow-sm">
              {filteredProducts.map((p) => (
                <div key={p.id} className="p-4 flex items-center justify-between gap-4 hover:bg-[#f1f4f3]">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-cover border border-[#bdc9c6]" />
                    <div>
                      <span className="text-[10px] font-bold text-[#6e7977] uppercase">SKU: {p.sku}</span>
                      <h4 className="font-bold text-xs md:text-sm text-[#181c1c]">{p.name}</h4>
                      <p className="text-xs text-[#005c55] font-semibold">{formatCurrency(p.price)}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        p.stock <= 5 ? 'bg-[#ffdad6] text-[#ba1a1a]' : 'bg-[#6df5e1]/40 text-[#006f64]'
                      }`}
                    >
                      {p.stock} {p.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: GUDANG LAYOUT */}
      {activeTab === 'gudang' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#181c1c]">Daftar Gudang Cabang</h2>
            <button className="text-xs text-[#005c55] font-bold hover:underline flex items-center gap-1">
              Kelola Semua <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Main Warehouse Bento */}
            <div className="md:col-span-8 bg-white rounded-2xl border border-[#bdc9c6] p-5 relative overflow-hidden flex flex-col justify-between space-y-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-base text-[#181c1c]">Gudang Utama - Jakarta</h3>
                  <p className="text-xs text-[#3e4947]">Kawasan Industri Pulogadung, Jakarta Timur</p>
                </div>
                <span className="bg-[#6df5e1] text-[#006f64] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  ACTIVE
                </span>
              </div>

              <div className="flex items-center gap-6 my-2">
                <div>
                  <span className="text-xs text-[#3e4947]">Total Stok Physical</span>
                  <p className="text-2xl font-black text-[#181c1c]">
                    45,820 <span className="text-xs font-normal text-[#6e7977]">Unit</span>
                  </p>
                </div>
                <div className="h-10 w-px bg-[#bdc9c6]" />
                <div>
                  <span className="text-xs text-[#3e4947]">Kapasitas Gudang</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-28 md:w-36 h-2 bg-[#e5e9e7] rounded-full overflow-hidden">
                      <div className="bg-[#005c55] w-[78%] h-full" />
                    </div>
                    <span className="text-xs font-bold text-[#181c1c]">78%</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="bg-[#005c55] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-[#0f766e]">
                  <span className="material-symbols-outlined text-sm">input</span>
                  <span>Masuk Barang</span>
                </button>
                <button className="bg-[#e0e3e1] text-[#3e4947] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-[#bdc9c6]">
                  <span className="material-symbols-outlined text-sm">output</span>
                  <span>Keluar Barang</span>
                </button>
              </div>
            </div>

            {/* Side Warehouses */}
            <div className="md:col-span-4 space-y-4">
              <div className="bg-white rounded-2xl border border-[#bdc9c6] p-4 hover:border-[#005c55] transition-all cursor-pointer shadow-sm">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-xs md:text-sm text-[#181c1c]">Gudang Cabang - Bekasi</h4>
                  <span className="material-symbols-outlined text-[#005c55] text-sm">open_in_new</span>
                </div>
                <div className="flex items-end justify-between mt-2">
                  <span className="text-xs text-[#3e4947]">8,210 Items</span>
                  <span className="text-[10px] bg-[#e5e9e7] px-2 py-0.5 rounded font-bold">62% Cap.</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#bdc9c6] p-4 hover:border-[#005c55] transition-all cursor-pointer shadow-sm">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-xs md:text-sm text-[#181c1c]">Gudang Cabang - Tangerang</h4>
                  <span className="material-symbols-outlined text-[#005c55] text-sm">open_in_new</span>
                </div>
                <div className="flex items-end justify-between mt-2">
                  <span className="text-xs text-[#3e4947]">12,450 Items</span>
                  <span className="text-[10px] bg-[#e5e9e7] px-2 py-0.5 rounded font-bold">91% Cap.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Adjustment Action Banner */}
          <div className="bg-[#9c573a] text-[#ffe5db] p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="bg-[#ffdbce] text-[#7f4025] p-3 rounded-2xl">
                <span className="material-symbols-outlined text-3xl">inventory</span>
              </div>
              <div>
                <h3 className="font-bold text-base md:text-lg">Penyesuaian Stok Cepat</h3>
                <p className="text-xs text-[#ffe5db]/80">
                  Lakukan audit stok mendadak atau perbaikan selisih data fisik toko.
                </p>
              </div>
            </div>
            <button
              onClick={onOpenScanner}
              className="bg-[#ffdbce] text-[#370e00] font-bold text-xs md:text-sm px-6 py-3 rounded-full shadow-md hover:brightness-105 active:scale-95 transition-all whitespace-nowrap"
            >
              Mulai Penyesuaian
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: RIWAYAT ACTIVITAS */}
      {activeTab === 'riwayat' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[#181c1c]">Aktivitas Terakhir</h2>
          <div className="space-y-2">
            {activities.map((act) => (
              <div
                key={act.id}
                className="flex items-center justify-between p-4 bg-white rounded-2xl border border-[#bdc9c6]/50 hover:bg-[#f1f4f3] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#e0e3e1] rounded-xl overflow-hidden shrink-0 border border-[#bdc9c6]">
                    <img src={act.image} alt={act.productName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-xs md:text-sm text-[#181c1c]">{act.productName}</p>
                    <p className="text-[11px] text-[#3e4947]">{act.changeText}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`font-bold text-xs block ${
                      act.type === 'Audit'
                        ? 'text-[#ba1a1a]'
                        : act.type === 'Inbound'
                        ? 'text-[#005c55]'
                        : 'text-[#006f64]'
                    }`}
                  >
                    {act.type}
                  </span>
                  <p className="text-[10px] text-[#6e7977]">
                    {act.time} • {act.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAB: Add New Item (Amber #F59E0B) */}
      <button
        onClick={onOpenAddProduct}
        className="fixed bottom-24 right-4 bg-[#F59E0B] text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl z-40 active:scale-95 transition-transform"
      >
        <span className="material-symbols-outlined text-3xl filled">add</span>
      </button>
    </div>
  );
};
