"use client";

import { useAtom } from "jotai";
import { useState, useEffect } from "react";
import {
  cartAtom,
  cartCountAtom,
  cartTotalAtom,
  addToCartAtom,
  removeFromCartAtom,
  updateQuantityAtom,
  clearCartAtom,
  syncCartFromBackendAtom,
} from "@/atoms/cartAtom";
import {
  wishlistAtom,
  wishlistCountAtom,
  addToWishlistAtom,
  removeFromWishlistAtom,
  toggleWishlistAtom,
  isInWishlistAtom,
  clearWishlistAtom,
  syncWishlistFromBackendAtom,
} from "@/atoms/wishlistAtom";

/**
 * A custom hook that provides cart and wishlist functionality with hydration safety
 * This hook should be the primary way to access cart and wishlist state
 */
export const useShoppingState = () => {
  // Track client-side mounting to prevent hydration errors
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state after hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Cart atoms
  const [cart] = useAtom(cartAtom);
  const [cartCount] = useAtom(cartCountAtom);
  const [cartTotal] = useAtom(cartTotalAtom);
  const [, addToCart] = useAtom(addToCartAtom);
  const [, removeFromCart] = useAtom(removeFromCartAtom);
  const [, updateQuantity] = useAtom(updateQuantityAtom);
  const [, clearCart] = useAtom(clearCartAtom);
  const [, syncCartFromBackend] = useAtom(syncCartFromBackendAtom);

  // Wishlist atoms
  const [wishlist] = useAtom(wishlistAtom);
  const [wishlistCount] = useAtom(wishlistCountAtom);
  const [, addToWishlist] = useAtom(addToWishlistAtom);
  const [, removeFromWishlist] = useAtom(removeFromWishlistAtom);
  const [, toggleWishlist] = useAtom(toggleWishlistAtom);
  const [, clearWishlist] = useAtom(clearWishlistAtom);
  const [, syncWishlistFromBackend] = useAtom(syncWishlistFromBackendAtom);
  const [isInWishlist] = useAtom(isInWishlistAtom);

  return {
    // Mounted state for hydration safety
    isMounted,

    // Cart state and methods
    cart: isMounted ? cart : [],
    cartCount: isMounted ? cartCount : 0,
    cartTotal: isMounted ? cartTotal : 0,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    syncCartFromBackend,

    // Wishlist state and methods
    wishlist: isMounted ? wishlist : [],
    wishlistCount: isMounted ? wishlistCount : 0,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    syncWishlistFromBackend,
    isInWishlist,
  };
};

// Keep the old hooks for backward compatibility, but mark as deprecated
/**
 * @deprecated Use useShoppingState() instead for better hydration safety
 */
export const useCart = () => {
  const shoppingState = useShoppingState();
  return {
    cart: shoppingState.cart,
    cartCount: shoppingState.cartCount,
    cartTotal: shoppingState.cartTotal,
    addToCart: shoppingState.addToCart,
    removeFromCart: shoppingState.removeFromCart,
    updateQuantity: shoppingState.updateQuantity,
    clearCart: shoppingState.clearCart,
    syncCartFromBackend: shoppingState.syncCartFromBackend,
  };
};

/**
 * @deprecated Use useShoppingState() instead for better hydration safety
 */
export const useWishlist = () => {
  const shoppingState = useShoppingState();
  return {
    wishlist: shoppingState.wishlist,
    wishlistCount: shoppingState.wishlistCount,
    addToWishlist: shoppingState.addToWishlist,
    removeFromWishlist: shoppingState.removeFromWishlist,
    toggleWishlist: shoppingState.toggleWishlist,
    clearWishlist: shoppingState.clearWishlist,
    syncWishlistFromBackend: shoppingState.syncWishlistFromBackend,
    isInWishlist: shoppingState.isInWishlist,
  };
};
