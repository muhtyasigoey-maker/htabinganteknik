import React, { useState } from 'react';
import { StoreBranch, TabType } from '../types';

interface StoresViewProps {
  stores: StoreBranch[];
  onAddStore: (store: StoreBranch) => void;
  onUpdateStore: (store: StoreBranch) => void;
  onDeleteStore: (id: string) => void;
  onSelectStoreForPos?: (storeName: string) => void;
  onNavigate: (tab: TabType) => void;
}

export const StoresView: React.FC<StoresViewProps> = ({
  stores,
  onAddStore,
  onUpdateStore,
  onDeleteStore,
  onSelectStoreForPos,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('Semua');
  const [selectedStatus, setSelectedStatus] = useState('Semua');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<StoreBranch | null>(null);
  const [deletingStore, setDeletingStore] = useState<StoreBranch | null>(null);
  const [viewingStore, setViewingStore] = useState<StoreBranch | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    address: '',
    city: '',
    phone: '',
    manager: '',
    type: 'Toko Retail' as StoreBranch['type'],
    status: 'Aktif' as StoreBranch['status'],
    totalCashiers: 2,
    monthlyTarget: 250000000,
    monthlyRevenue: 0,
    openHours: '08:00 - 17:00 WIB',
  });

  const handleOpenAddModal = () => {
    const nextCode = 'CBG-' + String(stores.length + 1).padStart(2, '0');
    setFormData({
      code: nextCode,
      name: '',
      address: '',
      city: 'Jakarta',
      phone: '',
      manager: '',
      type: 'Toko Retail',
      status: 'Aktif',
      totalCashiers: 2,
      monthlyTarget: 250000000,
      monthlyRevenue: 0,
      openHours: '08:00 - 17:00 WIB',
    });
    setEditingStore(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (st: StoreBranch) => {
    setFormData({
      code: st.code,
      name: st.name,
      address: st.address,
      city: st.city,
      phone: st.phone,
      manager: st.manager,
      type: st.type,
      status: st.status,
      totalCashiers: st.totalCashiers,
      monthlyTarget: st.monthlyTarget,
      monthlyRevenue: st.monthlyRevenue,
      openHours: st.openHours,
    });
    setEditingStore(st);
    setIsModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingStore) {
      const updated: StoreBranch = {
        ...editingStore,
        code: formData.code.trim(),
        name: formData.name.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        phone: formData.phone.trim(),
        manager: formData.manager.trim() || 'Kepala Toko',
        type: formData.type,
        status: formData.status,
        totalCashiers: Number(formData.totalCashiers),
        monthlyTarget: Number(formData.monthlyTarget),
        monthlyRevenue: Number(formData.monthlyRevenue),
        openHours: formData.openHours.trim(),
      };
      onUpdateStore(updated);
    } else {
      const newStore: StoreBranch = {
        id: 'store_' + Date.now(),
        code: formData.code.trim() || 'CBG-' + Math.floor(10 + Math.random() * 90),
        name: formData.name.trim(),
        address: formData.address.trim() || 'Jl. Raya Industri No. 1',
        city: formData.city.trim() || 'Jakarta',
        phone: formData.phone.trim() || '021-5000-888',
        manager: formData.manager.trim() || 'Kepala Toko',
        type: formData.type,
        status: formData.status,
        totalCashiers: Number(formData.totalCashiers),
        monthlyTarget: Number(formData.monthlyTarget),
        monthlyRevenue: Number(formData.monthlyRevenue),
        openHours: formData.openHours.trim() || '08:00 - 17:00 WIB',
      };
      onAddStore(newStore);
    }

    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (deletingStore) {
      onDeleteStore(deletingStore.id);
      setDeletingStore(null);
    }
  };

  const handleSelectStoreForPos = (storeName: string) => {
    if (onSelectStoreForPos) {
      onSelectStoreForPos(storeName);
    }
    onNavigate('pos');
  };

  const filteredStores = stores.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === 'Semua' || s.type === selectedType;
    const matchesStatus = selectedStatus === 'Semua' || s.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const totalTargetAll = stores.reduce((sum, s) => sum + s.monthlyTarget, 0);
  const totalRevenueAll = stores.reduce((sum, s) => sum + s.monthlyRevenue, 0);
  const totalCashiersAll = stores.reduce((sum, s) => sum + s.totalCashiers, 0);

  return (
    <div className="pt-20 pb-32 px-4 md:px-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-[#005c55] text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2 text-[#a3faef] text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-sm">storefront</span>
            <span>MODUL MANAJEMEN CABANG & OUTLET TOKO</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black">Data Cabang & Outlet Retail</h1>
          <p className="text-xs md:text-sm text-[#a3faef]/90 max-w-xl">
            Kelola lokasi jaringan toko fisik, target penjualan bulanan cabang, penanggung jawab outlet, serta integrasi POS Toko H. Tabingan Teknik.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-3 bg-[#6df5e1] hover:bg-[#a3faef] text-[#004f49] rounded-2xl font-extrabold text-xs md:text-sm flex items-center gap-2 shadow-lg active:scale-95 transition-all relative z-10 shrink-0"
        >
          <span className="material-symbols-outlined text-lg">add_business</span>
          <span>+ Tambah Cabang Baru</span>
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#bdc9c6] shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-teal-100 text-[#005c55] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">storefront</span>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#6e7977]">Total Cabang</p>
            <p className="text-2xl font-black text-[#181c1c]">{stores.length}</p>
            <p className="text-[10px] text-teal-700 font-bold">Outlet Beroperasi</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#bdc9c6] shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">insights</span>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#6e7977]">Omset Gabungan</p>
            <p className="text-xl font-black text-emerald-900">
              Rp {(totalRevenueAll / 1000000).toFixed(0)} Jt
            </p>
            <p className="text-[10px] text-emerald-700 font-bold">Omset Bulan Ini</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#bdc9c6] shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">track_changes</span>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#6e7977]">Target Pencapaian</p>
            <p className="text-xl font-black text-amber-900">
              {Math.round((totalRevenueAll / (totalTargetAll || 1)) * 100)}%
            </p>
            <p className="text-[10px] text-amber-700 font-bold">Rata-rata Jaringan</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#bdc9c6] shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">point_of_sale</span>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#6e7977]">Terminal POS Kasir</p>
            <p className="text-2xl font-black text-blue-900">{totalCashiersAll}</p>
            <p className="text-[10px] text-blue-700 font-bold">Mesin Kasir Aktif</p>
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#bdc9c6] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6e7977] text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Cari nama cabang, kota, manajer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl text-xs font-medium focus:outline-none focus:border-[#005c55]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {['Semua', 'Pusat', 'Cabang Utama', 'Toko Retail', 'Outlet Proyek'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedType === type
                    ? 'bg-[#005c55] text-white shadow-xs'
                    : 'bg-[#f1f4f3] text-[#3e4947] hover:bg-[#e0e3e1]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl text-xs font-semibold text-[#181c1c] focus:outline-none focus:border-[#005c55]"
          >
            <option value="Semua">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Tutup Sementara">Tutup Sementara</option>
            <option value="Nonaktif">Nonaktif</option>
          </select>
        </div>
      </div>

      {/* Store Branch Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredStores.length === 0 ? (
          <div className="col-span-full py-12 bg-white rounded-2xl border border-dashed border-[#bdc9c6] text-center space-y-2">
            <span className="material-symbols-outlined text-4xl text-gray-300">storefront</span>
            <p className="text-xs font-bold text-[#3e4947]">Tidak Ada Cabang Ditemukan</p>
          </div>
        ) : (
          filteredStores.map((st) => {
            const pct = Math.min(100, Math.round((st.monthlyRevenue / (st.monthlyTarget || 1)) * 100));
            return (
              <div
                key={st.id}
                className="bg-white rounded-3xl p-6 border border-[#bdc9c6] shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
                        {st.code}
                      </span>
                      <span className="text-[11px] font-bold text-[#005c55] bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/60">
                        {st.type}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        st.status === 'Aktif'
                          ? 'bg-emerald-100 text-emerald-800'
                          : st.status === 'Tutup Sementara'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {st.status}
                    </span>
                  </div>

                  <h3 className="font-black text-lg text-[#181c1c] group-hover:text-[#005c55] transition-colors leading-snug">
                    {st.name}
                  </h3>

                  <p className="text-xs text-[#6e7977] flex items-center gap-1 mt-1 font-medium">
                    <span className="material-symbols-outlined text-sm text-[#005c55]">location_on</span>
                    <span>{st.address} ({st.city})</span>
                  </p>

                  <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-[#bdc9c6]/50 text-xs">
                    <div>
                      <p className="text-[#6e7977] text-[11px]">Kepala Toko</p>
                      <p className="font-bold text-[#181c1c] flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-xs text-blue-600">badge</span>
                        <span>{st.manager}</span>
                      </p>
                    </div>

                    <div>
                      <p className="text-[#6e7977] text-[11px]">Telepon / Jam Buka</p>
                      <p className="font-bold text-[#181c1c] flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-xs text-teal-600">call</span>
                        <span>{st.phone}</span>
                      </p>
                    </div>
                  </div>

                  {/* Revenue vs Target Progress Bar */}
                  <div className="space-y-1.5 pt-3 mt-3 border-t border-[#bdc9c6]/50">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-[#6e7977]">Pencapaian Omset Bulanan</span>
                      <span className="text-[#005c55] font-black">
                        Rp {(st.monthlyRevenue / 1000000).toFixed(0)}Jt / Rp {(st.monthlyTarget / 1000000).toFixed(0)}Jt ({pct}%)
                      </span>
                    </div>

                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          pct >= 100 ? 'bg-emerald-500' : pct >= 75 ? 'bg-[#005c55]' : 'bg-amber-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-3 border-t border-[#bdc9c6]/50 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleSelectStoreForPos(st.name)}
                    className="px-3.5 py-2 bg-[#005c55] hover:bg-[#0f766e] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
                    title="Set Sebagai Toko Aktif untuk POS Kasir"
                  >
                    <span className="material-symbols-outlined text-base">point_of_sale</span>
                    <span>Pilih Toko POS</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setViewingStore(st)}
                      className="p-2 text-slate-600 hover:bg-[#f1f4f3] rounded-xl transition-colors"
                      title="Lihat Detail Cabang"
                    >
                      <span className="material-symbols-outlined text-lg">visibility</span>
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(st)}
                      className="p-2 text-[#005c55] hover:bg-[#f1f4f3] rounded-xl transition-colors"
                      title="Edit Cabang"
                    >
                      <span className="material-symbols-outlined text-lg">edit</span>
                    </button>

                    <button
                      onClick={() => setDeletingStore(st)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Hapus Cabang"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Add / Edit Store */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-[#bdc9c6] overflow-hidden">
            <div className="px-6 py-4 bg-[#005c55] text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined">
                  {editingStore ? 'edit_location_alt' : 'add_business'}
                </span>
                <h3 className="font-bold text-lg">
                  {editingStore ? 'Edit Data Cabang Toko' : 'Tambah Cabang Toko Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#3e4947] uppercase mb-1">
                    Kode Cabang
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
                    Nama Toko / Cabang *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Toko H. Tabingan Teknik (Cabang Bogor)"
                    className="w-full px-4 py-2.5 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl focus:border-[#005c55] focus:outline-none font-semibold text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#3e4947] uppercase mb-1">
                    Tipe Outlet / Cabang *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value as StoreBranch['type'] })
                    }
                    className="w-full px-4 py-2.5 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl focus:border-[#005c55] focus:outline-none font-semibold text-xs"
                  >
                    <option value="Pusat">Pusat</option>
                    <option value="Cabang Utama">Cabang Utama</option>
                    <option value="Toko Retail">Toko Retail</option>
                    <option value="Outlet Proyek">Outlet Proyek</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#3e4947] uppercase mb-1">
                    Status Beroperasi
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as StoreBranch['status'] })
                    }
                    className="w-full px-4 py-2.5 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl focus:border-[#005c55] focus:outline-none font-semibold text-xs"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Tutup Sementara">Tutup Sementara</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#3e4947] uppercase mb-1">
                    Kota / Wilayah *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Jakarta Timur / Bekasi / Bogor"
                    className="w-full px-4 py-2.5 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl focus:border-[#005c55] focus:outline-none font-semibold text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#3e4947] uppercase mb-1">
                    No. Telepon Toko
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="021-5000-8888"
                    className="w-full px-4 py-2.5 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl focus:border-[#005c55] focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#3e4947] uppercase mb-1">
                    Kepala Toko / Manajer
                  </label>
                  <input
                    type="text"
                    value={formData.manager}
                    onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                    placeholder="Nama Manajer Cabang"
                    className="w-full px-4 py-2.5 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl focus:border-[#005c55] focus:outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#3e4947] uppercase mb-1">
                    Jam Operasional
                  </label>
                  <input
                    type="text"
                    value={formData.openHours}
                    onChange={(e) => setFormData({ ...formData, openHours: e.target.value })}
                    placeholder="08:00 - 17:00 WIB"
                    className="w-full px-4 py-2.5 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl focus:border-[#005c55] focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#3e4947] uppercase mb-1">
                    Jumlah Mesin POS
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.totalCashiers}
                    onChange={(e) => setFormData({ ...formData, totalCashiers: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#3e4947] uppercase mb-1">
                    Target Omset (Rp)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="5000000"
                    value={formData.monthlyTarget}
                    onChange={(e) => setFormData({ ...formData, monthlyTarget: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#3e4947] uppercase mb-1">
                    Omset Realisasi (Rp)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="5000000"
                    value={formData.monthlyRevenue}
                    onChange={(e) => setFormData({ ...formData, monthlyRevenue: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#3e4947] uppercase mb-1">
                  Alamat Lengkap Cabang
                </label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Jl. Raya Industri Pulogadung No. 88, Jakarta Timur"
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
                  {editingStore ? 'Simpan Perubahan' : 'Tambah Cabang'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail Store */}
      {viewingStore && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-[#bdc9c6] p-6 space-y-5">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 rounded border">
                  {viewingStore.code}
                </span>
                <h3 className="font-black text-base text-[#181c1c] mt-1">
                  {viewingStore.name}
                </h3>
                <p className="text-xs text-[#005c55] font-bold">
                  {viewingStore.type} • {viewingStore.city}
                </p>
              </div>
              <button
                onClick={() => setViewingStore(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-[#f1f4f3] rounded-xl flex justify-between items-center">
                <span className="text-[#6e7977] font-medium">Kepala Toko / Manajer</span>
                <span className="font-bold text-[#181c1c]">{viewingStore.manager || '-'}</span>
              </div>

              <div className="p-3 bg-[#f1f4f3] rounded-xl flex justify-between items-center">
                <span className="text-[#6e7977] font-medium">No. Telepon Toko</span>
                <span className="font-bold text-[#181c1c]">{viewingStore.phone || '-'}</span>
              </div>

              <div className="p-3 bg-[#f1f4f3] rounded-xl flex justify-between items-center">
                <span className="text-[#6e7977] font-medium">Jam Operasional</span>
                <span className="font-bold text-[#181c1c]">{viewingStore.openHours}</span>
              </div>

              <div className="p-3 bg-[#f1f4f3] rounded-xl flex justify-between items-center">
                <span className="text-[#6e7977] font-medium">Terminal Kasir POS</span>
                <span className="font-bold text-[#181c1c]">{viewingStore.totalCashiers} Unit</span>
              </div>

              <div className="p-3 bg-[#f1f4f3] rounded-xl flex justify-between items-center">
                <span className="text-[#6e7977] font-medium">Omset Realisasi / Target</span>
                <span className="font-extrabold text-[#005c55]">
                  Rp {(viewingStore.monthlyRevenue).toLocaleString('id-ID')} / Rp {(viewingStore.monthlyTarget).toLocaleString('id-ID')}
                </span>
              </div>

              <div className="p-3 bg-[#f1f4f3] rounded-xl space-y-1">
                <span className="text-[#6e7977] font-medium block">Alamat Cabang</span>
                <p className="font-semibold text-[#181c1c]">{viewingStore.address || 'Belum diisi'}</p>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  const s = viewingStore;
                  setViewingStore(null);
                  handleOpenEditModal(s);
                }}
                className="flex-1 py-2.5 bg-[#005c55] text-white font-bold rounded-xl text-xs hover:bg-[#0f766e]"
              >
                Edit Cabang
              </button>
              <button
                onClick={() => setViewingStore(null)}
                className="py-2.5 px-4 bg-gray-200 text-gray-700 font-bold rounded-xl text-xs hover:bg-gray-300"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Delete Store */}
      {deletingStore && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 text-center space-y-4 border border-[#bdc9c6]">
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-3xl">warning</span>
            </div>

            <div>
              <h3 className="font-black text-lg text-slate-900">Hapus Cabang Toko?</h3>
              <p className="text-xs text-slate-600 mt-1">
                Apakah Anda yakin ingin menghapus data cabang <strong>{deletingStore.name}</strong>? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeletingStore(null)}
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
    </div>
  );
};
