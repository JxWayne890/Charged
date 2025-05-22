
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Home, RefreshCcw } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { fetchSquareProducts, syncCategoriesFromSquare } from '@/lib/square';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { toast } from "@/components/ui/use-toast";

const AllProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await fetchSquareProducts();
        setProducts(fetchedProducts);
        setError(null);
      } catch (err) {
        console.error('Failed to load products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, []);
  
  const handleSyncCategories = async () => {
    setSyncing(true);
    try {
      const success = await syncCategoriesFromSquare();
      
      if (success) {
        // Reload products to get updated categories
        const fetchedProducts = await fetchSquareProducts();
        setProducts(fetchedProducts);
        toast({
          title: "Categories Updated",
          description: "Categories have been synchronized successfully. Please refresh the page to see all changes.",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Error syncing categories:", error);
      toast({
        title: "Sync Failed",
        description: "Failed to sync categories. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-24 pb-12 flex justify-center items-center">
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
    <div className="pt-24 pb-12">
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 py-16 mb-8">
        <div className="container mx-auto px-4">
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/" className="flex items-center text-gray-300 hover:text-white">
                    <Home className="h-4 w-4 mr-1" />
                    Home
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-gray-400" />
              <BreadcrumbItem>
                <BreadcrumbLink className="text-white">All Products</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-white">All Products</h1>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSyncCategories} 
              disabled={syncing}
              className="text-white border-white hover:bg-white/10"
            >
              <RefreshCcw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync Categories'}
            </Button>
          </div>
          <p className="text-gray-300 max-w-2xl mb-4">Browse our complete range of premium supplements to find exactly what you need.</p>
          
          <div className="mt-4 p-4 bg-yellow-500/20 rounded-md border border-yellow-500/30">
            <p className="text-yellow-100 font-medium">⚠️ If products are not showing in their correct categories, click "Sync Categories" and then refresh the page.</p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.length === 0 ? (
            <div className="text-center col-span-full py-12">
              <h3 className="text-xl font-medium mb-2">No products available</h3>
              <p className="text-gray-600">We couldn't find any products in our catalog. Please check back later!</p>
            </div>
          ) : (
            products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProductsPage;
