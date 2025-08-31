"use client";
import { Button } from "../ui/button";
import { Heart, X, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Locale } from "@/i18n/routing";
import ImageApi from "../ImageApi";
import { useWishlist } from "@/hooks/useWishlist";
import { WishlistItem } from "@/types/common";
import { Product } from "@/types/product";
import { useCart } from "@/hooks/useCart";

const WishlistDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("common");
  const lang = useLocale() as Locale;
  const { wishlist, wishlistCount, clearWishlist, addToWishlist } =
    useWishlist();
  const { addToCart, cart } = useCart();

  const getItemPrice = (item: WishlistItem) => {
    return item.product.offer
      ? item.product.price - (item.product.price * item.product.offer) / 100
      : item.product.price;
  };

  const handleAddToCart = async (item: Product) => {
    await addToCart({
      id: item.id,
      productId: item.id,
      product: item,
      quantity: 1,
    });
  };

  const handleClearAll = async () => {
    await clearWishlist();
  };

  return (
    <div className="relative">
      {/* Wishlist Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Heart className="size-4" />
        {wishlistCount > 0 && (
          <span className="absolute -top-2 -end-2 bg-red-500 text-white text-xs rounded-full size-5 flex-center">
            {wishlistCount}
          </span>
        )}
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <button
            type="button"
            aria-label={t("wishlist.closeDropdown")}
            className="fixed inset-0 z-40 p-0 m-0 border-0 bg-transparent"
            onClick={() => setIsOpen(false)}
            style={{ outline: "none", width: "100%", height: "100%" }}
            tabIndex={-1}
          />

          {/* Wishlist Dropdown */}
          <div className="absolute end-0 top-full mt-2 w-80 bg-white border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{t("wishlist.title")}</h3>
                <div className="flex items-center gap-2">
                  {wishlist.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearAll}
                      className="text-red-500 hover:text-red-700"
                    >
                      {t("wishlist.clearAll")}
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

              {wishlist.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  {t("wishlist.empty")}
                </p>
              ) : (
                <>
                  {/* Wishlist Items */}
                  <div className="space-y-3 mb-4">
                    {wishlist.map((item) => (
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
                                  ? item.product.nameAr ?? item.product.name
                                  : item.product.name
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
                              ? item.product.nameAr ?? item.product.name
                              : item.product.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            ${getItemPrice(item).toFixed(2)}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1">
                          {/* Add to Cart Button */}
                          {!cart.find(
                            (cartItem) => cartItem.productId === item.productId
                          ) && (
                            <Button
                              variant="outline"
                              size="icon"
                              className="w-8 h-8 text-green-600 hover:text-green-700"
                              onClick={() => handleAddToCart(item.product)}
                              title={t("wishlist.addToCart")}
                            >
                              <ShoppingCart className="size-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="icon"
                            className="w-8 h-8 text-red-500 hover:text-red-700"
                            onClick={async () => await addToWishlist(item)}
                            title={t("wishlist.remove")}
                          >
                            <X className="size-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total Items */}
                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold">
                        {t("wishlist.totalItems")}:
                      </span>
                      <span className="font-semibold text-lg">
                        {wishlistCount}
                      </span>
                    </div>

                    {/* View All Button */}
                    <Button
                      className="w-full"
                      onClick={() => {
                        setIsOpen(false);
                        // Navigate to wishlist page
                        // router.push('/wishlist');
                      }}
                    >
                      {t("wishlist.viewAll")}
                    </Button>
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

export default WishlistDropdown;
