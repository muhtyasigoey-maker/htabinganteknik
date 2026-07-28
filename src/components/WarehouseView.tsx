import React, { useState } from 'react';
import { Warehouse, StockActivity, Product, TabType } from '../types';

interface WarehouseViewProps {
  warehouses: Warehouse[];
  onAddWarehouse: (warehouse: Warehouse) => void;
  onUpdateWarehouse: (warehouse: Warehouse) => void;
  onDeleteWarehouse: (id: string) => void;
  activities: StockActivity[];
  products: Product[];
  onNavigate: (tab: TabType) => void;
}

export const WarehouseView: React.FC<WarehouseViewProps> = ({
  warehouses,
  onAddWarehouse,
  onUpdateWarehouse,
  onDeleteWarehouse,
  activities: initialActivities,
  products,
  onNavigate,
}) => {
  const [activities, setActivities] = useState<StockActivity[]>(initialActivities);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal States
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [deletingWarehouse, setDeletingWarehouse] = useState<Warehouse | null>(null);
  const [detailWarehouse, setDetailWarehouse] = useState<Warehouse | null>(null);

  // Transfer Form State
  const [selectedProduct, setSelectedProduct] = useState(products[0]?.id || '');
  const [fromWarehouse, setFromWarehouse] = useState(warehouses[0]?.name || 'Gudang Utama - Jakarta');
  const [toWarehouse, setToWarehouse] = useState(warehouses[1]?.name || 'Gudang Cabang - Bekasi');
  const [transferQty, setTransferQty] = useState(10);
  const [transferNotes, setTransferNotes] = useState('');

  // Warehouse Form State
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    location: '',
    address: '',
    manager: '',
    phone: '',
    capacityPercentage: 50,
    status: 'ACTIVE' as Warehouse['status'],
  });

  const handleOpenAddModal = () => {
    const randomCode = 'GDG-' + String(warehouses.length + 1).padStart(2, '0');
    setFormData({
      code: randomCode,
      name: '',
      location: '',
      address: '',
      manager: '',
      phone: '',
      capacityPercentage: 50,
      status: 'ACTIVE',
    });
    setEditingWarehouse(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (wh: Warehouse) => {
    setFormData({
      code: wh.code || 'GDG-' + wh.id.slice(-2),
      name: wh.name,
      location: wh.location,
      address: wh.address || '',
      manager: wh.manager || '',
      phone: wh.phone || '',
      capacityPercentage: wh.capacityPercentage,
      status: wh.status,
    });
    setEditingWarehouse(wh);
    setIsModalOpen(true);
  };

  const handleSubmitWarehouseForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingWarehouse) {
      const updated: Warehouse = {
        ...editingWarehouse,
        code: formData.code.trim(),
        name: formData.name.trim(),
        location: formData.location.trim() || 'Jakarta',
        address: formData.address.trim(),
        manager: formData.manager.trim() || 'Kepala Gudang',
        phone: formData.phone.trim(),
        capacityPercentage: Number(formData.capacityPercentage),
        status: formData.status,
      };
      onUpdateWarehouse(updated);
    } else {
      const newWh: Warehouse = {
        id: 'wh_' + Date.now(),
        code: formData.code.trim() || 'GDG-' + Math.floor(10 + Math.random() * 90),
        name: formData.name.trim(),
        location: formData.location.trim() || 'Pusat Distribusi',
        address: formData.address.trim() || 'Kawasan Industri',
        manager: formData.manager.trim() || 'Kepala Gudang',
        phone: formData.phone.trim() || '021-5000-123',
        totalStock: 0,
        capacityPercentage: Number(formData.capacityPercentage),
        status: formData.status,
      };
      onAddWarehouse(newWh);
    }

    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (deletingWarehouse) {
      onDeleteWarehouse(deletingWarehouse.id);
      setDeletingWarehouse(null);
    }
  };

  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find((p) => p.id === selectedProduct) || products[0];

    const newActivity: StockActivity = {
      id: 'act_' + Date.now(),
      productName: prod ? prod.name : 'Transfer Stok',
      image:
        prod?.image ||
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=100&auto=format&fit=crop&q=80',
      type: 'Inbound',
      changeText: `Transfer ${transferQty} ${prod?.unit || 'unit'} (${fromWarehouse} ➔ ${toWarehouse})`,
      time: 'Baru saja',
      location: toWarehouse,
    };

    setActivities([newActivity, ...activities]);
    setIsTransferModalOpen(false);
  };

  // Filter Warehouses
  const filteredWarehouses = warehouses.filter((wh) => {
    const matchesSearch =
      wh.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wh.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (wh.manager && wh.manager.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (wh.code && wh.code.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || wh.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalStockAll = warehouses.reduce((sum, w) => sum + w.totalStock, 0);

  return (
    <div className="pt-20 pb-32 px-4 md:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Banner & Page Header */}
      <div className="bg-[#005c55] text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2 text-[#a3faef] text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-sm">warehouse</span>
            <span>MODUL MANAJEMEN GUDANG & LOGISTIK</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black">Lokasi Gudang & Cabang</h1>
          <p className="text-xs md:text-sm text-[#a3faef]/90 max-w-xl">
            Kelola cabang gudang penyimpanan, audit kapasitas rak material, alokasi stok antar lokasi, dan penanggung jawab gudang.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 relative z-10 shrink-0">
          <button
            onClick={() => setIsTransferModalOpen(true)}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-base">swap_horiz</span>
            <span>Transfer Stok</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="px-5 py-2.5 bg-[#6df5e1] hover:bg-[#a3faef] text-[#004f49] rounded-xl font-extrabold text-xs md:text-sm flex items-center gap-2 shadow-lg active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-base">add_location_alt</span>
            <span>+ Tambah Gudang Baru</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#bdc9c6] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-[#005c55] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">warehouse</span>
          </div>
          <div>
            <p className="text-[11px] text-[#6e7977] font-semibold uppercase tracking-wider">Total Gudang</p>
            <h3 className="text-2xl font-black text-[#181c1c]">{warehouses.length} Lokasi</h3>
            <p className="text-[10px] text-emerald-700 font-bold mt-0.5">
              {warehouses.filter((w) => w.status === 'ACTIVE').length} Aktif Beroperasi
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#bdc9c6] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">inventory_2</span>
          </div>
          <div>
            <p className="text-[11px] text-[#6e7977] font-semibold uppercase tracking-wider">Total Item Barang</p>
            <h3 className="text-2xl font-black text-blue-950">{totalStockAll.toLocaleString()}</h3>
            <p className="text-[10px] text-blue-700 font-bold mt-0.5">Tersimpan di Gudang</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#bdc9c6] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">pie_chart</span>
          </div>
          <div>
            <p className="text-[11px] text-[#6e7977] font-semibold uppercase tracking-wider">Rata-rata Utilisasi</p>
            <h3 className="text-xl font-black text-amber-900">
              {Math.round(warehouses.reduce((a, b) => a + b.capacityPercentage, 0) / (warehouses.length || 1))}%
            </h3>
            <p className="text-[10px] text-amber-700 font-bold mt-0.5">Kapasitas Terpakai</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#bdc9c6] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">sync_alt</span>
          </div>
          <div>
            <p className="text-[11px] text-[#6e7977] font-semibold uppercase tracking-wider">Mutasi Terakhir</p>
            <h3 className="text-xl font-black text-emerald-900">{activities.length} Aktivitas</h3>
            <p className="text-[10px] text-emerald-700 font-bold mt-0.5">Transfer Stok Hari Ini</p>
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#bdc9c6] shadow-xs flex flex-col md:flex-row gap-3 justify-between items-center">
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6e7977] text-lg">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama gudang, lokasi, kepala..."
            className="w-full pl-10 pr-4 py-2 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl text-xs font-medium focus:outline-none focus:border-[#005c55]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-semibold text-[#3e4947]">Status Gudang:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl text-xs font-semibold text-[#181c1c] focus:outline-none focus:border-[#005c55]"
          >
            <option value="ALL">Semua Status</option>
            <option value="ACTIVE">Aktif (ACTIVE)</option>
            <option value="FULL">Penuh (FULL)</option>
            <option value="MAINTENANCE">Perbaikan (MAINTENANCE)</option>
          </select>
        </div>
      </div>

      {/* Warehouse Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredWarehouses.length === 0 ? (
          <div className="col-span-full py-12 bg-white rounded-2xl border border-dashed border-[#bdc9c6] text-center space-y-2">
            <span className="material-symbols-outlined text-4xl text-gray-300">location_off</span>
            <p className="text-xs font-bold text-[#3e4947]">Tidak Ada Gudang Ditemukan</p>
          </div>
        ) : (
          filteredWarehouses.map((wh) => (
            <div
              key={wh.id}
              className="bg-white rounded-2xl p-5 border border-[#bdc9c6] shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
                      {wh.code || 'GDG-' + wh.id.slice(-2)}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      wh.status === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : wh.status === 'FULL'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {wh.status}
                  </span>
                </div>

                <h3 className="font-black text-base text-[#181c1c] group-hover:text-[#005c55] transition-colors leading-snug">
                  {wh.name}
                </h3>
                <p className="text-xs text-[#6e7977] flex items-center gap-1 mt-1 font-medium">
                  <span className="material-symbols-outlined text-sm text-[#005c55]">location_on</span>
                  <span>{wh.location}</span>
                </p>

                {wh.manager && (
                  <p className="text-xs text-[#3e4947] mt-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-blue-600">badge</span>
                    <span className="font-semibold">{wh.manager}</span>
                  </p>
                )}

                <div className="space-y-2 pt-3 mt-3 border-t border-[#bdc9c6]/50">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[#6e7977]">Kapasitas Terpakai</span>
                    <span className="text-[#005c55] font-extrabold">{wh.capacityPercentage}%</span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        wh.capacityPercentage > 85
                          ? 'bg-rose-600'
                          : wh.capacityPercentage > 60
                          ? 'bg-amber-500'
                          : 'bg-[#005c55]'
                      }`}
                      style={{ width: `${wh.capacityPercentage}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-xs pt-1">
                    <span className="text-[#6e7977]">Total Stok Barang</span>
                    <span className="font-extrabold text-[#181c1c]">{wh.totalStock.toLocaleString()} Item</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#bdc9c6]/50 flex items-center justify-between gap-2">
                <button
                  onClick={() => setDetailWarehouse(wh)}
                  className="px-3 py-1.5 bg-[#f1f4f3] hover:bg-[#e0e3e1] text-[#3e4947] font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">visibility</span>
                  <span>Detail</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditModal(wh)}
                    className="p-1.5 text-[#005c55] hover:bg-[#f1f4f3] rounded-lg transition-colors"
                    title="Edit Gudang"
                  >
                    <span className="material-symbols-outlined text-lg">edit</span>
                  </button>

                  <button
                    onClick={() => setDeletingWarehouse(wh)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Hapus Gudang"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stock Movement Log */}
      <div className="bg-white border border-[#bdc9c6] rounded-2xl overflow-hidden shadow-xs">
        <div className="p-5 bg-[#f1f4f3] border-b border-[#bdc9c6] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-base text-[#181c1c]">Aktivitas Mutasi & Audit Stok</h3>
            <p className="text-xs text-[#6e7977]">Log pergerakan barang antar cabang gudang terupdate</p>
          </div>
          <button
            onClick={() => onNavigate('inventory')}
            className="text-xs font-bold text-[#005c55] hover:underline"
          >
            Lihat Katalog Stok Barang ➔
          </button>
        </div>

        <div className="divide-y divide-[#bdc9c6]/40">
          {activities.map((act) => (
            <div key={act.id} className="p-4 hover:bg-[#f1f4f3]/50 transition-colors flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={act.image}
                  alt={act.productName}
                  className="w-11 h-11 rounded-xl object-cover border border-[#bdc9c6] bg-slate-50 shrink-0"
                />
                <div>
                  <h4 className="font-bold text-xs md:text-sm text-[#181c1c]">{act.productName}</h4>
                  <p className="text-xs text-[#3e4947] font-medium mt-0.5">{act.changeText}</p>
                  <div className="flex items-center gap-3 text-[10px] text-[#6e7977] mt-1">
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
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase shrink-0 ${
                  act.type === 'Inbound'
                    ? 'bg-blue-100 text-blue-900'
                    : act.type === 'Sales'
                    ? 'bg-emerald-100 text-emerald-900'
                    : 'bg-amber-100 text-amber-900'
                }`}
              >
                {act.type}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Add / Edit Warehouse */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-[#bdc9c6]">
            <div className="px-6 py-4 bg-[#005c55] text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined">
                  {editingWarehouse ? 'edit_location_alt' : 'add_location_alt'}
                </span>
                <h3 className="font-bold text-lg">
                  {editingWarehouse ? 'Edit Lokasi Gudang' : 'Tambah Gudang Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmitWarehouseForm} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#3e4947] uppercase mb-1">
                    Kode Gudang
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl font-mono text-xs font-bold text-[#181c1c]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-semibold text-[#3e4947] uppercase mb-1">
                    Nama Gudang / Cabang *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Gudang Barat - Tangerang"
                    className="w-full px-4 py-2.5 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl focus:border-[#005c55] focus:outline-none font-semibold text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#3e4947] uppercase mb-1">
                    Wilayah / Kota *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Pulogadung / BSD / Cikarang"
                    className="w-full px-4 py-2.5 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl focus:border-[#005c55] focus:outline-none font-semibold text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#3e4947] uppercase mb-1">
                    Status Gudang
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as Warehouse['status'] })
                    }
                    className="w-full px-4 py-2.5 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl focus:border-[#005c55] focus:outline-none font-semibold text-xs"
                  >
                    <option value="ACTIVE">ACTIVE (Aktif Beroperasi)</option>
                    <option value="FULL">FULL (Kapasitas Maksimal)</option>
                    <option value="MAINTENANCE">MAINTENANCE (Perbaikan)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#3e4947] uppercase mb-1">
                    Penanggung Jawab / Kepala Gudang
                  </label>
                  <input
                    type="text"
                    value={formData.manager}
                    onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                    placeholder="Nama Kepala Gudang"
                    className="w-full px-4 py-2.5 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl focus:border-[#005c55] focus:outline-none font-semibold text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#3e4947] uppercase mb-1">
                    No. Telepon Gudang
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="021-4600-990"
                    className="w-full px-4 py-2.5 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl focus:border-[#005c55] focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#3e4947] uppercase mb-1">
                  Kapasitas Awal Terpakai (%)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.capacityPercentage}
                    onChange={(e) =>
                      setFormData({ ...formData, capacityPercentage: Number(e.target.value) })
                    }
                    className="w-full accent-[#005c55]"
                  />
                  <span className="font-extrabold text-sm text-[#005c55] w-12 text-right">
                    {formData.capacityPercentage}%
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#3e4947] uppercase mb-1">
                  Alamat Lengkap Gudang
                </label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Kawasan Industri Pulogadung Blok B No. 18, Jakarta Timur"
                  className="w-full px-4 py-2.5 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl focus:border-[#005c55] focus:outline-none text-xs"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-[#e0e3e1] text-[#3e4947] font-semibold rounded-xl hover:bg-[#bdc9c6] text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#005c55] text-white font-bold rounded-xl hover:bg-[#0f766e] shadow-lg text-xs"
                >
                  {editingWarehouse ? 'Simpan Perubahan' : 'Simpan Gudang'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail Warehouse */}
      {detailWarehouse && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-[#bdc9c6] p-6 space-y-5">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 rounded border">
                  {detailWarehouse.code || 'GDG-' + detailWarehouse.id.slice(-2)}
                </span>
                <h3 className="font-black text-base text-[#181c1c] mt-1">
                  {detailWarehouse.name}
                </h3>
                <p className="text-xs text-[#005c55] font-bold">
                  {detailWarehouse.location}
                </p>
              </div>
              <button
                onClick={() => setDetailWarehouse(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-[#f1f4f3] rounded-xl flex justify-between items-center">
                <span className="text-[#6e7977] font-medium">Penanggung Jawab</span>
                <span className="font-bold text-[#181c1c]">{detailWarehouse.manager || '-'}</span>
              </div>

              <div className="p-3 bg-[#f1f4f3] rounded-xl flex justify-between items-center">
                <span className="text-[#6e7977] font-medium">No. Telepon Gudang</span>
                <span className="font-bold text-[#181c1c]">{detailWarehouse.phone || '-'}</span>
              </div>

              <div className="p-3 bg-[#f1f4f3] rounded-xl flex justify-between items-center">
                <span className="text-[#6e7977] font-medium">Status Gudang</span>
                <span className="font-extrabold text-[#005c55] bg-teal-100 px-2 py-0.5 rounded">
                  {detailWarehouse.status}
                </span>
              </div>

              <div className="p-3 bg-[#f1f4f3] rounded-xl flex justify-between items-center">
                <span className="text-[#6e7977] font-medium">Total Stok Tersimpan</span>
                <span className="font-black text-[#181c1c]">
                  {detailWarehouse.totalStock.toLocaleString()} Unit Item
                </span>
              </div>

              <div className="p-3 bg-[#f1f4f3] rounded-xl space-y-1">
                <span className="text-[#6e7977] font-medium block">Alamat Gudang</span>
                <p className="font-semibold text-[#181c1c]">{detailWarehouse.address || 'Belum diisi'}</p>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  const w = detailWarehouse;
                  setDetailWarehouse(null);
                  handleOpenEditModal(w);
                }}
                className="flex-1 py-2.5 bg-[#005c55] text-white font-bold rounded-xl text-xs hover:bg-[#0f766e]"
              >
                Edit Gudang
              </button>
              <button
                onClick={() => setDetailWarehouse(null)}
                className="py-2.5 px-4 bg-gray-200 text-gray-700 font-bold rounded-xl text-xs hover:bg-gray-300"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Delete Warehouse */}
      {deletingWarehouse && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 text-center space-y-4 border border-[#bdc9c6]">
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-3xl">warning</span>
            </div>

            <div>
              <h3 className="font-black text-lg text-slate-900">Hapus Gudang?</h3>
              <p className="text-xs text-slate-600 mt-1">
                Apakah Anda yakin ingin menghapus lokasi <strong>{deletingWarehouse.name}</strong>? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeletingWarehouse(null)}
                className="flex-1 py-2.5 bg-slate-200 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-300"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 bg-rose-600 text-white font-bold rounded-xl text-xs hover:bg-rose-700 shadow-md"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Stock Modal */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-[#bdc9c6] overflow-hidden">
            <div className="px-6 py-4 bg-[#005c55] text-white flex justify-between items-center">
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
                <label className="block text-[#3e4947] font-bold uppercase mb-1">
                  Pilih Produk
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full px-4 py-3 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl font-bold text-[#181c1c] focus:outline-none focus:border-[#005c55]"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Stok: {p.stock} {p.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#3e4947] font-bold uppercase mb-1">
                    Gudang Asal
                  </label>
                  <select
                    value={fromWarehouse}
                    onChange={(e) => setFromWarehouse(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl focus:outline-none focus:border-[#005c55]"
                  >
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.name}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#3e4947] font-bold uppercase mb-1">
                    Gudang Tujuan
                  </label>
                  <select
                    value={toWarehouse}
                    onChange={(e) => setToWarehouse(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl focus:outline-none focus:border-[#005c55]"
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
                <label className="block text-[#3e4947] font-bold uppercase mb-1">
                  Jumlah Transfer
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={transferQty}
                  onChange={(e) => setTransferQty(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl font-bold focus:outline-none focus:border-[#005c55]"
                />
              </div>

              <div>
                <label className="block text-[#3e4947] font-bold uppercase mb-1">
                  Catatan Mutasi
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Permintaan mendesak cabang"
                  value={transferNotes}
                  onChange={(e) => setTransferNotes(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl focus:outline-none focus:border-[#005c55]"
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  className="flex-1 py-3 bg-[#e0e3e1] text-[#3e4947] font-bold rounded-xl hover:bg-[#bdc9c6]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#005c55] text-white font-bold rounded-xl hover:bg-[#0f766e] shadow-md"
                >
                  Proses Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
