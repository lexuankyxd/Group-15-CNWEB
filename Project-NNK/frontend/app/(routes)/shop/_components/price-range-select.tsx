"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

const PRICE_RANGES = [
  { value: "", label: "All Prices" },
  { value: "under1m", label: "Under 1M" },
  { value: "1mTo3m", label: "1M to 3M" },
  { value: "3mTo7m", label: "3M to 7M" },
  { value: "7mTo15m", label: "7M to 15M" },
  { value: "over15m", label: "Over 15M" }
];

const PriceRangeSelect = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentRange = searchParams.get("priceRange") || "";

  const handlePriceRangeChange = useCallback((range: string) => {
    const params = new URLSearchParams(searchParams);
    if (range) {
      params.set("priceRange", range);
    } else {
      params.delete("priceRange");
    }
    params.set("page", "1"); // Reset to first page when changing price range
    router.replace(`${pathname}?${params.toString()}`);
  }, [pathname, router, searchParams]);

  return (
    <select
      value={currentRange}
      onChange={(e) => handlePriceRangeChange(e.target.value)}
      className="w-full p-2 border border-neutral-800 mt-2 text-sm font-serif"
    >
      {PRICE_RANGES.map(range => (
        <option key={range.value} value={range.value}>
          {range.label}
        </option>
      ))}
    </select>
  );
};

export default PriceRangeSelect;