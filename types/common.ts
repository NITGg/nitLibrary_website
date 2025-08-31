import { Product } from "./product";
import { User } from "./user";

export type SearchParams = Record<string, string | string[] | undefined>;

export interface CartItem {
  id: string;
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
  product: Product;
  userId?: string;
  productId: string;
  user?: User;
}

export interface WishlistItem {
  id: string;
  product: Product;
  userId?: string;
  productId: string;
  user?: User;
  createdAt?: string;
}

export interface ErrorResponse {
  response: {
    status: number;
    message: string;
    data?: Record<string, any>;
  };
}
