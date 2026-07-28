import React, { useState } from 'react';
import { Supplier, TabType } from '../types';

interface SuppliersViewProps {
  suppliers: Supplier[];
  onAddSupplier: (supplier: Supplier) => void;
  onUpdateSupplier: (supplier: Supplier) => void;
  onDeleteSupplier?: (id: string) => void;
  onNavigate: (tab: TabType) => void;
  onOpenStockInWithSupplier?: (supplierName: string) => void;
}

export const SuppliersView: React.FC<SuppliersViewProps> = ({
  suppliers,
  onAddSupplier,
  onUpdateSupplier,
  onDeleteSupplier,
  onNavigate,
  onOpenStockInWithSupplier,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedTerms, setSelectedTerms] = useState<string>('ALL');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [selectedSupplierForDetail, setSelectedSupplierForDetail] = useState<Supplier | null>(null);
  const [deletingSupplier, setDeletingSupplier] = useState<Supplier | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    contactPerson: '',
    category: 'Semen & Material Bangunan',
    phone: '',
    email: '',
    address: '',
    paymentTerms: 'Tempo 30 Hari' as Supplier['paymentTerms'],
    status: 'Aktif' as Supplier['status'],
  });

  const handleOpenAddModal = () => {
    const randomCode = 'SUP-' + Math.floor(100 + Math.random() * 900);
    setFormData({
      code: randomCode,
      name: '',
      contactPerson: '',
      category: 'Semen & Material Bangunan',
      phone: '',
      email: '',
      address: '',
      paymentTerms: 'Tempo 30 Hari',
      status: 'Aktif',
    });
    setEditingSupplier(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (sup: Supplier) => {
    setFormData({
      code: sup.code,
      name: sup.name,
      contactPerson: sup.contactPerson,
      category: sup.category,
      phone: sup.phone,
      email: sup.email,
      address: sup.address,
      paymentTerms: sup.paymentTerms,
      status: sup.status,
    });
    setEditingSupplier(sup);
    setIsModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingSupplier) {
      const updated: Supplier = {
        ...editingSupplier,
        code: formData.code.trim() || editingSupplier.code,
        name: formData.name.trim(),
        contactPerson: formData.contactPerson.trim(),
        category: formData.category,
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        paymentTerms: formData.paymentTerms,
        status: formData.status,
      };
      onUpdateSupplier(updated);
    } else {
      const newSup: Supplier = {
        id: 'sup_' + Date.now(),
        code: formData.code.trim() || 'SUP-' + Math.floor(100 + Math.random() * 900),
        name: formData.name.trim(),
        contactPerson: formData.contactPerson.trim() || 'Tim Sales',
        category: formData.category,
        phone: formData.phone.trim(),
        email: formData.email.trim() || 'sales@distributor.com',
        address: formData.address.trim() || 'Jakarta, Indonesia',
        paymentTerms: formData.paymentTerms,
        status: formData.status,
        totalOrders: 1,
        totalPurchases: 15000000,
        rating: 4.8,
      };
      onAddSupplier(newSup);
    }

    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (deletingSupplier && onDeleteSupplier) {
      onDeleteSupplier(deletingSupplier.id);
      setDeletingSupplier(null);
    }
  };

  // Filter suppliers
  const filteredSuppliers = suppliers.filter((sup) => {
    const matchesSearch =
      sup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sup.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sup.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sup.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sup.phone.includes(searchTerm);

    const matchesCat = selectedCategory === 'ALL' || sup.category === selectedCategory;
    const matchesTerms = selectedTerms === 'ALL' || sup.paymentTerms === selectedTerms;

    return matchesSearch && matchesCat && matchesTerms;
  });

  // Calculate statistics
  const totalSuppliersCount = suppliers.length;
  const activeSuppliersCount = suppliers.filter((s) => s.status === 'Aktif').length;
  const totalPurchasesSum = suppliers.reduce((sum, s) => sum + (s.totalPurchases || 0), 0);
  const totalOrdersSum = suppliers.reduce((sum, s) => sum + (s.totalOrders || 0), 0);

  // Categories list
  const categoriesList = Array.from(new Set(suppliers.map((s) => s.category)));

  return (
    <div className="pt-20 pb-24 px-4 md:px-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-[#0f766e] text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 opacity-10 pointer-events-none">
          <span className="material-symbols-outlined text-[240px]">local_shipping</span>
        </div>

        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2 text-[#a3faef] text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-sm">handshake</span>
            <span>MODUL PEMASOK & DISTRIBUTOR MATERIAL</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black">Pemasok & Distributor</h2>
          <p className="text-xs md:text-sm text-[#a3faef]/90 max-w-xl">
            Kelola jaringan vendor, distributor pabrikan, syarat pembayaran tempo, histori pasokan stok, dan kontak resmi Toko H. Tabingan Teknik.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 relative z-10 w-full md:w-auto">
          <button
            onClick={() => onNavigate('inventory')}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">inventory_2</span>
            <span>Stok Barang</span>
          </button>
          <button
            onClick={handleOpenAddModal}
            className="px-5 py-2.5 bg-[#6df5e1] hover:bg-[#a3faef] text-[#004f49] rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-base">domain_add</span>
            <span>+ Tambah Pemasok Baru</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#bdc9c6] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-[#0f766e] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">store</span>
          </div>
          <div>
            <p className="text-[11px] text-[#6e7977] font-semibold uppercase tracking-wider">Total Vendor</p>
            <h3 className="text-2xl font-black text-[#181c1c]">{totalSuppliersCount} Mitra</h3>
            <p className="text-[10px] text-emerald-600 font-bold mt-0.5">{activeSuppliersCount} Aktif Bekerjasama</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#bdc9c6] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">local_shipping</span>
          </div>
          <div>
            <p className="text-[11px] text-[#6e7977] font-semibold uppercase tracking-wider">Total Pengiriman</p>
            <h3 className="text-2xl font-black text-blue-900">{totalOrdersSum} Order</h3>
            <p className="text-[10px] text-blue-700 font-bold mt-0.5">Pengadaan Barang</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#bdc9c6] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#005c55]/10 text-[#005c55] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">payments</span>
          </div>
          <div>
            <p className="text-[11px] text-[#6e7977] font-semibold uppercase tracking-wider">Nilai Pembelian</p>
            <h3 className="text-xl font-black text-[#005c55]">
              Rp {(totalPurchasesSum / 1000000).toFixed(1)}Jt
            </h3>
            <p className="text-[10px] text-teal-600 font-bold mt-0.5">Akumulasi Restock</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#bdc9c6] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">history_toggle_off</span>
          </div>
          <div>
            <p className="text-[11px] text-[#6e7977] font-semibold uppercase tracking-wider">Sistem Tempo</p>
            <h3 className="text-xl font-black text-amber-900">Tempo 30 H</h3>
            <p className="text-[10px] text-amber-700 font-bold mt-0.5">Fasilitas Kredit Vendor</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#bdc9c6] shadow-sm flex flex-col md:flex-row gap-3 justify-between items-center">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6e7977] text-xl">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari distributor, nama sales, atau barang..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl text-xs font-medium focus:outline-none focus:border-[#0f766e]"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#3e4947]">
            <span className="material-symbols-outlined text-base">category</span>
            <span className="hidden sm:inline">Kategori:</span>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl text-xs font-semibold text-[#181c1c] focus:outline-none focus:border-[#0f766e]"
          >
            <option value="ALL">Semua Spesialisasi Material</option>
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={selectedTerms}
            onChange={(e) => setSelectedTerms(e.target.value)}
            className="px-3 py-2 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl text-xs font-semibold text-[#181c1c] focus:outline-none focus:border-[#0f766e]"
          >
            <option value="ALL">Semua Syarat Bayar</option>
            <option value="Cash On Delivery">Cash On Delivery (COD)</option>
            <option value="Tempo 14 Hari">Tempo 14 Hari</option>
            <option value="Tempo 30 Hari">Tempo 30 Hari</option>
            <option value="Tempo 60 Hari">Tempo 60 Hari</option>
          </select>
        </div>
      </div>

      {/* Supplier Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuppliers.length === 0 ? (
          <div className="col-span-full py-12 bg-white rounded-2xl border border-dashed border-[#bdc9c6] text-center space-y-3">
            <span className="material-symbols-outlined text-5xl text-gray-300">travel_explore</span>
            <p className="text-sm font-bold text-[#3e4947]">Pemasok Tidak Ditemukan</p>
            <p className="text-xs text-[#6e7977]">
              Tidak ada data distributor yang cocok dengan kriteria pencarian anda.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('ALL');
                setSelectedTerms('ALL');
              }}
              className="px-4 py-2 bg-[#0f766e] text-white rounded-xl text-xs font-bold"
            >
              Reset Filter Pencarian
            </button>
          </div>
        ) : (
          filteredSuppliers.map((sup) => (
            <div
              key={sup.id}
              className="bg-white rounded-2xl border border-[#bdc9c6] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              <div>
                {/* Header Card */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
                        {sup.code}
                      </span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 bg-teal-50 text-[#0f766e] rounded border border-teal-200">
                        {sup.category}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-sm text-[#181c1c] group-hover:text-[#0f766e] transition-colors leading-tight">
                      {sup.name}
                    </h4>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      sup.status === 'Aktif'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {sup.status}
                  </span>
                </div>

                {/* Meta details */}
                <div className="mt-4 pt-3 border-t border-[#bdc9c6]/50 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-[#3e4947]">
                    <span className="text-[#6e7977]">Kontak Personal / Sales:</span>
                    <span className="font-extrabold text-[#181c1c] flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-teal-600">person</span>
                      {sup.contactPerson}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[#3e4947]">
                    <span className="text-[#6e7977]">No. HP / WA Sales:</span>
                    <a
                      href={`https://wa.me/${sup.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-teal-700 hover:underline flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-xs">chat</span>
                      {sup.phone}
                    </a>
                  </div>

                  <div className="flex justify-between items-center text-[#3e4947]">
                    <span className="text-[#6e7977]">Syarat Pembayaran:</span>
                    <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {sup.paymentTerms}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[#3e4947] text-[11px]">
                    <span className="text-[#6e7977]">Histori Restock:</span>
                    <span className="font-extrabold text-[#005c55]">
                      {sup.totalOrders} Restock (Rp {(sup.totalPurchases / 1000000).toFixed(1)}Jt)
                    </span>
                  </div>

                  <div className="text-[11px] text-[#6e7977] line-clamp-1 pt-1 italic">
                    <span className="material-symbols-outlined text-xs align-middle mr-1">location_on</span>
                    {sup.address}
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="pt-3 border-t border-[#bdc9c6]/50 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedSupplierForDetail(sup)}
                  className="px-3 py-1.5 bg-[#f1f4f3] hover:bg-[#e0e3e1] text-[#3e4947] font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">visibility</span>
                  <span>Detail</span>
                </button>

                <div className="flex items-center gap-2">
                  {onOpenStockInWithSupplier && (
                    <button
                      onClick={() => onOpenStockInWithSupplier(sup.name)}
                      className="px-3 py-1.5 bg-[#0f766e] hover:bg-[#005c55] text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-xs transition-colors"
                      title="Buat Order Pasokan Stok Baru"
                    >
                      <span className="material-symbols-outlined text-sm">add_box</span>
                      <span>Order Stok</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleOpenEditModal(sup)}
                    className="p-1.5 text-[#0f766e] hover:bg-[#f1f4f3] rounded-lg transition-colors"
                    title="Edit Distributor"
                  >
                    <span className="material-symbols-outlined text-lg">edit</span>
                  </button>

                  <button
                    onClick={() => setDeletingSupplier(sup)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Hapus Distributor"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Add / Edit Supplier */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-[#bdc9c6]">
            <div className="px-6 py-4 bg-[#0f766e] text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined">
                  {editingSupplier ? 'edit_location' : 'domain_add'}
                </span>
                <h3 className="font-bold text-lg">
                  {editingSupplier ? 'Edit Data Pemasok' : 'Tambah Pemasok Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#3e4947] uppercase mb-1">
                    Kode Pemasok
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
                  <label className="block text-xs font-semibold text-[#3e4947] uppercase mb-1">
                    Nama PT / Distributor / Toko *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: PT Semen Indonesia Tbk"
                    className="w-full px-4 py-2.5 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl focus:border-[#0f766e] focus:outline-none text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#3e4947] uppercase mb-1">
                    Nama Kontak Sales / Admin *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="Contoh: Pak Aris Setiawan"
                    className="w-full px-4 py-2.5 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl focus:border-[#0f766e] focus:outline-none text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3e4947] uppercase mb-1">
                    Spesialis Kategori Material
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Semen / Cat / Perkakas / Listrik / Pipa"
                    className="w-full px-4 py-2.5 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl focus:border-[#0f766e] focus:outline-none text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#3e4947] uppercase mb-1">
                    No. HP / WA Sales *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="021-5559900 / 0812-9988-77"
                    className="w-full px-4 py-2.5 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl focus:border-[#0f766e] focus:outline-none text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3e4947] uppercase mb-1">
                    Email Distributor
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="sales@vendor.com"
                    className="w-full px-4 py-2.5 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl focus:border-[#0f766e] focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#3e4947] uppercase mb-1">
                    Syarat Pembayaran (Payment Terms)
                  </label>
                  <select
                    value={formData.paymentTerms}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentTerms: e.target.value as Supplier['paymentTerms'],
                      })
                    }
                    className="w-full px-4 py-2.5 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl focus:border-[#0f766e] focus:outline-none text-xs font-semibold"
                  >
                    <option value="Cash On Delivery">Cash On Delivery (COD)</option>
                    <option value="Tempo 14 Hari">Tempo 14 Hari</option>
                    <option value="Tempo 30 Hari">Tempo 30 Hari</option>
                    <option value="Tempo 60 Hari">Tempo 60 Hari</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3e4947] uppercase mb-1">
                    Status Kerjasama
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as Supplier['status'],
                      })
                    }
                    className="w-full px-4 py-2.5 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl focus:border-[#0f766e] focus:outline-none text-xs font-semibold"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3e4947] uppercase mb-1">
                  Alamat Kantor / Gudang Distributor
                </label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Kawasan Industri Pulogadung, Jakarta Timur"
                  className="w-full px-4 py-2.5 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl focus:border-[#0f766e] focus:outline-none text-xs"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-[#e0e3e1] text-[#3e4947] font-semibold rounded-xl hover:bg-[#bdc9c6] text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#0f766e] text-white font-bold rounded-xl hover:bg-[#005c55] shadow-lg text-xs"
                >
                  {editingSupplier ? 'Simpan Perubahan' : 'Tambah Pemasok'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail Supplier */}
      {selectedSupplierForDetail && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-[#bdc9c6] p-6 space-y-5">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 rounded">
                  {selectedSupplierForDetail.code}
                </span>
                <h3 className="font-black text-base text-[#181c1c] mt-1">
                  {selectedSupplierForDetail.name}
                </h3>
                <p className="text-xs text-[#0f766e] font-bold">
                  Kategori: {selectedSupplierForDetail.category}
                </p>
              </div>
              <button
                onClick={() => setSelectedSupplierForDetail(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#f1f4f3] rounded-xl flex justify-between items-center">
                <span className="text-[#6e7977] font-medium">Sales Executive</span>
                <span className="font-bold text-[#181c1c]">{selectedSupplierForDetail.contactPerson}</span>
              </div>

              <div className="p-3 bg-[#f1f4f3] rounded-xl flex justify-between items-center">
                <span className="text-[#6e7977] font-medium">No. WhatsApp / Telepon</span>
                <a
                  href={`https://wa.me/${selectedSupplierForDetail.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-teal-700 hover:underline"
                >
                  {selectedSupplierForDetail.phone}
                </a>
              </div>

              <div className="p-3 bg-[#f1f4f3] rounded-xl flex justify-between items-center">
                <span className="text-[#6e7977] font-medium">Syarat Pembayaran</span>
                <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  {selectedSupplierForDetail.paymentTerms}
                </span>
              </div>

              <div className="p-3 bg-[#f1f4f3] rounded-xl flex justify-between items-center">
                <span className="text-[#6e7977] font-medium">Total Pembelian Kumulatif</span>
                <span className="font-extrabold text-[#005c55]">
                  Rp {selectedSupplierForDetail.totalPurchases.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="p-3 bg-[#f1f4f3] rounded-xl space-y-1">
                <span className="text-[#6e7977] font-medium block">Alamat Gudang / Kantor</span>
                <p className="font-semibold text-[#181c1c]">{selectedSupplierForDetail.address}</p>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  const s = selectedSupplierForDetail;
                  setSelectedSupplierForDetail(null);
                  handleOpenEditModal(s);
                }}
                className="flex-1 py-2.5 bg-[#0f766e] text-white font-bold rounded-xl text-xs hover:bg-[#005c55]"
              >
                Edit Data Vendor
              </button>
              <button
                onClick={() => setSelectedSupplierForDetail(null)}
                className="py-2.5 px-4 bg-gray-200 text-gray-700 font-bold rounded-xl text-xs hover:bg-gray-300"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Delete Supplier */}
      {deletingSupplier && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 text-center space-y-4 border border-[#bdc9c6]">
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-3xl">warning</span>
            </div>

            <div>
              <h3 className="font-black text-lg text-slate-900">Hapus Pemasok / Distributor?</h3>
              <p className="text-xs text-slate-600 mt-1">
                Apakah Anda yakin ingin menghapus data pemasok <strong>{deletingSupplier.name}</strong> ({deletingSupplier.code})? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeletingSupplier(null)}
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
