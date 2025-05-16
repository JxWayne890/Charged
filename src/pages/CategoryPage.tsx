
import React from 'react';
import { useParams } from 'react-router-dom';
import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Home } from 'lucide-react';

// This is a reusable component for all category pages
const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  
  const categoryFormatted = category ? category.replace(/-/g, ' ') : '';
  const capitalizedCategory = categoryFormatted.replace(/\b\w/g, char => char.toUpperCase());
  
  // Filter products by the current category
  const categoryProducts = products.filter(
    product => product.category.toLowerCase() === categoryFormatted.toLowerCase()
  );
  
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
          {categoryProducts.length > 0 ? (
            categoryProducts.map(product => (
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
