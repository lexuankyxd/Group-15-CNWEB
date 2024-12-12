
import Link from "next/link";

const Banner = () => {
  return (
    <div className="relative h-[500px] w-full mb-8">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('/banner.png')",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute right-0 top-0 bottom-0 w-1/2 flex flex-col justify-center items-start p-12 text-white">
          <h1 className="text-4xl font-bold mb-4">Welcome to 4Kay Store</h1>
          <p className="text-lg mb-6">
            Discover our amazing collection of products with the best quality and prices.
            Shop with confidence and enjoy our excellent customer service.
          </p>
          <Link 
            href="/shop"
            className="bg-white text-black px-8 py-3 rounded-md hover:bg-gray-200 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Banner;