"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Product } from "@/types";
import ProductCard from "@/components/ui/product-card";
import filteredData from "@/app/utils/filteredData";
import Link from "next/link";
import { publicApi } from "@/lib/apiCalls";

const CategoryPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      const categoryPath = decodeURIComponent(pathname.split("/").pop() || "");
      setCategory(categoryPath);

      const pageParam = searchParams.get("page");
      const priceRangeParam = searchParams.get("priceRange");
      const sortParam = searchParams.get("sort");

      const sortValue = Array.isArray(sortParam) ? sortParam[0] : sortParam;
      const priceRangeValue = Array.isArray(priceRangeParam) ? priceRangeParam[0] : priceRangeParam;
      const pageValue = Array.isArray(pageParam) ? pageParam[0] : pageParam;

      try {
        const { products, total, currentPage } = await publicApi.getCategoryProducts(
          categoryPath,
          { 
            page: Number(pageValue) || 1,
            limit: 10,
            priceRange: priceRangeValue as string 
          }
        );

        setProducts(sortValue ? filteredData({ sort: sortValue }, products) : products);
        setTotal(total);
        setCurrentPage(currentPage);
      } catch (error) {
        console.error("Error loading products:", error);
      }
    };

    fetchProducts();
  }, [pathname, searchParams]);

  if (!products.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">No products found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-semibold mb-4">
        {category.charAt(0).toUpperCase() + category.slice(1)} Products
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product: Product) => (
          <ProductCard key={product._id} data={product} />
        ))}
      </div>

      {total > 5 && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: Math.ceil(total / 5) }).map((_, i) => {
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.set('page', String(i + 1));
            return (
              <Link
                key={i}
                href={`${pathname}?${newParams.toString()}`}
                className={`px-4 py-2 border ${currentPage === i + 1 ? 'bg-black text-white' : ''}`}
              >
                {i + 1}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
