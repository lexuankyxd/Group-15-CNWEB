import Footer from "@/components/footer";
import OrdersList from "./_components/orders-list";

export default function UserOrdersPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <OrdersList />
      <Footer />
    </div>
  );
}