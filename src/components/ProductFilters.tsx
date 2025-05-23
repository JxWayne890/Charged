
import React, { useState, useEffect } from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ChevronDown, Filter } from 'lucide-react';

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
  'Black Magic Supplements',
  'Bucked Up',
  'Chemix',
  'Raw Nutrition',
  'Ryse Supplements',
  'Rule One Proteins',
  'Fresh Supps',
  'Metabolic Nutrition',
  'Core Nutritionals',
  'Axe & Sledge Supplements'
];

interface ProductFiltersProps {
  priceRange: [number, number];
  selectedBrands: string[];
  selectedCategory: string | null;
  onPriceChange: (range: [number, number]) => void;
  onBrandChange: (brands: string[]) => void;
  onCategoryChange: (category: string | null) => void;
  minMaxPrices: [number, number];
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  priceRange,
  selectedBrands,
  selectedCategory,
  onPriceChange,
  onBrandChange,
  onCategoryChange,
  minMaxPrices
}) => {
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(priceRange);
  const [minInput, setMinInput] = useState<string>(priceRange[0].toString());
  const [maxInput, setMaxInput] = useState<string>(priceRange[1].toString());
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Update local state when props change
  useEffect(() => {
    setLocalPriceRange(priceRange);
    setMinInput(priceRange[0].toString());
    setMaxInput(priceRange[1].toString());
  }, [priceRange]);

  const handleSliderChange = (value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]];
    setLocalPriceRange(newRange);
    setMinInput(newRange[0].toString());
    setMaxInput(newRange[1].toString());
    onPriceChange(newRange);
  };

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinInput(e.target.value);
    const minValue = parseFloat(e.target.value) || minMaxPrices[0];
    if (!isNaN(minValue)) {
      const newRange: [number, number] = [
        Math.max(minValue, minMaxPrices[0]), 
        localPriceRange[1]
      ];
      setLocalPriceRange(newRange);
      onPriceChange(newRange);
    }
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxInput(e.target.value);
    const maxValue = parseFloat(e.target.value) || minMaxPrices[1];
    if (!isNaN(maxValue)) {
      const newRange: [number, number] = [
        localPriceRange[0], 
        Math.min(maxValue, minMaxPrices[1])
      ];
      setLocalPriceRange(newRange);
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

  const toggleCategory = (category: string) => {
    if (selectedCategory === category) {
      onCategoryChange(null); // Deselect if already selected
    } else {
      onCategoryChange(category);
    }
  };

  const clearAllFilters = () => {
    onPriceChange(minMaxPrices);
    onBrandChange([]);
    onCategoryChange(null);
  };

  return (
    <div className="w-full">
      {/* Desktop Filters */}
      <div className="hidden md:block">
        <div className="flex flex-col gap-6 p-4 bg-background rounded-lg border shadow-sm">
          <div>
            <h3 className="text-lg font-medium mb-2">Price Range</h3>
            <div className="space-y-4">
              <Slider
                value={localPriceRange}
                min={minMaxPrices[0]}
                max={minMaxPrices[1]}
                step={1}
                onValueChange={(values) => handleSliderChange(values as [number, number])}
                className="mb-6"
              />
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Label htmlFor="min-price" className="text-sm">Min</Label>
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
                  <Label htmlFor="max-price" className="text-sm">Max</Label>
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
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Categories</h3>
            <div className="space-y-2">
              {standardCategories.map((category) => (
                <div key={category.slug} className="flex items-center gap-2">
                  <Switch 
                    checked={selectedCategory === category.slug}
                    onCheckedChange={() => toggleCategory(category.slug)}
                  />
                  <span className="text-sm">{category.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Brands</h3>
            <div className="space-y-2">
              {brands.map((brand) => (
                <div key={brand} className="flex items-center gap-2">
                  <Switch 
                    checked={selectedBrands.includes(brand)}
                    onCheckedChange={() => handleBrandToggle(brand)}
                  />
                  <span className="text-sm">{brand}</span>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={clearAllFilters}
            className="text-primary hover:underline text-sm font-medium mt-2"
          >
            Clear All Filters
          </button>
        </div>
      </div>

      {/* Mobile Filter Dropdown */}
      <div className="block md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 border rounded-lg">
            <Filter size={18} />
            <span>Filters</span>
            <ChevronDown size={16} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-screen max-w-md p-4">
            <DropdownMenuLabel>Price Range</DropdownMenuLabel>
            <div className="px-2 py-4">
              <Slider
                value={localPriceRange}
                min={minMaxPrices[0]}
                max={minMaxPrices[1]}
                step={1}
                onValueChange={(values) => handleSliderChange(values as [number, number])}
                className="mb-6"
              />
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={minInput}
                  onChange={handleMinInputChange}
                  placeholder="Min"
                  className="w-24"
                />
                <span>to</span>
                <Input
                  type="number"
                  value={maxInput}
                  onChange={handleMaxInputChange}
                  placeholder="Max"
                  className="w-24"
                />
              </div>
            </div>

            <DropdownMenuSeparator />
            <DropdownMenuLabel>Categories</DropdownMenuLabel>
            <div className="px-2 py-2 max-h-60 overflow-y-auto">
              <ToggleGroup type="single" value={selectedCategory || ""} className="flex flex-wrap gap-2">
                {standardCategories.map((category) => (
                  <ToggleGroupItem 
                    key={category.slug} 
                    value={category.slug}
                    onClick={() => toggleCategory(category.slug)}
                    className="text-xs"
                  >
                    {category.name}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            <DropdownMenuSeparator />
            <DropdownMenuLabel>Brands</DropdownMenuLabel>
            <div className="px-2 py-2 max-h-60 overflow-y-auto">
              {brands.map((brand) => (
                <DropdownMenuItem 
                  key={brand} 
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => handleBrandToggle(brand)}
                >
                  <div className={`w-4 h-4 border rounded-sm ${selectedBrands.includes(brand) ? 'bg-primary border-primary' : 'bg-transparent'}`}>
                    {selectedBrands.includes(brand) && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </div>
                  {brand}
                </DropdownMenuItem>
              ))}
            </div>

            <div className="mt-4 px-2">
              <button 
                onClick={clearAllFilters}
                className="text-primary hover:underline text-sm font-medium"
              >
                Clear All Filters
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ProductFilters;
