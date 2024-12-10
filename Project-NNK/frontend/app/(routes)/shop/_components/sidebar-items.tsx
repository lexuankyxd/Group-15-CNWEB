"use client";

import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChangeEvent } from "react";

interface SidebarItemsProps {
  categories: string[];
}

const SidebarItems = ({ categories = [] }: SidebarItemsProps) => {
  const pathName = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = event.target.value;
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.delete('page'); // Reset page when changing category
    
    const queryString = currentParams.toString();
    const path = selectedCategory === "all" ? "/shop" : `/shop/${selectedCategory}`;
    router.push(queryString ? `${path}?${queryString}` : path);
  };

  const handleCategoryClick = (category: string | "all") => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.delete('page'); // Reset page when changing category
    
    const queryString = currentParams.toString();
    const path = category === "all" ? "/shop" : `/shop/${category}`;
    router.push(queryString ? `${path}?${queryString}` : path);
  };

  const currentCategory = pathName === "/shop" ? "all" : pathName.split("/").pop();

  return (
    <>
      <select
        onChange={handleSelectChange}
        className="w-full p-2 border border-neutral-800 mt-2 text-sm font-serif sm:hidden"
        value={currentCategory ?? "all"}
      >
        <option value="all">All Products</option>
        {categories.map((category: string) => (
          <option key={category} value={category}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </option>
        ))}
      </select>

      <div className="hidden sm:block space-y-2">
        <div
          onClick={() => handleCategoryClick("all")}
          className={`cursor-pointer hover:underline underline-offset-4 tracking-widest font-serif 
            ${pathName === "/shop" ? "underline" : ""}`}
        >
          All Products
        </div>
        {categories.map((category) => (
          <div
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`cursor-pointer hover:underline underline-offset-4 tracking-widest font-serif
              ${pathName === `/shop/${category}` ? "underline" : ""}`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </div>
        ))}
      </div>
    </>
  );
};

export default SidebarItems;
