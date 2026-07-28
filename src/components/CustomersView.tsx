import React, { useState } from 'react';
import { Customer, TabType } from '../types';

interface CustomersViewProps {
  customers: Customer[];
  onAddCustomer: (customer: Customer) => void;
  onUpdateCustomer: (customer: Customer) => void;
  onDeleteCustomer: (id: string) => void;
  onSelectCustomerForPos?: (customer: Customer) => void;
  onNavigate: (tab: TabType) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  onAddCustomer,
  onUpdateCustomer,
  onDeleteCustomer,
  onSelectCustomerForPos,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('Semua');
  const [selectedStatus, setSelectedStatus] = useState('Semua');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'Pelanggan Langsung',
    phone: '',
    email: '',
    address: '',
    status: 'Aktif' as 'Aktif' | 'Nonaktif',
  });

  const handleOpenAddModal = () => {
    const nextCode = 'PLG-' + String(customers.length + 1).padStart(3, '0');
    setFormData({
      code: nextCode,
      name: '',
      type: 'Pelanggan Langsung',
      phone: '',
      email: '',
      address: '',
      status: 'Aktif',
    });
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cust: Customer) => {
    setFormData({
      code: cust.code || 'PLG-' + cust.id.slice(-3),
      name: cust.name,
      type: cust.type,
      phone: cust.phone || '',
      email: cust.email || '',
      address: cust.address || '',
      status: cust.status || 'Aktif',
    });
    setEditingCustomer(cust);
    setIsModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingCustomer) {
      const updated: Customer = {
        ...editingCustomer,
        code: formData.code.trim(),
        name: formData.name.trim(),
        type: formData.type,
        phone: formData.phone.trim() || '-',
        email: formData.email.trim(),
        address: formData.address.trim(),
        status: formData.status,
      };
      onUpdateCustomer(updated);
    } else {
      const newCust: Customer = {
        id: 'c_' + Date.now(),
        code: formData.code.trim() || 'PLG-' + Math.floor(100 + Math.random() * 900),
        name: formData.name.trim(),
        type: formData.type,
        phone: formData.phone.trim() || '-',
        email: formData.email.trim(),
        address: formData.address.trim(),
        status: formData.status,
        totalTransactions: 0,
        totalSpent: 0,
        createdAt: 'Hari ini',
      };
      onAddCustomer(newCust);
    }

    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (deletingCustomer) {
      onDeleteCustomer(deletingCustomer.id);
      setDeletingCustomer(null);
    }
  };

  const handleStartPosForCustomer = (cust: Customer) => {
    if (onSelectCustomerForPos) {
      onSelectCustomerForPos(cust);
    }
    onNavigate('pos');
  };

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone && c.phone.includes(searchTerm)) ||
      (c.code && c.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.address && c.address.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType =
      selectedType === 'Semua' || c.type.toLowerCase().includes(selectedType.toLowerCase());

    const matchesStatus =
      selectedStatus === 'Semua' || (c.status || 'Aktif') === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const totalSpentAll = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);

  return (
    <div className="pt-20 pb-32 px-4 md:px-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-[#005c55] text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2 text-[#a3faef] text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-sm">group</span>
            <span>MODUL MANAJEMEN PELANGGAN & KONTRAKTOR</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black">Data Pelanggan & Mitra Toko</h1>
          <p className="text-xs md:text-sm text-[#a3faef]/90 max-w-xl">
            Kelola kontak pelanggan retail, kontraktor proyek, toko grosir, data histori transaksi, serta diskon kemitraan Toko H. Tabingan Teknik.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-3 bg-[#6df5e1] hover:bg-[#a3faef] text-[#004f49] rounded-2xl font-extrabold text-xs md:text-sm flex items-center gap-2 shadow-lg active:scale-95 transition-all relative z-10 shrink-0"
        >
          <span className="material-symbols-outlined text-lg">person_add</span>
          <span>+ Tambah Pelanggan Baru</span>
        </button>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#bdc9c6] shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-teal-100 text-[#005c55] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">groups</span>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#6e7977]">Total Pelanggan</p>
            <p className="text-2xl font-black text-[#181c1c]">{customers.length}</p>
            <p className="text-[10px] text-teal-700 font-bold">Terdaftar Aktif</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#bdc9c6] shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">engineering</span>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#6e7977]">Kontraktor & B2B</p>
            <p className="text-2xl font-black text-blue-900">
              {customers.filter((c) => c.type.includes('Kontraktor') || c.type.includes('B2B')).length}
            </p>
            <p className="text-[10px] text-blue-700 font-bold">Proyek Utama</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#bdc9c6] shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">store</span>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#6e7977]">Mitra Grosir</p>
            <p className="text-2xl font-black text-emerald-900">
              {customers.filter((c) => c.type.includes('Grosir') || c.type.includes('Toko')).length}
            </p>
            <p className="text-[10px] text-emerald-700 font-bold">Volume Besar</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#bdc9c6] shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">payments</span>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#6e7977]">Total Transaksi</p>
            <p className="text-xl font-black text-amber-900">
              Rp {(totalSpentAll / 1000000).toFixed(1)}Jt
            </p>
            <p className="text-[10px] text-amber-700 font-bold">Akumulasi Omset</p>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-[#bdc9c6] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6e7977] text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Cari nama, kode PLG, no. HP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl text-xs font-medium focus:outline-none focus:border-[#005c55]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {['Semua', 'Langsung', 'Kontraktor', 'Grosir', 'B2B', 'Tukang'].map((type) => (
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
            <option value="Aktif">Status Aktif</option>
            <option value="Nonaktif">Status Nonaktif</option>
          </select>
        </div>
      </div>

      {/* Customer List Table */}
      <div className="bg-white rounded-2xl border border-[#bdc9c6] shadow-xs overflow-hidden">
        <div className="px-5 py-3 bg-[#f1f4f3] border-b border-[#bdc9c6] flex items-center justify-between">
          <span className="text-xs font-bold text-[#181c1c]">
            Menampilkan {filteredCustomers.length} dari {customers.length} Pelanggan
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[#6e7977] text-[11px] font-bold uppercase tracking-wider border-b border-[#bdc9c6]">
                <th className="px-5 py-3.5">Kode & Pelanggan</th>
                <th className="px-5 py-3.5">Kategori / Tipe</th>
                <th className="px-5 py-3.5">Kontak & Telepon</th>
                <th className="px-5 py-3.5">Total Belanja</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Aksi Manajemen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bdc9c6]/40 text-xs">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#6e7977]">
                    <span className="material-symbols-outlined text-4xl block mb-2 opacity-50">
                      group_off
                    </span>
                    Tidak ada pelanggan yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-[#f1f4f3]/60 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#6df5e1]/40 text-[#004f49] font-black text-xs flex items-center justify-center shrink-0 border border-[#6df5e1]">
                          {cust.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded border">
                              {cust.code || 'PLG-' + cust.id.slice(-3)}
                            </span>
                          </div>
                          <p className="font-bold text-[#181c1c] text-sm group-hover:text-[#005c55] transition-colors">
                            {cust.name}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="bg-[#e0e3e1] text-[#005c55] font-bold px-2.5 py-1 rounded-lg text-[11px]">
                        {cust.type}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-[#3e4947]">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1 font-bold text-[#181c1c]">
                          <span className="material-symbols-outlined text-xs text-teal-600">call</span>
                          <span>{cust.phone || '-'}</span>
                        </div>
                        {cust.email && (
                          <div className="text-[10px] text-slate-500">{cust.email}</div>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-black text-[#005c55]">
                        Rp {(cust.totalSpent || 0).toLocaleString('id-ID')}
                      </p>
                      <p className="text-[10px] text-slate-500 font-semibold">
                        {cust.totalTransactions || 0} Trx Pembelian
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          (cust.status || 'Aktif') === 'Aktif'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            (cust.status || 'Aktif') === 'Aktif' ? 'bg-emerald-600' : 'bg-rose-600'
                          }`}
                        />
                        {cust.status || 'Aktif'}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleStartPosForCustomer(cust)}
                          className="px-2.5 py-1.5 bg-[#005c55] hover:bg-[#0f766e] text-white rounded-xl font-bold text-xs flex items-center gap-1 shadow-xs transition-colors"
                          title="Mulai Transaksi Kasir POS"
                        >
                          <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                          <span className="hidden lg:inline">Trx POS</span>
                        </button>

                        <button
                          onClick={() => setViewingCustomer(cust)}
                          className="p-1.5 text-slate-600 hover:bg-[#f1f4f3] rounded-lg transition-colors"
                          title="Lihat Detail"
                        >
                          <span className="material-symbols-outlined text-lg">visibility</span>
                        </button>

                        <button
                          onClick={() => handleOpenEditModal(cust)}
                          className="p-1.5 text-[#005c55] hover:bg-[#f1f4f3] rounded-lg transition-colors"
                          title="Edit Customer"
                        >
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>

                        <button
                          onClick={() => setDeletingCustomer(cust)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Hapus Customer"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Customer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-[#bdc9c6] overflow-hidden">
            <div className="px-6 py-4 bg-[#005c55] text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined">
                  {editingCustomer ? 'manage_accounts' : 'person_add'}
                </span>
                <h3 className="font-bold text-lg">
                  {editingCustomer ? 'Edit Data Pelanggan' : 'Tambah Pelanggan Baru'}
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
                    Kode Pelanggan
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
                    Nama Pelanggan / Perusahaan *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Pak Budi Santoso / CV Karya"
                    className="w-full px-4 py-2.5 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl focus:border-[#005c55] focus:outline-none font-semibold text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#3e4947] uppercase mb-1">
                    Kategori Pelanggan *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl focus:border-[#005c55] focus:outline-none font-semibold text-xs"
                  >
                    <option value="Pelanggan Langsung">Pelanggan Langsung</option>
                    <option value="Kontraktor Perorangan">Kontraktor Perorangan</option>
                    <option value="Mitra Toko / Grosir">Mitra Toko / Grosir</option>
                    <option value="Perusahaan B2B">Perusahaan B2B</option>
                    <option value="Tukang Langganan">Tukang Langganan</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#3e4947] uppercase mb-1">
                    Status Pelanggan
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as 'Aktif' | 'Nonaktif' })
                    }
                    className="w-full px-4 py-2.5 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl focus:border-[#005c55] focus:outline-none font-semibold text-xs"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#3e4947] uppercase mb-1">
                    Nomor Telepon / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0812-3456-7890"
                    className="w-full px-4 py-2.5 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl focus:border-[#005c55] focus:outline-none font-semibold text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#3e4947] uppercase mb-1">
                    Email (Opsional)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="mitra@pelanggan.com"
                    className="w-full px-4 py-2.5 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl focus:border-[#005c55] focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#3e4947] uppercase mb-1">
                  Alamat Proyek / Toko / Kantor
                </label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Jl. Merdeka No. 45, Jakarta Barat"
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
                  {editingCustomer ? 'Simpan Perubahan' : 'Tambah Pelanggan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail Customer */}
      {viewingCustomer && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-[#bdc9c6] p-6 space-y-5">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#005c55] text-white font-black text-sm flex items-center justify-center">
                  {viewingCustomer.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 rounded border">
                    {viewingCustomer.code || 'PLG-' + viewingCustomer.id.slice(-3)}
                  </span>
                  <h3 className="font-black text-base text-[#181c1c] mt-0.5">
                    {viewingCustomer.name}
                  </h3>
                  <p className="text-xs text-[#005c55] font-bold">
                    {viewingCustomer.type}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setViewingCustomer(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-[#f1f4f3] rounded-xl flex justify-between items-center">
                <span className="text-[#6e7977] font-medium">Nomor WhatsApp / Telepon</span>
                <span className="font-bold text-[#181c1c]">{viewingCustomer.phone || '-'}</span>
              </div>

              <div className="p-3 bg-[#f1f4f3] rounded-xl flex justify-between items-center">
                <span className="text-[#6e7977] font-medium">Email Kontak</span>
                <span className="font-bold text-[#181c1c]">{viewingCustomer.email || '-'}</span>
              </div>

              <div className="p-3 bg-[#f1f4f3] rounded-xl flex justify-between items-center">
                <span className="text-[#6e7977] font-medium">Total Akumulasi Belanja</span>
                <span className="font-extrabold text-[#005c55]">
                  Rp {(viewingCustomer.totalSpent || 0).toLocaleString('id-ID')}
                </span>
              </div>

              <div className="p-3 bg-[#f1f4f3] rounded-xl flex justify-between items-center">
                <span className="text-[#6e7977] font-medium">Jumlah Transaksi POS</span>
                <span className="font-bold text-[#181c1c]">
                  {viewingCustomer.totalTransactions || 0} Kali
                </span>
              </div>

              <div className="p-3 bg-[#f1f4f3] rounded-xl space-y-1">
                <span className="text-[#6e7977] font-medium block">Alamat Terdaftar</span>
                <p className="font-semibold text-[#181c1c]">{viewingCustomer.address || 'Belum diisi'}</p>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  const c = viewingCustomer;
                  setViewingCustomer(null);
                  handleOpenEditModal(c);
                }}
                className="flex-1 py-2.5 bg-[#005c55] text-white font-bold rounded-xl text-xs hover:bg-[#0f766e]"
              >
                Edit Customer
              </button>
              <button
                onClick={() => setViewingCustomer(null)}
                className="py-2.5 px-4 bg-gray-200 text-gray-700 font-bold rounded-xl text-xs hover:bg-gray-300"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingCustomer && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 text-center space-y-4 border border-[#bdc9c6]">
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-3xl">warning</span>
            </div>

            <div>
              <h3 className="font-black text-lg text-slate-900">Hapus Pelanggan?</h3>
              <p className="text-xs text-slate-600 mt-1">
                Apakah Anda yakin ingin menghapus data <strong>{deletingCustomer.name}</strong>? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeletingCustomer(null)}
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
