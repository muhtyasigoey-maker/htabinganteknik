import React, { useState } from 'react';
import { Product, CartItem, TabType } from '../types';

interface PosViewProps {
  products: Product[];
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
  onNavigate: (tab: TabType) => void;
  onOpenScanner: () => void;
}

export const PosView: React.FC<PosViewProps> = ({
  products,
  cart,
  onAddToCart,
  onNavigate,
  onOpenScanner,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['Semua', 'Bangunan', 'Listrik', 'Plumbing', 'Cat & Aksesoris', 'Perkakas'];

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'Semua' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const formatShortPrice = (price: number) => {
    if (price >= 1000000) {
      return `Rp ${(price / 1000000).toFixed(1).replace('.0', '')}jt`;
    }
    if (price >= 1000) {
      return `Rp ${(price / 1000).toFixed(0)}rb`;
    }
    return `Rp ${price}`;
  };

  return (
    <div className="pt-20 px-4 md:px-8 pb-32 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Search & Scan Bar */}
      <div className="relative flex items-center bg-white border border-[#bdc9c6] rounded-2xl overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-[#005c55] transition-all">
        <span className="material-symbols-outlined ml-4 text-[#6e7977]">search</span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && searchQuery.trim()) {
              const query = searchQuery.trim().toLowerCase();
              const exactSkuMatch = products.find((p) => p.sku.toLowerCase() === query || p.id.toLowerCase() === query);
              if (exactSkuMatch) {
                onAddToCart(exactSkuMatch);
                setSearchQuery('');
              } else if (filteredProducts.length === 1) {
                onAddToCart(filteredProducts[0]);
                setSearchQuery('');
              }
            }
          }}
          placeholder="Cari Produk atau Scan Barcode (Tekan Enter)..."
          className="w-full bg-transparent border-none py-3.5 px-3 focus:outline-none text-sm font-medium text-[#181c1c]"
        />
        <button
          onClick={onOpenScanner}
          className="mr-2 p-2 bg-[#6df5e1] text-[#006f64] rounded-xl hover:bg-[#4fdbc8] active:scale-95 transition-transform flex items-center gap-1 font-bold text-xs"
        >
          <span className="material-symbols-outlined text-lg">barcode_scanner</span>
          <span className="hidden sm:inline">Scan</span>
        </button>
      </div>

      {/* Horizontal Category Filters */}
      <div className="overflow-x-auto hide-scrollbar -mx-4 px-4">
        <div className="flex gap-2 whitespace-nowrap">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all active:scale-95 ${
                  isActive
                    ? 'bg-[#005c55] text-white shadow-md'
                    : 'bg-[#e5e9e7] text-[#3e4947] hover:bg-[#e0e3e1]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Section Title */}
      <div className="flex justify-between items-center pt-2">
        <h2 className="text-xl font-bold text-[#181c1c]">Produk Terlaris</h2>
        <span className="text-xs text-[#005c55] font-bold flex items-center gap-1 cursor-pointer">
          {filteredProducts.length} Produk <span className="material-symbols-outlined text-sm">chevron_right</span>
        </span>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            onClick={() => onAddToCart(p)}
            className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-[#bdc9c6] hover:border-[#005c55] transition-all hover:shadow-md cursor-pointer active:scale-95"
          >
            <div className="aspect-square bg-[#e0e3e1] overflow-hidden relative">
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {p.stock <= 5 && (
                <span className="absolute top-2 right-2 bg-[#ba1a1a] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {p.stock === 0 ? 'Habis' : `Sisa ${p.stock}`}
                </span>
              )}
            </div>

            <div className="p-3 flex flex-col flex-grow justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#6e7977] uppercase tracking-wider block mb-1">
                  {p.category}
                </span>
                <h3 className="text-xs font-semibold text-[#181c1c] line-clamp-2 h-8 leading-tight mb-2">
                  {p.name}
                </h3>
              </div>

              <div className="mt-auto pt-2 border-t border-[#f1f4f3]">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm font-bold text-[#005c55]">
                      {formatShortPrice(p.price)}
                    </p>
                    <p className="text-[10px] text-[#006b5f] font-medium">
                      Stok: {p.stock} {p.unit}
                    </p>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-[#0f766e] text-[#a3faef] flex items-center justify-center group-hover:bg-[#005c55] transition-colors shadow-sm">
                    <span className="material-symbols-outlined text-base">add</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Cart Button (FAB) */}
      <div className="fixed bottom-24 right-4 z-40">
        <button
          onClick={() => onNavigate('cart')}
          className="relative flex items-center gap-2 bg-[#9c573a] text-[#ffe5db] pl-5 pr-4 py-3.5 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all group overflow-hidden"
        >
          <span className="font-bold text-sm tracking-wide">Keranjang</span>
          <div className="relative">
            <span className="material-symbols-outlined text-2xl filled">shopping_cart</span>
            {totalCartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#ba1a1a] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-[#9c573a]">
                {totalCartCount}
              </span>
            )}
          </div>
        </button>
      </div>
    </div>
  );
};
