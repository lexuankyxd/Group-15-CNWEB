import { Order } from "@/types";
import formatDate from "@/app/utils/formateDate";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

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
        {order.items.map((item) => (
          <div key={item.productId} className="flex justify-between border-b pb-2">
            <div>
              <p className="font-medium">Product ID: {item.productId}</p>
              <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
            </div>
            <p className="font-medium">${item.price.toFixed(2)}</p>
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
            Total: ${order.totalPrice.toFixed(2)}
          </div>
        </div>
      </div>
    </Card>
  );
}