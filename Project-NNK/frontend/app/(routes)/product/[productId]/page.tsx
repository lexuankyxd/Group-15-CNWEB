import ProductItem from "./_components/product-item";
import Footer from "@/components/footer";

const ProductPage = async ({
  params,
}: {
  params: { productId: string }
}) => {
  return (
    <div>
      <ProductItem />
      <Footer />
    </div>
  );
};

export default ProductPage;
