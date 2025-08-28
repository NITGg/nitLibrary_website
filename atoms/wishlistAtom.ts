import { atom } from "jotai";
import { clientApiFetch } from "@/lib/clientApiFetch";
import { userAtom, tokenAtom } from "./userAtom";

export interface WishlistItem {
  id: string; // Product ID
  name: string;
  nameAr?: string;
  price: number;
  image?: string;
  offer?: number;
  wishlistItemId?: string; // Backend wishlist item ID
  createdAt?: string;
}

// Backend wishlist item interface
interface BackendWishlistItem {
  id: string;
  createdAt: string;
  product: {
    id: string;
    title: string;
    titleAr?: string;
    price: number;
    imageUrl?: string;
    stock: number;
    isActive: boolean;
  };
}

// Load wishlist from localStorage on initialization
const loadWishlistFromStorage = (): WishlistItem[] => {
  if (typeof window === "undefined") return [];

  // Use a try-catch block to handle any localStorage errors
  try {
    // Only access localStorage on the client side during hydration
    if (document.readyState === "complete") {
      const saved = localStorage.getItem("wishlist");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  } catch {
    return [];
  }
};

// Save wishlist to localStorage
const saveWishlistToStorage = (wishlist: WishlistItem[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }
};

// Convert backend wishlist item to frontend wishlist item
const convertBackendWishlistItem = (
  backendItem: BackendWishlistItem
): WishlistItem => ({
  id: backendItem.product.id,
  name: backendItem.product.title,
  nameAr: backendItem.product.titleAr,
  price: backendItem.product.price,
  image: backendItem.product.imageUrl,
  wishlistItemId: backendItem.id,
  createdAt: backendItem.createdAt,
});

export const wishlistAtom = atom<WishlistItem[]>(loadWishlistFromStorage());

// Sync wishlist from backend
export const syncWishlistFromBackendAtom = atom(null, async (get, set) => {
  const user = get(userAtom);
  const token = get(tokenAtom);
  if (!user || !token) return;

  try {
    const response = await clientApiFetch<{
      success: boolean;
      wishlist: BackendWishlistItem[];
      totalItems: number;
      totalPages: number;
      currentPage: number;
    }>("/api/users/wishlist", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.success) {
      const wishlistItems = response.wishlist.map(convertBackendWishlistItem);
      set(wishlistAtom, wishlistItems);
      saveWishlistToStorage(wishlistItems);
    }
  } catch (error) {
    console.error("Failed to sync wishlist from backend:", error);
  }
});

// Check if item is in wishlist
export const isInWishlistAtom = atom((get) => (productId: string) => {
  const wishlist = get(wishlistAtom);
  return wishlist.some((item) => item.id === productId);
});

// Get wishlist count
export const wishlistCountAtom = atom((get) => {
  const wishlist = get(wishlistAtom);
  return wishlist.length;
});

// Add item to wishlist
export const addToWishlistAtom = atom(
  null,
  async (
    get,
    set,
    product: {
      id: string;
      name: string;
      nameAr?: string;
      price: number;
      image?: string;
      offer?: number;
    }
  ) => {
    const wishlist = get(wishlistAtom);
    const user = get(userAtom);
    const token = get(tokenAtom);

    // Check if item already exists
    const existingItem = wishlist.find((item) => item.id === product.id);
    if (existingItem) {
      return; // Item already in wishlist
    }

    // Local wishlist update
    const newWishlistItem: WishlistItem = {
      ...product,
      createdAt: new Date().toISOString(),
    };
    const newWishlist = [...wishlist, newWishlistItem];

    set(wishlistAtom, newWishlist);
    saveWishlistToStorage(newWishlist);

    // Sync with backend if user is logged in
    if (user && token) {
      try {
        const response = await clientApiFetch<{
          success: boolean;
          wishlistItem: {
            id: string;
            productId: string;
            userId: string;
            createdAt: string;
          };
        }>("/api/users/wishlist", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: product.id,
          }),
        });

        if (response.success) {
          // Update the item with the backend ID
          const updatedWishlist = newWishlist.map((item) =>
            item.id === product.id
              ? { ...item, wishlistItemId: response.wishlistItem.id }
              : item
          );
          set(wishlistAtom, updatedWishlist);
          saveWishlistToStorage(updatedWishlist);
        }
      } catch (error) {
        console.error("Failed to add item to backend wishlist:", error);
        // Optionally revert local changes
        set(wishlistAtom, wishlist);
        saveWishlistToStorage(wishlist);
      }
    }
  }
);

// Remove item from wishlist
export const removeFromWishlistAtom = atom(
  null,
  async (get, set, productId: string) => {
    const wishlist = get(wishlistAtom);
    const user = get(userAtom);
    const token = get(tokenAtom);

    // Local wishlist update
    const newWishlist = wishlist.filter((item) => item.id !== productId);
    set(wishlistAtom, newWishlist);
    saveWishlistToStorage(newWishlist);

    // Sync with backend if user is logged in
    if (user && token) {
      try {
        await clientApiFetch("/api/users/wishlist", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId,
          }),
        });
      } catch (error) {
        console.error("Failed to remove item from backend wishlist:", error);
      }
    }
  }
);

// Toggle wishlist item (add if not exists, remove if exists)
export const toggleWishlistAtom = atom(
  null,
  async (
    get,
    set,
    product: {
      id: string;
      name: string;
      nameAr?: string;
      price: number;
      image?: string;
      offer?: number;
    }
  ) => {
    const wishlist = get(wishlistAtom);
    const existingItem = wishlist.find((item) => item.id === product.id);

    if (existingItem) {
      // Remove from wishlist
      await set(removeFromWishlistAtom, product.id);
    } else {
      // Add to wishlist
      await set(addToWishlistAtom, product);
    }
  }
);

// Check if product is in wishlist (async version for backend sync)
export const checkWishlistAtom = atom(
  null,
  async (get, set, productId: string) => {
    const user = get(userAtom);
    const token = get(tokenAtom);

    if (!user || !token) {
      // Return local status
      const wishlist = get(wishlistAtom);
      return wishlist.some((item) => item.id === productId);
    }

    try {
      const response = await clientApiFetch<{
        success: boolean;
        inWishlist: boolean;
        wishlistItem?: {
          id: string;
          createdAt: string;
        };
      }>(`/api/users/wishlist/check/${productId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.inWishlist;
    } catch (error) {
      console.error("Failed to check wishlist status:", error);
      // Fallback to local status
      const wishlist = get(wishlistAtom);
      return wishlist.some((item) => item.id === productId);
    }
  }
);

// Clear wishlist
export const clearWishlistAtom = atom(null, async (get, set) => {
  const user = get(userAtom);
  const token = get(tokenAtom);

  // Local wishlist update
  set(wishlistAtom, []);
  saveWishlistToStorage([]);

  // Sync with backend if user is logged in
  if (user && token) {
    try {
      await clientApiFetch("/api/users/wishlist", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Failed to clear wishlist in backend:", error);
    }
  }
});
