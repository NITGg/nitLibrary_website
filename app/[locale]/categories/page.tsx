import CategoriesList from "@/components/categories/CategoriesList";
import GridCardsSkeleton from "@/components/ui/GridCardsSkeleton";
import { SearchParams } from "@/types/common";
import { getTranslations } from "next-intl/server";
import React, { Suspense } from "react";

const page = async (props: { searchParams: Promise<SearchParams> }) => {
  const searchParams = await props.searchParams;
  const key = JSON.stringify(searchParams);
  const t = await getTranslations("categories");

  return (
    <>
      <Suspense
        key={key}
        fallback={
          <GridCardsSkeleton
            title={t("cards.title")}
            description={t("cards.description")}
          />
        }
      >
        <CategoriesList homePage={false} searchParams={searchParams} />
      </Suspense>
      hi
    </>
  );
};

export default page;
