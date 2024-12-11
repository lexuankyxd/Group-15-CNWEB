"use client";

import { useAuth } from "@/app/utils/authContext";
import Container from "@/components/ui/container";
import { createProtectedApi } from "@/lib/apiCalls";
import { Order } from "@/types";
import { useQuery } from "@tanstack/react-query";
import OrderCard from "./order-card";
import OrdersSkeleton from "./orders-skeleton";

export default function OrdersList() {
  const { user } = useAuth();
  
  const { data: response, isLoading, error } = useQuery<{ orders: Order[], success: boolean }>({
    queryKey: ["user-orders"],
    queryFn: async () => {
      if (!user?.token) throw new Error("No auth token");
      const api = createProtectedApi(user.token);
      return api.orders.getUserOrders();
    },
    enabled: !!user?.token
  });

  if (isLoading) return <OrdersSkeleton />;

  if (error) {
    return (
      <Container>
        <div className="py-20 text-center">
          <h2 className="text-2xl font-bold text-red-600">Error loading orders</h2>
          <p className="text-gray-500 mt-2">Please try again later</p>
        </div>
      </Container>
    );
  }

  if (!response?.orders?.length) {
    return (
      <Container>
        <div className="py-20 text-center">
          <h2 className="text-2xl font-bold">No orders found</h2>
          <p className="text-gray-500 mt-2">You haven&apos;t placed any orders yet.</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        <div className="space-y-4">
          {response.orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      </div>
    </Container>
  );
}