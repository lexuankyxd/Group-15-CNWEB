import ProductCard from "@/components/ui/product-card";
import { publicApi } from "@/lib/apiCalls";
import filteredData from "@/app/utils/filteredData";
import { Product } from "@/types";
import Link from "next/link";

export const metadata = {
  title: "Shop | 4Kay Store",
  description: `Shop for E-commerce, selling electronics`,
};

interface SearchParams {
  [key: string]: string | string[] | undefined;
}

const applyPriceFilter = (products: Product[], priceRange: string | null) => {
  if (!priceRange) return products;
  
  return products.filter(product => {
    switch (priceRange) {
      case "under1m":
        return product.price < 1000000;
      case "1mTo3m":
        return product.price >= 1000000 && product.price < 3000000;
      case "3mTo10m":
        return product.price >= 3000000 && product.price < 10000000;
      case "10mTo20m":
        return product.price >= 10000000 && product.price < 20000000;
      case "over20m":
        return product.price >= 20000000;
      default:
        return true;
    }
  });
};

const ShopPage = async ({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const searchParams = await searchParamsPromise;
  const page = Number(searchParams.page) || 1;
  const limit = 12;
  
  const { products, total, currentPage } = await publicApi.getAllProducts();
  
  let filtered = products;
  
  // Apply price range filter
  const priceRange = searchParams.priceRange as string | null;
  if (priceRange) {
    filtered = applyPriceFilter(filtered, priceRange);
  }
  
  // Apply search filter if query exists
  if (searchParams.q) {
    filtered = filtered.filter((product: Product) => 
      product.name.toLowerCase().includes(String(searchParams.q).toLowerCase())
    );
  }

  // Apply sort if specified
  if (searchParams.sort) {
    filtered = filteredData({ sort: String(searchParams.sort) }, filtered);
  }

  // Apply pagination
  const startIndex = (page - 1) * limit;
  const paginatedProducts = filtered.slice(startIndex, startIndex + limit);
  const totalPages = Math.ceil(filtered.length / limit);

  return (
    <div className="container mx-auto px-4">
      {searchParams.q && (
        <p className="font-serif text-lg mb-3">
          {filtered?.length === 0 
            ? `No products found for "${searchParams.q}"`
            : `Showing ${filtered?.length} results for "${searchParams.q}"`}
        </p>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {paginatedProducts.map((product: Product) => (
          <ProductCard key={product._id} data={product} />
        ))}
      </div>

      {filtered.length > limit && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: Math.ceil(filtered.length / limit) }).map((_, i) => {
            const newParams = new URLSearchParams(searchParams as Record<string, string>);
            newParams.set('page', String(i + 1));
            return (
              <Link
                key={i}
                href={`/shop?${newParams.toString()}`}
                className={`px-4 py-2 border ${page === i + 1 ? 'bg-black text-white' : ''}`}
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

export default ShopPage;
