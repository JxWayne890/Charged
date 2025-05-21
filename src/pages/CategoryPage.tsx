
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchSquareProducts } from '@/lib/square';
import { standardizeUrlCategory } from '@/utils/categoryUtils';
import { toast } from "@/components/ui/use-toast";
import { Product } from '@/types';
import CategoryHero from '@/components/CategoryHero';
import CategoryProductList from '@/components/CategoryProductList';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import { useCategoryProducts } from '@/hooks/useCategoryProducts';

// This is a reusable component for all category pages
const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Format and standardize category from URL parameter
  const categoryFormatted = category ? category.replace(/-/g, ' ') : '';
  const standardCategory = standardizeUrlCategory(category || '');
  
  // Use custom hook for product filtering and sorting
  const {
    categoryProducts,
    filteredProducts,
    sortOption,
    filterOptions,
    handleFilterChange,
    handleSortChange,
    clearFilters
  } = useCategoryProducts(products, category || '', standardCategory);
  
  // Fetch products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await fetchSquareProducts();
        
        // Debug logging to see all categories
        console.log('CategoryPage: All product categories:', [...new Set(fetchedProducts.map(p => p.category))]);
        console.log(`CategoryPage: Total products fetched: ${fetchedProducts.length}`);
        
        setProducts(fetchedProducts);
        setError(null);
      } catch (err: any) {
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
  
  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => window.location.reload()} />;
  }
  
  return (
    <div className="pt-24 pb-12">
      {/* Hero Section */}
      <CategoryHero categoryName={standardCategory} categoryFormatted={categoryFormatted} />
      
      {/* Products Section */}
      <CategoryProductList 
        categoryProducts={categoryProducts}
        filteredProducts={filteredProducts}
        sortOption={sortOption}
        filterOptions={filterOptions}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
      />
    </div>
  );
};

export default CategoryPage;
