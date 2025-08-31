"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Locale } from "@/i18n/routing";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { clientApiFetch } from "@/lib/clientApiFetch";
import ImageApi from "@/components/ImageApi";
import { toast } from "sonner";
import {
  OutlineInput,
  OutlineSelect,
  OutlineTextArea,
} from "@/components/formInputs/OutlineInputs";
import { CreditCard, Loader2, MapPin, MessageSquare } from "lucide-react";
import { getItemPrice } from "@/components/common/CartDropdown";
import { Separator } from "@/components/ui/separator";

// Order schema from your requirements
const orderCreateSchema = z.object({
  paymentMethod: z.string().min(1, "error.paymentMethodIsRequired"),
  shippingAddress: z.string().min(1, "error.shippingAddressIsRequired"),
  notes: z.string().optional(),
});

type OrderFormValues = z.infer<typeof orderCreateSchema>;

export default function OrderPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const t = useTranslations("order");
  const commonT = useTranslations("common");
  const lang = useLocale() as Locale;
  const { cart, cartTotal, setCart } = useCart();

  // Redirect if not logged in
  useEffect(() => {
     const timer = setTimeout(() => {
      if (!token || !user) {
        // No token means definitely not logged in
        toast.error(commonT("unauthorized"), {
          description: commonT("pleaseLogin"),
        });
        router.push(`/${lang}/login?redirect=/order`);
      }
    }, 500); // Short delay to allow hydration
    
    return () => clearTimeout(timer);
  }, [user, router, lang, commonT, toast]);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderCreateSchema),
    defaultValues: {
      paymentMethod: "CASH",
      shippingAddress: "",
      notes: "",
    },
  });

  const onSubmit = async (data: OrderFormValues) => {
    try {
      // Submit order to API
      await clientApiFetch("/api/orders", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(t("orderSuccess"), {
        description: t("orderProcessing"),
      });
      setCart([]);
      router.push(`/${lang}`);
    } catch (error: any) {
      toast.error(t("orderFailed"), {
        description: error.message || t("tryAgain"),
      });
    }
  };

  return (
    <div className="min-h-section p-container ">
      <h1 className="text-3xl font-bold mb-6">{t("checkout")}</h1>

      {cart.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p>{t("emptyCart")}</p>
            <Button onClick={() => router.push(`/${lang}`)} className="mt-4">
              {t("continueShopping")}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Order Form */}
          <div className="col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{t("shippingDetails")}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <OutlineSelect
                    id="order-paymentMethod"
                    label={t("paymentMethod")}
                    iconStart={<CreditCard className="size-4" />}
                    defaultValue="CASH"
                    options={[
                      { value: "CASH", label: t("cash") },
                      { value: "CARD", label: t("card") },
                    ]}
                    placeholder={t("selectPaymentMethod")}
                    {...register("paymentMethod")}
                    error={
                      errors.paymentMethod?.message
                        ? t(errors.paymentMethod.message)
                        : undefined
                    }
                    dir={lang === "ar" ? "rtl" : "ltr"}
                  />
                  <OutlineInput
                    id="order-shippingAddress"
                    {...register("shippingAddress")}
                    label={t("shippingAddress")}
                    error={
                      errors.shippingAddress?.message
                        ? t(errors.shippingAddress.message)
                        : undefined
                    }
                    iconStart={<MapPin className="size-4" />}
                  />

                  <OutlineTextArea
                    id="order-notes"
                    rows={4}
                    label={t("notes")}
                    {...register("notes")}
                    error={
                      errors.notes?.message
                        ? t(errors.notes.message)
                        : undefined
                    }
                    iconStart={<MessageSquare className="size-4" />}
                  />
                  <Button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <Loader2 className="size-6 animate-spin" />
                    ) : (
                      t("placeOrder")
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>{t("orderSummary")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      {item.product?.images?.[0] && (
                        <div className="size-12">
                          <ImageApi
                            src={item.product.images[0]}
                            alt={
                              lang === "ar"
                                ? item.product?.nameAr ?? item.product?.name
                                : item.product?.name
                            }
                            width={48}
                            height={48}
                            className="size-12 object-cover rounded"
                          />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {lang === "ar"
                            ? item.product?.nameAr ?? item.product?.name
                            : item.product?.name}
                        </p>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>
                            {item.product.price.toFixed(2)} × {item.quantity}
                            {t("currency")}
                          </span>
                          <span>
                            {(getItemPrice(item) * item.quantity).toFixed(2)}
                            {t("currency")}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{t("subtotal")}</span>
                    <span>
                      {cartTotal.toFixed(2)}
                      {t("currency")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("shipping")}</span>
                    <span>
                      {(0).toFixed(2)}
                      {t("currency")}
                    </span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>{t("total")}</span>
                    <span>
                      {cartTotal.toFixed(2)}
                      {t("currency")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
