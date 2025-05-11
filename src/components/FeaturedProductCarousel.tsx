
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Button } from './ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface FeaturedProductCarouselProps {
  products: Product[];
  autoScrollInterval?: number; // in ms
}

const FeaturedProductCarousel = ({
  products,
  autoScrollInterval = 5000,
}: FeaturedProductCarouselProps) => {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);

  // Auto scroll effect
  useEffect(() => {
    if (!api) return;

    // Set up the interval for auto scrolling
    const interval = setInterval(() => {
      api.scrollNext();
    }, autoScrollInterval);

    // Update current slide index when slide changes
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };
    api.on('select', onSelect);

    // Clean up
    return () => {
      clearInterval(interval);
      api.off('select', onSelect);
    };
  }, [api, autoScrollInterval]);

  if (!products || products.length === 0) return null;

  return (
    <div className="bg-black text-white py-8 md:py-16">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Featured Products</h2>
        
        <Carousel
          setApi={setApi}
          opts={{
            align: 'center',
            loop: true,
          }}
          className="w-full max-w-4xl mx-auto"
        >
          <CarouselContent>
            {products.map((product, index) => (
              <CarouselItem key={product.id} className="w-full flex justify-center">
                <div className="w-full max-w-lg p-4 flex flex-col md:flex-row items-center gap-8">
                  {/* Product Image */}
                  <div className="w-full md:w-1/2 aspect-square relative overflow-hidden rounded-lg bg-gray-900">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    {product.bestSeller && (
                      <div className="absolute top-2 left-2 bg-primary text-white text-xs py-1 px-2 rounded">
                        Best Seller
                      </div>
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="w-full md:w-1/2 flex flex-col">
                    <span className="text-sm text-gray-400 mb-1">{product.category}</span>
                    <h3 className="text-xl font-bold mb-2">{product.title}</h3>
                    
                    <div className="flex items-center gap-2 mb-4">
                      {product.salePrice ? (
                        <>
                          <span className="text-lg font-bold text-primary">{formatPrice(product.salePrice)}</span>
                          <span className="text-sm line-through text-gray-400">{formatPrice(product.price)}</span>
                        </>
                      ) : (
                        <span className="text-lg font-bold">{formatPrice(product.price)}</span>
                      )}
                    </div>
                    
                    <p className="mb-6 text-gray-300 line-clamp-3">{product.description}</p>
                    
                    <Button asChild className="mb-2 bg-primary hover:bg-primary-dark w-full md:w-auto">
                      <Link to={`/product/${product.slug}`}>View Product</Link>
                    </Button>
                    
                    <div className="mt-4 flex justify-center">
                      {products.map((_, i) => (
                        <span 
                          key={i}
                          className={`w-2 h-2 rounded-full mx-1 ${i === current ? 'bg-primary' : 'bg-gray-600'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <CarouselPrevious className="left-2 md:left-8 bg-white/10 hover:bg-primary border-none text-white" />
          <CarouselNext className="right-2 md:right-8 bg-white/10 hover:bg-primary border-none text-white" />
        </Carousel>
      </div>
    </div>
  );
};

export default FeaturedProductCarousel;
