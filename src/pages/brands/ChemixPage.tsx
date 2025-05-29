
import { useEffect, useState } from 'react';
import { fetchSquareProducts } from '@/lib/square';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import { toast } from "@/components/ui/use-toast";

const ChemixPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await fetchSquareProducts();
        const chemixProducts = fetchedProducts.filter(p => {
          const brandMatch = p.brand?.toLowerCase().includes('chemix');
          const titleMatch = p.title?.toLowerCase().includes('chemix');
          console.log(`Product: ${p.title}, Brand: ${p.brand}, Brand Match: ${brandMatch}, Title Match: ${titleMatch}`);
          return brandMatch || titleMatch;
        });
        
        // Sort products alphabetically by title
        const sortedProducts = chemixProducts.sort((a, b) => a.title.localeCompare(b.title));
        console.log(`Found ${sortedProducts.length} Chemix products`);
        setProducts(sortedProducts);
        setError(null);
      } catch (err) {
        console.error('Failed to load Chemix products:', err);
        setError('Failed to load products. Please try again later.');
        toast({
          title: "Error",
          description: "Failed to load Chemix products",
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
          src="/lovable-uploads/43831f2f-b13b-4610-a228-8b0039e17e4f.png" 
          alt="Chemix" 
          className="mx-auto mb-4 max-h-24 object-contain"
        />
        <p className="text-gray-600 max-w-2xl mx-auto">
          Science-backed formulations for optimal performance. Chemix delivers innovative supplements for serious athletes.
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
          <p className="text-gray-600 text-lg">No Chemix products available at the moment. Check back soon!</p>
        </div>
      )}
    </div>
  );
};

export default ChemixPage;
