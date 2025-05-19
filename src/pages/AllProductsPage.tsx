
import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { Separator } from '@/components/ui/separator';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { fetchSquareProducts } from '@/lib/square';
import FilterSidebar from '@/components/FilterSidebar';
import { Product } from '@/types';
import { toast } from "@/components/ui/use-toast";

const AllProductsPage = () => {
  const [sortOption, setSortOption] = useState('featured');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState({
    brands: [] as string[],
    priceRange: null as string | null,
    inStock: false,
    onSale: false,
    bestSeller: false
  });
  
  // Fetch products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await fetchSquareProducts();
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
        setError(null);
        
        if (fetchedProducts.length === 0) {
          console.warn('No products found');
          toast({
            title: "No products found",
            description: "Your catalog appears to be empty. Please check your Square account.",
            variant: "default",
          });
        }
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
  }, []);
  
  // Apply filters and sorting
  useEffect(() => {
    if (!products.length) return;
    
    let result = [...products];
    
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
  }, [products, filterOptions, sortOption]);

  const handleFilterChange = (newFilters: any) => {
    setFilterOptions(newFilters);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 pt-32 flex justify-center">
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
    <div className="container mx-auto px-4 py-12 pt-32">
      <div className="flex flex-col items-center mb-10">
        <h1 className="text-4xl font-bold text-center mb-4">All Products</h1>
        <p className="text-gray-600 text-center max-w-2xl mb-6">
          Discover our complete collection of premium supplements designed to help you reach your health and fitness goals.
        </p>
        <Separator className="w-24 bg-primary my-4" />
      </div>
      
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
          
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-gray-50">
              <h3 className="text-xl font-medium mb-4">No Products Match Your Filters</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your filter criteria to find what you're looking for.
              </p>
              <Button 
                onClick={() => setFilterOptions({
                  brands: [],
                  priceRange: null,
                  inStock: false,
                  onSale: false,
                  bestSeller: false
                })}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProductsPage;
