
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Button } from './ui/button';
import ProductImage from './ProductImage';

interface FeaturedProductCarouselProps {
  products: Product[];
  autoScrollInterval?: number; // in ms
}

const FeaturedProductCarousel = ({
  products,
  autoScrollInterval = 8000 // 8 seconds for better readability
}: FeaturedProductCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Auto scroll effect with smooth fade transition
  useEffect(() => {
    if (!products || products.length === 0) return;
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % products.length);
        setIsVisible(true);
      }, 800); // Smooth fade out time
    }, autoScrollInterval);
    return () => clearInterval(interval);
  }, [products, autoScrollInterval]);

  if (!products || products.length === 0) return null;

  const currentProduct = products[currentIndex];

  return (
    <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black py-3 overflow-hidden mt-0">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(122,210,60,0.1),transparent_70%)]"></div>
      <div className="absolute top-0 left-1/4 w-12 h-12 bg-primary/5 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 right-1/4 w-12 h-12 bg-primary/5 rounded-full blur-2xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-3">
          <h2 className="text-lg font-bold text-white mb-1 electric-lime-glow md:text-2xl">
            FEATURED PRODUCTS
          </h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-primary to-yellow-400 mx-auto rounded-full"></div>
        </div>
        
        <div className="max-w-md mx-auto">
          <div className={`transition-all duration-1000 ease-in-out ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2'}`}>
            <div className="flex items-center gap-4">
              {/* Left side - Product Image with price underneath */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 relative overflow-hidden rounded-md mb-2">
                  <ProductImage src={currentProduct.images[0]} alt={currentProduct.title} className="w-full h-full object-cover transition-all duration-300 hover:scale-105" width={80} />
                </div>
                
                {/* Product Price */}
                <div className="flex items-center justify-center gap-2">
                  {currentProduct.salePrice ? (
                    <>
                      <span className="text-sm font-bold text-primary electric-lime-glow">
                        {formatPrice(currentProduct.salePrice)}
                      </span>
                      <span className="text-sm line-through text-gray-400">
                        {formatPrice(currentProduct.price)}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm font-bold text-white">
                      {formatPrice(currentProduct.price)}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Right side - Product name and View Product button */}
              <div className="flex flex-col items-start justify-center flex-1">
                <h3 className="font-bold uppercase text-white electric-lime-glow mb-3 text-lg">
                  {currentProduct.title}
                </h3>
                
                <Button asChild className="bg-gradient-to-r from-primary to-green-400 hover:from-green-400 hover:to-primary text-black font-bold py-1 px-3 text-xs rounded-full shadow-lg hover:shadow-primary/50 transition-all duration-300 hover:scale-105">
                  <Link to={`/product/${currentProduct.slug}`}>
                    VIEW PRODUCT
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product indicators */}
        {products.length > 1 && (
          <div className="flex justify-center mt-3 gap-1">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-1 h-1 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-primary shadow-sm shadow-primary/50' : 'bg-gray-600 hover:bg-gray-500'
                }`}
                aria-label={`Go to product ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedProductCarousel;
