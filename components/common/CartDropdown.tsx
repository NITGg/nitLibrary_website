"use client";
import { Button } from "../ui/button";
import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Locale } from "@/i18n/routing";
import ImageApi from "../ImageApi";
import { useCart } from "@/hooks/useCart";
import { CartItem } from "@/types/common";

const CartDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("common");
  const lang = useLocale() as Locale;
  const {
    cartCount,
    cart,
    increaseItemQuantity,
    decreaseItemQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
  } = useCart();

  const getItemPrice = (item: CartItem) => {
    return item.product.offer
      ? item.product.price - (item.product.price * item.product.offer) / 100
      : item.product.price;
  };

  return (
    <div className="relative">
      {/* Cart Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <ShoppingCart className="size-4" />
        {cartCount > 0 && (
          <span className="absolute -top-2 -end-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Cart Dropdown */}
          <div className="absolute end-0 top-full mt-2 w-80 bg-white border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{t("cart.title")}</h3>
                <div className="flex-center gap-2">
                  {cart.length > 0 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={async () => {
                        await clearCart();
                        setIsOpen(false);
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </div>

              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  {t("cart.empty")}
                </p>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="space-y-3 mb-4">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-2 border rounded"
                      >
                        {item.product?.images?.[0] && (
                          <div className="size-10">
                            <ImageApi
                              src={item.product.images[0]}
                              alt={
                                lang === "ar"
                                  ? item.product?.nameAr ?? item.product?.name
                                  : item.product?.name
                              }
                              width={40}
                              height={40}
                              className="size-10 object-cover rounded"
                            />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium truncate">
                            {lang === "ar"
                              ? item.product?.nameAr ?? item.product?.name
                              : item.product?.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {getItemPrice(item).toFixed(2)}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-6"
                            onClick={async () =>
                              await decreaseItemQuantity(item.productId)
                            }
                          >
                            <Minus className="size-3" />
                          </Button>

                          <span className="w-8 text-center text-sm">
                            {item.quantity}
                          </span>

                          <Button
                            variant="outline"
                            size="icon"
                            className="size-6"
                            disabled={item.quantity + 1 > item.product.stock}
                            onClick={async () =>
                              await increaseItemQuantity(item.productId)
                            }
                          >
                            <Plus className="size-3" />
                          </Button>
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-6 text-red-500 hover:text-red-700"
                          onClick={() => removeFromCart(item.productId)}
                        >
                          <X className="size-3" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold">{t("cart.total")}:</span>
                      <span className="font-semibold text-lg">
                        ${cartTotal.toFixed(2)}
                      </span>
                    </div>

                    {/* Checkout Button */}
                    <Button className="w-full">{t("cart.checkout")}</Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartDropdown;
