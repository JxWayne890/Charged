
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { Product } from '@/types';

interface ProductCarouselProps {
  title: string;
  products: Product[];
  viewAllLink?: string;
}

const ProductCarousel = ({ title, products, viewAllLink }: ProductCarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollable = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10); // 10px buffer for cross-browser compatibility
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
  }, [products]);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { clientWidth } = carouselRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth / 2 : clientWidth / 2;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Sort products alphabetically and limit to prevent rendering too many at once
  const sortedProducts = [...products].sort((a, b) => a.title.localeCompare(b.title));
  const displayProducts = sortedProducts.slice(0, 12);

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
        {viewAllLink && (
          <a href={viewAllLink} className="text-primary hover:text-primary-dark text-sm font-medium transition">
            View All Available Products
          </a>
        )}
      </div>

      <div className="relative">
        {/* Left scroll button */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-md hover:bg-primary hover:text-white transition"
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Products carousel */}
        <div
          ref={carouselRef}
          className="flex overflow-x-auto scrollbar-none gap-4 pb-2"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {displayProducts.map((product) => (
            <div
              key={product.id}
              className="min-w-[280px] max-w-[280px] snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Right scroll button */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-md hover:bg-primary hover:text-white transition"
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCarousel;
