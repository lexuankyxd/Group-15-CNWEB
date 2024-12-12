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
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      const categoryPath = decodeURIComponent(pathname.split("/").pop() || "");
      setCategory(categoryPath);

      const page = Number(searchParams.get("page")) || 1;
      const priceRangeParam = searchParams.get("priceRange");
      const sortParam = searchParams.get("sort");
      const searchQuery = searchParams.get("q");

      try {
        // Call API with price range parameter
        const { products } = await publicApi.getCategoryProducts(
          categoryPath,
          {
            priceRange: priceRangeParam || undefined
          }
        );

        // Store all products
        setProducts(products);
        setTotal(products.length);

        let filtered = [...products];

        // Apply search filter if exists
        if (searchQuery) {
          filtered = filtered.filter(product => 
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        // Apply sort if specified
        if (sortParam) {
          filtered = filteredData({ sort: sortParam }, filtered);
        }

        // Apply pagination
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        const paginatedProducts = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

        setCurrentPage(page);
        setFilteredProducts(paginatedProducts);
      } catch (error) {
        console.error("Error loading products:", error);
      }
    };

    fetchProducts();
  }, [pathname, searchParams]);

  if (!filteredProducts.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">No products found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-semibold mb-4">
        {decodeURIComponent(category)} Products
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product: Product) => (
          <ProductCard key={product._id} data={product} />
        ))}
      </div>

      {total > ITEMS_PER_PAGE && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: Math.ceil(total / ITEMS_PER_PAGE) }).map((_, i) => {
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
