export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  category: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderItem {
  productId: {
    _id: string;
    name: string;
    image: string;
    price: number;
  };
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'Chờ thanh toán' | 'Chờ xử lý' | 'Đang giao' | 'Hoàn thành' | 'Đã hủy';
  shippingAddress: string;
  paymentMethod: 'Tiền mặt' | 'Chuyển khoản';
  paymentStatus?: 'Chưa thanh toán' | 'Đã thanh toán' | null;
  paymentAccount?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  _id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  category: string;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Admin {
  _id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RequestData {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock?: number;
}

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  token: string;
  phone?: string;
  address?: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
  message?: string;
}

export interface LoginResponse extends AuthResponse {
  user: AuthUser;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface PaginatedCustomerResponse {
  customers: Customer[];
  currentPage: number;
  totalPages: number;
  totalCustomers: number;
}

export interface PaymentSchema {
  paymentMethod: 'Tiền mặt' | 'Chuyển khoản';
  shippingAddress: string;
  paymentAccount?: string;
}