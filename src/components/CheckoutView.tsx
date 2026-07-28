import React, { useState } from 'react';
import { CartItem, Customer, PaymentMethod, Transaction, TabType } from '../types';

interface CheckoutViewProps {
  cart: CartItem[];
  selectedCustomer: Customer;
  discount: number;
  onCompleteCheckout: (transaction: Transaction) => void;
  onNavigate: (tab: TabType) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  cart,
  selectedCustomer,
  discount,
  onCompleteCheckout,
  onNavigate,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [receivedCashInput, setReceivedCashInput] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const taxPPN = Math.round(subtotal * 0.11);
  const totalAmount = Math.max(0, subtotal + taxPPN - discount);

  const cashValue = Number(receivedCashInput) || 0;
  const changeValue = cashValue - totalAmount;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleQuickAmount = (amount: number) => {
    if (amount === -1) {
      setReceivedCashInput(totalAmount.toString());
    } else {
      setReceivedCashInput(amount.toString());
    }
  };

  const handleFinish = () => {
    if (paymentMethod === 'cash' && cashValue < totalAmount && cashValue > 0) {
      showToast('Uang tunai kurang dari total pembayaran!');
      return;
    }

    const paid = paymentMethod === 'cash' ? (cashValue >= totalAmount ? cashValue : totalAmount) : totalAmount;
    const chg = paymentMethod === 'cash' ? Math.max(0, paid - totalAmount) : 0;

    const trxId = `#TRX-${new Date().toISOString().slice(0,10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`;

    const newTrx: Transaction = {
      id: trxId,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      cashier: 'Admin Utama',
      customerName: selectedCustomer.name,
      items: cart.map((c) => ({
        id: c.product.id,
        name: c.product.name,
        quantity: c.quantity,
        unitPrice: c.product.price,
        totalPrice: c.product.price * c.quantity,
      })),
      subtotal,
      tax: taxPPN,
      discount,
      totalAmount,
      paymentMethod,
      amountPaid: paid,
      change: chg,
      status: 'Selesai',
    };

    showToast('Memproses Transaksi...');
    setTimeout(() => {
      onCompleteCheckout(newTrx);
    }, 800);
  };

