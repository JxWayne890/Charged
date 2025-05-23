
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Button } from './ui/button';

interface FeaturedProductCarouselProps {
  products: Product[];
  autoScrollInterval?: number; // in ms
}

const FeaturedProductCarousel = ({
  products,
  autoScrollInterval = 8000, // Increased to 8 seconds for better readability
}: FeaturedProductCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Auto scroll effect with smooth fade transition
  useEffect(() => {
    if (!products || products.length === 0) return;

    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
        setIsVisible(true);
      }, 800); // Smooth fade out time
    }, autoScrollInterval);

    return () => clearInterval(interval);
  }, [products, autoScrollInterval]);

  if (!products || products.length === 0) return null;

  const currentProduct = products[currentIndex];

  return (
    <div className="bg-black text-white py-6">
      <div className="container mx-auto px-4">
        <h2 className="text-xl font-bold text-center mb-4">Featured Products</h2>
        
        <div className="max-w-xl mx-auto">
          <div 
            className={`transition-all duration-1000 ease-in-out ${
              isVisible 
                ? 'opacity-100 transform translate-y-0' 
                : 'opacity-0 transform translate-y-2'
            }`}
          >
            <div className="flex flex-col md:flex-row items-center gap-4 p-3">
              {/* Product Image */}
              <div className="w-full md:w-1/2 max-w-xs aspect-square relative overflow-hidden rounded-lg bg-gray-900">
                <img
                  src={currentProduct.images[0]}
                  alt={currentProduct.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                {currentProduct.bestSeller && (
                  <div className="absolute top-2 left-2 bg-primary text-white text-xs py-1 px-2 rounded">
                    Best Seller
                  </div>
                )}
              </div>
              
              {/* Product Info */}
              <div className="w-full md:w-1/2 flex flex-col text-center md:text-left">
                <span className="text-sm text-gray-400 mb-1">{currentProduct.category}</span>
                <h3 className="text-lg font-bold mb-2 uppercase">{currentProduct.title}</h3>
                
                <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                  {currentProduct.salePrice ? (
                    <>
                      <span className="text-lg font-bold text-primary">{formatPrice(currentProduct.salePrice)}</span>
                      <span className="text-sm line-through text-gray-400">{formatPrice(currentProduct.price)}</span>
                    </>
                  ) : (
                    <span className="text-lg font-bold">{formatPrice(currentProduct.price)}</span>
                  )}
                </div>
                
                <p className="mb-4 text-gray-300 line-clamp-3 text-sm">
                  {currentProduct.description}
                </p>
                
                <Button asChild className="bg-primary hover:bg-primary-dark w-full md:w-auto max-w-xs mx-auto md:mx-0">
                  <Link to={`/product/${currentProduct.slug}`}>View Product</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProductCarousel;
