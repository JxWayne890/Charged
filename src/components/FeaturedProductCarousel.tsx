
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Button } from './ui/button';
import ProductImage from './ProductImage';

interface FeaturedProductCarouselProps {
  products: Product[];
  autoScrollInterval?: number;
}

const FeaturedProductCarousel = ({
  products,
}: FeaturedProductCarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  if (!products || products.length === 0) return null;

  const checkScrollable = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      checkScrollable();
      carousel.addEventListener('scroll', checkScrollable);
      window.addEventListener('resize', checkScrollable);

      return () => {
        carousel.removeEventListener('scroll', checkScrollable);
        window.removeEventListener('resize', checkScrollable);
      };
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { clientWidth } = carouselRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth / 2 : clientWidth / 2;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black py-8 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(122,210,60,0.1),transparent_70%)]"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 electric-lime-glow">
            FEATURED PRODUCTS
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-yellow-400 mx-auto rounded-full"></div>
        </div>
        
        <div className="relative">
          {/* Left scroll button */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-gradient-to-r from-primary to-green-400 text-black rounded-full p-3 shadow-lg hover:shadow-primary/50 transition-all duration-300 hover:scale-110"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} className="font-bold" />
            </button>
          )}

          {/* Product carousel */}
          <div
            ref={carouselRef}
            className="flex overflow-x-auto scrollbar-none gap-4 pb-4"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="min-w-[160px] max-w-[160px] snap-start group"
              >
                <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-3 border border-gray-700/50 hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 overflow-hidden h-72">
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                  
                  {/* Electric border effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary via-yellow-400 to-primary opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-500"></div>
                  
                  {/* Animated corners */}
                  <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-primary/0 group-hover:border-primary transition-colors duration-300"></div>
                  <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-primary/0 group-hover:border-primary transition-colors duration-300"></div>
                  <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-primary/0 group-hover:border-primary transition-colors duration-300"></div>
                  <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-primary/0 group-hover:border-primary transition-colors duration-300"></div>
                  
                  <Link to={`/product/${product.slug}`} className="block relative z-10 h-full flex flex-col">
                    {/* Product Image */}
                    <div className="relative w-full h-24 mb-3 overflow-hidden rounded-lg bg-gray-900/50 border border-gray-700/50">
                      <ProductImage
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:brightness-110 group-hover:drop-shadow-lg group-hover:scale-105"
                        width={120}
                      />
                      {product.bestSeller && (
                        <div className="absolute top-1 left-1 bg-gradient-to-r from-primary to-green-400 text-black text-xs font-bold py-0.5 px-1 rounded-full shadow-lg">
                          BEST
                        </div>
                      )}
                      {product.featured && (
                        <div className="absolute top-1 right-1 bg-gradient-to-r from-yellow-400 to-primary text-black text-xs font-bold py-0.5 px-1 rounded-full shadow-lg">
                          FEAT
                        </div>
                      )}
                    </div>
                    
                    {/* Product Info */}
                    <div className="text-center space-y-1 flex-1">
                      {/* Brand/Category */}
                      <p className="text-xs uppercase text-gray-400 tracking-wider">
                        {product.category || 'SUPPLEMENT'}
                      </p>
                      
                      {/* Product Name */}
                      <h3 className="text-xs font-bold uppercase text-white group-hover:text-primary transition-colors duration-300 electric-lime-glow leading-tight line-clamp-2">
                        {product.title}
                      </h3>
                      
                      {/* Price */}
                      <div className="flex items-center justify-center gap-1">
                        {product.salePrice ? (
                          <>
                            <span className="text-sm font-bold text-primary electric-lime-glow">
                              {formatPrice(product.salePrice)}
                            </span>
                            <span className="text-xs line-through text-gray-400">
                              {formatPrice(product.price)}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm font-bold text-primary electric-lime-glow">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                  
                  {/* CTA Button */}
                  <div className="mt-2 relative z-10">
                    <Button asChild className="w-full bg-gradient-to-r from-primary to-green-400 hover:from-green-400 hover:to-primary text-black font-bold py-1 px-2 rounded-full shadow-lg hover:shadow-primary/50 transition-all duration-300 hover:scale-105 text-xs">
                      <Link to={`/product/${product.slug}`}>
                        VIEW
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right scroll button */}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-gradient-to-r from-primary to-green-400 text-black rounded-full p-3 shadow-lg hover:shadow-primary/50 transition-all duration-300 hover:scale-110"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} className="font-bold" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProductCarousel;
