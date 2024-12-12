"use client";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Product } from "@/types";
import Autoplay from "embla-carousel-autoplay";
import CardItem from "./gallery/card-item";
import Link from "next/link";
import { useEffect, useState } from "react";
import { publicApi } from "@/lib/apiCalls";
import { Loader2 } from "lucide-react";

interface CategoryInfo {
  name: string;
  image: string;
}

export function CarouselSpacing() {
  const [loading, setLoading] = useState(true);
  const [categoryInfo, setCategoryInfo] = useState<CategoryInfo[]>([]);

  useEffect(() => {
    const fetchProductCategories = async () => {
      try {
        const response = await publicApi.getAllProducts();
        const products: Product[] = response.products;

        // Get unique categories with their first product image
        const categories = products.reduce((acc, product) => {
          if (!acc.some(cat => cat.name === product.category)) {
            acc.push({
              name: product.category,
              image: product.image
            });
          }
          return acc;
        }, [] as CategoryInfo[]);

        setCategoryInfo(categories.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  return (
    <Carousel
      opts={{ align: "start", loop: true }}
      plugins={[Autoplay({ delay: 2500 })]}
      className="w-full relative"
    >
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 pointer-events-none">
        <CarouselPrevious className="pointer-events-auto" />
        <CarouselNext className="pointer-events-auto" />
      </div>
      <CarouselContent>
        {categoryInfo.map((category) => (
          <CarouselItem
            key={category.name}
            className="pl-1 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/5"
          >
            <Link href={`/shop?category=${encodeURIComponent(category.name)}`}>
              <CardItem
                category={category.name}
                image={category.image}
              />
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
