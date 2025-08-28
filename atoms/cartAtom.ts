import { atom } from "jotai";
import { clientApiFetch } from "@/lib/clientApiFetch";
import { userAtom, tokenAtom } from "./userAtom";

export interface CartItem {
  id: string; // Changed to string to match backend UUID
  productId: string; // Added productId for backend sync
  name: string;
  nameAr?: string;
  price: number;
  quantity: number;
  image?: string;
  offer?: number;
  cartItemId?: string; // Backend cart item ID
}

// Backend cart item interface
interface BackendCartItem {
  id: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
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

// Load cart from localStorage on initialization
const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === "undefined") return [];

  // Use a try-catch block to handle any localStorage errors
  try {
    // Only access localStorage on the client side during hydration
    if (document.readyState === "complete") {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  } catch {
    return [];
  }
};

// Save cart to localStorage
const saveCartToStorage = (cart: CartItem[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
};

// Convert backend cart item to frontend cart item
const convertBackendCartItem = (backendItem: BackendCartItem): CartItem => ({
  id: backendItem.product.id,
  productId: backendItem.product.id,
  name: backendItem.product.title,
  nameAr: backendItem.product.titleAr,
  price: backendItem.product.price,
  quantity: backendItem.quantity,
  image: backendItem.product.imageUrl,
  cartItemId: backendItem.id,
});

export const cartAtom = atom<CartItem[]>(loadCartFromStorage());

// Sync cart from backend
export const syncCartFromBackendAtom = atom(null, async (get, set) => {
  const user = get(userAtom);
  const token = get(tokenAtom);
  if (!user || !token) return;

  try {
    const response = await clientApiFetch<{
      success: boolean;
      cart: BackendCartItem[];
      totalItems: number;
      totalPrice: number;
    }>("/api/users/cart", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.success) {
      const cartItems = response.cart.map(convertBackendCartItem);
      set(cartAtom, cartItems);
      saveCartToStorage(cartItems);
    }
  } catch (error) {
    console.error("Failed to sync cart from backend:", error);
  }
});

export const cartCountAtom = atom((get) => {
  const cart = get(cartAtom);
  return cart.reduce((total, item) => total + item.quantity, 0);
});

export const cartTotalAtom = atom((get) => {
  const cart = get(cartAtom);
  return cart.reduce((total, item) => {
    const price = item.offer
      ? item.price - (item.price * item.offer) / 100
      : item.price;
    return total + price * item.quantity;
  }, 0);
});

export const addToCartAtom = atom(
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
    const cart = get(cartAtom);
    const user = get(userAtom);
    const token = get(tokenAtom);

    // Local cart update
    const existingItem = cart.find((item) => item.id === product.id);
    let newCart: CartItem[];

    if (existingItem) {
      newCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newCart = [
        ...cart,
        {
          ...product,
          productId: product.id,
          quantity: 1,
        },
      ];
    }

    set(cartAtom, newCart);
    saveCartToStorage(newCart);
console.log(user);
console.log(token);

    // Sync with backend if user is logged in
    if (user && token) {
      console.log("Syncing cart with backend:");
      try {
        await clientApiFetch("/api/users/cart", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: product.id,
            quantity: 1,
          }),
        });
      } catch (error) {
        console.error("Failed to sync cart with backend:", error);
        // Optionally revert local changes or show error to user
      }
    }
  }
);

export const removeFromCartAtom = atom(
  null,
  async (get, set, productId: string) => {
    const cart = get(cartAtom);
    const user = get(userAtom);
    const token = get(tokenAtom);

    // Find the item to get its cartItemId
    const itemToRemove = cart.find((item) => item.id === productId);

    // Local cart update
    const newCart = cart.filter((item) => item.id !== productId);
    set(cartAtom, newCart);
    saveCartToStorage(newCart);

    // Sync with backend if user is logged in
    if (user && token && itemToRemove?.cartItemId) {
      try {
        await clientApiFetch("/api/users/cart", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            cartItemId: itemToRemove.cartItemId,
          }),
        });
      } catch (error) {
        console.error("Failed to remove item from backend cart:", error);
      }
    }
  }
);

export const updateQuantityAtom = atom(
  null,
  async (get, set, { id, quantity }: { id: string; quantity: number }) => {
    const cart = get(cartAtom);
    const user = get(userAtom);
    const token = get(tokenAtom);

    // Find the item to get its cartItemId
    const itemToUpdate = cart.find((item) => item.id === id);

    // Local cart update
    const newCart =
      quantity <= 0
        ? cart.filter((item) => item.id !== id)
        : cart.map((item) => (item.id === id ? { ...item, quantity } : item));

    set(cartAtom, newCart);
    saveCartToStorage(newCart);

    // Sync with backend if user is logged in
    if (user && token && itemToUpdate?.cartItemId) {
      try {
        if (quantity <= 0) {
          // Remove item
          await clientApiFetch("/api/users/cart", {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              cartItemId: itemToUpdate.cartItemId,
            }),
          });
        } else {
          // Update quantity
          await clientApiFetch("/api/users/cart", {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              cartItemId: itemToUpdate.cartItemId,
              quantity,
            }),
          });
        }
      } catch (error) {
        console.error("Failed to update cart item in backend:", error);
      }
    }
  }
);

export const clearCartAtom = atom(null, async (get, set) => {
  const user = get(userAtom);
  const token = get(tokenAtom);

  // Local cart update
  set(cartAtom, []);
  saveCartToStorage([]);

  // Sync with backend if user is logged in
  if (user && token) {
    try {
      await clientApiFetch("/api/users/cart/clear", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Failed to clear cart in backend:", error);
    }
  }
});
