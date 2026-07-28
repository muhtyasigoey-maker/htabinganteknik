import React, { useState } from 'react';
import { StaffMember, TabType } from '../types';

interface StaffViewProps {
  staffList: StaffMember[];
  onAddStaff: (staff: StaffMember) => void;
  onUpdateStaff: (staff: StaffMember) => void;
  onDeleteStaff?: (id: string) => void;
  onNavigate: (tab: TabType) => void;
}

export const StaffView: React.FC<StaffViewProps> = ({
  staffList,
  onAddStaff,
  onUpdateStaff,
  onDeleteStaff,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [selectedStaffForDetail, setSelectedStaffForDetail] = useState<StaffMember | null>(null);
  const [deletingStaff, setDeletingStaff] = useState<StaffMember | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Kasir' as StaffMember['role'],
    shift: 'Pagi (08:00 - 16:00)' as StaffMember['shift'],
    status: 'Aktif' as StaffMember['status'],
    pin: '',
  });

  // Open modal for adding
  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'Kasir',
      shift: 'Pagi (08:00 - 16:00)',
      status: 'Aktif',
      pin: Math.floor(1000 + Math.random() * 9000).toString(),
    });
    setEditingStaff(null);
    setIsAddModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEditModal = (staff: StaffMember) => {
    setFormData({
      name: staff.name,
      email: staff.email,
      phone: staff.phone,
      role: staff.role,
      shift: staff.shift,
      status: staff.status,
      pin: staff.pin || '1234',
    });
    setEditingStaff(staff);
    setIsAddModalOpen(true);
  };

  // Save staff (create or update)
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingStaff) {
      const updated: StaffMember = {
        ...editingStaff,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        role: formData.role,
        shift: formData.shift,
        status: formData.status,
        pin: formData.pin.trim() || '1234',
      };
      onUpdateStaff(updated);
    } else {
      const initials = formData.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

      const newStaff: StaffMember = {
        id: 'st_' + Date.now(),
        name: formData.name.trim(),
        email: formData.email.trim() || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@tabingan.com`,
        phone: formData.phone.trim(),
        role: formData.role,
        shift: formData.shift,
        status: formData.status,
        avatar: initials || 'ST',
        joinDate: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
        totalTransactions: 0,
        pin: formData.pin.trim() || '1234',
      };
      onAddStaff(newStaff);
    }

    setIsAddModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (deletingStaff && onDeleteStaff) {
      onDeleteStaff(deletingStaff.id);
      setDeletingStaff(null);
    }
  };

  // Toggle status directly
  const handleToggleStatus = (staff: StaffMember) => {
    const nextStatus: StaffMember['status'] =
      staff.status === 'Aktif' ? 'Cuti' : staff.status === 'Cuti' ? 'Nonaktif' : 'Aktif';
    
    onUpdateStaff({
      ...staff,
      status: nextStatus,
    });
  };

  // Filter staff
  const filteredStaff = staffList.filter((st) => {
    const matchesSearch =
      st.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.phone.includes(searchTerm) ||
      st.role.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = selectedRole === 'ALL' || st.role === selectedRole;
    const matchesStatus = selectedStatus === 'ALL' || st.status === selectedStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Calculate statistics
  const totalStaff = staffList.length;
  const activeStaff = staffList.filter((s) => s.status === 'Aktif').length;
  const cashiersCount = staffList.filter((s) => s.role === 'Kasir' && s.status === 'Aktif').length;
  const totalTrxCount = staffList.reduce((sum, s) => sum + (s.totalTransactions || 0), 0);

  return (
    <div className="pt-20 pb-24 px-4 md:px-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-[#005c55] text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 opacity-10 pointer-events-none">
          <span className="material-symbols-outlined text-[240px]">badge</span>
        </div>

        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2 text-[#a3faef] text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-sm">manage_accounts</span>
            <span>MODUL KARYAWAN & HAK AKSES POS</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black">Manajemen Staff & Kasir</h2>
          <p className="text-xs md:text-sm text-[#a3faef]/90 max-w-xl">
            Kelola data staf operasional toko, pembagian shift kasir, pin transaksi, dan pemantauan performa pelayanan Toko H. Tabingan Teknik.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 relative z-10 w-full md:w-auto">
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Dashboard</span>
          </button>
          <button
            onClick={handleOpenAddModal}
            className="px-5 py-2.5 bg-[#6df5e1] hover:bg-[#a3faef] text-[#004f49] rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            <span>+ Tambah Staff Baru</span>
          </button>
        </div>
      </div>

      {/* Quick Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#bdc9c6] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#005c55]/10 text-[#005c55] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">badge</span>
          </div>
          <div>
            <p className="text-[11px] text-[#6e7977] font-semibold uppercase tracking-wider">Total Staff</p>
            <h3 className="text-2xl font-black text-[#181c1c]">{totalStaff} Orang</h3>
            <p className="text-[10px] text-emerald-600 font-bold mt-0.5">Terdaftar di Sistem</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#bdc9c6] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">check_circle</span>
          </div>
          <div>
            <p className="text-[11px] text-[#6e7977] font-semibold uppercase tracking-wider">Status Aktif</p>
            <h3 className="text-2xl font-black text-emerald-700">{activeStaff} Staff</h3>
            <p className="text-[10px] text-[#6e7977] font-medium mt-0.5">Siap Bertugas</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#bdc9c6] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-[#005c55] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">point_of_sale</span>
          </div>
          <div>
            <p className="text-[11px] text-[#6e7977] font-semibold uppercase tracking-wider">Kasir Aktif</p>
            <h3 className="text-2xl font-black text-[#005c55]">{cashiersCount} Kasir</h3>
            <p className="text-[10px] text-teal-600 font-bold mt-0.5">Penjualan POS</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#bdc9c6] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">receipt_long</span>
          </div>
          <div>
            <p className="text-[11px] text-[#6e7977] font-semibold uppercase tracking-wider">Total Layanan</p>
            <h3 className="text-2xl font-black text-[#181c1c]">{totalTrxCount} Trx</h3>
            <p className="text-[10px] text-amber-600 font-bold mt-0.5">Akumulasi Penjualan</p>
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
            placeholder="Cari nama staff, email, role, atau No HP..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl text-xs font-medium focus:outline-none focus:border-[#005c55]"
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
            <span className="material-symbols-outlined text-base">filter_list</span>
            <span className="hidden sm:inline">Role:</span>
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-2 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl text-xs font-semibold text-[#181c1c] focus:outline-none focus:border-[#005c55]"
          >
            <option value="ALL">Semua Jabatan / Role</option>
            <option value="Kasir">Kasir POS</option>
            <option value="Admin POS">Admin POS</option>
            <option value="Kepala Toko">Kepala Toko</option>
            <option value="Staf Gudang">Staf Gudang</option>
            <option value="Supervisor">Supervisor</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl text-xs font-semibold text-[#181c1c] focus:outline-none focus:border-[#005c55]"
          >
            <option value="ALL">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Cuti">Cuti</option>
            <option value="Nonaktif">Nonaktif</option>
          </select>
        </div>
      </div>

      {/* Staff Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.length === 0 ? (
          <div className="col-span-full py-12 bg-white rounded-2xl border border-dashed border-[#bdc9c6] text-center space-y-3">
            <span className="material-symbols-outlined text-5xl text-gray-300">person_search</span>
            <p className="text-sm font-bold text-[#3e4947]">Tidak Ada Staff yang Ditemukan</p>
            <p className="text-xs text-[#6e7977]">Coba ubah kata kunci pencarian atau filter status anda.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedRole('ALL');
                setSelectedStatus('ALL');
              }}
              className="px-4 py-2 bg-[#005c55] text-white rounded-xl text-xs font-bold"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          filteredStaff.map((staff) => (
            <div
              key={staff.id}
              className="bg-white rounded-2xl border border-[#bdc9c6] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              <div>
                {/* Staff Header Card */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#005c55] text-[#a3faef] font-black text-sm flex items-center justify-center shrink-0 shadow-xs border border-[#6df5e1]/30">
                      {staff.avatar}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-[#181c1c] group-hover:text-[#005c55] transition-colors">
                        {staff.name}
                      </h4>
                      <p className="text-xs text-[#6e7977] font-medium">{staff.email}</p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <button
                    onClick={() => handleToggleStatus(staff)}
                    title="Klik untuk mengubah status"
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all ${
                      staff.status === 'Aktif'
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : staff.status === 'Cuti'
                        ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        staff.status === 'Aktif'
                          ? 'bg-emerald-600'
                          : staff.status === 'Cuti'
                          ? 'bg-amber-600'
                          : 'bg-rose-600'
                      }`}
                    />
                    {staff.status}
                  </button>
                </div>

                {/* Details Meta */}
                <div className="mt-4 pt-3 border-t border-[#bdc9c6]/50 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-[#3e4947]">
                    <span className="text-[#6e7977]">Jabatan / Role:</span>
                    <span className="font-extrabold px-2 py-0.5 bg-[#f1f4f3] rounded-md text-[#005c55]">
                      {staff.role}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[#3e4947]">
                    <span className="text-[#6e7977]">Shift Kerja:</span>
                    <span className="font-bold text-[#181c1c] flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-teal-600">schedule</span>
                      {staff.shift}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[#3e4947]">
                    <span className="text-[#6e7977]">No. Telepon / WA:</span>
                    <a
                      href={`https://wa.me/${staff.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-teal-700 hover:underline flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-xs">call</span>
                      {staff.phone}
                    </a>
                  </div>

                  <div className="flex justify-between items-center text-[#3e4947]">
                    <span className="text-[#6e7977]">PIN Kasir POS:</span>
                    <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px] border border-slate-200">
                      •••• ({staff.pin || '1234'})
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[#3e4947] text-[11px]">
                    <span className="text-[#6e7977]">Total Trx Dilayani:</span>
                    <span className="font-extrabold text-[#005c55]">
                      {staff.totalTransactions || 0} Trx
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="pt-3 border-t border-[#bdc9c6]/50 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedStaffForDetail(staff)}
                  className="px-3 py-1.5 bg-[#f1f4f3] hover:bg-[#e0e3e1] text-[#3e4947] font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">info</span>
                  <span>Detail</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(staff)}
                    className="p-1.5 text-[#005c55] hover:bg-[#f1f4f3] rounded-lg transition-colors"
                    title="Edit Data Staff"
                  >
                    <span className="material-symbols-outlined text-lg">edit</span>
                  </button>
                  <button
                    onClick={() => handleToggleStatus(staff)}
                    className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    title="Ubah Status Shift/Aktif"
                  >
                    <span className="material-symbols-outlined text-lg">sync_alt</span>
                  </button>
                  <button
                    onClick={() => setDeletingStaff(staff)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Hapus Staff"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Add / Edit Staff */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-[#bdc9c6]">
            <div className="px-6 py-4 bg-[#005c55] text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined">
                  {editingStaff ? 'manage_accounts' : 'person_add'}
                </span>
                <h3 className="font-bold text-lg">
                  {editingStaff ? 'Edit Data Staff' : 'Tambah Staff Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-[#3e4947] uppercase mb-1">
                  Nama Lengkap Staff *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Budi Kurniawan"
                  className="w-full px-4 py-3 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl focus:border-[#005c55] focus:outline-none text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#3e4947] uppercase mb-1">
                    Jabatan / Role *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value as StaffMember['role'] })
                    }
                    className="w-full px-4 py-3 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl focus:border-[#005c55] focus:outline-none text-xs font-semibold"
                  >
                    <option value="Kasir">Kasir POS</option>
                    <option value="Admin POS">Admin POS</option>
                    <option value="Kepala Toko">Kepala Toko</option>
                    <option value="Staf Gudang">Staf Gudang</option>
                    <option value="Supervisor">Supervisor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3e4947] uppercase mb-1">
                    Shift Kerja *
                  </label>
                  <select
                    value={formData.shift}
                    onChange={(e) =>
                      setFormData({ ...formData, shift: e.target.value as StaffMember['shift'] })
                    }
                    className="w-full px-4 py-3 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl focus:border-[#005c55] focus:outline-none text-xs font-semibold"
                  >
                    <option value="Pagi (08:00 - 16:00)">Pagi (08:00 - 16:00)</option>
                    <option value="Sore (16:00 - 22:00)">Sore (16:00 - 22:00)</option>
                    <option value="Full Time">Full Time</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#3e4947] uppercase mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="budi@tabingan.com"
                    className="w-full px-4 py-3 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl focus:border-[#005c55] focus:outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3e4947] uppercase mb-1">
                    No. HP / WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0812-3456-7890"
                    className="w-full px-4 py-3 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl focus:border-[#005c55] focus:outline-none text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#3e4947] uppercase mb-1">
                    PIN Transaksi POS (4 Digit)
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={formData.pin}
                    onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                    placeholder="1234"
                    className="w-full px-4 py-3 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl focus:border-[#005c55] focus:outline-none text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3e4947] uppercase mb-1">
                    Status Keaktifan
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as StaffMember['status'] })
                    }
                    className="w-full px-4 py-3 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl focus:border-[#005c55] focus:outline-none text-xs font-semibold"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Cuti">Cuti</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 bg-[#e0e3e1] text-[#3e4947] font-semibold rounded-xl hover:bg-[#bdc9c6] text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#005c55] text-white font-bold rounded-xl hover:bg-[#0f766e] shadow-lg text-xs"
                >
                  {editingStaff ? 'Simpan Perubahan' : 'Tambah Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail Staff */}
      {selectedStaffForDetail && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-[#bdc9c6] p-6 space-y-5">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-[#005c55] text-[#a3faef] font-black text-lg flex items-center justify-center">
                  {selectedStaffForDetail.avatar}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#181c1c]">{selectedStaffForDetail.name}</h3>
                  <p className="text-xs text-[#005c55] font-bold">{selectedStaffForDetail.role}</p>
                  <p className="text-[11px] text-[#6e7977]">{selectedStaffForDetail.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStaffForDetail(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#f1f4f3] rounded-xl flex justify-between items-center">
                <span className="text-[#6e7977] font-medium">Status Pekerjaan</span>
                <span className="font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full text-[11px]">
                  {selectedStaffForDetail.status}
                </span>
              </div>

              <div className="p-3 bg-[#f1f4f3] rounded-xl flex justify-between items-center">
                <span className="text-[#6e7977] font-medium">Shift Operasional</span>
                <span className="font-bold text-[#181c1c]">{selectedStaffForDetail.shift}</span>
              </div>

              <div className="p-3 bg-[#f1f4f3] rounded-xl flex justify-between items-center">
                <span className="text-[#6e7977] font-medium">Tanggal Bergabung</span>
                <span className="font-bold text-[#181c1c]">{selectedStaffForDetail.joinDate}</span>
              </div>

              <div className="p-3 bg-[#f1f4f3] rounded-xl flex justify-between items-center">
                <span className="text-[#6e7977] font-medium">No. Telepon Kontak</span>
                <span className="font-bold text-teal-700">{selectedStaffForDetail.phone}</span>
              </div>

              <div className="p-3 bg-[#f1f4f3] rounded-xl flex justify-between items-center">
                <span className="text-[#6e7977] font-medium">Sertifikasi & Otentikasi</span>
                <span className="font-mono font-bold text-slate-800">PIN: {selectedStaffForDetail.pin || '1234'}</span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  const st = selectedStaffForDetail;
                  setSelectedStaffForDetail(null);
                  handleOpenEditModal(st);
                }}
                className="flex-1 py-2.5 bg-[#005c55] text-white font-bold rounded-xl text-xs hover:bg-[#0f766e]"
              >
                Edit Profil Staff
              </button>
              <button
                onClick={() => setSelectedStaffForDetail(null)}
                className="py-2.5 px-4 bg-gray-200 text-gray-700 font-bold rounded-xl text-xs hover:bg-gray-300"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Delete Staff */}
      {deletingStaff && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 text-center space-y-4 border border-[#bdc9c6]">
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-3xl">warning</span>
            </div>

            <div>
              <h3 className="font-black text-lg text-slate-900">Hapus Data Staff / Kasir?</h3>
              <p className="text-xs text-slate-600 mt-1">
                Apakah Anda yakin ingin menghapus data <strong>{deletingStaff.name}</strong> ({deletingStaff.role})? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeletingStaff(null)}
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
