
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Home } from 'lucide-react';
import { fetchSquareProducts } from '@/lib/square';
import { Product } from '@/types';
import { toast } from "@/components/ui/use-toast";

// Function to standardize category names for URL parameters
const standardizeUrlCategory = (urlCategory: string): string => {
  const normalized = urlCategory.toLowerCase().trim().replace(/-/g, ' ');
  
  // Map to standard category names
  if (normalized === 'protein') return 'Protein';
  if (normalized === 'pre workout' || normalized === 'preworkout') return 'Pre-Workout';
  if (normalized === 'weight loss') return 'Weight Loss';
  if (normalized === 'amino acids' || normalized === 'aminos') return 'Amino Acids';
  if (normalized === 'wellness') return 'Wellness';
  
  // If no match, capitalize each word
  return normalized.replace(/\b\w/g, char => char.toUpperCase());
};

// This is a reusable component for all category pages
const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Format and standardize category from URL parameter
  const categoryFormatted = category ? category.replace(/-/g, ' ') : '';
  const standardCategory = standardizeUrlCategory(categoryFormatted);
  
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
        toast({
          title: "Error",
          description: "Failed to load products. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, [category]);
  
  // Debug logs
  console.log('Current URL category:', category);
  console.log('Formatted category:', categoryFormatted);
  console.log('Standardized category:', standardCategory);
  console.log('All products:', products);
  console.log('Product categories:', products.map(p => p.category));
  
  // Simple matching logic using standardized categories
  const categoryProducts = products.filter(product => {
    // Skip products with no category
    if (!product.category) return false;
    
    // Compare the product's category with our standardized URL category
    // Since we've already standardized both at the source, this should be a simple equals check
    const match = product.category === standardCategory;
    
    console.log(`Comparing: "${standardCategory}" with "${product.category}" = ${match}`);
    return match;
  });
  
  console.log('Filtered products:', categoryProducts);
  
  if (loading) {
    return (
      <div className="pt-24 pb-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
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
                <BreadcrumbLink>{standardCategory}</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <h1 className="text-4xl font-bold text-white mb-2">{standardCategory}</h1>
          <p className="text-gray-300 max-w-2xl">
            Shop our selection of premium quality {categoryFormatted} products designed 
            to help you achieve your fitness goals.
          </p>
        </div>
      </div>
      
      {/* Products Grid */}
      <div className="container mx-auto px-4">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No products available</h3>
            <p className="text-gray-600">
              We couldn't find any products in our catalog. Please check back later!
            </p>
          </div>
        ) : categoryProducts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No products found in this category</h3>
            <p className="text-gray-600">
              We currently don't have any products in the {standardCategory} category. Please check back later!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {categoryProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
