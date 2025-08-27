import { apiFetch } from "@/lib/apiFetch";
import GridCards from "../GridCards";
import { getTranslations } from "next-intl/server";
import { ProductApiResponse } from "@/types/product";
import { SearchParams } from "@/types/common";

const fetchProducts = async (
  type?: "featured" | "offer" | "latest",
  homePage: boolean = true,
  searchParams?: SearchParams,
  categoryName?: string
) => {
  try {
    const queryParams = new URLSearchParams({
      ...(homePage && { homePage: "true" }),
      "stock[gt]": "0",
      isActive: "true",
      limit: searchParams?.limit?.toString() ?? "10",
      skip: searchParams?.skip?.toString() ?? "0",
      fields: "id,name,nameAr,images,price,isFeatured,offer,stock",
      ...(categoryName && {
        "category[name]": decodeURIComponent(categoryName.trim()),
      }),
    });
    if (type === "featured") queryParams.append("isFeatured", "true");
    if (type === "offer") queryParams.append("offer[gt]", "0");
    if (type === "latest") {
      queryParams.append("sort", "-createdAt");
      queryParams.append("createdAt", "true");
    }
    if (searchParams?.sort)
      queryParams.get("sort")
        ? queryParams.set("sort", searchParams.sort.toString())
        : queryParams.append("sort", searchParams.sort.toString());

    const response = await apiFetch<ProductApiResponse>(
      `/api/products?${queryParams}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [], totalProducts: 0, totalPages: 0 };
  }
};

const ProductsList = async ({
  type,
  searchParams,
  homePage,
  categoryName,
}: {
  type?: "featured" | "offer" | "latest";
  searchParams?: SearchParams;
  homePage?: boolean;
  categoryName?: string;
}) => {
  const { products } = await fetchProducts(
    type,
    homePage,
    searchParams,
    categoryName
  );
  const t = await getTranslations("products");
  return (
    <GridCards
      title={t(type ? `${type}.title` : "title")}
      description={t(type ? `${type}.description` : "description")}
      data={products}
      type="product"
    />
  );
};

export default ProductsList;
