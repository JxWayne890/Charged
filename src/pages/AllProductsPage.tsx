
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Home } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import ProductFilters from '@/components/ProductFilters';
import { fetchSquareProducts } from '@/lib/square';
import { Product } from '@/types';
import { toast } from "@/components/ui/use-toast";

const AllProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category')?.toLowerCase();
  
  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam || null);
  const [minMaxPrices, setMinMaxPrices] = useState<[number, number]>([0, 100]);
  
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await fetchSquareProducts();
        setProducts(fetchedProducts);
        
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
  
  // Update the URL when category changes
  useEffect(() => {
    if (selectedCategory !== null && selectedCategory !== categoryParam) {
      setSearchParams({ category: selectedCategory });
    } else if (selectedCategory === null && categoryParam) {
      // Remove the category param if no category is selected
      searchParams.delete('category');
      setSearchParams(searchParams);
    }
  }, [selectedCategory, categoryParam, searchParams, setSearchParams]);
  
  // Set the selected category from URL parameter
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);
  
  // Apply all filters
  useEffect(() => {
    if (!products.length) {
      return;
    }
    
    let result = [...products];
    
    // Apply category filter
    if (selectedCategory) {
      console.log(`Filtering by category: ${selectedCategory}`);
      
      // Log all available categories for debugging
      const availableCategories = [...new Set(products.map(p => p.category))];
      console.log('Available categories:', availableCategories);
      
      // Count how many products should be in the selected category
      const categoryCount = products.filter(p => 
        p.category.toLowerCase() === selectedCategory
      ).length;
      
      console.log(`Total products in category "${selectedCategory}": ${categoryCount}`);
      
      // Apply filtering - using exact case-insensitive match
      result = result.filter(product => {
        const productCategory = product.category.toLowerCase();
        const matches = productCategory === selectedCategory;
        return matches;
      });
      
      console.log(`Found ${result.length} products matching category ${selectedCategory}`);
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
    
    setFilteredProducts(result);
  }, [products, selectedCategory, priceRange, selectedBrands]);

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
  
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
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
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters sidebar */}
          <div className="w-full md:w-1/4">
            <ProductFilters
              priceRange={priceRange}
              selectedBrands={selectedBrands}
              selectedCategory={selectedCategory}
              onPriceChange={handlePriceChange}
              onBrandChange={handleBrandChange}
              onCategoryChange={handleCategoryChange}
              minMaxPrices={minMaxPrices}
            />
            
            <div className="mt-8 p-4 bg-gray-100 rounded-lg border">
              <h3 className="text-lg font-medium mb-2">Active Filters</h3>
              <div className="space-y-2">
                {selectedCategory && (
                  <div className="flex items-center justify-between">
                    <span>Category:</span>
                    <span className="font-medium">{formatCategoryName(selectedCategory)}</span>
                  </div>
                )}
                {(priceRange[0] > minMaxPrices[0] || priceRange[1] < minMaxPrices[1]) && (
                  <div className="flex items-center justify-between">
                    <span>Price:</span>
                    <span className="font-medium">${priceRange[0]} - ${priceRange[1]}</span>
                  </div>
                )}
                {selectedBrands.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span>Brands:</span>
                    <span className="font-medium">{selectedBrands.length}</span>
                  </div>
                )}
                {!selectedCategory && priceRange[0] === minMaxPrices[0] && priceRange[1] === minMaxPrices[1] && selectedBrands.length === 0 && (
                  <div className="text-gray-500">No active filters</div>
                )}
              </div>
            </div>
          </div>
          
          {/* Product grid */}
          <div className="w-full md:w-3/4">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">
                  {categoryParam 
                    ? `No ${formatCategoryName(categoryParam)} products found`
                    : "No products match your filters"}
                </h3>
                <p className="text-gray-600">
                  {categoryParam 
                    ? `We couldn't find any ${formatCategoryName(categoryParam)} products in our catalog. Please check back later!`
                    : "Try adjusting your filters to find products."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProductsPage;
