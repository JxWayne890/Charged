
import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { Separator } from '@/components/ui/separator';
import { fetchSquareProducts, mapSquareProductsToAppFormat } from '@/lib/square';
import { Product } from '@/types';
import { toast } from '@/components/ui/use-toast';

const BestSellersPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const squareProducts = await fetchSquareProducts();
        
        if (squareProducts.length === 0) {
          toast({
            title: "No products found",
            description: "Unable to fetch products from Square at this time.",
            variant: "destructive"
          });
          setError('No products available from Square. Please try again later.');
          return;
        }
        
        const formattedProducts = mapSquareProductsToAppFormat(squareProducts);
        setProducts(formattedProducts);
        setError(null);
      } catch (err) {
        console.error('Failed to load products:', err);
        toast({
          title: "Error loading products",
          description: "Failed to connect to Square API. Please try again later.",
          variant: "destructive"
        });
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, []);
  
  // Filter just best seller products
  const bestSellerProducts = products.filter(product => product.bestSeller);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 pt-32 flex justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 pt-32">
        <div className="text-center p-8 max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 pt-32">
      <div className="flex flex-col items-center mb-10">
        <h1 className="text-4xl font-bold text-center mb-4">Best Sellers</h1>
        <p className="text-gray-600 text-center max-w-2xl mb-6">
          Our most popular products that customers love. Quality supplements with proven results.
        </p>
        <Separator className="w-24 bg-primary my-4" />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {bestSellerProducts.length > 0 ? (
          bestSellerProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600">No best seller products found at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BestSellersPage;
