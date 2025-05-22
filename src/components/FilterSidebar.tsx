
import React, { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from './ui/accordion';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { getAllCategories } from '@/utils/categoryUtils';

// Available brands for filtering
const availableBrands = [
  'Alpha Lion',
  'Axe & Sledge Supplements',
  'Black Magic Supplements',
  'Bucked Up',
  'Chemix',
  'Core Nutritionals',
  'Fresh Supps',
  'Metabolic Nutrition',
  'Raw Nutrition',
  'Rule One Proteins',
  'Ryse Supplements'
];

// Price ranges for filtering
const priceRanges = [
  { label: 'Under $25', value: 'under-25', min: 0, max: 25 },
  { label: '$25 - $50', value: '25-50', min: 25, max: 50 },
  { label: '$50 - $75', value: '50-75', min: 50, max: 75 },
  { label: '$75 - $100', value: '75-100', min: 75, max: 100 },
  { label: 'Over $100', value: 'over-100', min: 100, max: Infinity }
];

type FilterOptions = {
  brands: string[];
  categories: string[];
  priceRange: string | null;
  inStock: boolean;
  onSale: boolean;
  bestSeller: boolean;
}

interface FilterSidebarProps {
  filterOptions: FilterOptions;
  onFilterChange: (newFilters: FilterOptions) => void;
  productCount: number;
}

const FilterSidebar = ({ filterOptions, onFilterChange, productCount }: FilterSidebarProps) => {
  // Toggle brand selection
  const toggleBrand = (brand: string) => {
    const updatedBrands = filterOptions.brands.includes(brand)
      ? filterOptions.brands.filter(b => b !== brand)
      : [...filterOptions.brands, brand];
    
    onFilterChange({
      ...filterOptions,
      brands: updatedBrands
    });
  };

  // Toggle category selection
  const toggleCategory = (category: string) => {
    const updatedCategories = filterOptions.categories.includes(category)
      ? filterOptions.categories.filter(c => c !== category)
      : [...filterOptions.categories, category];
    
    onFilterChange({
      ...filterOptions,
      categories: updatedCategories
    });
  };

  // Set price range
  const setPriceRange = (value: string) => {
    onFilterChange({
      ...filterOptions,
      priceRange: value === filterOptions.priceRange ? null : value
    });
  };

  // Toggle boolean filters
  const toggleFilter = (filterName: 'inStock' | 'onSale' | 'bestSeller') => {
    onFilterChange({
      ...filterOptions,
      [filterName]: !filterOptions[filterName]
    });
  };

  // Clear all filters
  const clearFilters = () => {
    onFilterChange({
      brands: [],
      categories: [],
      priceRange: null,
      inStock: false,
      onSale: false,
      bestSeller: false
    });
  };

  // Get all available categories
  const availableCategories = getAllCategories().map(c => c.name);

  return (
    <div className="w-full lg:w-64 lg:min-w-64 bg-white border rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Filters</h2>
        {(filterOptions.brands.length > 0 || 
          filterOptions.categories.length > 0 ||
          filterOptions.priceRange !== null || 
          filterOptions.inStock || 
          filterOptions.onSale ||
          filterOptions.bestSeller) && (
          <button 
            onClick={clearFilters}
            className="text-sm text-primary hover:text-primary-dark transition-colors"
          >
            Clear all
          </button>
        )}
      </div>
      
      <div className="text-sm text-gray-600 mb-4">
        <span>{productCount} products</span>
      </div>
      
      <Separator className="my-4" />
      
      <Accordion type="multiple" defaultValue={['categories', 'brands', 'price', 'availability']}>
        {/* Category Filter */}
        <AccordionItem value="categories" className="border-b">
          <AccordionTrigger className="py-3 hover:no-underline">
            <span className="text-base font-medium">Category</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-2">
              {availableCategories.map(category => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`category-${category}`} 
                    checked={filterOptions.categories.includes(category)}
                    onCheckedChange={() => toggleCategory(category)}
                  />
                  <Label 
                    htmlFor={`category-${category}`}
                    className="text-sm cursor-pointer flex-1"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Brand Filter */}
        <AccordionItem value="brands" className="border-b">
          <AccordionTrigger className="py-3 hover:no-underline">
            <span className="text-base font-medium">Brand</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-2">
              {availableBrands.map(brand => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`brand-${brand}`} 
                    checked={filterOptions.brands.includes(brand)}
                    onCheckedChange={() => toggleBrand(brand)}
                  />
                  <Label 
                    htmlFor={`brand-${brand}`}
                    className="text-sm cursor-pointer flex-1"
                  >
                    {brand}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Filter */}
        <AccordionItem value="price" className="border-b">
          <AccordionTrigger className="py-3 hover:no-underline">
            <span className="text-base font-medium">Price</span>
          </AccordionTrigger>
          <AccordionContent>
            <RadioGroup 
              value={filterOptions.priceRange || ""}
              onValueChange={setPriceRange}
              className="space-y-2"
            >
              {priceRanges.map(range => (
                <div key={range.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={range.value} id={`price-${range.value}`} />
                  <Label 
                    htmlFor={`price-${range.value}`}
                    className="text-sm cursor-pointer flex-1"
                  >
                    {range.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        {/* Other Filters */}
        <AccordionItem value="availability" className="border-b">
          <AccordionTrigger className="py-3 hover:no-underline">
            <span className="text-base font-medium">Availability</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="in-stock" 
                  checked={filterOptions.inStock}
                  onCheckedChange={() => toggleFilter('inStock')}
                />
                <Label htmlFor="in-stock" className="text-sm cursor-pointer">In Stock</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="on-sale" 
                  checked={filterOptions.onSale}
                  onCheckedChange={() => toggleFilter('onSale')}
                />
                <Label htmlFor="on-sale" className="text-sm cursor-pointer">On Sale</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="best-seller" 
                  checked={filterOptions.bestSeller}
                  onCheckedChange={() => toggleFilter('bestSeller')}
                />
                <Label htmlFor="best-seller" className="text-sm cursor-pointer">Best Sellers</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FilterSidebar;
