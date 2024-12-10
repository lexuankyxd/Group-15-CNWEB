"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/utils/authContext";

import useCart from "@/hooks/use-cart";
import CartItem from "./_components/cart-item";
import Footer from "@/components/footer";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Summary from "./_components/summary";

const CartPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const cart = useCart();
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Only redirect if auth is loaded and user is not authenticated
    if (!loading && !isAuthenticated && isMounted) {
      router.push('/customer-sign-in');
    }
  }, [loading, isAuthenticated, isMounted, router]);

  // Show nothing while loading auth or mounting
  if (!isMounted || loading) {
    return null;
  }

  // Show nothing if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  const items = cart?.items || [];

  return (
    <div className="bg-white ">
      <div className="mx-auto max-w-7xl min-h-screen">
        <div className="px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-black">Shopping Cart</h1>
          {items.length === 0 && (
            <div className="flex flex-col items-center justify-center py-40">
              <ShoppingCartIcon style={{ fontSize: "10rem" }} />
              <p className="text-neutral-500">Your cart is empty.</p>
            </div>
          )}
          <div className="lg:grid lg:grid-cols-12 lg:items-start gap-x-12">
            <div className="lg:col-span-7">
              <ul>
                {items.map((item, index) => (
                  <CartItem key={index} data={item} />
                ))}
              </ul>
            </div>
            {items.length > 0 && <Summary />}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
