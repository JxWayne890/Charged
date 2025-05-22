import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Home, Filter } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchSquareProducts } from '@/lib/square';
import FilterSidebar from '@/components/FilterSidebar';
import { Product } from '@/types';
import { toast } from "@/components/ui/use-toast";
import { standardizeUrlCategory } from '@/utils/categoryUtils';

// Function to standardize category names for URL parameters
const standardizeUrlCategory = (urlCategory: string): string => {
  if (!urlCategory) return '';
  
  // Convert to lowercase, trim spaces and replace dashes with spaces for standardized comparison
  const normalized = urlCategory.toLowerCase().trim().replace(/-/g, ' ');
  
  console.log(`Standardizing category: '${urlCategory}' -> normalized: '${normalized}'`);
  
  // Map to standard category names (with more variations to catch edge cases)
  const categoryMap: Record<string, string> = {
    'protein': 'Protein',
    'whey': 'Protein',
    'protein powder': 'Protein',
    'whey protein': 'Protein',
    
    'pre workout': 'Pre-Workout',
    'preworkout': 'Pre-Workout',
    'pre-workout': 'Pre-Workout',
    'pre workout extreme villain': 'Pre-Workout',
    
    'weight loss': 'Weight Loss',
    'weightloss': 'Weight Loss',
    'fat burn': 'Weight Loss',
    'fat burner': 'Weight Loss',
    'thermogenic': 'Weight Loss',
    
    'amino acids': 'Amino Acids',
    'aminos': 'Amino Acids',
    'amino': 'Amino Acids',
    'bcaa': 'Amino Acids',
    
    'wellness': 'Wellness',
    'health': 'Wellness',
    'vitamin': 'Wellness',
    'vitamins': 'Wellness',
    'essential': 'Wellness',
    'multivitamin': 'Wellness',
    'anti-aging': 'Wellness',
    
    'daily essentials': 'Daily Essentials',
  };
  
  // Check if the normalized category has a direct match in our map
  if (categoryMap[normalized]) {
    console.log(`Found direct match for '${normalized}': '${categoryMap[normalized]}'`);
    return categoryMap[normalized];
  }
  
  // If no direct match, try to find partial matches
  for (const [key, value] of Object.entries(categoryMap)) {
    if (normalized.includes(key)) {
      console.log(`Found partial match for '${normalized}' with key '${key}': '${value}'`);
      return value;
    }
  }
  
  // If no match, capitalize each word
  const capitalized = normalized.replace(/\b\w/g, char => char.toUpperCase());
  console.log(`No match found for '${normalized}', capitalizing: '${capitalized}'`);
  return capitalized;
};

