import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Standard categories that match our application
const standardCategories = [
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

// Array of major supplement brands
const brands = [
  'Alpha Lion',
  'Axe & Sledge Supplements',
  'Black Magic Supplements',
  'Bucked Up',
  'Chemix',
  'Core Nutritionals',
  'Fresh Supps',
  'Gorilla Mind',
  'Metabolic Nutrition',
  'Panda Supplements',
  'Raw Nutrition',
  'Rule One Proteins',
  'Ryse Supplements'
];

interface ProductFiltersProps {
  priceRange: [number, number];
  selectedBrands: string[];
  selectedCategories: string[];
  onPriceChange: (range: [number, number]) => void;
  onBrandChange: (brands: string[]) => void;
  onCategoryChange: (categories: string[]) => void;
  minMaxPrices: [number, number];
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  priceRange,
  selectedBrands,
  selectedCategories,
  onPriceChange,
  onBrandChange,
  onCategoryChange,
  minMaxPrices
}) => {
  const [minInput, setMinInput] = useState<string>(priceRange[0].toString());
  const [maxInput, setMaxInput] = useState<string>(priceRange[1].toString());

  // Update local state when props change
  useEffect(() => {
    setMinInput(priceRange[0].toString());
    setMaxInput(priceRange[1].toString());
  }, [priceRange]);

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinInput(e.target.value);
    const minValue = parseFloat(e.target.value) || minMaxPrices[0];
    if (!isNaN(minValue)) {
      const newRange: [number, number] = [
        Math.max(minValue, minMaxPrices[0]), 
        priceRange[1]
      ];
      onPriceChange(newRange);
    }
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxInput(e.target.value);
    const maxValue = parseFloat(e.target.value) || minMaxPrices[1];
    if (!isNaN(maxValue)) {
      const newRange: [number, number] = [
        priceRange[0], 
        Math.min(maxValue, minMaxPrices[1])
      ];
      onPriceChange(newRange);
    }
  };

  const handleBrandToggle = (brand: string) => {
    let newSelectedBrands;
    if (selectedBrands.includes(brand)) {
      newSelectedBrands = selectedBrands.filter(b => b !== brand);
    } else {
      newSelectedBrands = [...selectedBrands, brand];
    }
    onBrandChange(newSelectedBrands);
  };

  const handleCategoryToggle = (slug: string) => {
    let newSelectedCategories;
    if (selectedCategories.includes(slug)) {
      newSelectedCategories = selectedCategories.filter(c => c !== slug);
    } else {
      newSelectedCategories = [...selectedCategories, slug];
    }
    onCategoryChange(newSelectedCategories);
  };

  const selectedBrandsCount = selectedBrands.length;
  const selectedCategoriesCount = selectedCategories.length;

  const clearAllFilters = () => {
    onPriceChange(minMaxPrices);
    onBrandChange([]);
    onCategoryChange([]);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-6">
        <Accordion type="multiple" defaultValue={["price", "category", "brand"]} className="w-full">
          <AccordionItem value="price" className="border border-gray-200 rounded-md overflow-hidden">
            <AccordionTrigger className="px-4 py-3 bg-gray-50 hover:bg-gray-100 font-medium">
              PRICE
            </AccordionTrigger>
            <AccordionContent className="px-4 py-3 border-t">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Label htmlFor="min-price" className="text-sm">Min Price ($)</Label>
                    <Input
                      id="min-price"
                      type="number"
                      value={minInput}
                      onChange={handleMinInputChange}
                      className="mt-1"
                    />
                  </div>
                  <span className="pt-6">-</span>
                  <div className="flex-1">
                    <Label htmlFor="max-price" className="text-sm">Max Price ($)</Label>
                    <Input
                      id="max-price"
                      type="number"
                      value={maxInput}
                      onChange={handleMaxInputChange}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="category" className="border border-gray-200 rounded-md mt-2 overflow-hidden">
            <AccordionTrigger className="px-4 py-3 bg-gray-50 hover:bg-gray-100 font-medium">
              PRODUCT TYPE {selectedCategoriesCount > 0 && `(${selectedCategoriesCount})`}
            </AccordionTrigger>
            <AccordionContent className="px-4 py-3 border-t">
              <div className="space-y-2">
                {standardCategories.map((category) => (
                  <div key={category.slug} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`category-${category.slug}`} 
                      checked={selectedCategories.includes(category.slug)}
                      onCheckedChange={() => handleCategoryToggle(category.slug)}
                    />
                    <label
                      htmlFor={`category-${category.slug}`}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="brand" className="border border-gray-200 rounded-md mt-2 overflow-hidden">
            <AccordionTrigger className="px-4 py-3 bg-gray-50 hover:bg-gray-100 font-medium">
              SHOP BY BRANDS {selectedBrandsCount > 0 && `(${selectedBrandsCount})`}
            </AccordionTrigger>
            <AccordionContent className="px-4 py-3 border-t">
              <div className="space-y-2">
                {brands.map((brand) => (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`brand-${brand}`} 
                      checked={selectedBrands.includes(brand)}
                      onCheckedChange={() => handleBrandToggle(brand)}
                    />
                    <label
                      htmlFor={`brand-${brand}`}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {brand}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        {(selectedCategories.length > 0 || selectedBrands.length > 0 || 
          priceRange[0] > minMaxPrices[0] || priceRange[1] < minMaxPrices[1]) && (
          <Button 
            variant="link"
            onClick={clearAllFilters}
            className="text-primary hover:underline text-sm font-medium mt-2 self-start"
          >
            Clear All Filters
          </Button>
        )}
      </div>

      {/* Mobile Filters - Using Collapsible for mobile */}
      <div className="block md:hidden mt-4">
        <div className="text-sm text-gray-500">
          {selectedCategoriesCount > 0 || selectedBrandsCount > 0 || 
            priceRange[0] > minMaxPrices[0] || priceRange[1] < minMaxPrices[1] ? (
            <div className="flex gap-2 flex-wrap">
              {selectedCategoriesCount > 0 && (
                <span className="bg-gray-100 px-2 py-1 rounded">
                  {selectedCategoriesCount} categories
                </span>
              )}
              {selectedBrandsCount > 0 && (
                <span className="bg-gray-100 px-2 py-1 rounded">
                  {selectedBrandsCount} brands
                </span>
              )}
              {(priceRange[0] > minMaxPrices[0] || priceRange[1] < minMaxPrices[1]) && (
                <span className="bg-gray-100 px-2 py-1 rounded">
                  ${priceRange[0]} - ${priceRange[1]}
                </span>
              )}
            </div>
          ) : (
            <span>No filters applied</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
