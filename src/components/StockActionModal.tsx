import React, { useState } from 'react';
import { Product, Warehouse, StockActivity } from '../types';

export type StockActionType = 'stock_in' | 'stock_out' | 'audit' | 'transfer';

interface StockActionModalProps {
  isOpen: boolean;
  initialAction: StockActionType;
  products: Product[];
  warehouses: Warehouse[];
  onClose: () => void;
  onStockIn: (productId: string, qty: number, supplierNote: string, warehouse: string) => void;
  onStockOut: (productId: string, qty: number, reason: string, warehouse: string) => void;
  onAudit: (productId: string, actualCount: number, notes: string) => void;
  onTransfer: (productId: string, qty: number, fromWh: string, toWh: string, notes: string) => void;
}

export const StockActionModal: React.FC<StockActionModalProps> = ({
  isOpen,
  initialAction,
  products,
  warehouses,
  onClose,
  onStockIn,
  onStockOut,
  onAudit,
  onTransfer,
}) => {
  const [activeTab, setActiveTab] = useState<StockActionType>(initialAction);

  // Selected Product
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  // Form Fields
  const [qty, setQty] = useState<number>(10);
  const [actualCount, setActualCount] = useState<number>(selectedProduct ? selectedProduct.stock : 0);
  const [notes, setNotes] = useState<string>('');
  const [fromWarehouse, setFromWarehouse] = useState<string>(warehouses[0]?.name || 'Gudang Utama');
  const [toWarehouse, setToWarehouse] = useState<string>(warehouses[1]?.name || 'Toko Tabingan Pusat');
  const [reason, setReason] = useState<string>('Penggunaan Internal');

  if (!isOpen) return null;

  const handleProductChange = (id: string) => {
    setSelectedProductId(id);
    const p = products.find((prod) => prod.id === id);
    if (p) {
      setActualCount(p.stock);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;

    if (activeTab === 'stock_in') {
      onStockIn(selectedProductId, Number(qty), notes || 'Penerimaan Stok', fromWarehouse);
    } else if (activeTab === 'stock_out') {
      onStockOut(selectedProductId, Number(qty), reason + (notes ? ` - ${notes}` : ''), fromWarehouse);
    } else if (activeTab === 'audit') {
      onAudit(selectedProductId, Number(actualCount), notes || 'Penyesuaian Stok Opname');
    } else if (activeTab === 'transfer') {
      onTransfer(selectedProductId, Number(qty), fromWarehouse, toWarehouse, notes || 'Mutasi Antar Gudang');
    }

    onClose();
  };

  // Tab configurations
  const tabs = [
    {
      id: 'stock_in' as StockActionType,
      label: 'Stock In',
      subtitle: 'Barang Masuk',
      icon: 'move_to_inbox',
      bgColor: 'bg-[#e6f4ea]',
      textColor: 'text-[#16a34a]',
      activeBorder: 'border-emerald-600',
    },
    {
      id: 'stock_out' as StockActionType,
      label: 'Stock Out',
      subtitle: 'Barang Keluar',
      icon: 'outbox',
      bgColor: 'bg-[#fce8e6]',
      textColor: 'text-[#dc2626]',
      activeBorder: 'border-rose-600',
    },
    {
      id: 'audit' as StockActionType,
      label: 'Audit',
      subtitle: 'Stok Opname',
      icon: 'assignment_turned_in',
      bgColor: 'bg-[#fef7e0]',
      textColor: 'text-[#d97706]',
      activeBorder: 'border-amber-600',
    },
    {
      id: 'transfer' as StockActionType,
      label: 'Transfer',
      subtitle: 'Mutasi Gudang',
      icon: 'swap_horiz',
      bgColor: 'bg-[#e8f0fe]',
      textColor: 'text-[#2563eb]',
      activeBorder: 'border-blue-600',
    },
  ];

  const currentTabInfo = tabs.find((t) => t.id === activeTab)!;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Tabs */}
        <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-400">inventory</span>
            <h3 className="font-extrabold text-base">Kelola Operasional Stok</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Action Type Selector Grid */}
        <div className="grid grid-cols-4 gap-2 p-3 bg-slate-100 border-b border-slate-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                if (selectedProduct) {
                  setActualCount(selectedProduct.stock);
                }
              }}
              className={`p-2 rounded-2xl flex flex-col items-center justify-center transition-all ${
                activeTab === tab.id
                  ? `${tab.bgColor} ${tab.textColor} font-bold shadow-xs ring-2 ring-current`
                  : 'bg-white text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-xl">{tab.icon}</span>
              <span className="text-[11px] mt-0.5">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-medium overflow-y-auto flex-1">
          {/* Selected Product Banner */}
          <div>
            <label className="block text-slate-700 font-extrabold uppercase tracking-wider mb-1">
              Pilih Produk *
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => handleProductChange(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — (Stok Sistem: {p.stock} {p.unit})
                </option>
              ))}
            </select>
          </div>

          {selectedProduct && (
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200"
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 truncate">{selectedProduct.name}</p>
                <p className="text-[11px] text-slate-500">
                  SKU: {selectedProduct.sku} | Harga: Rp {selectedProduct.price.toLocaleString()}
                </p>
                <p className="text-[11px] font-bold text-blue-700">
                  Stok Saat Ini: {selectedProduct.stock} {selectedProduct.unit}
                </p>
              </div>
            </div>
          )}

          {/* DYNAMIC FORM DEPENDING ON ACTION TYPE */}

          {/* MODE 1: STOCK IN */}
          {activeTab === 'stock_in' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-extrabold uppercase tracking-wider mb-1">
                    Jumlah Masuk (+) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-emerald-50/50 border border-emerald-300 rounded-xl font-bold text-emerald-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-extrabold uppercase tracking-wider mb-1">
                    Lokasi Gudang
                  </label>
                  <select
                    value={fromWarehouse}
                    onChange={(e) => setFromWarehouse(e.target.value)}
                    className="w-full px-3 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none"
                  >
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.name}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-extrabold uppercase tracking-wider mb-1">
                  Pemasok / Catatan Penerimaan
                </label>
                <input
                  type="text"
                  placeholder="Contoh: PO-202309 / Supplier PT Utama Jaya"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* MODE 2: STOCK OUT */}
          {activeTab === 'stock_out' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-extrabold uppercase tracking-wider mb-1">
                    Jumlah Keluar (-) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={selectedProduct ? selectedProduct.stock : 9999}
                    required
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-rose-50/50 border border-rose-300 rounded-xl font-bold text-rose-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-extrabold uppercase tracking-wider mb-1">
                    Alasan Keluar
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-3 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none"
                  >
                    <option value="Kerusakan / Rusak">Kerusakan / Rusak</option>
                    <option value="Kadaluarsa / Rusak">Kadaluarsa</option>
                    <option value="Penggunaan Internal">Penggunaan Internal Toko</option>
                    <option value="Penjualan Non-POS">Penjualan Manual / Non-POS</option>
                    <option value="Barang Hilang">Barang Hilang</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-extrabold uppercase tracking-wider mb-1">
                  Catatan Tambahan
                </label>
                <input
                  type="text"
                  placeholder="Keterangan pendukung..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* MODE 3: AUDIT (STOK OPNAME) */}
          {activeTab === 'audit' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-amber-900 uppercase">Stok Sistem</p>
                  <p className="text-xl font-black text-amber-950">
                    {selectedProduct ? selectedProduct.stock : 0} {selectedProduct?.unit}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-bold text-amber-900 uppercase">Selisih Audited</p>
                  <p
                    className={`text-xl font-black ${
                      actualCount - (selectedProduct?.stock || 0) < 0
                        ? 'text-rose-600'
                        : actualCount - (selectedProduct?.stock || 0) > 0
                        ? 'text-emerald-600'
                        : 'text-slate-600'
                    }`}
                  >
                    {actualCount - (selectedProduct?.stock || 0) > 0 ? '+' : ''}
                    {actualCount - (selectedProduct?.stock || 0)} {selectedProduct?.unit}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-extrabold uppercase tracking-wider mb-1">
                  Hasil Hitung Fisik Sebenarnya (Stok Nyata) *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={actualCount}
                  onChange={(e) => setActualCount(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-amber-100/50 border border-amber-400 rounded-xl font-bold text-amber-950 text-base focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-extrabold uppercase tracking-wider mb-1">
                  Catatan Hasil Opname
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Ditemukan sisa barang di rak belakang"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* MODE 4: TRANSFER */}
          {activeTab === 'transfer' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-extrabold uppercase tracking-wider mb-1">
                    Dari Gudang (Asal)
                  </label>
                  <select
                    value={fromWarehouse}
                    onChange={(e) => setFromWarehouse(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none"
                  >
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.name}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-extrabold uppercase tracking-wider mb-1">
                    Ke Gudang (Tujuan)
                  </label>
                  <select
                    value={toWarehouse}
                    onChange={(e) => setToWarehouse(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none"
                  >
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.name}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-extrabold uppercase tracking-wider mb-1">
                  Jumlah Transfer *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-blue-50/50 border border-blue-300 rounded-xl font-bold text-blue-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-extrabold uppercase tracking-wider mb-1">
                  Catatan Transfer
                </label>
                <input
                  type="text"
                  placeholder="Keterangan pengiriman..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className={`flex-1 py-3 text-white font-extrabold rounded-xl shadow-md transition-all active:scale-95 ${
                activeTab === 'stock_in'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : activeTab === 'stock_out'
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : activeTab === 'audit'
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Proses {currentTabInfo.label}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
