
import { Separator } from '@/components/ui/separator';
import ProductGrid from '@/components/ProductGrid';

const SquareProductsPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 pt-32">
      <div className="flex flex-col items-center mb-10">
        <h1 className="text-4xl font-bold text-center mb-4">Square Products</h1>
        <p className="text-gray-600 text-center max-w-2xl mb-6">
          These products are pulled directly from our Square catalog.
        </p>
        <Separator className="w-24 bg-primary my-4" />
      </div>
      
      <ProductGrid />
    </div>
  );
};

export default SquareProductsPage;
