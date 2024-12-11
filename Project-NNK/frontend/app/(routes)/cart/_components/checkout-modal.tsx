"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog } from '@headlessui/react';
import { PaymentSchema } from '@/types';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/app/utils/authContext';
import { createProtectedApi } from '@/lib/apiCalls';
import { toast } from 'react-hot-toast';
import useCart from "@/hooks/use-cart";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalPrice: number;
}

const CheckoutModal = ({ isOpen, onClose, totalPrice }: CheckoutModalProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PaymentSchema>({
    paymentMethod: 'Tiền mặt',
    shippingAddress: user?.address || '',
    paymentAccount: '',
  });
  const cart = useCart();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user?.token) throw new Error('Unauthorized');
      const api = createProtectedApi(user.token);
      
      await api.orders.create({
        shippingAddress: formData.shippingAddress,
        paymentMethod: formData.paymentMethod,
        ...(formData.paymentMethod === 'Chuyển khoản' ? {
          paymentAccount: formData.paymentAccount
        } : {})
      });

      // Only need to clear frontend cart since backend handles cart removal
      cart.removeAllCart();
      
      toast.success('Order placed successfully!');
      onClose();
      router.push('/user-orders');
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error?.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6">
          <Dialog.Title className="text-lg font-medium mb-4">Checkout</Dialog.Title>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Payment Method</label>
                <select 
                  className="w-full p-2 border rounded"
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({
                    ...formData,
                    paymentMethod: e.target.value as 'Tiền mặt' | 'Chuyển khoản'
                  })}
                >
                  <option value="Tiền mặt">Tiền mặt</option>
                  <option value="Chuyển khoản">Chuyển khoản</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Shipping Address</label>
                <textarea 
                  className="w-full p-2 border rounded"
                  value={formData.shippingAddress}
                  onChange={(e) => setFormData({
                    ...formData,
                    shippingAddress: e.target.value
                  })}
                  required
                />
              </div>

              {formData.paymentMethod === 'Chuyển khoản' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Payment Account</label>
                  <input 
                    type="text"
                    className="w-full p-2 border rounded"
                    value={formData.paymentAccount}
                    onChange={(e) => setFormData({
                      ...formData,
                      paymentAccount: e.target.value
                    })}
                    required
                  />
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-4">
              <Button
                type="button"
                onClick={onClose}
                className="flex-1"
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={loading}
              >
                Place Order
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CheckoutModal;