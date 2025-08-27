import { apiFetch } from "@/lib/apiFetch";
import { CategoriesApiResponse } from "@/types/category";
import GridCards from "../GridCards";
import { getTranslations } from "next-intl/server";
import { SearchParams } from "next/dist/server/request/search-params";

const fetchCategories = async (
  searchParams?: SearchParams,
  homePage: boolean = true
) => {
  try {
    const queryParams = new URLSearchParams({
      ...(homePage && { homePage: "true" }),
      limit: searchParams?.limit?.toString() ?? "10",
      sort: searchParams?.sort?.toString() ?? "-createdAt",
      skip: searchParams?.skip?.toString() ?? "0",
      fields:
        "id,name,nameAr,description,descriptionAr,imageUrl,parent=id-name,createdAt,isActive,_count=children-products",
    });

    const response = await apiFetch<CategoriesApiResponse>(
      `/api/categories?${queryParams}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { categories: [], totalCount: 0, totalPages: 0 };
  }
};

const CategoriesList = async ({
  searchParams,
  homePage
}:{
  searchParams?: SearchParams,
  homePage?: boolean
}) => {
  const { categories } = await fetchCategories(searchParams, homePage);
  const t = await getTranslations("categories");
  return (
    <GridCards
      title={t("cards.title")}
      description={t("cards.description")}
      data={categories}
      type="category"
    />
  );
};

export default CategoriesList;
