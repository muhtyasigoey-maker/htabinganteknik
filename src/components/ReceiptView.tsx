import React from 'react';
import { Transaction, TabType } from '../types';

interface ReceiptViewProps {
  transaction: Transaction | null;
  onNewTransaction: () => void;
  onNavigate: (tab: TabType) => void;
}

export const ReceiptView: React.FC<ReceiptViewProps> = ({
  transaction,
  onNewTransaction,
}) => {
  if (!transaction) {
    return (
      <div className="pt-24 text-center px-4">
        <p className="text-[#3e4947] text-sm">Tidak ada transaksi yang dapat ditampilkan.</p>
        <button
          onClick={onNewTransaction}
          className="mt-4 px-6 py-2.5 bg-[#005c55] text-white font-bold text-xs rounded-xl"
        >
          Kembali ke POS
        </button>
      </div>
    );
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const text = `*STUK PEMBAYARAN TOKO TABINGAN TEKNIK*%0A` +
      `No TRX: ${transaction.id}%0A` +
      `Total: ${formatCurrency(transaction.totalAmount)}%0A` +
      `Terima kasih telah berbelanja alat teknik berkualitas bersama kami!`;
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="pt-20 pb-36 px-4 flex justify-center animate-fade-in">
      <div className="w-full max-w-md space-y-8">
        {/* Success Checkmark & Header */}
        <div className="text-center">
          <div className="success-checkmark mb-3">
            <svg viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
              <circle className="path" cx="26" cy="26" r="25" fill="none" />
              <path className="check" d="M14.1 27.2l7.1 7.2 16.7-16.8" fill="none" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#005c55] mb-1">Transaksi Berhasil</h2>
          <p className="text-xs text-[#3e4947]">Pembayaran telah diterima & divalidasi</p>
        </div>

        {/* Receipt Paper Component with Jagged Edge */}
        <div className="receipt-paper p-6 rounded-sm space-y-4">
          {/* Header Info */}
          <div className="text-center border-b border-dashed border-[#bdc9c6] pb-4">
            <div className="flex justify-center mb-3">
              <div className="w-14 h-14 bg-[#0f766e] rounded-xl flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-3xl filled">construction</span>
              </div>
            </div>
            <h3 className="text-lg font-bold text-[#181c1c] uppercase tracking-wide">
              TOKO TABINGAN TEKNIK
            </h3>
            <p className="text-[10px] text-[#3e4947] uppercase tracking-wider">
              Jl. Raya Industri No. 45, Jakarta
            </p>
            <p className="text-[10px] text-[#3e4947]">Telp: (021) 555-0123</p>
          </div>

          {/* Metadata */}
          <div className="flex justify-between text-[11px] text-[#3e4947] pb-2">
            <div>
              <p>
                ID Transaksi: <span className="font-bold text-[#181c1c]">{transaction.id}</span>
              </p>
              <p>
                Kasir: <span className="font-bold text-[#181c1c]">{transaction.cashier}</span>
              </p>
            </div>
            <div className="text-right">
              <p>{transaction.date}</p>
              <p>{transaction.time}</p>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-3 py-2 border-t border-dashed border-[#bdc9c6]">
            {transaction.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start text-xs">
                <div className="max-w-[70%]">
                  <p className="font-bold text-[#181c1c] leading-tight">{item.name}</p>
                  <p className="text-[10px] text-[#6e7977]">
                    {item.quantity} x {formatCurrency(item.unitPrice)}
                  </p>
                </div>
                <p className="font-bold text-[#181c1c]">{formatCurrency(item.totalPrice)}</p>
              </div>
            ))}
          </div>

          {/* Totals Section */}
          <div className="border-t border-dashed border-[#bdc9c6] pt-3 space-y-1.5 text-xs text-[#3e4947]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">{formatCurrency(transaction.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Pajak (PPN 11%)</span>
              <span className="font-semibold">{formatCurrency(transaction.tax)}</span>
            </div>
            {transaction.discount > 0 && (
              <div className="flex justify-between text-[#ba1a1a]">
                <span>Diskon Toko</span>
                <span className="font-semibold">- {formatCurrency(transaction.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-extrabold text-[#005c55] pt-2 border-t border-[#bdc9c6]/40">
              <span>Total Akhir</span>
              <span>{formatCurrency(transaction.totalAmount)}</span>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-[#f1f4f3] p-3 rounded-xl border border-[#bdc9c6]/50 space-y-1 text-xs text-[#3e4947]">
            <div className="flex justify-between">
              <span>Metode Pembayaran</span>
              <span className="font-bold uppercase text-[#181c1c]">{transaction.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span>Dibayar</span>
              <span className="font-semibold">{formatCurrency(transaction.amountPaid)}</span>
            </div>
            <div className="flex justify-between">
              <span>Kembali</span>
              <span className="font-bold text-[#006b5f]">
                {formatCurrency(transaction.change)}
              </span>
            </div>
          </div>

          {/* QR Code Validation & Footer Quote */}
          <div className="text-center pt-2 space-y-3">
            <div className="flex justify-center opacity-80">
              <div className="bg-white p-2 border border-[#bdc9c6] rounded-xl shadow-xs">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCI7k-36WEXIF-M0Niz_UVFZRVI5tkN5iCUKXjRfTmRHZkuQnuyuvU2uUGD6GLSkqKrCz30LddOpH8CErpNybs8EY4go5IpXLvS-ah1XkIsGugehIGXpgTqaZP_psa_oaIFznmMb80dVSn5FT7IxGvCvlXOkrTkSlXpbuDfEuQKjMxNtQQisj9Z8xiRLa5FFpZ17BeNw43eYYnAOeEa6P1nXrMcDbvESS8his3PxjUO1cLvvaO3rCKAoBKCl0HC3Y7Z06HpTu71Uts"
                  alt="Validation QR Code"
                  className="w-20 h-20"
                />
              </div>
            </div>
            <p className="text-[11px] text-[#6e7977] italic">
              "Terima kasih telah berbelanja alat teknik berkualitas di toko kami."
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handlePrint}
            className="w-full h-14 bg-[#005c55] text-white rounded-2xl flex items-center justify-center gap-3 font-bold text-sm shadow-lg active:scale-95 transition-all hover:bg-[#0f766e]"
          >
            <span className="material-symbols-outlined">print</span>
            <span>Cetak Struk</span>
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="w-full h-14 bg-[#6df5e1] text-[#006f64] border border-[#bdc9c6] rounded-2xl flex items-center justify-center gap-3 font-bold text-sm shadow-sm active:scale-95 transition-all hover:bg-[#4fdbc8]"
          >
            <span className="material-symbols-outlined">share</span>
            <span>Bagikan via WhatsApp</span>
          </button>

          <div className="text-center pt-2">
            <button
              onClick={onNewTransaction}
              className="text-[#005c55] font-bold text-sm hover:underline py-2 px-4 rounded-full"
            >
              Lanjut ke Transaksi Baru
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
