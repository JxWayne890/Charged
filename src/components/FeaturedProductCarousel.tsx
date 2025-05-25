
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
  autoScrollInterval = 8000, // 8 seconds for better readability
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
    <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black py-3 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(122,210,60,0.1),transparent_70%)]"></div>
      <div className="absolute top-0 left-1/4 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-2">
          <h2 className="text-lg md:text-xl font-bold text-white mb-1 electric-lime-glow">
            FEATURED PRODUCTS
          </h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-primary to-yellow-400 mx-auto rounded-full"></div>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div 
            className={`transition-all duration-1000 ease-in-out ${
              isVisible 
                ? 'opacity-100 transform translate-y-0' 
                : 'opacity-0 transform translate-y-2'
            }`}
          >
            <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-lg p-3 border border-gray-700/50 hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-primary/20 overflow-hidden group">
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
              
              {/* Electric border effect */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary via-yellow-400 to-primary opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-500"></div>
              
              {/* Animated corners */}
              <div className="absolute top-1 left-1 w-3 h-3 border-l-2 border-t-2 border-primary/0 group-hover:border-primary transition-colors duration-300"></div>
              <div className="absolute top-1 right-1 w-3 h-3 border-r-2 border-t-2 border-primary/0 group-hover:border-primary transition-colors duration-300"></div>
              <div className="absolute bottom-1 left-1 w-3 h-3 border-l-2 border-b-2 border-primary/0 group-hover:border-primary transition-colors duration-300"></div>
              <div className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 border-primary/0 group-hover:border-primary transition-colors duration-300"></div>
              
              <div className="flex flex-col md:flex-row items-center gap-3 relative z-10">
                {/* Product Image */}
                <div className="w-full md:w-1/3 max-w-[120px] aspect-square relative overflow-hidden rounded-md bg-gray-900/50 border border-gray-700/50">
                  <ProductImage
                    src={currentProduct.images[0]}
                    alt={currentProduct.title}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:brightness-110 group-hover:drop-shadow-lg group-hover:scale-105"
                    width={120}
                  />
                  {currentProduct.bestSeller && (
                    <div className="absolute top-1 left-1 bg-gradient-to-r from-primary to-green-400 text-black text-[10px] font-bold py-0.5 px-1.5 rounded-full shadow-lg">
                      BEST SELLER
                    </div>
                  )}
                  {currentProduct.featured && (
                    <div className="absolute top-1 right-1 bg-gradient-to-r from-yellow-400 to-primary text-black text-[10px] font-bold py-0.5 px-1.5 rounded-full shadow-lg">
                      FEATURED
                    </div>
                  )}
                </div>
                
                {/* Product Info */}
                <div className="w-full md:w-2/3 flex flex-col text-center md:text-left">
                  <h3 className="text-sm md:text-base font-bold mb-1 uppercase text-white group-hover:text-primary transition-colors duration-300 electric-lime-glow">
                    {currentProduct.title}
                  </h3>
                  
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    {currentProduct.salePrice ? (
                      <>
                        <span className="text-sm md:text-base font-bold text-primary electric-lime-glow">
                          {formatPrice(currentProduct.salePrice)}
                        </span>
                        <span className="text-xs line-through text-gray-400">
                          {formatPrice(currentProduct.price)}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm md:text-base font-bold text-white group-hover:text-primary transition-colors duration-300">
                        {formatPrice(currentProduct.price)}
                      </span>
                    )}
                  </div>
                  
                  <Button asChild className="bg-gradient-to-r from-primary to-green-400 hover:from-green-400 hover:to-primary text-black font-bold py-1 px-3 text-xs rounded-full shadow-lg hover:shadow-primary/50 transition-all duration-300 hover:scale-105 w-full md:w-auto max-w-[140px] mx-auto md:mx-0">
                    <Link to={`/product/${currentProduct.slug}`}>
                      VIEW PRODUCT
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product indicators */}
        {products.length > 1 && (
          <div className="flex justify-center mt-2 gap-1">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-primary shadow-sm shadow-primary/50' 
                    : 'bg-gray-600 hover:bg-gray-500'
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
