
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Home } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { fetchSquareProducts } from '@/lib/square';
import { Product } from '@/types';
import { toast } from "@/components/ui/use-toast";

const AllProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  
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
  
  // Filter products when the category parameter or products list changes
  useEffect(() => {
    if (categoryParam && products.length > 0) {
      console.log(`Filtering by category: ${categoryParam}`);
      
      // Log all available categories for debugging
      const availableCategories = [...new Set(products.map(p => p.category))];
      console.log('Available categories:', availableCategories);
      
      // Count how many products should be in the selected category
      const categoryCount = products.filter(p => p.category === categoryParam).length;
      console.log(`Total products in category "${categoryParam}": ${categoryCount}`);
      
      const filtered = products.filter(product => {
        // Exact match for category slug
        const matches = product.category === categoryParam;
        return matches;
      });
      
      setFilteredProducts(filtered);
      console.log(`Found ${filtered.length} products matching category ${categoryParam}`);
      
      // If we didn't find any products but we should have, show a warning
      if (filtered.length === 0 && categoryCount > 0) {
        toast({
          title: "Filtering Issue",
          description: `There should be ${categoryCount} products in this category, but filtering returned none.`,
          variant: "destructive"
        });
      }
    } else {
      setFilteredProducts(products);
    }
  }, [categoryParam, products]);

  // Format category name for display (e.g., "pre-workout" to "Pre Workout")
  const formatCategoryName = (slug: string): string => {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
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
                <BreadcrumbLink asChild>
                  <Link to="/products" className="text-gray-300 hover:text-white">
                    All Products
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {categoryParam && (
                <>
                  <BreadcrumbSeparator className="text-gray-400" />
                  <BreadcrumbItem>
                    <BreadcrumbLink className="text-white">
                      {formatCategoryName(categoryParam)}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-white">
              {categoryParam ? formatCategoryName(categoryParam) : "All Products"}
            </h1>
          </div>
          <p className="text-gray-300 max-w-2xl mb-4">
            {categoryParam 
              ? `Browse our selection of ${formatCategoryName(categoryParam)} supplements.`
              : "Browse our complete range of premium supplements to find exactly what you need."}
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.length === 0 ? (
            <div className="text-center col-span-full py-12">
              <h3 className="text-xl font-medium mb-2">
                {categoryParam 
                  ? `No ${formatCategoryName(categoryParam)} products found`
                  : "No products available"}
              </h3>
              <p className="text-gray-600">
                {categoryParam 
                  ? `We couldn't find any ${formatCategoryName(categoryParam)} products in our catalog. Please check back later!`
                  : "We couldn't find any products in our catalog. Please check back later!"}
              </p>
            </div>
          ) : (
            filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProductsPage;