  return (
    <div className="pt-20 px-4 max-w-2xl mx-auto pb-36 animate-fade-in space-y-6">
      {/* Top Header */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-[#bdc9c6] shadow-sm">
        <button
          onClick={() => onNavigate('cart')}
          className="flex items-center gap-2 text-[#005c55] font-bold text-sm hover:underline"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          <span>Kembali ke Keranjang</span>
        </button>
        <span className="text-xs font-bold text-[#006b5f] bg-[#6df5e1]/30 px-3 py-1 rounded-full">
          Standard POS Checkout
        </span>
      </div>

      {/* Order Summary Section */}
      <section>
        <div className="bg-white rounded-2xl p-6 border border-[#bdc9c6] shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-[#181c1c]">Order Summary</h2>
            <span className="text-xs font-bold text-[#006b5f] bg-[#6df5e1]/40 px-3 py-1 rounded-full">
              #TRX-88291
            </span>
          </div>

          <div className="space-y-2 text-xs md:text-sm text-[#3e4947] pt-2 border-t border-[#bdc9c6]/40">
            <div className="flex justify-between items-center">
              <span>Subtotal ({totalItemCount} items)</span>
              <span className="font-bold text-[#181c1c]">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Tax (PPN 11%)</span>
              <span className="font-bold text-[#181c1c]">{formatCurrency(taxPPN)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between items-center text-[#ba1a1a]">
                <span>Diskon Toko</span>
                <span className="font-bold">- {formatCurrency(discount)}</span>
              </div>
            )}
            <div className="border-t border-[#bdc9c6] pt-3 mt-2 flex justify-between items-center">
              <span className="text-base font-extrabold text-[#181c1c]">Total Amount</span>
              <span className="text-xl font-black text-[#005c55]">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Method Selection */}
      <section>
        <h2 className="text-base font-bold text-[#181c1c] mb-3">Metode Pembayaran</h2>
        <div className="grid grid-cols-2 gap-3">
          {/* Tunai */}
          <button
            onClick={() => setPaymentMethod('cash')}
            className={`flex flex-col items-center justify-center gap-2 p-5 border-2 rounded-2xl transition-all ${
              paymentMethod === 'cash'
                ? 'border-[#005c55] bg-[#f1f4f3] shadow-md scale-[1.02]'
                : 'border-[#bdc9c6] bg-white hover:bg-[#f1f4f3]'
            }`}
          >
            <span className="material-symbols-outlined text-[#005c55] text-3xl">payments</span>
            <span className="text-xs font-bold text-[#181c1c]">Tunai / Cash</span>
          </button>

          {/* QRIS */}
          <button
            onClick={() => setPaymentMethod('qris')}
            className={`flex flex-col items-center justify-center gap-2 p-5 border-2 rounded-2xl transition-all ${
              paymentMethod === 'qris'
                ? 'border-[#005c55] bg-[#f1f4f3] shadow-md scale-[1.02]'
                : 'border-[#bdc9c6] bg-white hover:bg-[#f1f4f3]'
            }`}
          >
            <span className="material-symbols-outlined text-[#005c55] text-3xl">qr_code_2</span>
            <span className="text-xs font-bold text-[#181c1c]">QRIS Digital</span>
          </button>

          {/* Transfer Bank */}
          <button
            onClick={() => setPaymentMethod('transfer')}
            className={`flex flex-col items-center justify-center gap-2 p-5 border-2 rounded-2xl transition-all ${
              paymentMethod === 'transfer'
                ? 'border-[#005c55] bg-[#f1f4f3] shadow-md scale-[1.02]'
                : 'border-[#bdc9c6] bg-white hover:bg-[#f1f4f3]'
            }`}
          >
            <span className="material-symbols-outlined text-[#005c55] text-3xl">account_balance</span>
            <span className="text-xs font-bold text-[#181c1c]">Bank Transfer</span>
          </button>

          {/* Debit / Kredit */}
          <button
            onClick={() => setPaymentMethod('card')}
            className={`flex flex-col items-center justify-center gap-2 p-5 border-2 rounded-2xl transition-all ${
              paymentMethod === 'card'
                ? 'border-[#005c55] bg-[#f1f4f3] shadow-md scale-[1.02]'
                : 'border-[#bdc9c6] bg-white hover:bg-[#f1f4f3]'
            }`}
          >
            <span className="material-symbols-outlined text-[#005c55] text-3xl">credit_card</span>
            <span className="text-xs font-bold text-[#181c1c]">Debit / Kredit</span>
          </button>
        </div>
      </section>

      {/* Cash Details (Tunai Mode) */}
      {paymentMethod === 'cash' && (
        <section className="animate-fade-in">
          <h2 className="text-base font-bold text-[#181c1c] mb-3">Received Cash (Nominal Uang)</h2>
          <div className="bg-[#f1f4f3] rounded-2xl p-5 border border-[#bdc9c6] space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#3e4947] mb-1">
                Enter Amount Received
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-[#3e4947]">
                  Rp
                </span>
                <input
                  type="number"
                  value={receivedCashInput}
                  onChange={(e) => setReceivedCashInput(e.target.value)}
                  placeholder="0"
                  className="w-full pl-12 pr-4 py-3 bg-white border-2 border-[#6e7977] rounded-xl text-lg font-bold text-[#181c1c] focus:border-[#005c55] outline-none"
                />
              </div>
            </div>

            {/* Preset Cash Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => handleQuickAmount(50000)}
                className="py-2.5 bg-[#006b5f] text-white rounded-xl font-bold text-xs hover:bg-[#005048] active:scale-95 transition-all shadow-sm"
              >
                Rp 50.000
              </button>
              <button
                onClick={() => handleQuickAmount(100000)}
                className="py-2.5 bg-[#006b5f] text-white rounded-xl font-bold text-xs hover:bg-[#005048] active:scale-95 transition-all shadow-sm"
              >
                Rp 100.000
              </button>
              <button
                onClick={() => handleQuickAmount(150000)}
                className="py-2.5 bg-[#006b5f] text-white rounded-xl font-bold text-xs hover:bg-[#005048] active:scale-95 transition-all shadow-sm"
              >
                Rp 150.000
              </button>
              <button
                onClick={() => handleQuickAmount(-1)}
                className="py-2.5 bg-[#005c55] text-[#a3faef] rounded-xl font-bold text-xs hover:bg-[#0f766e] active:scale-95 transition-all shadow-sm"
              >
                Uang Pas
              </button>
            </div>

            {/* Change Display */}
            <div className="pt-3 border-t border-[#bdc9c6] flex justify-between items-center">
              <span className="text-xs font-bold text-[#3e4947]">Change (Kembalian)</span>
              <span
                className={`text-lg font-black ${
                  changeValue < 0 ? 'text-[#ba1a1a]' : 'text-[#7f4025]'
                }`}
              >
                {changeValue < 0
                  ? `Kurang ${formatCurrency(Math.abs(changeValue))}`
                  : formatCurrency(changeValue)}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* QRIS Display (QRIS Mode) */}
      {paymentMethod === 'qris' && (
        <section className="animate-fade-in text-center">
          <div className="bg-white rounded-2xl p-6 border border-[#bdc9c6] shadow-sm flex flex-col items-center space-y-4">
            <div className="w-60 h-60 bg-white p-3 border border-[#bdc9c6] rounded-2xl flex items-center justify-center shadow-inner">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYkLCRfdkAV9n7DoX2ZsLlQNA2nJLpJQ5yHJ0EWdhvkwgaqeXtGhqhRI42RB00QZn5fK52SXHPta7wmEuzaogb6QeLtwBFNKOiL7d7WyR3P90POeUJiWcTW91m4j10-8aA5R8PCkpUEpL1Rmlaca-ZGPvmwfb5o1meN3ibLWvUUwiSg81GzKuPq3VT7zWVw6GbBMDj11jxiwg4q60zoU5FbPfrzB6_hDsyihdyYXTVfF4uLhj1J3HEUKmz6mLHCwxf6eXTF4Ueb9Q"
                alt="QRIS Toko Tabingan Teknik"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-xs font-bold text-[#3e4947]">
              Scan QRIS untuk membayar {formatCurrency(totalAmount)}
            </p>
            <span className="px-4 py-1.5 bg-[#0f766e] text-[#a3faef] rounded-full text-[11px] font-bold tracking-widest uppercase animate-pulse">
              Awaiting Payment...
            </span>
          </div>
        </section>
      )}

      {/* Bank Transfer Details (Transfer Mode) */}
      {paymentMethod === 'transfer' && (
        <section className="animate-fade-in">
          <div className="bg-white rounded-2xl p-5 border border-[#bdc9c6] shadow-sm space-y-3">
            <div className="flex justify-between items-center p-4 bg-[#f1f4f3] rounded-xl border border-[#bdc9c6]">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#005c55]">account_balance</span>
                <div>
                  <p className="text-[11px] font-bold text-[#3e4947]">Bank Mandiri (Pusat)</p>
                  <p className="text-sm font-bold text-[#181c1c]">123-00-1234567-8</p>
                  <p className="text-[10px] text-[#6e7977]">a.n Toko H. Tabingan Teknik</p>
                </div>
              </div>
              <button
                onClick={() => showToast('Nomor Rekening Disalin!')}
                className="px-3 py-1.5 bg-[#005c55] text-white text-xs font-bold rounded-lg hover:bg-[#0f766e]"
              >
                Copy
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Card Mode */}
      {paymentMethod === 'card' && (
        <section className="animate-fade-in text-center bg-white p-6 rounded-2xl border border-[#bdc9c6]">
          <span className="material-symbols-outlined text-4xl text-[#005c55] mb-2">point_of_sale</span>
          <p className="text-xs font-bold text-[#181c1c]">EDC Machine Connected</p>
          <p className="text-[11px] text-[#6e7977] mt-1">Silakan gesek atau tap kartu EDC pelanggan.</p>
        </section>
      )}

      {/* Bottom Complete Button */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-[#bdc9c6] shadow-[0_-8px_20px_rgba(0,0,0,0.08)] p-4 z-50">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleFinish}
            className="w-full py-4 bg-[#005c55] text-white rounded-2xl font-bold text-base md:text-lg flex items-center justify-center gap-3 hover:bg-[#0f766e] active:scale-95 transition-all shadow-xl"
          >
            <span className="material-symbols-outlined text-2xl">check_circle</span>
            <span>Selesaikan Transaksi</span>
          </button>
        </div>
      </div>

      {/* Toast Popup */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#2d3130] text-[#eef1f0] px-6 py-3 rounded-full shadow-2xl z-[150] text-xs font-bold animate-bounce">
          {toastMessage}
        </div>
      )}
    </div>
  );
};
