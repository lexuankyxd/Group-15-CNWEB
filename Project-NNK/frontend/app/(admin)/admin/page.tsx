"use client";

import React from "react";
import TitleHeader from "../components/title-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Package, Loader2 } from "lucide-react";
import { useQueries } from "@tanstack/react-query";
import { adminApi } from "@/lib/apiCalls";

const AdminPage = () => {
  const [orderQuery, productQuery] = useQueries({
    queries: [
      {
        queryKey: ["Sales count"],
        queryFn: async () => {
          const data = await adminApi.getAllOrders();
          return data;
        },
      },
      {
        queryKey: ["Stock products"],
        queryFn: async () => {
          const data = await adminApi.getAllProducts();
          return data.products;
        },
      },
    ],
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
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pl-6 pb-3">
            <div className="text-2xl font-bold">
              {orderQuery.isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                `+${orderQuery?.data?.length || 0}`
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
                productQuery?.data?.length || 0
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPage;
