import { Product } from "./product";

export interface Category {
  id: number;
  name: string;
  nameAr: string;
  description?: string;
  descriptionAr?: string;
  imageUrl?: string;
  parentId?: number;
  parent?: Partial<Category>;
  children?: Partial<Category[]>;
  products?: Partial<Product[]>;
  createdAt: string;
  updatedAt?: string;
  isActive: boolean;
  _count?: {
    children?: number;
    products?: number;
  };
}

export interface CategoriesApiResponse {
  categories: Category[];
  totalCount: number;
  totalPages: number;
//   parentCategory?: {
//     name: string;
//     nameAr?: string;
//     parent?: {
//       name: string;
//       nameAr?: string;
//     };
//   }; 
}