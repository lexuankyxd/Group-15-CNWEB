import { useEffect, useState } from "react";
import Image from "next/image";
import useCart from "@/hooks/use-cart";
import { CartItem, Product } from "@/types";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useAuth } from "@/app/utils/authContext";
import formatVND from "@/app/utils/formatCurrency";
import { createProtectedApi, publicApi } from "@/lib/apiCalls";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

interface CartItemProps {
  data: CartItem;
}

const CartItem: React.FC<CartItemProps> = ({ data }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const cart = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await publicApi.getProduct(data.productId);
        setProduct(productData);
      } catch (error) {
        console.error('Failed to fetch product:', error);
        toast.error("Failed to load product details");
      }
    };
    fetchProduct();
  }, [data.productId]);

  if (!product) return null;

  const onRemoveAll = () => {
    cart.removeAll(data.productId);
  };

  const onRemove = () => {
    cart.removeItem(data.productId);
  };

  const onAdd = async () => {
    cart.addItem(data.productId);
  };

  const itemTotal = data.price * data.quantity;

  // Use single image instead of array
  const imageUrl = data?.image || '/placeholder-image.jpg';

  return (
    <li className="flex py-6 border-b">
      <div className="relative h-24 w-24 rounded-md overflow-hidden sm:h-48 sm:w-48">
        <Image
          fill
          src={imageUrl}
          alt={data?.name || 'Product'}
          className="object-cover object-center"
        />
      </div>
      <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
        <div className="absolute z-10 right-0 top-0">
          <button
            onClick={onRemoveAll}
            className="rounded-full flex items-center justify-center bg-white border shadow-md p-2 hover:scale-110 transition"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
          <div className="flex justify-between">
            <p className="text-lg font-semibold text-black">{data.name}</p>
          </div>
          <div className="mt-1 flex text-sm">
            <p className="text-gray-500">{data.category}</p>
          </div>
          <div className="flex flex-col mt-2 gap-y-3 max-md:flex-row max-md:justify-between max-md:items-center">
            <p className="text-lg text-gray-900 font-semibold">
              {formatVND(itemTotal)}
            </p>
            <div className="flex max-md:justify-end w-full">
              <div className="border w-28 rounded-3xl p-2 gap-2 flex justify-between">
                <button onClick={onRemove}>
                  <RemoveIcon />
                </button>
                <p>{data.quantity}</p>
                <button onClick={onAdd}>
                  <AddIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
