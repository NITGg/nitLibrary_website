import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";

const CategoriesHero = () => {
  const t = useTranslations("categories");
  return (
    <section className="h-screen relative p-container">
      <div className="absolute size-full inset-0 z-[-1]">
        <Image
          src="/images/CategoriesHero.svg"
          alt="Services Hero"
          className="ltr:scale-x-[-1]"
          fill
          priority
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="flex-center flex-col gap-4 size-3/5">
        <h1 className="text-3xl font-bold text-secondary">
          &quot;{t("hero.title")}&quot;
        </h1>
        <p className="text-white">{t("hero.description")}</p>
      </div>
    </section>
  );
};

export default CategoriesHero;
