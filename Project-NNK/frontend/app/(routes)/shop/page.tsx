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

const ShopPage = async ({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const searchParams = await searchParamsPromise;
  const page = Number(searchParams.page) || 1;
  const { products, total, currentPage } = await publicApi.getAllProducts({ page });
  
  let filtered = searchParams.sort ? filteredData(searchParams, products) : products;

  return (
    <div className="container mx-auto px-4">
      {searchParams.q && (
        <p className="font-serif text-lg mb-3">
          {filtered?.length === 0 
            ? `No products found for "${searchParams.q}"`
            : `Showing ${filtered?.length} results for "${searchParams.q}"`}
        </p>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {filtered?.map((product: Product) => (
          <ProductCard key={product._id} data={product} />
        ))}
      </div>

      {total > 5 && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: Math.ceil(total / 5) }).map((_, i) => (
            <Link
              key={i}
              href={`/shop?page=${i + 1}${searchParams.sort ? `&sort=${searchParams.sort}` : ''}`}
              className={`px-4 py-2 border ${currentPage === i + 1 ? 'bg-black text-white' : ''}`}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopPage;
