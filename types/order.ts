import { Product } from "./product";
import { User } from "./user";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";
export type PaymentMethod = "CASH" | "CARD";
export interface OrderItem {
  id: string;
  orderId?: string;
  productId?: number;
  quantity: number;
  price?: number;
  createdAt?: string;
  order?: Order;
  product?: Partial<Product>;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  totalAmount: number;
  shippingCost: number;
  discount: number;
  taxAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  shippingAddress: PaymentMethod;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  customer?: Partial<User>;
  items?: OrderItem[];
}

interface OrderApiResponse {
  orders: Order[];
  totalCount: number;
  totalPages: number;
}