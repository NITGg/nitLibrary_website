import { Category } from "./category";
import { OrderItem } from "./order";

export interface Product {
  id: string;
  name: string;
  nameAr?: string;
  description?: string;
  descriptionAr?: string;
  images?: string[];
  price: number;
  costPrice?: number;
  offer: number;
  stock: number;
  minStock?: number;
  sku: string;
  barcode?: string;
  weight?: number;
  dimensions?: string;
  isActive: boolean;
  category?: Partial<Category>;
  createdAt: string;
  updatedAt?: string;
  categoryId: number;
  isFeatured: boolean;
  supplierId?: number;
  supplier?: any;
  orderItems?: OrderItem[];
  cartItems?: any[];
  reviews?: any[];
  wishlist?: any[];
  bookDetails?: any;
}

export interface ProductApiResponse {
  products: Product[];
  totalProducts: number;
  totalPages: number;
}