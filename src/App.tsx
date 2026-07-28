import React, { useState } from 'react';
import { TabType, Product, CartItem, Customer, Transaction, StockActivity } from './types';
import { INITIAL_PRODUCTS, INITIAL_TRANSACTIONS, INITIAL_CUSTOMERS, DEFAULT_CUSTOMER, WAREHOUSES, RECENT_ACTIVITIES } from './data/mockData';

import { Navigation } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { PosView } from './components/PosView';
import { CartView } from './components/CartView';
import { CheckoutView } from './components/CheckoutView';
import { ReceiptView } from './components/ReceiptView';
import { InventoryView } from './components/InventoryView';
import { CustomersView } from './components/CustomersView';
import { WarehouseView } from './components/WarehouseView';
import { ReportsView } from './components/ReportsView';

import { CustomerModal } from './components/CustomerModal';
import { ScannerModal } from './components/ScannerModal';
import { AddProductModal } from './components/AddProductModal';
import { OnboardingModal } from './components/OnboardingModal';
import { StockActionModal, StockActionType } from './components/StockActionModal';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>(DEFAULT_CUSTOMER);
  const [discount, setDiscount] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [stockActivities, setStockActivities] = useState<StockActivity[]>(RECENT_ACTIVITIES);

  // Modals & Auth State
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [currentStockAction, setCurrentStockAction] = useState<StockActionType>('stock_in');
  const [onboardingMode, setOnboardingMode] = useState<'splash' | 'onboarding' | 'login'>('splash');
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentUser, setCurrentUser] = useState({
    name: 'Admin Utama',
    email: 'admin@tabingan.com',
    role: 'Administrator POS',
    avatar: 'AU',
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleOpenStockAction = (action: StockActionType) => {
    setCurrentStockAction(action);
    setIsStockModalOpen(true);
  };

  const handleStockIn = (productId: string, qty: number, supplierNote: string, warehouse: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: p.stock + qty } : p))
    );

    const newAct: StockActivity = {
      id: 'act_' + Date.now(),
      productName: prod.name,
      image: prod.image,
      type: 'Inbound',
      changeText: `Tambah Stok +${qty} ${prod.unit} (${supplierNote})`,
      time: 'Baru saja',
      location: warehouse,
    };

    setStockActivities((prev) => [newAct, ...prev]);
    showToast(`Stok ${prod.name} bertambah +${qty} ${prod.unit}`);
  };

  const handleStockOut = (productId: string, qty: number, reason: string, warehouse: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: Math.max(0, p.stock - qty) } : p))
    );

    const newAct: StockActivity = {
      id: 'act_' + Date.now(),
      productName: prod.name,
      image: prod.image,
      type: 'Adjustment',
      changeText: `Stok Keluar -${qty} ${prod.unit} (${reason})`,
      time: 'Baru saja',
      location: warehouse,
    };

    setStockActivities((prev) => [newAct, ...prev]);
    showToast(`Stok ${prod.name} berkurang -${qty} ${prod.unit}`);
  };

  const handleAudit = (productId: string, actualCount: number, notes: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    const diff = actualCount - prod.stock;
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: actualCount } : p))
    );

    const newAct: StockActivity = {
      id: 'act_' + Date.now(),
      productName: prod.name,
      image: prod.image,
      type: 'Audit',
      changeText: `Audit Opname: Stok diubah ke ${actualCount} ${prod.unit} (Selisih: ${diff > 0 ? '+' : ''}${diff})`,
      time: 'Baru saja',
      location: 'Gudang Utama',
    };

    setStockActivities((prev) => [newAct, ...prev]);
    showToast(`Audit Selesai: Stok ${prod.name} disesuaikan ke ${actualCount} ${prod.unit}`);
  };

  const handleTransfer = (productId: string, qty: number, fromWh: string, toWh: string, notes: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    const newAct: StockActivity = {
      id: 'act_' + Date.now(),
      productName: prod.name,
      image: prod.image,
      type: 'Inbound',
      changeText: `Transfer ${qty} ${prod.unit} dari ${fromWh} ➔ ${toWh} (${notes})`,
      time: 'Baru saja',
      location: toWh,
    };

    setStockActivities((prev) => [newAct, ...prev]);
    showToast(`Transfer ${qty} ${prod.unit} ${prod.name} dari ${fromWh} ke ${toWh} berhasil!`);
  };

  const handleOpenOnboarding = () => {
    setOnboardingMode('onboarding');
    setIsOnboardingOpen(true);
  };

  const handleOpenLogin = () => {
    setOnboardingMode('login');
    setIsOnboardingOpen(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    showToast('Anda telah keluar (logout) dari sistem.');
    setOnboardingMode('login');
    setIsOnboardingOpen(true);
  };

  const handleLoginSuccess = (email?: string) => {
    setIsLoggedIn(true);
    if (email && email.trim() !== '') {
      const namePart = email.split('@')[0];
      const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      const isA = formattedName.toLowerCase().includes('admin');
      setCurrentUser({
        name: isA ? 'Admin Utama' : `Kasir (${formattedName})`,
        email: email,
        role: isA ? 'Administrator POS' : 'Kasir Operasional',
        avatar: email.slice(0, 2).toUpperCase(),
      });
    }
    setIsOnboardingOpen(false);
    showToast('Berhasil masuk sebagai kasir.');
    setActiveTab('dashboard');
  };

  // Cart operations
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
    setDiscount(0);
  };

  const handleAddProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
  };

  const handleAddCustomer = (newCust: Customer) => {
    setCustomers((prev) => [...prev, newCust]);
  };

  const handleCompleteCheckout = (newTrx: Transaction) => {
    // Deduct stock for purchased products
    setProducts((prev) =>
      prev.map((p) => {
        const cartMatch = cart.find((c) => c.product.id === p.id);
        if (cartMatch) {
          return { ...p, stock: Math.max(0, p.stock - cartMatch.quantity) };
        }
        return p;
      })
    );

    setTransactions((prev) => [newTrx, ...prev]);
    setCurrentTransaction(newTrx);
    setCart([]);
    setDiscount(0);
    setActiveTab('receipt');
  };

  const handleNewTransaction = () => {
    setCurrentTransaction(null);
    setCart([]);
    setDiscount(0);
    setActiveTab('pos');
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#f7faf8] text-[#181c1c] font-sans selection:bg-[#6df5e1] selection:text-[#005c55] antialiased">
      {/* Top Header & Bottom Navigation */}
      <Navigation
        activeTab={activeTab}
        cartCount={totalCartCount}
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        onNavigate={setActiveTab}
        onOpenOnboarding={handleOpenOnboarding}
        onOpenLogin={handleOpenLogin}
        onLogout={handleLogout}
      />

      {/* Floating Status Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-[150] bg-[#005c55] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-[#6df5e1]/40 animate-in slide-in-from-top-2 duration-200">
          <span className="material-symbols-outlined text-[#6df5e1] text-xl">info</span>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Main View Area */}
      <main className="transition-all duration-300">
        {activeTab === 'dashboard' && (
          <DashboardView
            transactions={transactions}
            userName={currentUser.name}
            onNavigate={setActiveTab}
            onOpenAddProduct={() => setIsAddProductOpen(true)}
            onOpenStockAction={handleOpenStockAction}
          />
        )}

        {activeTab === 'pos' && (
          <PosView
            products={products}
            cart={cart}
            onAddToCart={handleAddToCart}
            onNavigate={setActiveTab}
            onOpenScanner={() => setIsScannerOpen(true)}
          />
        )}

        {activeTab === 'cart' && (
          <CartView
            cart={cart}
            selectedCustomer={selectedCustomer}
            discount={discount}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onOpenCustomerModal={() => setIsCustomerModalOpen(true)}
            onApplyDiscount={(amount) => setDiscount(amount)}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'checkout' && (
          <CheckoutView
            cart={cart}
            selectedCustomer={selectedCustomer}
            discount={discount}
            onCompleteCheckout={handleCompleteCheckout}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'receipt' && (
          <ReceiptView
            transaction={currentTransaction}
            onNewTransaction={handleNewTransaction}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'inventory' && (
          <InventoryView
            products={products}
            warehouses={WAREHOUSES}
            activities={stockActivities}
            onOpenAddProduct={() => setIsAddProductOpen(true)}
            onOpenScanner={() => setIsScannerOpen(true)}
            onOpenStockAction={handleOpenStockAction}
          />
        )}

        {activeTab === 'customers' && (
          <CustomersView
            customers={customers}
            onAddCustomer={handleAddCustomer}
            onSelectCustomerForPos={(cust) => setSelectedCustomer(cust)}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'warehouse' && (
          <WarehouseView
            warehouses={WAREHOUSES}
            activities={stockActivities}
            products={products}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'reports' && <ReportsView />}
      </main>

      {/* Modals */}
      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        customers={customers}
        selectedCustomer={selectedCustomer}
        onSelectCustomer={setSelectedCustomer}
        onAddCustomer={handleAddCustomer}
      />

      <ScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        products={products}
        onScanSuccess={(prod) => {
          handleAddToCart(prod);
        }}
      />

      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onAddProduct={handleAddProduct}
      />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        initialMode={onboardingMode}
        onLoginSuccess={handleLoginSuccess}
      />

      <StockActionModal
        isOpen={isStockModalOpen}
        initialAction={currentStockAction}
        products={products}
        warehouses={WAREHOUSES}
        onClose={() => setIsStockModalOpen(false)}
        onStockIn={handleStockIn}
        onStockOut={handleStockOut}
        onAudit={handleAudit}
        onTransfer={handleTransfer}
      />
    </div>
  );
}

export default App;
