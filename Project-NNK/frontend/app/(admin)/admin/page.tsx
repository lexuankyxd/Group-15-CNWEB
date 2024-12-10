"use client";

import React from "react";
import TitleHeader from "../components/title-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Package, Loader2 } from "lucide-react";
import { useQueries } from "@tanstack/react-query";
import { useAuth } from "@/app/utils/authContext";
import { createProtectedApi, publicApi } from "@/lib/apiCalls";

const AdminPage = () => {
  const { user } = useAuth();
  const protectedApi = user ? createProtectedApi(user.token) : null;

  const [orderQuery, productQuery] = useQueries({
    queries: [
      {
        queryKey: ["admin-orders"],
        queryFn: async () => {
          if (!protectedApi) throw new Error("Not authenticated");
          const response = await protectedApi.admin.getAllOrders();
          // Calculate total sales from order items
          const totalSales = response.orders.reduce((acc: number, order: any) => {
            const orderTotal = order.items.reduce((itemAcc: number, item: any) => 
              itemAcc + (item.price * item.quantity), 0);
            return acc + orderTotal;
          }, 0);
          return totalSales;
        },
        enabled: !!protectedApi
      },
      {
        queryKey: ["admin-products"],
        queryFn: async () => {
          const response = await publicApi.getAllProducts();
          // Calculate total stock from all products
          const totalStock = response.products.reduce((acc: number, product: any) => 
            acc + (product.stock || 0), 0);
          return totalStock;
        }
      }
    ]
  });

  if (orderQuery.isError || productQuery.isError) {
    return <div className="p-4">Error loading dashboard data</div>;
  }

  return (
    <div className="p-4 mt-2 w-3/4 max-md:w-full mx-auto">
      <TitleHeader title="Dashboard" description="Overview of your store" />
      <div className="grid gap-4 grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pl-6 pb-3">
            <div className="text-2xl font-bold">
              {orderQuery.isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                `$${orderQuery.data?.toFixed(2) || "0.00"}`
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products In Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pl-6 pb-3">
            <div className="text-2xl font-bold">
              {productQuery.isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                productQuery.data
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPage;
