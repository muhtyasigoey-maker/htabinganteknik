import React, { useState } from 'react';
import { Customer, TabType } from '../types';

interface CustomersViewProps {
  customers: Customer[];
  onAddCustomer: (customer: Customer) => void;
  onSelectCustomerForPos?: (customer: Customer) => void;
  onNavigate: (tab: TabType) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  onAddCustomer,
  onSelectCustomerForPos,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Customer Form State
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('Pelanggan Langsung');
  const [newPhone, setNewPhone] = useState('');

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone && c.phone.includes(searchTerm));
    const matchesType =
      selectedType === 'Semua' || c.type.toLowerCase().includes(selectedType.toLowerCase());
    return matchesSearch && matchesType;
  });

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newCust: Customer = {
      id: 'c_' + Date.now(),
      name: newName,
      type: newType,
      phone: newPhone || '-',
    };

    onAddCustomer(newCust);
    setNewName('');
    setNewPhone('');
    setIsModalOpen(false);
  };

  const handleStartPosForCustomer = (cust: Customer) => {
    if (onSelectCustomerForPos) {
      onSelectCustomerForPos(cust);
    }
    onNavigate('pos');
  };

  return (
    <div className="pt-20 pb-32 px-4 md:px-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#005c55] mb-1">
            Manajemen Kontak & Mitra
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#181c1c]">
            Daftar Pelanggan & Kontraktor
          </h1>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#005c55] hover:bg-[#0f766e] text-white px-5 py-3 rounded-2xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">person_add</span>
          <span>Tambah Pelanggan Baru</span>
        </button>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#bdc9c6] shadow-xs">
          <p className="text-xs font-semibold text-[#6e7977] mb-1">Total Pelanggan</p>
          <p className="text-2xl font-extrabold text-[#005c55]">{customers.length}</p>
          <p className="text-[10px] text-[#3e4947] mt-1">Terdaftar dalam database</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#bdc9c6] shadow-xs">
          <p className="text-xs font-semibold text-[#6e7977] mb-1">Kontraktor & B2B</p>
          <p className="text-2xl font-extrabold text-[#0f766e]">
            {customers.filter((c) => c.type.includes('Kontraktor') || c.type.includes('B2B')).length}
          </p>
          <p className="text-[10px] text-[#0f766e] mt-1">Mitra proyek utama</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#bdc9c6] shadow-xs">
          <p className="text-xs font-semibold text-[#6e7977] mb-1">Grosir / Toko</p>
          <p className="text-2xl font-extrabold text-[#006f64]">
            {customers.filter((c) => c.type.includes('Grosir')).length}
          </p>
          <p className="text-[10px] text-[#006f64] mt-1">Pembelian volume besar</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#bdc9c6] shadow-xs">
          <p className="text-xs font-semibold text-[#6e7977] mb-1">Eceran (Umum)</p>
          <p className="text-2xl font-extrabold text-[#7f4025]">
            {customers.filter((c) => c.type.includes('Langsung')).length}
          </p>
          <p className="text-[10px] text-[#7f4025] mt-1">Pelanggan harian</p>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#bdc9c6] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3.5 top-3 text-[#6e7977]">
            search
          </span>
          <input
            type="text"
            placeholder="Cari nama atau nomor HP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl text-xs font-medium focus:outline-none focus:border-[#005c55]"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['Semua', 'Langsung', 'Kontraktor', 'Grosir', 'B2B'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedType === type
                  ? 'bg-[#005c55] text-white shadow-xs'
                  : 'bg-[#f1f4f3] text-[#3e4947] hover:bg-[#e0e3e1]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Customers Table / Cards */}
      <div className="bg-white rounded-2xl border border-[#bdc9c6] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#bdc9c6] bg-[#f1f4f3] flex items-center justify-between">
          <span className="text-xs font-bold text-[#181c1c]">
            Menampilkan {filteredCustomers.length} dari {customers.length} Pelanggan
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[#6e7977] text-[11px] font-bold uppercase tracking-wider border-b border-[#bdc9c6]">
                <th className="px-6 py-3.5">Pelanggan</th>
                <th className="px-6 py-3.5">Tipe / Kategori</th>
                <th className="px-6 py-3.5">Nomor Telepon</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Aksi Kasir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bdc9c6]/40 text-xs">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-[#6e7977]">
                    <span className="material-symbols-outlined text-4xl block mb-2 opacity-50">
                      person_off
                    </span>
                    Tidak ada pelanggan yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-[#f1f4f3]/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#6df5e1] text-[#006f64] font-bold text-xs flex items-center justify-center shrink-0">
                          {cust.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-[#181c1c] text-sm">{cust.name}</p>
                          <p className="text-[10px] text-[#6e7977]">ID: {cust.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-[#e0e3e1] text-[#005c55] font-bold px-3 py-1 rounded-full text-[11px]">
                        {cust.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#3e4947] font-medium">
                      {cust.phone ? (
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm text-[#005c55]">call</span>
                          <span>{cust.phone}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-normal">Tidak ada telepon</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                        <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full" /> Aktif
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleStartPosForCustomer(cust)}
                        className="bg-[#005c55] hover:bg-[#0f766e] text-white px-3.5 py-2 rounded-xl font-bold text-xs inline-flex items-center gap-1.5 transition-all active:scale-95 shadow-xs"
                      >
                        <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                        <span>Mulai Transaksi POS</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#bdc9c6] overflow-hidden">
            <div className="px-6 py-4 bg-[#005c55] text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined">person_add</span>
                <h3 className="font-bold text-base">Tambah Pelanggan Baru</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#3e4947] uppercase mb-1">
                  Nama Pelanggan / Toko / Perusahaan *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Contoh: Pak Budi Kontraktor / UD Jaya"
                  className="w-full px-4 py-3 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl text-xs font-medium focus:border-[#005c55] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3e4947] uppercase mb-1">
                  Kategori Pelanggan
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full px-4 py-3 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl text-xs font-medium focus:border-[#005c55] focus:outline-none"
                >
                  <option value="Pelanggan Langsung">Pelanggan Langsung</option>
                  <option value="Kontraktor Perorangan">Kontraktor Perorangan</option>
                  <option value="Mitra Toko / Grosir">Mitra Toko / Grosir</option>
                  <option value="Perusahaan B2B">Perusahaan B2B</option>
                  <option value="Tukang Langganan">Tukang Langganan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3e4947] uppercase mb-1">
                  Nomor HP / WhatsApp (Opsional)
                </label>
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="0812-3456-7890"
                  className="w-full px-4 py-3 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl text-xs font-medium focus:border-[#005c55] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-[#e0e3e1] text-[#3e4947] font-bold text-xs rounded-xl hover:bg-[#bdc9c6]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#005c55] text-white font-bold text-xs rounded-xl hover:bg-[#0f766e] shadow-md"
                >
                  Simpan Pelanggan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
