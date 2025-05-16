
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Home, Loader2 } from 'lucide-react';

interface SquareProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
}

// This is a reusable component for all category pages
const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<SquareProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const categoryFormatted = category ? category.replace(/-/g, ' ') : '';
  const capitalizedCategory = categoryFormatted.replace(/\b\w/g, char => char.toUpperCase());
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Calling our Supabase Edge Function
        const response = await fetch('https://uabhicleiumptashiarr.supabase.co/functions/v1/catalog', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        
        // For now, we'll show all products since we don't have category info from Square
        // In a real implementation, you would filter based on Square category or custom attributes
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);
  
  if (loading) {
    return (
      <div className="pt-24 pb-12 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Loading products...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center p-8 bg-red-50 text-red-700 rounded-md">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="pt-24 pb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 py-16 mb-8">
        <div className="container mx-auto px-4">
          <Breadcrumb className="mb-4 text-gray-300">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">
                  <Home className="h-4 w-4 mr-1" />
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/shop">Shop</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink>{capitalizedCategory}</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <h1 className="text-4xl font-bold text-white mb-2">{capitalizedCategory}</h1>
          <p className="text-gray-300 max-w-2xl">
            Shop our selection of premium quality {categoryFormatted} products designed 
            to help you achieve your fitness goals.
          </p>
        </div>
      </div>
      
      {/* Products Grid */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.length > 0 ? (
            products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-medium mb-2">No products found</h3>
              <p className="text-gray-600">
                We currently don't have any products in this category. Please check back later!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
