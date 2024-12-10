import CarouselFeatured from "@/components/CarouselFeatured";
import { CarouselSpacing } from "@/components/CarouselSpacing";
import Footer from "@/components/footer";
import TitleHeader from "@/components/title-header";
import { publicApi } from "@/lib/apiCalls";
import { Product } from "@/types";

const HomePage = async () => {
  try {
    const response = await publicApi.getAllProducts();
    const products = response.products;

    // Extract unique categories from the products
    const categories = Array.from(
      new Set(products.map((product: Product) => product.category))
    );

    // Select some products as "featured"
    const featuredProducts = products.slice(0, 10); // Limit to the first 10 products

    return (
      <>
        <TitleHeader title="Top Category" url="/shop" />
        <CarouselSpacing />
        <div className="mb-24">
          <TitleHeader title="Featured Products" url="/shop" />
          {featuredProducts.length > 0 && (
            <CarouselFeatured data={featuredProducts} />
          )}
        </div>
        <Footer />
      </>
    );
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return <div>Error loading products</div>;
  }
};

export default HomePage;
