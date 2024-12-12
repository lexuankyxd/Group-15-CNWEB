"use client";

import Gallery from "@/components/gallery/gallery";
import Info from "@/components/gallery/info";
import Container from "@/components/ui/container";
import ProductCard from "@/components/ui/product-card";
import { Product } from "@/types";
import { useQueries, UseQueryResult } from "@tanstack/react-query";
import { publicApi } from "@/lib/apiCalls";
import { useParams } from "next/navigation";
import LoadingSkeleton from "./loading-skeleton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";

const ProductItem = () => {
  const params = useParams();
  const productId = params.productId as string;

  const [productQuery, relatedQuery] = useQueries({
    queries: [
      {
        queryKey: ["single product", productId],
        queryFn: () => productId ? publicApi.getProduct(productId).then(res => res.product) : null,
        enabled: !!productId,
      },
      {
        queryKey: ["related products", productId],
        queryFn: async () => {
          if (!productId) return null;
          const response = await publicApi.getProduct(productId);
          const product = response.product;
          return publicApi.getCategoryProducts(product.category).then(res => res.products);
        },
        enabled: !!productId,
      },
    ],
  }) as [UseQueryResult<Product>, UseQueryResult<Product[]>];

  if (!productId || productQuery.isLoading) {
    return <LoadingSkeleton />;
  }

  if (!productQuery.data || productQuery.isError) {
    return (
      <Container>
        <div className="py-10 text-center">
          Product not found or something went wrong.
        </div>
      </Container>
    );
  }

  const filteredData = relatedQuery.data?.filter(
    (item) => item._id !== productQuery.data._id
  ) || [];

  return (
    <div className="bg-white">
      <Container>
        <div className="px-4 py-10 sm:px-6 lg:px-8">
          <Link href="/shop" className="flex items-center mb-8 gap-x-2 text-gray-600 hover:text-gray-900">
            <ArrowBackIcon />
            <span>Back to shop</span>
          </Link>
          
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-12">
            <Gallery image={productQuery.data.image} />
            <div className="mt-10 sm:mt-16 lg:mt-0">
              <Info data={productQuery.data} />
            </div>
          </div>

          {filteredData.length > 0 && (
            <div className="mt-20 space-y-6">
              <h3 className="font-bold text-2xl">Related Products</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredData.map((item: Product) => (
                  <ProductCard key={item._id} data={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default ProductItem;
