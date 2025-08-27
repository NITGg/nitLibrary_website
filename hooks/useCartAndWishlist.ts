import { useAtom } from "jotai";
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

export const useCart = () => {
  const [cart] = useAtom(cartAtom);
  const [cartCount] = useAtom(cartCountAtom);
  const [cartTotal] = useAtom(cartTotalAtom);
  const [, addToCart] = useAtom(addToCartAtom);
  const [, removeFromCart] = useAtom(removeFromCartAtom);
  const [, updateQuantity] = useAtom(updateQuantityAtom);
  const [, clearCart] = useAtom(clearCartAtom);
  const [, syncCartFromBackend] = useAtom(syncCartFromBackendAtom);

  return {
    cart,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    syncCartFromBackend,
  };
};

export const useWishlist = () => {
  const [wishlist] = useAtom(wishlistAtom);
  const [wishlistCount] = useAtom(wishlistCountAtom);
  const [, addToWishlist] = useAtom(addToWishlistAtom);
  const [, removeFromWishlist] = useAtom(removeFromWishlistAtom);
  const [, toggleWishlist] = useAtom(toggleWishlistAtom);
  const [, clearWishlist] = useAtom(clearWishlistAtom);
  const [, syncWishlistFromBackend] = useAtom(syncWishlistFromBackendAtom);
  const [isInWishlist] = useAtom(isInWishlistAtom);

  return {
    wishlist,
    wishlistCount,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    syncWishlistFromBackend,
    isInWishlist,
  };
};
