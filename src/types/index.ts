export type UserRole = 'admin' | 'staff' | 'customer';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  dutyTitle?: string; // For staff e.g. "Head Barista", "Pastry Specialist", "Counter Lead"
  shift?: string;     // e.g. "Morning Shift (7:00 AM - 3:00 PM)"
  createdAt?: string;
}

export type ProductCategory = 'Hot Coffee' | 'Cold Brews' | 'Pastries & Bakery' | 'Specialty Blends';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // in BDT ৳
  category: ProductCategory;
  imageUrl: string;
  stock: number;
  isAvailable: boolean;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'pending' | 'brewing' | 'ready' | 'completed' | 'cancelled';
export type OrderType = 'Cash on Delivery' | 'Pay at Counter / Dine-in';

export interface OrderItemSummary {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface Order {
  id: string; // Order code (e.g. AHN-7842)
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  deliveryAddress?: string;
  orderType: OrderType;
  paymentMethod: 'Cash on Delivery / Pay at Counter';
  items: OrderItemSummary[];
  totalAmount: number; // in BDT ৳
  status: OrderStatus;
  userId?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Review {
  id: string;
  productId?: string;
  productName: string;
  customerName: string;
  userId?: string;
  rating: number; // 1 - 5
  comment: string;
  createdAt: string;
}
