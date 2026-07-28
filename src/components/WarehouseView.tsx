import React, { useState } from 'react';
import { Warehouse, StockActivity, Product, TabType } from '../types';

interface WarehouseViewProps {
  warehouses: Warehouse[];
  activities: StockActivity[];
  products: Product[];
  onNavigate: (tab: TabType) => void;
}

export const WarehouseView: React.FC<WarehouseViewProps> = ({
  warehouses: initialWarehouses,
  activities: initialActivities,
  products,
  onNavigate,
}) => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>(initialWarehouses);
  const [activities, setActivities] = useState<StockActivity[]>(initialActivities);

  // Modals & Forms
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isAddWarehouseModalOpen, setIsAddWarehouseModalOpen] = useState(false);

  // Transfer Form State
  const [selectedProduct, setSelectedProduct] = useState(products[0]?.id || '');
  const [fromWarehouse, setFromWarehouse] = useState(warehouses[0]?.name || 'Gudang Utama - Jakarta');
  const [toWarehouse, setToWarehouse] = useState(warehouses[1]?.name || 'Toko Tabingan Pusat');
  const [transferQty, setTransferQty] = useState(10);
  const [transferNotes, setTransferNotes] = useState('');

  // Add Warehouse Form State
  const [newWhName, setNewWhName] = useState('');
  const [newWhLocation, setNewWhLocation] = useState('');

  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find((p) => p.id === selectedProduct) || products[0];

    const newActivity: StockActivity = {
      id: 'act_' + Date.now(),
      productName: prod ? prod.name : 'Transfer Stok',
      image: prod?.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=100&auto=format&fit=crop&q=80',
      type: 'Inbound',
      changeText: `Transfer ${transferQty} ${prod?.unit || 'unit'} (${fromWarehouse} ➔ ${toWarehouse})`,
      time: 'Baru saja',
      location: toWarehouse,
    };

    setActivities([newActivity, ...activities]);
    setIsTransferModalOpen(false);
    alert(`Berhasil memindahkan ${transferQty} ${prod?.unit || 'unit'} dari ${fromWarehouse} ke ${toWarehouse}!`);
  };

  const handleAddWarehouse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWhName.trim()) return;

    const newWh: Warehouse = {
      id: 'wh_' + Date.now(),
      name: newWhName,
      location: newWhLocation || 'Pusat Distribusi',
      totalStock: 0,
      capacityPercentage: 5,
      status: 'ACTIVE',
    };

    setWarehouses([...warehouses, newWh]);
    setNewWhName('');
    setNewWhLocation('');
    setIsAddWarehouseModalOpen(false);
  };

  return (
    <div className="pt-20 pb-32 px-4 md:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#005c55] mb-1">
            Manajemen Logistik & Cabang
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#181c1c]">
            Lokasi Gudang & Transfer Stok
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsTransferModalOpen(true)}
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-4 py-2.5 rounded-2xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">swap_horiz</span>
            <span>Transfer Stok Baru</span>
          </button>

          <button
            onClick={() => setIsAddWarehouseModalOpen(true)}
            className="bg-[#005c55] hover:bg-[#0f766e] text-white px-4 py-2.5 rounded-2xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">add_location_alt</span>
            <span>Tambah Gudang</span>
          </button>
        </div>
      </div>

      {/* Warehouse Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {warehouses.map((wh) => (
          <div
            key={wh.id}
            className="bg-white rounded-2xl p-5 border border-[#bdc9c6] shadow-xs hover:shadow-md transition-all relative overflow-hidden"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined">warehouse</span>
              </div>
              <span
                className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                  wh.status === 'ACTIVE'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-amber-50 text-amber-700'
                }`}
              >
                {wh.status}
              </span>
            </div>

            <h3 className="font-bold text-slate-900 text-sm">{wh.name}</h3>
            <p className="text-xs text-slate-500 mb-4 flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-xs">location_on</span>
              <span>{wh.location}</span>
            </p>

            <div className="space-y-2 pt-3 border-t border-slate-100">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-500">Kapasitas Stok</span>
                <span className="text-blue-700">{wh.capacityPercentage}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${wh.capacityPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                <span>Total item</span>
                <span className="font-bold text-slate-800">{wh.totalStock.toLocaleString()} unit</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stock Movement Log & Transfer History */}
      <div className="bg-white border border-[#bdc9c6] rounded-2xl overflow-hidden shadow-xs">
        <div className="p-5 bg-[#f1f4f3] border-b border-[#bdc9c6] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-base text-slate-900">Aktivitas Mutasi & Transfer Stok</h3>
            <p className="text-xs text-slate-500">Log pergerakan barang antar gudang & audit terupdate</p>
          </div>
          <button
            onClick={() => onNavigate('inventory')}
            className="text-xs font-bold text-[#005c55] hover:underline"
          >
            Lihat Katalog Lengkap ➔
          </button>
        </div>

        <div className="divide-y divide-[#bdc9c6]/40">
          {activities.map((act) => (
            <div key={act.id} className="p-4 hover:bg-[#f1f4f3]/50 transition-colors flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={act.image}
                  alt={act.productName}
                  className="w-12 h-12 rounded-xl object-cover border border-[#bdc9c6] bg-slate-50 shrink-0"
                />
                <div>
                  <h4 className="font-bold text-xs md:text-sm text-slate-900">{act.productName}</h4>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">{act.changeText}</p>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">schedule</span>
                      {act.time}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">place</span>
                      {act.location}
                    </span>
                  </div>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase shrink-0 ${
                  act.type === 'Inbound'
                    ? 'bg-blue-50 text-blue-700'
                    : act.type === 'Sales'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-amber-50 text-amber-700'
                }`}
              >
                {act.type}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Transfer Modal */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-[#2563eb] text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined">swap_horiz</span>
                <h3 className="font-bold text-base">Transfer Stok Antar Gudang</h3>
              </div>
              <button
                onClick={() => setIsTransferModalOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleExecuteTransfer} className="p-6 space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-bold uppercase mb-1">
                  Pilih Produk
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Tersedia: {p.stock} {p.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold uppercase mb-1">
                    Dari Gudang (Asal)
                  </label>
                  <select
                    value={fromWarehouse}
                    onChange={(e) => setFromWarehouse(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600"
                  >
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.name}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold uppercase mb-1">
                    Ke Gudang (Tujuan)
                  </label>
                  <select
                    value={toWarehouse}
                    onChange={(e) => setToWarehouse(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600"
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
                <label className="block text-slate-700 font-bold uppercase mb-1">
                  Jumlah Transfer
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={transferQty}
                  onChange={(e) => setTransferQty(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-bold focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase mb-1">
                  Catatan Transfer (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Permintaan mendesak cabang"
                  value={transferNotes}
                  onChange={(e) => setTransferNotes(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  className="flex-1 py-3 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md"
                >
                  Proses Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Warehouse Modal */}
      {isAddWarehouseModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-[#005c55] text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined">add_location_alt</span>
                <h3 className="font-bold text-base">Tambah Lokasi Gudang Baru</h3>
              </div>
              <button
                onClick={() => setIsAddWarehouseModalOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddWarehouse} className="p-6 space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-bold uppercase mb-1">
                  Nama Gudang / Cabang *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Gudang Barat - Tangerang"
                  value={newWhName}
                  onChange={(e) => setNewWhName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#005c55]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase mb-1">
                  Kota / Wilayah Lokasi
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Tangerang"
                  value={newWhLocation}
                  onChange={(e) => setNewWhLocation(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#005c55]"
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddWarehouseModalOpen(false)}
                  className="flex-1 py-3 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#005c55] text-white font-bold rounded-xl hover:bg-[#0f766e] shadow-md"
                >
                  Simpan Gudang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
