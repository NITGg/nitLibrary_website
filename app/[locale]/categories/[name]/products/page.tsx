import ProductsList from "@/components/products/ProductsList";
import { SearchParams } from "@/types/common";
import React from "react";

const page = async (props: {
  params: Promise<{ name: string }>;
  searchParams: Promise<SearchParams>;
}) => {
  const params = await props.params;
  const categoryName = decodeURIComponent(params.name.replace(/-/g, " "));
  const searchParams = await props.searchParams;
  return (
    <>
      <ProductsList
        categoryName={categoryName}
        homePage={false}
        searchParams={searchParams}
      />
      hi
    </>
  );
};

export default page;
