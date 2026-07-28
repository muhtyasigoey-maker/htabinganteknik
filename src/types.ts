export type TabType = 'dashboard' | 'pos' | 'cart' | 'checkout' | 'receipt' | 'inventory' | 'customers' | 'warehouse' | 'reports' | 'more';

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
  name: string;
  type: string;
  phone?: string;
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
  name: string;
  location: string;
  totalStock: number;
  capacityPercentage: number;
  status: 'ACTIVE' | 'MAINTENANCE';
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
