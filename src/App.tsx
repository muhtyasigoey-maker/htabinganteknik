import React, { useState } from 'react';
import { TabType, Product, CartItem, Customer, Transaction, StockActivity, StaffMember, Supplier, StoreBranch, Warehouse } from './types';
import { INITIAL_PRODUCTS, INITIAL_TRANSACTIONS, INITIAL_CUSTOMERS, DEFAULT_CUSTOMER, INITIAL_WAREHOUSES, RECENT_ACTIVITIES, INITIAL_STAFF, INITIAL_SUPPLIERS, INITIAL_STORES } from './data/mockData';

import { Navigation } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { PosView } from './components/PosView';
import { CartView } from './components/CartView';
import { CheckoutView } from './components/CheckoutView';
import { ReceiptView } from './components/ReceiptView';
import { InventoryView } from './components/InventoryView';
import { CustomersView } from './components/CustomersView';
import { WarehouseView } from './components/WarehouseView';
import { StoresView } from './components/StoresView';
import { ReportsView } from './components/ReportsView';
import { StaffView } from './components/StaffView';
import { SuppliersView } from './components/SuppliersView';

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
  const [warehouses, setWarehouses] = useState<Warehouse[]>(INITIAL_WAREHOUSES);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>(DEFAULT_CUSTOMER);
  const [discount, setDiscount] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [stockActivities, setStockActivities] = useState<StockActivity[]>(RECENT_ACTIVITIES);
  const [staffList, setStaffList] = useState<StaffMember[]>(INITIAL_STAFF);
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [stores, setStores] = useState<StoreBranch[]>(INITIAL_STORES);
  const [activeStoreName, setActiveStoreName] = useState<string>('Toko H. Tabingan Teknik (Pusat - Jakarta)');

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
    role: 'Admin POS',
    avatar: 'AU',
    shift: 'Full Time',
    phone: '0812-8899-7700',
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

  const handleLoginSuccess = (staffOrEmail?: StaffMember | string) => {
    setIsLoggedIn(true);
    if (typeof staffOrEmail === 'object' && staffOrEmail !== null) {
      setCurrentUser({
        name: staffOrEmail.name,
        email: staffOrEmail.email,
        role: staffOrEmail.role,
        avatar: staffOrEmail.avatar || staffOrEmail.name.slice(0, 2).toUpperCase(),
        shift: staffOrEmail.shift || 'Full Time',
        phone: staffOrEmail.phone || '0812-0000-1111',
      });
      showToast(`Berhasil masuk sebagai ${staffOrEmail.name} (${staffOrEmail.role})!`);
    } else if (typeof staffOrEmail === 'string' && staffOrEmail.trim() !== '') {
      const namePart = staffOrEmail.split('@')[0];
      const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      const isA = formattedName.toLowerCase().includes('admin');
      setCurrentUser({
        name: isA ? 'Admin Utama' : `Staff (${formattedName})`,
        email: staffOrEmail,
        role: isA ? 'Admin POS' : 'Kasir',
        avatar: staffOrEmail.slice(0, 2).toUpperCase(),
        shift: 'Full Time',
        phone: '0812-0000-1111',
      });
      showToast(`Berhasil masuk sebagai ${isA ? 'Admin POS' : 'Kasir'}`);
    } else {
      showToast('Berhasil masuk ke sistem.');
    }
    setIsOnboardingOpen(false);
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
    showToast(`Pelanggan "${newCust.name}" berhasil ditambahkan`);
  };

  const handleUpdateCustomer = (updatedCust: Customer) => {
    setCustomers((prev) => prev.map((c) => (c.id === updatedCust.id ? updatedCust : c)));
    showToast(`Data pelanggan "${updatedCust.name}" berhasil diperbarui`);
  };

  const handleDeleteCustomer = (id: string) => {
    const cust = customers.find((c) => c.id === id);
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    showToast(`Pelanggan "${cust?.name || ''}" telah dihapus`);
  };

  const handleAddWarehouse = (newWh: Warehouse) => {
    setWarehouses((prev) => [...prev, newWh]);
    showToast(`Gudang "${newWh.name}" berhasil ditambahkan`);
  };

  const handleUpdateWarehouse = (updatedWh: Warehouse) => {
    setWarehouses((prev) => prev.map((w) => (w.id === updatedWh.id ? updatedWh : w)));
    showToast(`Data gudang "${updatedWh.name}" berhasil diperbarui`);
  };

  const handleDeleteWarehouse = (id: string) => {
    const wh = warehouses.find((w) => w.id === id);
    setWarehouses((prev) => prev.filter((w) => w.id !== id));
    showToast(`Gudang "${wh?.name || ''}" telah dihapus`);
  };

  const handleAddStore = (newStore: StoreBranch) => {
    setStores((prev) => [newStore, ...prev]);
    showToast(`Cabang "${newStore.name}" berhasil ditambahkan`);
  };

  const handleUpdateStore = (updatedStore: StoreBranch) => {
    setStores((prev) => prev.map((s) => (s.id === updatedStore.id ? updatedStore : s)));
    showToast(`Data cabang "${updatedStore.name}" berhasil diperbarui`);
  };

  const handleDeleteStore = (id: string) => {
    const st = stores.find((s) => s.id === id);
    setStores((prev) => prev.filter((s) => s.id !== id));
    showToast(`Cabang "${st?.name || ''}" telah dihapus`);
  };

  const handleAddStaff = (newStaff: StaffMember) => {
    setStaffList((prev) => [newStaff, ...prev]);
    showToast('Staff baru berhasil ditambahkan');
  };

  const handleUpdateStaff = (updated: StaffMember) => {
    setStaffList((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    showToast('Data staff berhasil diperbarui');
  };

  const handleDeleteStaff = (id: string) => {
    const st = staffList.find((s) => s.id === id);
    setStaffList((prev) => prev.filter((s) => s.id !== id));
    showToast(`Staff "${st?.name || ''}" telah dihapus`);
  };

  const handleAddSupplier = (newSup: Supplier) => {
    setSuppliers((prev) => [newSup, ...prev]);
    showToast('Pemasok baru berhasil ditambahkan');
  };

  const handleUpdateSupplier = (updated: Supplier) => {
    setSuppliers((prev) => prev.map((sup) => (sup.id === updated.id ? updated : sup)));
    showToast('Data pemasok berhasil diperbarui');
  };

  const handleDeleteSupplier = (id: string) => {
    const sup = suppliers.find((s) => s.id === id);
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
    showToast(`Pemasok "${sup?.name || ''}" telah dihapus`);
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
            currentUser={currentUser}
            onNavigate={setActiveTab}
            onOpenAddProduct={() => setIsAddProductOpen(true)}
            onOpenStockAction={handleOpenStockAction}
            onOpenLogin={handleOpenLogin}
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
            warehouses={warehouses}
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
            onUpdateCustomer={handleUpdateCustomer}
            onDeleteCustomer={handleDeleteCustomer}
            onSelectCustomerForPos={(cust) => setSelectedCustomer(cust)}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'warehouse' && (
          <WarehouseView
            warehouses={warehouses}
            onAddWarehouse={handleAddWarehouse}
            onUpdateWarehouse={handleUpdateWarehouse}
            onDeleteWarehouse={handleDeleteWarehouse}
            activities={stockActivities}
            products={products}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'stores' && (
          <StoresView
            stores={stores}
            onAddStore={handleAddStore}
            onUpdateStore={handleUpdateStore}
            onDeleteStore={handleDeleteStore}
            onSelectStoreForPos={(storeName) => {
              setActiveStoreName(storeName);
              showToast(`Toko POS aktif diubah ke "${storeName}"`);
            }}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'staff' && (
          <StaffView
            staffList={staffList}
            onAddStaff={handleAddStaff}
            onUpdateStaff={handleUpdateStaff}
            onDeleteStaff={handleDeleteStaff}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'suppliers' && (
          <SuppliersView
            suppliers={suppliers}
            onAddSupplier={handleAddSupplier}
            onUpdateSupplier={handleUpdateSupplier}
            onDeleteSupplier={handleDeleteSupplier}
            onNavigate={setActiveTab}
            onOpenStockInWithSupplier={() => {
              handleOpenStockAction('stock_in');
            }}
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
        staffList={staffList}
      />

      <StockActionModal
        isOpen={isStockModalOpen}
        initialAction={currentStockAction}
        products={products}
        warehouses={warehouses}
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
