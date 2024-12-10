"use client";

import { useRouter } from "next/navigation";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import useCart from "@/hooks/use-cart";
import { useEffect, useState } from "react";
import Badge from "@mui/material/Badge";
import { useAuth } from "@/app/utils/authContext";

const NavbarActions = () => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const cart = useCart();
  const { user } = useAuth();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const totalItems = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  const handleCartClick = () => {
    if (!user) {
      router.push("/customer-sign-in");
      return;
    }
    router.push("/cart");
  };

  return (
    <div className="flex items-center gap-x-4">
      <button
        onClick={handleCartClick}
        className="flex items-center px-[6px] py-1"
      >
        <Badge
          badgeContent={totalItems}
          color="info"
          max={99}
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: "#171717",
              color: "white",
            },
          }}
        >
          <ShoppingCartIcon style={{ fontSize: "25px" }} />
        </Badge>
      </button>
    </div>
  );
};

export default NavbarActions;
