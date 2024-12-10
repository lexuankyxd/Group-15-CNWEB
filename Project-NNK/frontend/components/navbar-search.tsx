"use client";

import { SearchIcon, Loader2 } from "lucide-react";
import { Input } from "./ui/input";
import { useEffect, useState, useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import debounce from "lodash/debounce";

const NavbarSearch = () => {
  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchStr = searchParams.get("q");

  const performSearch = useCallback(async (searchTerm: string) => {
    try {
      if (searchTerm.length >= 1) {
        setIsLoading(true);
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        current.set("q", searchTerm);
        await router.replace(`/shop?${current.toString()}`);
      } else {
        await router.replace("/shop");
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [router, searchParams]);

  // Memoize the debounced search function
  const debouncedSearch = useMemo(
    () => debounce(performSearch, 500),
    [performSearch]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSearch(value);
  }, [debouncedSearch]);

  useEffect(() => {
    if (pathname !== "/shop") setSearch("");
  }, [pathname]);

  useEffect(() => {
    if (searchStr) setSearch(searchStr);
  }, [searchStr, setSearch]);

  return (
    <div className="flex mx-auto relative">
      <Input
        size={35}
        className="pr-12 outline-none rounded-xl max-md:text-white bg-transparent"
        placeholder="Search for products..."
        onChange={handleSearchChange}
        value={search}
        disabled={isLoading}
      />
      {isLoading ? (
        <Loader2 size={20} className="animate-spin absolute right-0 mr-4 top-1/2 transform -translate-y-1/2" />
      ) : (
        <SearchIcon
          size={20}
          className="absolute right-0 mr-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
          onClick={() => debouncedSearch(search)}
        />
      )}
    </div>
  );
};

export default NavbarSearch;