// This is a reusable component for all category pages
const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState('featured');
  const [filterOptions, setFilterOptions] = useState({
    brands: [] as string[],
    categories: [] as string[],
    priceRange: null as string | null,
    inStock: false,
    onSale: false,
    bestSeller: false
  });
  
  // Format and standardize category from URL parameter
  const categoryFormatted = category ? category.replace(/-/g, ' ') : '';
  const standardCategory = standardizeUrlCategory(category || '');
  
  // Fetch products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await fetchSquareProducts();
        
        // Debug logging to see all categories
        console.log('All product categories:', [...new Set(fetchedProducts.map(p => p.category))]);
        console.log(`Total products fetched: ${fetchedProducts.length}`);
        
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
  
  // Filter products by category with enhanced debugging
  useEffect(() => {
    if (!products.length) return;
    
    console.log(`CategoryPage: Filtering products for category '${category}'`);
    console.log(`Formatted category: '${categoryFormatted}'`);
    console.log(`Standardized category: '${standardCategory}'`);
    
    // More robust filtering logic
    const filtered = products.filter(product => {
      if (!product.category) {
        console.log(`Product has no category: ${product.title}`);
        return false;
      }
      
      const productCategory = product.category;
      const productCategoryLower = productCategory.toLowerCase().trim();
      const standardCategoryLower = standardCategory.toLowerCase().trim();
      
      // Log each product category comparison attempt
      console.log(`Comparing product '${product.title}': product category '${productCategory}' with standard category '${standardCategory}'`);
      
      // Check for exact match (case insensitive)
      const exactMatch = productCategoryLower === standardCategoryLower;
      if (exactMatch) {
        console.log(`✓ Exact match for product '${product.title}'`);
        return true;
      }
      
      // Check if product category contains the standard category or vice versa
      const containsMatch = 
        productCategoryLower.includes(standardCategoryLower) || 
        standardCategoryLower.includes(productCategoryLower);
      
      if (containsMatch) {
        console.log(`✓ Contains match for product '${product.title}'`);
        return true;
      }
      
      // Check for special cases
      const specialCases = {
        'pre-workout': ['preworkout', 'pre workout'],
        'amino acids': ['aminos', 'bcaa'],
        'weight loss': ['fat burn', 'fat burner', 'thermogenic'],
        'wellness': ['vitamin', 'health', 'multivitamin']
      };
      
      for (const [key, values] of Object.entries(specialCases)) {
        if (key.toLowerCase() === standardCategoryLower) {
          if (values.some(value => productCategoryLower.includes(value))) {
            console.log(`✓ Special case match for product '${product.title}': ${key}`);
            return true;
          }
        }
      }
      
      // No match
      console.log(`✗ No match for product '${product.title}' with category '${productCategory}'`);
      return false;
    });
    
    console.log(`Filtered products for category '${standardCategory}': ${filtered.length} of ${products.length} total`);
    setCategoryProducts(filtered);
    setFilteredProducts(filtered);
  }, [products, category, standardCategory, categoryFormatted]);
  
  // Apply filters and sorting
  useEffect(() => {
    if (!categoryProducts.length) return;
    
    let result = [...categoryProducts];
    
    // Apply brand filter
    if (filterOptions.brands.length > 0) {
      result = result.filter(product => 
        filterOptions.brands.some(brand => 
          product.tags?.includes(brand.toLowerCase()) || 
          product.title.toLowerCase().includes(brand.toLowerCase())
        )
      );
    }
    
    // Apply category filter (in addition to main category)
    if (filterOptions.categories.length > 0) {
      result = result.filter(product => 
        filterOptions.categories.includes(product.category)
      );
    }
    
    // Apply price filter
    if (filterOptions.priceRange) {
      const selectedRange = filterOptions.priceRange;
      const ranges = {
        'under-25': { min: 0, max: 25 },
        '25-50': { min: 25, max: 50 },
        '50-75': { min: 50, max: 75 },
        '75-100': { min: 75, max: 100 },
        'over-100': { min: 100, max: Infinity }
      };
      
      const range = ranges[selectedRange as keyof typeof ranges];
      result = result.filter(product => 
        product.price >= range.min && product.price < range.max
      );
    }
    
    // Apply availability filters
    if (filterOptions.inStock) {
      result = result.filter(product => product.stock > 0);
    }
    
    if (filterOptions.onSale) {
      result = result.filter(product => product.salePrice !== undefined);
    }
    
    if (filterOptions.bestSeller) {
      result = result.filter(product => product.bestSeller);
    }
    
    // Sort filtered products
    result.sort((a, b) => {
      switch (sortOption) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name-asc':
          return a.title.localeCompare(b.title);
        case 'name-desc':
          return b.title.localeCompare(a.title);
        case 'featured':
        default:
          // Featured products first, then best sellers, then the rest
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          if (a.bestSeller && !b.bestSeller) return -1;
          if (!a.bestSeller && b.bestSeller) return 1;
          return 0;
      }
    });
    
    setFilteredProducts(result);
  }, [categoryProducts, filterOptions, sortOption]);

  const handleFilterChange = (newFilters: any) => {
    setFilterOptions(newFilters);
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
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-16 mb-8">
        <div className="container mx-auto px-4">
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/" className="flex items-center text-gray-300 hover:text-white">
                    <Home className="h-4 w-4 mr-1" />
                    <span>Home</span>
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-gray-400" />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/shop" className="text-gray-300 hover:text-white">Shop</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-gray-400" />
              <BreadcrumbItem>
                <BreadcrumbLink className="text-white">{standardCategory}</BreadcrumbLink>
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
      
      {/* Products Section */}
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Sidebar - Hidden on mobile */}
          <div className="hidden lg:block">
            <FilterSidebar
              filterOptions={filterOptions}
              onFilterChange={handleFilterChange}
              productCount={filteredProducts.length}
            />
          </div>
          
          {/* Product Grid and Sort */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              {/* Mobile filter button */}
              <div className="w-full md:w-auto flex items-center justify-between mb-4 md:mb-0">
                <p className="text-gray-600">{filteredProducts.length} products</p>
                
                <Sheet>
                  <SheetTrigger asChild className="lg:hidden">
                    <Button variant="outline" size="sm" className="md:ml-4">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[380px]">
                    <div className="h-full overflow-y-auto py-4">
                      <FilterSidebar
                        filterOptions={filterOptions}
                        onFilterChange={handleFilterChange}
                        productCount={filteredProducts.length}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
              
              {/* Sort dropdown */}
              <div className="flex items-center w-full md:w-auto">
                <span className="mr-2 text-gray-700">Sort by:</span>
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="name-asc">Name: A to Z</SelectItem>
                      <SelectItem value="name-desc">Name: Z to A</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-12 border rounded-lg bg-gray-50">
                <h3 className="text-xl font-medium mb-2">No products available</h3>
                <p className="text-gray-600">
                  We couldn't find any products in our catalog. Please check back later!
                </p>
              </div>
            ) : categoryProducts.length === 0 ? (
              <div className="text-center py-12 border rounded-lg bg-gray-50">
                <h3 className="text-xl font-medium mb-2">No products found in this category</h3>
                <p className="text-gray-600">
                  We currently don't have any products in the {standardCategory} category. Please check back later!
                </p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12 border rounded-lg bg-gray-50">
                <h3 className="text-xl font-medium mb-4">No Products Match Your Filters</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filter criteria to find what you're looking for.
                </p>
                <Button 
                  onClick={() => setFilterOptions({
                    brands: [],
                    categories: [],
                    priceRange: null,
                    inStock: false,
                    onSale: false,
                    bestSeller: false
                  })}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

export default CategoryPage;
