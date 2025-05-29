import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import ProductFilters from '@/components/ProductFilters';
import { fetchSquareProducts } from '@/lib/square';
import { Product } from '@/types';
import { toast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PRODUCTS_PER_LOAD = 30;

const AllProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [itemsToShow, setItemsToShow] = useState(PRODUCTS_PER_LOAD);
  
  const categoryParam = searchParams.get('category')?.toLowerCase();
  
  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryParam ? [categoryParam] : []
  );
  const [minMaxPrices, setMinMaxPrices] = useState<[number, number]>([0, 100]);
  
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await fetchSquareProducts();
        // Sort products alphabetically by title
        const sortedProducts = fetchedProducts.sort((a, b) => a.title.localeCompare(b.title));
        setProducts(sortedProducts);
        
        // Calculate min and max prices for the price filter
        if (fetchedProducts.length > 0) {
          const prices = fetchedProducts.map(p => p.price);
          const min = Math.floor(Math.min(...prices));
          const max = Math.ceil(Math.max(...prices));
          setMinMaxPrices([min, max]);
          setPriceRange([min, max]);
        }
        
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
  
  // Update the URL when categories change
  useEffect(() => {
    if (selectedCategories.length === 1) {
      setSearchParams({ category: selectedCategories[0] });
    } else if (selectedCategories.length === 0 && categoryParam) {
      // Remove the category param if no categories are selected
      searchParams.delete('category');
      setSearchParams(searchParams);
    }
    // We don't update URL for multiple categories to keep it clean
  }, [selectedCategories, categoryParam, searchParams, setSearchParams]);
  
  // Set the selected category from URL parameter
  useEffect(() => {
    if (categoryParam && !selectedCategories.includes(categoryParam)) {
      setSelectedCategories([...selectedCategories, categoryParam]);
    }
  }, [categoryParam]);
  
  // Apply all filters and reset items to show when filters change
  useEffect(() => {
    if (!products.length) {
      return;
    }
    
    let result = [...products];
    
    // Apply category filter
    if (selectedCategories.length > 0) {
      console.log(`Filtering by categories: ${selectedCategories.join(', ')}`);
      
      // Apply filtering - using exact case-insensitive match for each selected category
      result = result.filter(product => {
        const productCategory = product.category.toLowerCase();
        return selectedCategories.some(cat => productCategory === cat);
      });
      
      console.log(`Found ${result.length} products matching selected categories`);
    }
    
    // Apply price filter
    result = result.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Apply brand filter
    if (selectedBrands.length > 0) {
      result = result.filter(product => {
        // Check if the product title contains any of the selected brands
        return selectedBrands.some(brand => 
          product.title.toLowerCase().includes(brand.toLowerCase())
        );
      });
    }
    
    // ALWAYS sort filtered results alphabetically by title at the end
    result.sort((a, b) => a.title.localeCompare(b.title));
    
    setFilteredProducts(result);
    setItemsToShow(PRODUCTS_PER_LOAD); // Reset to initial load amount when filters change
  }, [products, selectedCategories, priceRange, selectedBrands]);

  // Update displayed products when filteredProducts or itemsToShow changes
  useEffect(() => {
    // Ensure displayed products are also sorted alphabetically
    const sortedDisplayed = filteredProducts.slice(0, itemsToShow).sort((a, b) => a.title.localeCompare(b.title));
    setDisplayedProducts(sortedDisplayed);
  }, [filteredProducts, itemsToShow]);

  // Format category name for display (e.g., "pre-workout" to "Pre Workout")
  const formatCategoryName = (slug: string): string => {
    // First check if we have a defined category with this slug
    const category = categories.find(c => c.slug === slug);
    if (category) {
      return category.name;
    }
    
    // Fallback to formatting the slug
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Our standardized categories
  const categories = [
    { name: 'Pre Workout', slug: 'pre-workout' },
    { name: 'Protein', slug: 'protein' },
    { name: 'Creatine', slug: 'creatine' },
    { name: 'BCAA', slug: 'bcaa' },
    { name: 'Aminos', slug: 'aminos' },
    { name: 'Vitamins', slug: 'vitamins' },
    { name: 'Multivitamin', slug: 'multivitamin' },
    { name: 'Fat Burners', slug: 'fat-burners' },
    { name: 'Pump Supplement', slug: 'pump-supplement' },
    { name: 'Testosterone', slug: 'testosterone' },
    { name: 'Anti-Aging Supplement', slug: 'anti-aging-supplement' },
    { name: 'Dry Spell', slug: 'dry-spell' }
  ];
  
  const handlePriceChange = (range: [number, number]) => {
    setPriceRange(range);
  };
  
  const handleBrandChange = (brands: string[]) => {
    setSelectedBrands(brands);
  };
  
  const handleCategoryChange = (categories: string[]) => {
    setSelectedCategories(categories);
  };

  const handleLoadMore = async () => {
    setLoadingMore(true);
    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    setItemsToShow(prev => prev + PRODUCTS_PER_LOAD);
    setLoadingMore(false);
  };

  const hasMoreItems = itemsToShow < filteredProducts.length;

  if (loading) {
    return (
      <div className="pt-32 pb-12 flex justify-center items-center">
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

  // Get the primary category for display
  const primaryCategory = selectedCategories.length === 1 ? selectedCategories[0] : null;

  return (
    <div className="pt-32 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters sidebar */}
          <div className="w-full md:w-1/4">
            <ProductFilters
              priceRange={priceRange}
              selectedBrands={selectedBrands}
              selectedCategories={selectedCategories}
              onPriceChange={handlePriceChange}
              onBrandChange={handleBrandChange}
              onCategoryChange={handleCategoryChange}
              minMaxPrices={minMaxPrices}
            />
          </div>
          
          {/* Product grid */}
          <div className="w-full md:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">
                {primaryCategory ? formatCategoryName(primaryCategory) : 
                 selectedCategories.length > 1 ? "Selected Categories" : "All Products"}
              </h1>
              {filteredProducts.length > 0 && (
                <p className="text-gray-600">
                  Showing {displayedProducts.length} of {filteredProducts.length} products
                </p>
              )}
            </div>
            
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">
                  {selectedCategories.length > 0 
                    ? `No products found for selected categories`
                    : "No products match your filters"}
                </h3>
                <p className="text-gray-600">
                  {selectedCategories.length > 0 
                    ? `We couldn't find any products matching your selected categories. Please try different filters!`
                    : "Try adjusting your filters to find products."}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                  {displayedProducts.map(product => (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProductsPage;
