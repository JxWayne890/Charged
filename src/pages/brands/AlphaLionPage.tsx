
import { useEffect, useState } from 'react';
import { fetchSquareProducts } from '@/lib/square';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import { toast } from "@/components/ui/use-toast";

const AlphaLionPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await fetchSquareProducts();
        const alphaLionProducts = fetchedProducts.filter(p => 
          p.brand?.toLowerCase().includes('alpha lion')
        );
        setProducts(alphaLionProducts);
        setError(null);
      } catch (err) {
        console.error('Failed to load Alpha Lion products:', err);
        setError('Failed to load products. Please try again later.');
        toast({
          title: "Error",
          description: "Failed to load Alpha Lion products",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-8 max-w-lg">
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
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <img 
          src="/lovable-uploads/95fddad6-cd02-4458-8d15-b1e0dbac344b.png" 
          alt="Alpha Lion" 
          className="mx-auto mb-4 max-h-24 object-contain"
        />
        <h1 className="text-3xl font-bold mb-2">Alpha Lion</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Unleash your inner alpha with Alpha Lion's premium supplements designed for serious athletes and fitness enthusiasts.
        </p>
      </div>
      
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No Alpha Lion products available at the moment. Check back soon!</p>
        </div>
      )}
    </div>
  );
};

export default AlphaLionPage;
