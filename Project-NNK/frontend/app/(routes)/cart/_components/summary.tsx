"use client";

import useCart from "@/hooks/use-cart";
import formatVND from "@/app/utils/formatCurrency";

const Summary = () => {
  const totalCartPrice = useCart((state) => state.totalCartPrice);

  return (
    <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-base font-medium text-gray-900">Order total</div>
          <p className="text-lg text-gray-900 font-semibold">
          {formatVND(totalCartPrice)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Summary;
