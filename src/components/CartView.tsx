import React, { useState } from 'react';
import { CartItem, Customer, TabType } from '../types';

interface CartViewProps {
  cart: CartItem[];
  selectedCustomer: Customer;
  discount: number;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOpenCustomerModal: () => void;
  onApplyDiscount: (amount: number) => void;
  onNavigate: (tab: TabType) => void;
}

export const CartView: React.FC<CartViewProps> = ({
  cart,
  selectedCustomer,
  discount,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOpenCustomerModal,
  onApplyDiscount,
  onNavigate,
}) => {
  const [showVoucherInput, setShowVoucherInput] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const taxPPN = Math.round(subtotal * 0.11);
  const totalFinal = Math.max(0, subtotal + taxPPN - discount);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (voucherCode.toLowerCase().includes('diskon') || voucherCode.toLowerCase().includes('teknik')) {
      onApplyDiscount(10000);
      alert('Voucher Diskon Rp 10.000 Berhasil Dipasang!');
    } else {
      onApplyDiscount(10000); // default applied demo discount
      alert('Voucher Diskon Rp 10.000 Berhasil Dipasang!');
    }
    setShowVoucherInput(false);
  };

  return (
    <div className="pt-20 px-4 max-w-4xl mx-auto pb-36 animate-fade-in space-y-6">
      {/* Top Controls */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-[#bdc9c6] shadow-sm">
        <button
          onClick={() => onNavigate('pos')}
          className="flex items-center gap-2 text-[#005c55] font-bold text-sm hover:underline"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          <span>Kembali ke POS</span>
        </button>
        {cart.length > 0 && (
          <button
            onClick={onClearCart}
            className="text-[#ba1a1a] hover:bg-[#ffdad6] p-2 rounded-xl transition-colors flex items-center gap-1 text-xs font-semibold"
          >
            <span className="material-symbols-outlined text-lg">delete_sweep</span>
            <span>Kosongkan</span>
          </button>
        )}
      </div>

      {/* Customer Selection Section */}
      <section>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#bdc9c6] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#6df5e1] flex items-center justify-center text-[#006f64]">
              <span className="material-symbols-outlined filled">person</span>
            </div>
            <div>
              <p className="font-semibold text-xs text-[#181c1c]">Pilih Pelanggan</p>
              <p className="text-sm font-bold text-[#005c55]">{selectedCustomer.name}</p>
            </div>
          </div>
          <button
            onClick={onOpenCustomerModal}
            className="text-[#005c55] font-bold text-xs flex items-center gap-1 hover:underline active:scale-95 transition-transform"
          >
            <span>Ubah</span>
            <span className="material-symbols-outlined text-base">expand_more</span>
          </button>
        </div>
      </section>

      {/* Cart Items Section */}
      <section className="space-y-4">
        <h2 className="text-xs font-bold text-[#3e4947] uppercase tracking-wider px-1">
          Item dalam Keranjang ({cart.length})
        </h2>

        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-[#bdc9c6] text-center space-y-3">
            <span className="material-symbols-outlined text-5xl text-[#6e7977]">remove_shopping_cart</span>
            <p className="text-sm text-[#3e4947] font-medium">Keranjang belanja Anda masih kosong</p>
            <button
              onClick={() => onNavigate('pos')}
              className="px-6 py-2.5 bg-[#005c55] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#0f766e]"
            >
              Tambah Produk dari POS
            </button>
          </div>
        ) : (
          cart.map(({ product: p, quantity }) => (
            <div
              key={p.id}
              className="bg-white border border-[#bdc9c6] rounded-2xl p-4 flex gap-4 transition-all hover:shadow-md"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-[#f1f4f3] border border-[#bdc9c6]/50">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-semibold text-xs md:text-sm text-[#181c1c] leading-tight">
                      {p.name}
                    </h3>
                    <button
                      onClick={() => onRemoveItem(p.id)}
                      className="text-[#6e7977] hover:text-[#ba1a1a] transition-colors p-1"
                    >
                      <span className="material-symbols-outlined text-base">close</span>
                    </button>
                  </div>
                  <p className="text-[#005c55] font-extrabold text-sm md:text-base mt-1">
                    {formatCurrency(p.price)}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#f1f4f3]">
                  <p className="text-[11px] text-[#3e4947]">Stok: {p.stock} Unit</p>

                  <div className="flex items-center bg-[#e5e9e7] rounded-full p-1 gap-2">
                    <button
                      onClick={() => onUpdateQuantity(p.id, -1)}
                      className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#005c55] shadow-sm active:scale-90 transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">remove</span>
                    </button>
                    <span className="px-2 font-bold text-xs text-[#181c1c] min-w-[20px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(p.id, 1)}
                      className="w-7 h-7 rounded-full bg-[#005c55] flex items-center justify-center text-white shadow-sm active:scale-90 transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Voucher/Discount Section */}
      <section>
        {!showVoucherInput ? (
          <div
            onClick={() => setShowVoucherInput(true)}
            className="bg-[#ffdbce] text-[#370e00] p-4 rounded-2xl flex items-center justify-between cursor-pointer active:scale-[0.99] transition-transform shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#7f4025]">confirmation_number</span>
              <p className="font-bold text-xs md:text-sm">
                {discount > 0
                  ? `Voucher Aktif: Potongan ${formatCurrency(discount)}`
                  : 'Gunakan Voucher atau Diskon Toko'}
              </p>
            </div>
            <span className="material-symbols-outlined">chevron_right</span>
          </div>
        ) : (
          <form onSubmit={handleApplyVoucher} className="bg-[#ffdbce] p-4 rounded-2xl space-y-3">
            <p className="text-xs font-bold text-[#370e00]">Masukkan Kode Voucher Diskon:</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Contoh: TEKNIK10K"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                className="flex-1 px-3 py-2 bg-white rounded-xl text-xs border border-[#bdc9c6] outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#7f4025] text-white font-bold text-xs rounded-xl hover:bg-[#9c573a]"
              >
                Gunakan
              </button>
            </div>
          </form>
        )}
      </section>

      {/* Summary Section */}
      <section className="bg-[#f1f4f3] p-6 rounded-2xl border border-[#bdc9c6]">
        <h3 className="font-bold text-sm text-[#181c1c] mb-4">Ringkasan Pesanan</h3>
        <div className="space-y-3 text-xs md:text-sm">
          <div className="flex justify-between items-center text-[#3e4947]">
            <span>Subtotal ({totalItemCount} item)</span>
            <span className="font-bold text-[#181c1c]">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between items-center text-[#3e4947]">
            <span>Pajak (PPN 11%)</span>
            <span className="font-bold text-[#181c1c]">{formatCurrency(taxPPN)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between items-center text-[#ba1a1a]">
              <span>Diskon Toko</span>
              <span className="font-bold">- {formatCurrency(discount)}</span>
            </div>
          )}
          <div className="pt-3 border-t border-[#bdc9c6] flex justify-between items-center">
            <span className="font-extrabold text-sm md:text-base text-[#181c1c]">Total Akhir</span>
            <span className="font-black text-lg md:text-xl text-[#005c55]">
              {formatCurrency(totalFinal)}
            </span>
          </div>
        </div>
      </section>

      {/* Fixed Bottom Action */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-[#bdc9c6] shadow-[0_-8px_20px_rgba(0,0,0,0.08)] px-6 py-4 z-50 rounded-t-3xl">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] text-[#3e4947] font-bold uppercase tracking-wider">
                Total Pembayaran
              </p>
              <p className="text-lg md:text-xl font-extrabold text-[#005c55]">
                {formatCurrency(totalFinal)}
              </p>
            </div>
            <button
              onClick={() => onNavigate('checkout')}
              className="bg-[#005c55] hover:bg-[#0f766e] text-white px-6 md:px-8 py-3.5 rounded-2xl font-bold text-xs md:text-sm shadow-xl active:scale-95 transition-all flex items-center gap-2"
            >
              <span>Lanjut ke Pembayaran</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
