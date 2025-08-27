export type UserRole = "ADMIN" | "USER";

export type User = {
  id: string;
  fullname: string;
  email: string;
  imageUrl: string | null;
  role: UserRole;
  phone: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
  lang?: "EN" | "AR";
  isConfirmed?: boolean;
  birthDate?: string;
  gender: string;
  isDeleted?: boolean;
  UserAddress?: UserAddress[];
};

export type UserAddress = {
  id: string;
  address: string;
  lat: string;
  long: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
  User?: User;
};
