"use client";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import { Card, CardContent, CardFooter, CardTitle } from "./ui/card";
import { useLocale, useTranslations } from "next-intl";
import { Locale } from "@/i18n/routing";
import clsx from "clsx";
import { Button } from "./ui/button";
import { Link } from "@/i18n/navigation";
import ImageApi from "./ImageApi";
import { useAtom } from "jotai";
import { addToCartAtom } from "@/atoms/cartAtom";
import { toggleWishlistAtom, isInWishlistAtom } from "@/atoms/wishlistAtom";
import { ShoppingCart, Heart } from "lucide-react";

type GridCardsProps =
  | {
      type: "product";
      data: Product[];
      title: string;
      description: string;
    }
  | {
      type: "category";
      data: Category[];
      title: string;
      description: string;
    };

const GridCards = ({ title, data, type, description }: GridCardsProps) => {
  const lang = useLocale() as Locale;

  return (
    <section className="p-container min-h-section flex-center flex-col gap-5 w-full">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-gray-600">{description}</p>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 w-full ">
        {type === "product"
          ? data.map((item) => (
              <ItemCard key={item.id} item={item} type="product" lang={lang} />
            ))
          : data.map((item) => (
              <ItemCard key={item.id} item={item} type="category" lang={lang} />
            ))}
      </div>
    </section>
  );
};

const ItemCard = ({
  item,
  type,
  lang,
}:
  | {
      item: Product;
      type: "product";
      lang: Locale;
    }
  | {
      type: "category";
      item: Category;
      lang: Locale;
    }) => {
  const t = useTranslations(type === "category" ? "categories.cards" : "products");
  const [, addToCart] = useAtom(addToCartAtom);
  const [, toggleWishlist] = useAtom(toggleWishlistAtom);
  const [isInWishlist] = useAtom(isInWishlistAtom);

  const handleAddToCart = () => {
    if (type === "product") {
      addToCart({
        id: String(item.id),
        name: item.name,
        nameAr: item.nameAr,
        price: item.price,
        image: item.images?.[0],
        offer: item.offer,
      });
    }
  };

  const handleToggleWishlist = () => {
    if (type === "product") {
      toggleWishlist({
        id: String(item.id),
        name: item.name,
        nameAr: item.nameAr,
        price: item.price,
        image: item.images?.[0],
        offer: item.offer,
      });
    }
  };

  const inWishlist = type === "product" ? isInWishlist(String(item.id)) : false;
  return (
    <Card className="relative min-h-[400px] overflow-hidden flex flex-col">
      {type === "product" && !!item.offer && (
        <span
          style={{
            borderRadius: "0% 0% 0% 20px / 0% 0% 0% 70%",
          }}
          className="absolute top-0 right-0 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded z-10"
        >
          {t("offerPercent", { offer: item.offer })}
        </span>
      )}

      {/* Wishlist Heart Icon */}
      {type === "product" && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleWishlist}
          className={`absolute top-2 left-2 z-10 w-8 h-8 rounded-full ${
            inWishlist
              ? "text-red-500 bg-white hover:bg-gray-100"
              : "text-gray-400 bg-white hover:bg-gray-100"
          }`}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-current" : ""}`} />
        </Button>
      )}
      <CardContent className="flex-center flex-col gap-4 p-6 flex-1">
        <div className="w-3/5 aspect-square">
          <ImageApi
            key={item.id}
            src={
              (type === "category" ? item.imageUrl : item.images?.[0]) ||
              "/images/notfound.png"
            }
            alt={lang === "ar" ? item.nameAr ?? item.name : item.name}
            width={300}
            height={300}
            className="w-full object-cover aspect-square rounded-md"
          />
        </div>
        <CardTitle className="font-semibold text-center text-nowrap">
          {lang === "ar" ? item.nameAr ?? item.name : item.name}
        </CardTitle>

        {/* Spacer to push footer to bottom */}
        {/* <div className="flex-1" /> */}

        <CardFooter className="w-full flex-center flex-col gap-3 p-0">
          {type === "product" ? (
            <>
              <div className="flex-center gap-3">
                {!!item.offer && (
                  <span className={"text-red-500 font-semibold text-lg"}>
                    {t("price", {
                      price: item.price - item.price * (item.offer / 100),
                    })}
                  </span>
                )}
                <span
                  className={clsx("text-lg font-semibold text-red-500", {
                    "!text-gray-500 line-through !text-sm": !!item.offer,
                  })}
                >
                  {t("price", { price: item.price })}
                </span>
              </div>
              <div className="w-full flex gap-2">
                <Button onClick={handleAddToCart} className="flex-1 gap-2">
                  <ShoppingCart className="size-4" />
                  <span className="text-sm">{t("addToCart")}</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleToggleWishlist}
                  className={`${
                    inWishlist ? "text-red-500 border-red-500" : ""
                  }`}
                >
                  <Heart
                    className={`size-4 ${inWishlist ? "fill-current" : ""}`}
                  />
                </Button>
              </div>
            </>
          ) : (
            <Button variant={"outline"} className="w-full" asChild>
              <Link
                href={`/categories/${item.name.replace(/ /g, "-")}/products`}
                // href={`/categories/${
                //         categoryPath
                //           ? categoryPath
                //               .map((cat) => cat.replace(/ /g, "-"))
                //               .join("/") + "/"
                //           : ""
                //       }${category.name.replace(/ /g, "-")}`}
                aria-label={t("viewCategory")}
                className="w-full text-center"
              >
                {t("viewCategory")}
              </Link>
            </Button>
          )}
        </CardFooter>
      </CardContent>
    </Card>
  );
};

export default GridCards;
