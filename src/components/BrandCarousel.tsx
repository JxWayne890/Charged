
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Brand {
  name: string;
  logo: string;
  slug: string;
  largeIcon?: boolean;
}

const brands: Brand[] = [
  {
    name: 'Abe (All Black Everything)',
    logo: '/lovable-uploads/5989b1ff-d96c-481a-b0d3-9e3fa60fc4bd.png',
    slug: 'abe'
  },
  {
    name: 'Alpha Lion',
    logo: '/lovable-uploads/95fddad6-cd02-4458-8d15-b1e0dbac344b.png',
    slug: 'alpha-lion'
  },
  {
    name: 'Axe & Sledge Supplements',
    logo: '/lovable-uploads/0fce723a-25b9-4061-94e1-75f5c078e507.png',
    slug: 'axe-sledge'
  },
  {
    name: 'Bucked Up',
    logo: '/lovable-uploads/b5bcf8d9-2a12-4f70-8c19-4a655b43108d.png',
    slug: 'bucked-up'
  },
  {
    name: 'Chemix',
    logo: '/lovable-uploads/43831f2f-b13b-4610-a228-8b0039e17e4f.png',
    slug: 'chemix'
  },
  {
    name: 'Core Nutritionals',
    logo: '/lovable-uploads/82454db8-d543-4f21-9f20-ddaebcbff76a.png',
    slug: 'core-nutritionals'
  },
  {
    name: 'Fresh Supps',
    logo: '/lovable-uploads/c36fc2cc-c00e-4bb0-a5b5-e87ef10881b1.png',
    slug: 'fresh-supps'
  },
  {
    name: 'Gorilla Mind',
    logo: '/lovable-uploads/d32f1b37-7b0a-4d84-bc10-add104784921.png',
    slug: 'gorilla-mind',
    largeIcon: true
  },
  {
    name: 'Metabolic Nutrition',
    logo: '/lovable-uploads/2dc08c1e-a358-4b0f-adc6-ff3db4e7d4dd.png',
    slug: 'metabolic-nutrition',
    largeIcon: true
  },
  {
    name: 'Raw Nutrition',
    logo: '/lovable-uploads/75a79ad8-2782-46b0-af81-8b6db375dc1c.png',
    slug: 'raw-nutrition',
    largeIcon: true
  },
  {
    name: 'Rule One Proteins',
    logo: '/lovable-uploads/676c2abd-8e1a-4f4b-b3ae-7d1b0a4ba33f.png',
    slug: 'rule-one',
    largeIcon: true
  },
  {
    name: 'Panda Supplements',
    logo: '/lovable-uploads/841b6f3d-1334-4fb1-959b-49422919d292.png',
    slug: 'panda-supplements',
    largeIcon: true
  }
];

const BrandCarousel = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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
    <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black py-12 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(122,210,60,0.1),transparent_70%)]"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 electric-lime-glow">
            SHOP BY BRAND
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
              <ChevronLeft size={24} className="font-bold" />
            </button>
          )}

          {/* Brand carousel */}
          <div
            ref={carouselRef}
            className="flex overflow-x-auto scrollbar-none gap-6 pb-4"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {brands.map((brand, index) => (
              <div
                key={brand.slug}
                className="min-w-[180px] max-w-[180px] snap-start"
              >
                <Link to={`/brands/${brand.slug}`} className="cursor-pointer group block">
                  <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-primary/50 transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-primary/20 h-32 flex items-center justify-center overflow-hidden">
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                    
                    {/* Electric border effect */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary via-yellow-400 to-primary opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-500"></div>
                    
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className={cn(
                        "object-contain filter group-hover:brightness-110 group-hover:drop-shadow-lg transition-all duration-500 relative z-10",
                        brand.largeIcon ? "max-w-[90%] max-h-[90%]" : "max-w-full max-h-full"
                      )}
                      onError={(e) => {
                        console.log(`Failed to load logo for ${brand.name}`);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    
                    {/* Animated corners */}
                    <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-primary/0 group-hover:border-primary transition-colors duration-300"></div>
                    <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-primary/0 group-hover:border-primary transition-colors duration-300"></div>
                    <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-primary/0 group-hover:border-primary transition-colors duration-300"></div>
                    <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-primary/0 group-hover:border-primary transition-colors duration-300"></div>
                  </div>
                  
                  <p className="text-center text-sm mt-3 font-medium text-gray-300 group-hover:text-primary transition-colors duration-300 uppercase tracking-wide">
                    {brand.name}
                  </p>
                </Link>
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
              <ChevronRight size={24} className="font-bold" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandCarousel;
