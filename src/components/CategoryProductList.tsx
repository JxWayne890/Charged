
import React from 'react';
import { Filter } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FilterSidebar from '@/components/FilterSidebar';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';

interface CategoryProductListProps {
  categoryProducts: Product[];
  filteredProducts: Product[];
  sortOption: string;
  filterOptions: {
    brands: string[];
    priceRange: string | null;
    inStock: boolean;
    onSale: boolean;
    bestSeller: boolean;
  };
  onSortChange: (value: string) => void;
  onFilterChange: (newFilters: any) => void;
  onClearFilters: () => void;
}

const CategoryProductList: React.FC<CategoryProductListProps> = ({
  categoryProducts,
  filteredProducts,
  sortOption,
  filterOptions,
  onSortChange,
  onFilterChange,
  onClearFilters
}) => {
  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter Sidebar - Hidden on mobile */}
        <div className="hidden lg:block">
          <FilterSidebar
            filterOptions={filterOptions}
            onFilterChange={onFilterChange}
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
                      onFilterChange={onFilterChange}
                      productCount={filteredProducts.length}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            
            {/* Sort dropdown */}
            <div className="flex items-center w-full md:w-auto">
              <span className="mr-2 text-gray-700">Sort by:</span>
              <Select value={sortOption} onValueChange={onSortChange}>
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

          {/* Product display logic */}
          {categoryProducts.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-gray-50">
              <h3 className="text-xl font-medium mb-2">No products found in this category</h3>
              <p className="text-gray-600">
                We currently don't have any products in this category. Please check back later!
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-gray-50">
              <h3 className="text-xl font-medium mb-4">No Products Match Your Filters</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your filter criteria to find what you're looking for.
              </p>
              <Button onClick={onClearFilters}>
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
  );
};

export default CategoryProductList;
