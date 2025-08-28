"use client";
import { Button } from "../ui/button";
import { ShoppingCart, X, Plus, Minus } from "lucide-react";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Locale } from "@/i18n/routing";
import ImageApi from "../ImageApi";
import { useShoppingState } from "@/hooks/useShoppingState";

const CartDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("common");
  const lang = useLocale() as Locale;

  // Use consolidated hook with hydration safety
  const {
    cart,
    cartCount,
    cartTotal,
    removeFromCart,
    updateQuantity,
    isMounted,
  } = useShoppingState();

  const getItemPrice = (item: any) => {
    return item.offer
      ? item.price - (item.price * item.offer) / 100
      : item.price;
  };

  // Only render counter after mounting to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="relative">
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="size-4" />
        </Button>
      </div>
    );
  }

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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
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
                        {item.image && (
                          <div className="size-10">
                            <ImageApi
                              src={item.image}
                              alt={
                                lang === "ar"
                                  ? item.nameAr ?? item.name
                                  : item.name
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
                              ? item.nameAr ?? item.name
                              : item.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            ${getItemPrice(item).toFixed(2)}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="w-6 h-6"
                            onClick={() =>
                              updateQuantity({
                                id: item.id,
                                quantity: item.quantity - 1,
                              })
                            }
                          >
                            <Minus className="w-3 h-3" />
                          </Button>

                          <span className="w-8 text-center text-sm">
                            {item.quantity}
                          </span>

                          <Button
                            variant="outline"
                            size="icon"
                            className="w-6 h-6"
                            onClick={() =>
                              updateQuantity({
                                id: item.id,
                                quantity: item.quantity + 1,
                              })
                            }
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-6 h-6 text-red-500 hover:text-red-700"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <X className="w-3 h-3" />
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
