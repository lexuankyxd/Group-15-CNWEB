import { Order, OrderItem } from "@/types";
import formatDate from "@/app/utils/formateDate";
import formatVND from "@/app/utils/formatCurrency";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/app/utils/authContext";
import { createProtectedApi } from "@/lib/apiCalls";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

interface OrderCardProps {
  order: Order;
}

const statusColors = {
  'Chờ thanh toán': 'bg-yellow-500',
  'Chờ xử lý': 'bg-blue-500',
  'Đang giao': 'bg-purple-500',
  'Hoàn thành': 'bg-green-500',
  'Đã hủy': 'bg-red-500',
} as const;

export default function OrderCard({ order }: OrderCardProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleCancel = async () => {
    if (!user?.token) return;
    setIsLoading(true);

    try {
      const api = createProtectedApi(user.token);
      await api.orders.cancel(order._id);
      
      toast.success('Order cancelled successfully');
      // Refresh orders list
      queryClient.invalidateQueries({ queryKey: ['user-orders'] });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to cancel order');
    } finally {
      setIsLoading(false);
    }
  };

  // Show cancel button only for orders that can be cancelled
  const canCancel = !["Đang giao", "Hoàn thành", "Đã hủy"].includes(order.status);

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-gray-500">Order ID: {order._id}</p>
          <p className="text-sm text-gray-500">
            Placed on: {formatDate(order.createdAt.toString())}
          </p>
        </div>
        <Badge className={`${statusColors[order.status]}`}>
          {order.status}
        </Badge>
      </div>

      <div className="space-y-4">
        {order.items.map((item: OrderItem) => (
          <div key={item.productId._id} className="flex items-center gap-4 pb-2">
            <img 
              src={item.productId.image} 
              alt={item.productId.name}
              className="w-20 h-20 object-cover rounded"
            />
            <div className="flex-1">
              <p className="font-medium">{item.productId.name}</p>
              <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
              <p className="font-medium">{formatVND(item.price)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Payment Method: {order.paymentMethod}</p>
            <p className="text-sm text-gray-500">Shipping Address: {order.shippingAddress}</p>
          </div>
          <div className="text-xl font-bold">
            Total: {formatVND(order.totalPrice)}
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        {canCancel && (
          <Button 
            onClick={handleCancel}
            disabled={isLoading}
            variant="destructive"
          >
            Cancel Order
          </Button>
        )}
      </div>
    </Card>
  );
}