import React, { useState } from 'react';

export const ReportsView: React.FC = () => {
  const [period, setPeriod] = useState('Bulan Ini');

  const topProducts = [
    { name: 'Semen Tiga Roda 50kg', category: 'Bangunan', sold: 420, revenue: 35700000, margin: '12%' },
    { name: 'Kabel Supreme NYM 2x1.5mm (100m)', category: 'Listrik', sold: 85, revenue: 55250000, margin: '22%' },
    { name: 'Pipa PVC Wavin 3/4 Inch (4m)', category: 'Plumbing', sold: 310, revenue: 13950000, margin: '18%' },
    { name: 'Palu Tekiro 16oz Pro', category: 'Perkakas', sold: 140, revenue: 11900000, margin: '28%' },
    { name: 'Cat Dulux Weathershield 2.5L', category: 'Cat & Aksesoris', sold: 65, revenue: 15925000, margin: '20%' },
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleExportCSV = () => {
    const csvHeader = "Nama Produk,Kategori,Qty Terjual,Total Omset,Margin\n";
    const csvRows = topProducts
      .map(p => `"${p.name}","${p.category}",${p.sold},${p.revenue},"${p.margin}"`)
      .join("\n");
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Laporan_Penjualan_Tabingan_${period.replace(' ', '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="pt-20 px-4 md:px-8 pb-32 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#bdc9c6] shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-[#181c1c]">Laporan & Analitik</h1>
          <p className="text-xs text-[#6e7977]">Rekapitulasi penjualan dan performa bisnis toko</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2.5 bg-[#f1f4f3] border border-[#bdc9c6] rounded-xl text-xs font-bold text-[#005c55] focus:outline-none"
          >
            <option>Hari Ini</option>
            <option>Minggu Ini</option>
            <option>Bulan Ini</option>
            <option>Tahun Ini</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-[#005c55] text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-[#0f766e] active:scale-95 transition-all shadow-md"
          >
            <span className="material-symbols-outlined text-base">download</span>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Key Metrics Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#bdc9c6] shadow-sm space-y-2">
          <p className="text-[11px] font-bold text-[#6e7977] uppercase">Total Omset Penjualan</p>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-black text-[#005c55]">Rp 184.25M</h3>
            <span className="text-xs font-bold text-[#006f64] bg-[#6df5e1]/40 px-2 py-0.5 rounded-full">
              +14.2%
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#bdc9c6] shadow-sm space-y-2">
          <p className="text-[11px] font-bold text-[#6e7977] uppercase">Total Transaksi</p>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-black text-[#181c1c]">842 Trx</h3>
            <span className="text-xs font-bold text-[#006f64] bg-[#6df5e1]/40 px-2 py-0.5 rounded-full">
              +8.5%
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#bdc9c6] shadow-sm space-y-2">
          <p className="text-[11px] font-bold text-[#6e7977] uppercase">Rata-rata Keranjang (AOV)</p>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-black text-[#181c1c]">Rp 218.8rb</h3>
            <span className="text-xs font-bold text-[#006f64] bg-[#6df5e1]/40 px-2 py-0.5 rounded-full">
              +3.1%
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#bdc9c6] shadow-sm space-y-2">
          <p className="text-[11px] font-bold text-[#6e7977] uppercase">Margin Laba Bersih</p>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-black text-[#005c55]">18.4%</h3>
            <span className="text-xs font-bold text-[#006f64] bg-[#6df5e1]/40 px-2 py-0.5 rounded-full">
              +1.2%
            </span>
          </div>
        </div>
      </div>

      {/* Category Sales Distribution */}
      <div className="bg-white p-6 rounded-2xl border border-[#bdc9c6] shadow-sm space-y-4">
        <h3 className="font-bold text-base text-[#181c1c]">Kontribusi Penjualan per Kategori</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span>Bangunan & Semen</span>
              <span className="text-[#005c55]">45% (Rp 82.9M)</span>
            </div>
            <div className="w-full h-3 bg-[#e5e9e7] rounded-full overflow-hidden">
              <div className="bg-[#005c55] h-full w-[45%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span>Listrik & Kabel</span>
              <span className="text-[#0f766e]">25% (Rp 46.0M)</span>
            </div>
            <div className="w-full h-3 bg-[#e5e9e7] rounded-full overflow-hidden">
              <div className="bg-[#0f766e] h-full w-[25%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span>Plumbing & Pipa</span>
              <span className="text-[#006f64]">15% (Rp 27.6M)</span>
            </div>
            <div className="w-full h-3 bg-[#e5e9e7] rounded-full overflow-hidden">
              <div className="bg-[#006f64] h-full w-[15%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span>Perkakas & Alat</span>
              <span className="text-[#7f4025]">10% (Rp 18.4M)</span>
            </div>
            <div className="w-full h-3 bg-[#e5e9e7] rounded-full overflow-hidden">
              <div className="bg-[#7f4025] h-full w-[10%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span>Cat & Aksesoris</span>
              <span className="text-[#9c573a]">5% (Rp 9.2M)</span>
            </div>
            <div className="w-full h-3 bg-[#e5e9e7] rounded-full overflow-hidden">
              <div className="bg-[#9c573a] h-full w-[5%]" />
            </div>
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white rounded-2xl border border-[#bdc9c6] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-[#bdc9c6]">
          <h3 className="font-bold text-base text-[#181c1c]">5 Produk Terlaris</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f1f4f3] text-[#6e7977] text-xs font-bold uppercase">
                <th className="px-6 py-3.5">Nama Produk</th>
                <th className="px-6 py-3.5">Kategori</th>
                <th className="px-6 py-3.5 text-center">Qty Terjual</th>
                <th className="px-6 py-3.5 text-right">Total Omset</th>
                <th className="px-6 py-3.5 text-center">Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bdc9c6]/40 text-sm">
              {topProducts.map((p, idx) => (
                <tr key={idx} className="hover:bg-[#f1f4f3]/50">
                  <td className="px-6 py-4 font-bold text-[#181c1c]">{p.name}</td>
                  <td className="px-6 py-4 text-xs font-semibold text-[#6e7977]">{p.category}</td>
                  <td className="px-6 py-4 text-center font-bold">{p.sold} Unit</td>
                  <td className="px-6 py-4 text-right font-black text-[#005c55]">{formatCurrency(p.revenue)}</td>
                  <td className="px-6 py-4 text-center text-xs font-bold text-[#006f64]">{p.margin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
