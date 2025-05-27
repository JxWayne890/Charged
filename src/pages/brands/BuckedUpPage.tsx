
import { useEffect, useState } from 'react';
import { fetchSquareProducts } from '@/lib/square';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import { toast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import { usePaginatedProducts } from '@/hooks/usePaginatedProducts';

const BuckedUpPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    displayedProducts,
    loadingMore,
    handleLoadMore,
    hasMoreItems,
    totalProducts,
    showingCount
  } = usePaginatedProducts({ products });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await fetchSquareProducts();
        const buckedUpProducts = fetchedProducts.filter(p => {
          const brandMatch = p.brand?.toLowerCase().includes('bucked up');
          const titleMatch = p.title?.toLowerCase().includes('bucked up');
          console.log(`Product: ${p.title}, Brand: ${p.brand}, Brand Match: ${brandMatch}, Title Match: ${titleMatch}`);
          return brandMatch || titleMatch;
        });
        console.log(`Found ${buckedUpProducts.length} Bucked Up products`);
        setProducts(buckedUpProducts);
        setError(null);
      } catch (err) {
        console.error('Failed to load Bucked Up products:', err);
        setError('Failed to load products. Please try again later.');
        toast({
          title: "Error",
          description: "Failed to load Bucked Up products",
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
          src="/lovable-uploads/b5bcf8d9-2a12-4f70-8c19-4a655b43108d.png" 
          alt="Bucked Up" 
          className="mx-auto mb-4 max-h-24 object-contain"
        />
        <p className="text-gray-600 max-w-2xl mx-auto">
          Get bucked up with high-quality supplements that deliver real results for your fitness goals.
        </p>
      </div>
      
      {totalProducts > 0 ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Bucked Up Products</h2>
            <p className="text-gray-600">
              Showing {showingCount} of {totalProducts} products
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Load More Button */}
          {hasMoreItems && (
            <div className="flex justify-center">
              <Button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-8 py-3 text-lg"
              >
                {loadingMore ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Loading More...
                  </>
                ) : (
                  'Load More'
                )}
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No Bucked Up products available at the moment. Check back soon!</p>
        </div>
      )}
    </div>
  );
};

export default BuckedUpPage;
