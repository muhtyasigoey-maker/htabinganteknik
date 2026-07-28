import React, { useState } from 'react';
import { Customer } from '../types';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  selectedCustomer: Customer;
  onSelectCustomer: (customer: Customer) => void;
  onAddCustomer: (customer: Customer) => void;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({
  isOpen,
  onClose,
  customers,
  selectedCustomer,
  onSelectCustomer,
  onAddCustomer,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('Pelanggan Langsung');
  const [newPhone, setNewPhone] = useState('');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const newCust: Customer = {
      id: 'c_' + Date.now(),
      name: newName,
      type: newType,
      phone: newPhone,
    };
    onAddCustomer(newCust);
    onSelectCustomer(newCust);
    setNewName('');
    setNewPhone('');
    setIsAdding(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#2d3130] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-[#bdc9c6]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#f1f4f3] border-b border-[#bdc9c6] flex justify-between items-center">
          <div className="flex items-center gap-2 text-[#005c55]">
            <span className="material-symbols-outlined">person_search</span>
            <h3 className="font-bold text-lg">Pilih Pelanggan</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#6e7977] hover:bg-[#e0e3e1] transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
          {!isAdding ? (
            <>
              <div className="space-y-2">
                {customers.map((c) => {
                  const isSelected = c.id === selectedCustomer.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        onSelectCustomer(c);
                        onClose();
                      }}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-[#005c55] bg-[#6df5e1]/20 text-[#005c55] font-semibold'
                          : 'border-[#bdc9c6] hover:bg-[#f1f4f3] text-[#181c1c]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#6df5e1] text-[#006f64] flex items-center justify-center font-bold">
                          <span className="material-symbols-outlined filled">person</span>
                        </div>
                        <div>
                          <p className="text-base">{c.name}</p>
                          <p className="text-xs text-[#3e4947]">{c.type} {c.phone ? `• ${c.phone}` : ''}</p>
                        </div>
                      </div>
                      {isSelected && (
                        <span className="material-symbols-outlined text-[#005c55]">check_circle</span>
                      )}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setIsAdding(true)}
                className="w-full py-3 bg-[#0f766e] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#005c55] active:scale-95 transition-all shadow-md mt-4"
              >
                <span className="material-symbols-outlined">person_add</span>
                <span>Tambah Pelanggan Baru</span>
              </button>
            </>
          ) : (
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#3e4947] uppercase mb-1">
                  Nama Pelanggan / Toko
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Contoh: CV Bangunan Perkasa"
                  className="w-full px-4 py-3 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl focus:border-[#005c55] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3e4947] uppercase mb-1">
                  Tipe Pelanggan
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full px-4 py-3 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl focus:border-[#005c55] focus:outline-none"
                >
                  <option value="Pelanggan Langsung">Pelanggan Langsung</option>
                  <option value="Kontraktor Perorangan">Kontraktor Perorangan</option>
                  <option value="Mitra Toko / Grosir">Mitra Toko / Grosir</option>
                  <option value="Perusahaan B2B">Perusahaan B2B</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3e4947] uppercase mb-1">
                  Nomor HP / Telepon (Opsional)
                </label>
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="0812-xxxx-xxxx"
                  className="w-full px-4 py-3 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl focus:border-[#005c55] focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-3 bg-[#e0e3e1] text-[#3e4947] font-semibold rounded-xl hover:bg-[#bdc9c6]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#005c55] text-white font-semibold rounded-xl hover:bg-[#0f766e] shadow-md"
                >
                  Simpan
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
