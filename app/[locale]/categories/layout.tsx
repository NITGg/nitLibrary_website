import CategoriesHero from "@/components/categories/CategoriesHero";
import React from "react";

const layout = ({ children }:{
    children: React.ReactNode
}) => {
  return (
    <>
      <CategoriesHero />
      {children}
    </>
  );
};

export default layout;
