"use client";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

type CardProps = {
  image: string;
  category: string;
};

const CardItem = ({ image, category }: CardProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Card>
      <CardContent className="flex aspect-square justify-center relative">
        {image ? (
          <>
            <Image
              src={image}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "5px",
              }}
              fill
              alt={`Image of ${category}`}
              sizes="any"
            />
            <div className="absolute left-8 bottom-8 flex gap-2 flex-col w-24">
              <p className="text-black font-bold text-2xl">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </p>
              <Button>Shop</Button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <p className="text-gray-500">No Image Available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CardItem;
