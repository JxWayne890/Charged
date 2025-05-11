
import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { Separator } from '@/components/ui/separator';

const WellnessPage = () => {
  // Filter products for the wellness category
  const wellnessProducts = products.filter(product => product.category === 'daily-essentials');

  return (
    <div className="container mx-auto px-4 py-12 pt-32">
      <div className="flex flex-col items-center mb-10">
        <h1 className="text-4xl font-bold text-center mb-4">Wellness Products</h1>
        <p className="text-gray-600 text-center max-w-2xl mb-6">
          Essential supplements to support your overall health, immunity, and daily wellness needs.
        </p>
        <Separator className="w-24 bg-primary my-4" />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wellnessProducts.length > 0 ? (
          wellnessProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600">No wellness products found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WellnessPage;
