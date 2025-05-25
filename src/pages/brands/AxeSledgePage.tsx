
import { useEffect, useState } from 'react';
import { fetchSquareProducts } from '@/lib/square';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import { toast } from "@/components/ui/use-toast";

const AxeSledgePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await fetchSquareProducts();
        const axeSledgeProducts = fetchedProducts.filter(p => 
          (p.brand?.toLowerCase().includes('axe') && p.brand?.toLowerCase().includes('sledge')) ||
          (p.name?.toLowerCase().includes('axe') && p.name?.toLowerCase().includes('sledge'))
        );
        setProducts(axeSledgeProducts);
        setError(null);
      } catch (err) {
        console.error('Failed to load Axe & Sledge products:', err);
        setError('Failed to load products. Please try again later.');
        toast({
          title: "Error",
          description: "Failed to load Axe & Sledge products",
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
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="text-center mb-8">
        <img 
          src="/lovable-uploads/0fce723a-25b9-4061-94e1-75f5c078e507.png" 
          alt="Axe & Sledge Supplements" 
          className="mx-auto mb-4 max-h-24 object-contain"
        />
        <p className="text-gray-600 max-w-2xl mx-auto">
          Built for those who work hard and play harder. Axe & Sledge delivers powerful supplements for serious performance.
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
          <p className="text-gray-600 text-lg">No Axe & Sledge products available at the moment. Check back soon!</p>
        </div>
      )}
    </div>
  );
};

export default AxeSledgePage;
