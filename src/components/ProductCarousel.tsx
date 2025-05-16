
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';

interface SquareProduct {
  id: string;
  item_data: {
    name: string;
    description?: string;
    variations?: Array<{
      id: string;
      item_variation_data: {
        price_money?: {
          amount: number;
          currency: string;
        }
      }
    }>
  }
}

interface ProductCarouselProps {
  title: string;
  viewAllLink?: string;
}

const ProductCarousel = ({ title, viewAllLink }: ProductCarouselProps) => {
  const [products, setProducts] = useState<SquareProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://uabhicleiumptashiarr.supabase.co/functions/v1/catalog', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setProducts(data.items || []);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  const visibleProducts = products.slice(currentIndex, currentIndex + 4);
  const canScrollLeft = currentIndex > 0;
  const canScrollRight = currentIndex < products.length - 4;
  
  const scrollLeft = () => {
    if (canScrollLeft) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  const scrollRight = () => {
    if (canScrollRight) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className="flex justify-center">
          <p>Loading products...</p>
        </div>
      </div>
    );
  }
  
  if (products.length === 0) {
    return null;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        {viewAllLink && (
          <Link 
            to={viewAllLink} 
            className="text-primary hover:text-primary-dark text-sm font-medium transition"
          >
            View All
          </Link>
        )}
      </div>
      
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleProducts.map(product => (
            <ProductCard 
              key={product.id}
              product={{
                id: product.id,
                name: product.item_data.name,
                description: product.item_data.description || '',
                price: product.item_data.variations?.[0]?.item_variation_data.price_money?.amount || 0,
                currency: product.item_data.variations?.[0]?.item_variation_data.price_money?.currency || 'USD'
              }}
            />
          ))}
        </div>
        
        {/* Navigation buttons */}
        {products.length > 4 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className={`absolute -left-4 top-1/2 transform -translate-y-1/2 rounded-full w-8 h-8 ${
                !canScrollLeft ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={scrollLeft}
              disabled={!canScrollLeft}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"  
              className={`absolute -right-4 top-1/2 transform -translate-y-1/2 rounded-full w-8 h-8 ${
                !canScrollRight ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={scrollRight}
              disabled={!canScrollRight}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductCarousel;
