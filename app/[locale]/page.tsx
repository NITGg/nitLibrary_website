import CategoriesList from "@/components/categories/CategoriesList";
import Hero from "@/components/home/Hero";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardTitle,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import GridCardsSkeleton from "@/components/ui/GridCardsSkeleton";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Suspense } from "react";
import ProductsList from "@/components/products/ProductsList";

export default function Home() {
  const t = useTranslations("home");
  const tCategories = useTranslations("categories.cards");
  const tProducts = useTranslations("products");
  const features: { title: string; image: string }[] = [
    {
      title: t("features.strength"),
      image: "/images/strength.svg",
    },
    {
      title: t("features.quality"),
      image: "/images/check.svg",
    },
    {
      title: t("features.timing"),
      image: "/images/timing.svg",
    },
  ];

  const services: {
    title: string;
    description: string;
    image: string;
    gradient: string;
  }[] = [
    {
      title: t("services.teachers"),
      description: t("services.teachers_description"),
      image: "/images/servicesImage1.svg",
      gradient: "321.85deg, #C31D00 5.26%, #F89B11 46.55%, #FF5900 97.61%",
    },
    {
      title: t("services.lib"),
      description: t("services.lib_description"),
      image: "/images/servicesImage2.svg",
      gradient: "140.66deg, #003460 22.38%, #00A3FF 59.31%, #003CFF 98.43%",
    },
    {
      title: t("services.printing"),
      description: t("services.printing_description"),
      image: "/images/servicesImage3.svg",
      gradient: "321.85deg, #E218AF 5.26%, #871D6C 48.33%, #2D0055 97.61%",
    },
  ];
  return (
    <>
      <Hero />
      <div className="flex md:justify-between items-center justify-center gap-5 flex-wrap m-auto w-full p-3 md:w-4/5 min-h-44">
        {features.map((feature) => (
          <div key={feature.title} className="flex flex-col items-center gap-2">
            <Image
              src={feature.image}
              alt={feature.title}
              className="size-16"
              width={64}
              height={64}
            />
            <h3 className="text-lg font-semibold">{feature.title}</h3>
          </div>
        ))}
      </div>
      <section className="grid md:grid-cols-2 grid-cols-1 bg-primary min-h-section">
        <div className="relative w-full flex-center ltr:order-2 p-3">
          <Card className="w-4/5 flex-center gap-3">
            <CardContent>
              <CardTitle className="text-lg font-bold mb-3">
                {t("about.title")}
              </CardTitle>
              <CardDescription className="text-sm">
                {t("about.description")}
              </CardDescription>
            </CardContent>
            <CardFooter>
              <CardAction>
                <Button>{t("about.button")}</Button>
              </CardAction>
            </CardFooter>
          </Card>
        </div>
        <div className="relative size-full">
          <Image
            src="/images/homeAbout.svg"
            alt={t("about.imageAlt")}
            className="size-full"
            width={400}
            height={300}
          />
        </div>
      </section>
      <Suspense
        fallback={
          <GridCardsSkeleton
            title={tCategories("title")}
            description={tCategories("description")}
          />
        }
      >
        <CategoriesList />
      </Suspense>
      <Suspense
        fallback={
          <GridCardsSkeleton
            title={tProducts("title")}
            description={tProducts("description")}
          />
        }
      >
        <ProductsList />
      </Suspense>
      <Suspense
        fallback={
          <GridCardsSkeleton
            title={tProducts("featured.title")}
            description={tProducts("featured.description")}
          />
        }
      >
        <ProductsList type="featured" />
      </Suspense>
      <Suspense
        fallback={
          <GridCardsSkeleton
            title={tProducts("offer.title")}
            description={tProducts("offer.description")}
          />
        }
      >
        <ProductsList type="offer" />
      </Suspense>
      <Suspense
        fallback={
          <GridCardsSkeleton
            title={tProducts("latest.title")}
            description={tProducts("latest.description")}
          />
        }
      >
        <ProductsList type="latest" />
      </Suspense>
      <section className="min-h-section flex-center flex-col p-6 gap-4">
        <h2 className="text-2xl font-bold">{t("services.title")}</h2>
        <p className="text-gray-600">{t("services.description")}</p>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4 md:w-4/5 w-full ">
          {services.map((service) => (
            <Card
              key={service.title}
              style={{ background: `linear-gradient(${service.gradient})` }}
              className="text-white p-0 border-0 h-64 w-full"
            >
              <Image
                src={service.image}
                alt={service.title}
                className="w-full h-24 object-cover rounded-t-xl"
                width={64}
                height={64}
              />
              <CardContent className="flex-col flex-center gap-2 p-4 pt-0">
                <CardTitle className="font-semibold">{service.title}</CardTitle>
                <CardDescription className="text-sm text-white">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
