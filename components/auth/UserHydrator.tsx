"use client";

import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { clientApiFetch } from "@/lib/clientApiFetch";
import { CartItem, WishlistItem } from "@/types/common";
import { User } from "@/types/user";
import { useLocale } from "next-intl";
import { useEffect } from "react";

export function UserHydrator() {
  const { token, login, user } = useAuth();
  const {
    setCart,
    getCartFromLocal,
    fetchCartItems,
    mergeCarts,
    addItemUser,
    clearCartLocal,
  } = useCart();
  const {
    setWishlist,
    getWishlistFromLocal,
    fetchWishlistItems,
    mergeWishlists,
    addWishlistItemUser,
    clearWishlistLocal,
  } = useWishlist();
  const locale = useLocale();

  useEffect(() => {
    if (!token || user) return;

    (async () => {
      try {
        const res = await clientApiFetch<{ user: User }>(
          "/api/verify-me",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
          locale
        );
        const user = res.user;
        login(user, token);
      } catch (error) {
        console.error("Failed to verify user:", error);
      }
    })();
  }, [token, user]);

  useEffect(() => {
    const syncCart = async () => {
      if (!token) {
        // 🔹 Guest → load from localStorage
        setCart(getCartFromLocal());
        return;
      }

      const serverCart = await fetchCartItems();
      const localCart = getCartFromLocal();

      let finalCart: CartItem[] = [];

      if (serverCart.length === 0 && localCart.length > 0) {
        // Server empty → use local cart
        finalCart = localCart;
        finalCart.forEach(async (item) => {
          await addItemUser(item.id);
        });
      } else if (serverCart.length > 0 && localCart.length === 0) {
        // Local empty → use server
        finalCart = serverCart;
      } else if (serverCart.length > 0 && localCart.length > 0) {
        finalCart = await mergeCarts(localCart, serverCart);
      }

      setCart(finalCart);
      clearCartLocal();
    };

    syncCart();
  }, [
    user,
    token,
  ]);

  useEffect(() => {
    const syncWishlist = async () => {
      if (!token) {
        // 🔹 Guest → load from localStorage
        setWishlist(getWishlistFromLocal());
        return;
      }

      const serverWishlist = await fetchWishlistItems();
      const localWishlist = getWishlistFromLocal();

      let finalWishlist: WishlistItem[] = [];

      if (serverWishlist.length === 0 && localWishlist.length > 0) {
        // Server empty → use local wishlist
        finalWishlist = localWishlist;
        finalWishlist.forEach(async (item) => {
          await addWishlistItemUser(item.id, "add");
        });
      } else if (serverWishlist.length > 0 && localWishlist.length === 0) {
        // Local empty → use server
        finalWishlist = serverWishlist;
      } else if (serverWishlist.length > 0 && localWishlist.length > 0) {
        finalWishlist = await mergeWishlists(localWishlist, serverWishlist);
      }

      setWishlist(finalWishlist);
      clearWishlistLocal();
    };

    syncWishlist();
  }, [
    user,
    token,
  ]);

  return null;
}
