import { useAtom } from "jotai";
import { cartAtom } from "@/atoms/cartAtom";
import { CartItem } from "@/types/common";
import { clientApiFetch } from "@/lib/clientApiFetch";
import { useLocale, useTranslations } from "next-intl";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export const useCart = () => {
  const [cart, setCart] = useAtom(cartAtom);
  const { user, token } = useAuth();
  const locale = useLocale();
  const t = useTranslations("common");

  const addToCart = async (item: CartItem) => {
    const existingItem = cart.findIndex((i) => i.productId === item.productId);
    if (existingItem !== -1) {
      // If item exists, increase quantity
      const updatedCart = [...cart];
      updatedCart[existingItem].quantity += 1;
      setCart(updatedCart);
      if (!user || !token)
        return localStorage.setItem("cart", JSON.stringify(cart));

      return await updateItemUser(item.productId, 1, "increment");
    }
    setCart((prev) => [...prev, { ...item, quantity: 1 }]);
    console.log("Item added to cart:", item);
    console.log("Current cart:", cart);

    if (!user || !token)
      return localStorage.setItem("cart", JSON.stringify(cart));

    await addItemUser(item.productId);
  };

  const addItemUser = async (productId: string) => {
    if (!user || !token) return;
    try {
      await clientApiFetch(
        "/api/users/cart",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            productId,
            quantity: 1,
          }),
        },
        locale
      );
      toast.success(t("cart.added"));
    } catch (error) {
      console.error("Failed to add item to user cart:", error);
      toast.error(t("cart.error"));
    }
  };

  const updateItemUser = async (
    productId: string,
    quantity: number,
    action: "increment" | "decrement" | "set"
  ) => {
    if (!user || !token) return;

    try {
      await clientApiFetch(
        "/api/users/cart",
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            productId,
            quantity,
            action,
          }),
        },
        locale
      );
      toast.success(t("cart.updated"));
    } catch (error) {
      console.error("Failed to update item in user cart:", error);
      toast.error(t("cart.error"));
    }
  };

  const increaseItemQuantity = async (productId: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
    if (!user || !token) {
      return localStorage.setItem("cart", JSON.stringify(cart));
    }

    await updateItemUser(productId, 1, "increment");
  };

  const removeFromCart = async (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
    if (!user || !token)
      return localStorage.setItem("cart", JSON.stringify(cart));

    await updateItemUser(productId, 0, "set");
  };

  const decreaseItemQuantity = async (productId: string) => {
    const item = cart.find((i) => i.productId === productId);
    if (item && item.quantity === 1) {
      setCart((prev) => prev.filter((i) => i.productId !== productId));
      if (!user || !token)
        return localStorage.setItem("cart", JSON.stringify(cart));

      await removeFromCart(productId);
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
      if (!user || !token)
        return localStorage.setItem("cart", JSON.stringify(cart));

      await updateItemUser(productId, 1, "decrement");
    }
  };

  const clearCart = async () => {
    setCart([]);
    if (!user || !token) return clearCartLocal();
    try {
      await clientApiFetch(
        "/api/users/cart",
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
        locale
      );
      toast.success(t("cart.empty"));
    } catch (error) {
      console.error("Failed to clear user cart:", error);
      toast.error(t("cart.error"));
    }
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0) || 0;
  const cartTotal =
    cart.reduce(
      (total, item) =>
        total +
        (item.product?.offer
          ? item.product.price - (item.product.price * item.product.offer) / 100
          : item.product.price) *
          item.quantity,
      0
    ) || 0;

  const getCartFromLocal = () => {
    if (typeof window === "undefined") return [];
    const cart = localStorage.getItem("cart");
    const parsedCart: CartItem[] = cart ? JSON.parse(cart) : [];
    const sameUser = parsedCart.every(
      (item: CartItem) => item.userId === user?.id
    );
    if (!sameUser) clearCartLocal();
    return sameUser ? parsedCart : [];
  };

  const clearCartLocal = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
    }
  };
  const fetchCartItems = async (): Promise<CartItem[]> => {
    if (!token) return [];

    try {
      const fields = "id,quantity,createdAt,user,product,productId,userId";
      const data = await clientApiFetch<{ cartItems: CartItem[] }>(
        `/api/users/cart?fields=${fields}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
        locale
      );
      return data.cartItems;
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
      return [];
    }
  };

  const mergeCarts = async (
    localCart: CartItem[],
    serverCart: CartItem[]
  ): Promise<CartItem[]> => {
    try {
      const mergedCartMap = new Map<string, CartItem>();

      // Add server cart items to the map
      serverCart.forEach((item) => {
        mergedCartMap.set(item.id, item);
      });

      // Merge local cart items
      localCart.forEach(async (localItem) => {
        if (mergedCartMap.has(localItem.id)) {
          const existingItem = mergedCartMap.get(localItem.id)!;
          mergedCartMap.set(localItem.id, {
            ...existingItem,
            quantity:
              existingItem.quantity > localItem.quantity
                ? existingItem.quantity
                : localItem.quantity,
          });
          if (existingItem.quantity < localItem.quantity) {
            await updateItemUser(localItem.id, localItem.quantity, "set");
          }
        } else {
          // If item only exists in local cart, add it
          mergedCartMap.set(localItem.id, localItem);
          await addItemUser(localItem.id);
        }
      });

      return Array.from(mergedCartMap.values());
    } catch (error) {
      console.error("Failed to merge carts:", error);
      return [];
    }
  };

  return {
    cart,
    setCart,
    getCartFromLocal,
    addToCart,
    addItemUser,
    removeFromCart,
    clearCart,
    clearCartLocal,
    cartCount,
    cartTotal,
    decreaseItemQuantity,
    increaseItemQuantity,
    fetchCartItems,
    mergeCarts,
  };
};
