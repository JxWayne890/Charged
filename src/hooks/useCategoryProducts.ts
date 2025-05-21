
import { useState, useEffect } from 'react';
import { Product } from '@/types';

interface FilterOptions {
  brands: string[];
  priceRange: string | null;
  inStock: boolean;
  onSale: boolean;
  bestSeller: boolean;
}

export const useCategoryProducts = (products: Product[], category: string, standardCategory: string) => {
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortOption, setSortOption] = useState('featured');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    brands: [],
    priceRange: null,
    inStock: false,
    onSale: false,
    bestSeller: false
  });

  // Filter products by category
  useEffect(() => {
    if (!products.length) return;
    
    console.log(`useCategoryProducts: Filtering products for category '${category}'`);
    console.log(`useCategoryProducts: URL parameter: '${category}'`);
    console.log(`useCategoryProducts: Standardized category: '${standardCategory}'`);
    
    // Debug output of all products and their categories before filtering
    console.log("useCategoryProducts: All products before filtering:");
    products.forEach(p => console.log(`- ${p.title} (category: ${p.category})`));
    
    // Use case-insensitive exact matching for category filtering
    const filtered = products.filter(product => {
      if (!product.category) {
        console.log(`useCategoryProducts: Product has no category: ${product.title}`);
        return false;
      }
      
      const productCategory = product.category;
      
      // Log each product category comparison attempt
      console.log(`useCategoryProducts: Comparing product '${product.title}': product category '${productCategory}' with standard category '${standardCategory}'`);
      
      // Case-insensitive exact match
      const isMatch = productCategory.toLowerCase() === standardCategory.toLowerCase();
      
      if (isMatch) {
        console.log(`useCategoryProducts: ✓ Match for product '${product.title}' with category '${productCategory}'`);
        return true;
      } else {
        console.log(`useCategoryProducts: ✗ No match for product '${product.title}' with category '${productCategory}'`);
        return false;
      }
    });
    
    console.log(`useCategoryProducts: Filtered products for category '${standardCategory}': ${filtered.length} of ${products.length} total`);
    
    // Debug output of which products were included in this category
    if (filtered.length > 0) {
      console.log("useCategoryProducts: Products included in this category:");
      filtered.forEach(p => console.log(`- ${p.title} (category: ${p.category})`));
    } else {
      console.log("useCategoryProducts: No products matched this category exactly.");
    }
    
    setCategoryProducts(filtered);
    setFilteredProducts(filtered);
  }, [products, category, standardCategory]);
  
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
    
    // Apply price filter
    if (filterOptions.priceRange) {
      const selectedRange = filterOptions.priceRange;
      const ranges: Record<string, { min: number, max: number }> = {
        'under-25': { min: 0, max: 25 },
        '25-50': { min: 25, max: 50 },
        '50-75': { min: 50, max: 75 },
        '75-100': { min: 75, max: 100 },
        'over-100': { min: 100, max: Infinity }
      };
      
      const range = ranges[selectedRange];
      if (range) {
        result = result.filter(product => 
          product.price >= range.min && product.price < range.max
        );
      }
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

  // Handler for filter changes
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilterOptions(newFilters);
  };

  // Handler for sort changes
  const handleSortChange = (value: string) => {
    setSortOption(value);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilterOptions({
      brands: [],
      priceRange: null,
      inStock: false,
      onSale: false,
      bestSeller: false
    });
  };

  return {
    categoryProducts,
    filteredProducts,
    sortOption,
    filterOptions,
    handleFilterChange,
    handleSortChange,
    clearFilters
  };
};
