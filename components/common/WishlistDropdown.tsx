"use client";
import { Button } from "../ui/button";
import { Heart, X, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Locale } from "@/i18n/routing";
import ImageApi from "../ImageApi";
import { useShoppingState } from "@/hooks/useShoppingState";

const WishlistDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("common");
  const lang = useLocale() as Locale;

  // Use consolidated hook with hydration safety
  const {
    wishlist,
    wishlistCount,
    removeFromWishlist,
    clearWishlist,
    addToCart,
    isMounted,
  } = useShoppingState();

  const getItemPrice = (item: any) => {
    return item.offer
      ? item.price - (item.price * item.offer) / 100
      : item.price;
  };

  const handleAddToCart = async (item: any) => {
    await addToCart({
      id: item.id,
      name: item.name,
      nameAr: item.nameAr,
      price: item.price,
      image: item.image,
      offer: item.offer,
    });
    // Optionally remove from wishlist after adding to cart
    // await removeFromWishlist(item.id);
  };

  const handleClearAll = async () => {
    if (confirm(t("wishlist.confirmClearAll"))) {
      await clearWishlist();
    }
  };

  // Only render counter after mounting to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="relative">
        <Button variant="outline" size="icon" className="relative">
          <Heart className="size-4" />
        </Button>
      </div>
    );
  }

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
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
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
                    <X className="w-4 h-4" />
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

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1">
                          {/* Add to Cart Button */}
                          <Button
                            variant="outline"
                            size="icon"
                            className="w-8 h-8 text-green-600 hover:text-green-700"
                            onClick={() => handleAddToCart(item)}
                            title={t("wishlist.addToCart")}
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </Button>

                          {/* Remove Button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 text-red-500 hover:text-red-700"
                            onClick={() => removeFromWishlist(item.id)}
                            title={t("wishlist.remove")}
                          >
                            <X className="w-4 h-4" />
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
