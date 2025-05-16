
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
import { fetchSquareProducts, mapSquareProductsToAppFormat } from '@/lib/square';
import { Product } from '@/types';

const AllProductsPage = () => {
  const [sortOption, setSortOption] = useState('featured');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const squareProducts = await fetchSquareProducts();
        const formattedProducts = mapSquareProductsToAppFormat(squareProducts);
        setProducts(formattedProducts);
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
  
  // Sort products based on the selected option
  const sortedProducts = [...products].sort((a, b) => {
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
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="mb-4 md:mb-0">
          <p className="text-gray-600">{sortedProducts.length} products</p>
        </div>
        
        <div className="flex items-center">
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedProducts.length > 0 ? (
          sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600">No products found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProductsPage;
