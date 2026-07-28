export type TabType = 'dashboard' | 'pos' | 'cart' | 'checkout' | 'receipt' | 'inventory' | 'customers' | 'warehouse' | 'stores' | 'reports' | 'staff' | 'suppliers' | 'more';

export type PaymentMethod = 'cash' | 'qris' | 'transfer' | 'card';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: 'Bangunan' | 'Listrik' | 'Plumbing' | 'Cat & Aksesoris' | 'Perkakas';
  price: number;
  stock: number;
  unit: string;
  image: string;
  imageAlt?: string;
  minStock?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Customer {
  id: string;
  code?: string;
  name: string;
  type: string;
  phone?: string;
  email?: string;
  address?: string;
  status?: 'Aktif' | 'Nonaktif';
  totalTransactions?: number;
  totalSpent?: number;
  createdAt?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  username?: string;
  password?: string;
  phone: string;
  role: 'Kasir' | 'Admin POS' | 'Kepala Toko' | 'Staf Gudang' | 'Supervisor';
  status: 'Aktif' | 'Cuti' | 'Nonaktif';
  shift: 'Pagi (08:00 - 16:00)' | 'Sore (16:00 - 22:00)' | 'Full Time';
  avatar: string;
  joinDate: string;
  totalTransactions?: number;
  pin?: string;
}

export interface Supplier {
  id: string;
  code: string;
  name: string;
  contactPerson: string;
  category: string;
  phone: string;
  email: string;
  address: string;
  paymentTerms: 'Cash On Delivery' | 'Tempo 14 Hari' | 'Tempo 30 Hari' | 'Tempo 60 Hari';
  status: 'Aktif' | 'Nonaktif';
  totalOrders: number;
  totalPurchases: number;
  rating?: number;
}

export interface TransactionItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Transaction {
  id: string;
  date: string;
  time: string;
  cashier: string;
  customerName: string;
  items: TransactionItem[];
  subtotal: number;
  tax: number;
  discount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  amountPaid: number;
  change: number;
  status: 'Selesai' | 'Dibatalkan';
}

export interface Warehouse {
  id: string;
  code?: string;
  name: string;
  location: string;
  address?: string;
  manager?: string;
  phone?: string;
  totalStock: number;
  capacityPercentage: number;
  status: 'ACTIVE' | 'MAINTENANCE' | 'FULL';
}

export interface StockActivity {
  id: string;
  productName: string;
  image: string;
  type: 'Audit' | 'Inbound' | 'Sales' | 'Outbound' | 'Adjustment';
  changeText: string;
  time: string;
  location: string;
}

export interface StoreBranch {
  id: string;
  code: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  manager: string;
  type: 'Pusat' | 'Cabang Utama' | 'Toko Retail' | 'Outlet Proyek';
  status: 'Aktif' | 'Tutup Sementara' | 'Nonaktif';
  totalCashiers: number;
  monthlyTarget: number;
  monthlyRevenue: number;
  openHours: string;
}
