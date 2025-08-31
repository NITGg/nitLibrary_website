import { useAtom } from "jotai";
import { wishlistAtom } from "@/atoms/wishlistAtom";
import { WishlistItem } from "@/types/common";
import { clientApiFetch } from "@/lib/clientApiFetch";
import { useLocale, useTranslations } from "next-intl";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export const useWishlist = () => {
  const [wishlist, setWishlist] = useAtom(wishlistAtom);
  const { user, token } = useAuth();
  const locale = useLocale();
  const t = useTranslations("common");

const addToWishlist = async (item: WishlistItem) => {
    const existingIndex = wishlist.findIndex(
        (i) => i.productId === item.productId
    );
    let updatedWishlist: WishlistItem[];
    let action: "add" | "remove";

    if (existingIndex !== -1) {
        // Item exists, remove it
        updatedWishlist = [...wishlist];
        updatedWishlist.splice(existingIndex, 1);
        action = "remove";
    } else {
        // Item does not exist, add it
        updatedWishlist = [...wishlist, item];
        action = "add";
    }

    setWishlist(updatedWishlist);

    if (!user || !token) {
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
        return;
    }

    await addWishlistItemUser(item.productId, action);
};

  const addWishlistItemUser = async (productId: string, action: "add" | "remove") => {
    if (!user || !token) return;
    try {
      await clientApiFetch(
        "/api/users/wishlist",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            productId,
          }),
        },
        locale
      );
      toast.success(
        t(action === "add" ? "wishlist.added" : "wishlist.removed")
      );
    } catch (error) {
      console.error("Failed to add item to user wishlist:", error);
      toast.error(t("wishlist.error"));
    }
  };

  const clearWishlist = async () => {
    setWishlist([]);
    if (!user || !token) return clearWishlistLocal();
    try {
      await clientApiFetch(
        "/api/users/wishlist",
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
        locale
      );
      toast.success(t("wishlist.empty"));
    } catch (error) {
      console.error("Failed to clear user wishlist:", error);
      toast.error(t("wishlist.error"));
    }
  };

  const wishlistCount = wishlist.length;

  const getWishlistFromLocal = () => {
    if (typeof window === "undefined") return [];
    const wishlist = localStorage.getItem("wishlist");
    const parsedWishlist: WishlistItem[] = wishlist ? JSON.parse(wishlist) : [];
    const sameUser = parsedWishlist.every(
      (item: WishlistItem) => item.userId === user?.id
    );
    if (!sameUser) clearWishlistLocal();
    return sameUser ? parsedWishlist : [];
  };

  const clearWishlistLocal = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("wishlist");
    }
  };
  const fetchWishlistItems = async (): Promise<WishlistItem[]> => {
    if (!token) return [];

    try {
      const fields = "id,createdAt,user,product,productId,userId";
      const data = await clientApiFetch<{ wishlistItems: WishlistItem[] }>(
        `/api/users/wishlist?fields=${fields}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
        locale
      );
      return data.wishlistItems;
    } catch (error) {
      console.error("Failed to fetch wishlist items:", error);
      return [];
    }
  };

  const mergeWishlists = async (
    localWishlist: WishlistItem[],
    serverWishlist: WishlistItem[]
  ): Promise<WishlistItem[]> => {
    try {
      const mergedWishlistMap = new Map<string, WishlistItem>();

      // Add server wishlist items to the map
      serverWishlist.forEach((item) => {
        mergedWishlistMap.set(item.id, item);
      });

      // Merge local wishlist items
      localWishlist.forEach(async (localItem) => {
        if (!mergedWishlistMap.has(localItem.id)) {
          mergedWishlistMap.set(localItem.id, localItem);
          await addWishlistItemUser(localItem.id, "add");
        }
      });

      return Array.from(mergedWishlistMap.values());
    } catch (error) {
      console.error("Failed to merge wishlists:", error);

      return [];
    }
  };

  return {
    wishlist,
    setWishlist,
    addToWishlist,
    clearWishlist,
    wishlistCount,
    getWishlistFromLocal,
    fetchWishlistItems,
    mergeWishlists,
    addWishlistItemUser,
    clearWishlistLocal
  };
};