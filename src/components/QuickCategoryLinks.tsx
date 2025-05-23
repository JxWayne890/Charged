
import { Link } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

// Define the mapping of category slugs to their display images
const categoryImages = {
  'protein': '/lovable-uploads/2aa3e52f-35ac-42ea-ac84-51ff86ec9177.png',
  'pre-workout': '/lovable-uploads/c491ed4d-1b3a-4132-8051-e5bf2757ce56.png',
  'fat-burners': '/lovable-uploads/bc24b7f2-3784-4277-be96-81767ce6d068.png',
  'creatine': '/lovable-uploads/ace13b36-7daf-494c-aad3-9d2470d1b72b.png',
  'aminos': '/placeholder.svg',
  'anti-aging-supplement': '/placeholder.svg',
  'bcaa': '/placeholder.svg',
  'dry-spell': '/placeholder.svg',
  'multivitamin': '/placeholder.svg',
  'pump-supplement': '/placeholder.svg',
  'testosterone': '/placeholder.svg',
  'vitamins': '/placeholder.svg'
};

// Define our standardized categories with exact matching slugs
const categories = [
  { name: 'Pre Workout', slug: 'pre-workout' },
  { name: 'Protein', slug: 'protein' },
  { name: 'Creatine', slug: 'creatine' },
  { name: 'BCAA', slug: 'bcaa' },
  { name: 'Aminos', slug: 'aminos' },
  { name: 'Vitamins', slug: 'vitamins' },
  { name: 'Multivitamin', slug: 'multivitamin' },
  { name: 'Fat Burners', slug: 'fat-burners' },
  { name: 'Pump Supplement', slug: 'pump-supplement' },
  { name: 'Testosterone', slug: 'testosterone' },
  { name: 'Anti-Aging Supplement', slug: 'anti-aging-supplement' },
  { name: 'Dry Spell', slug: 'dry-spell' }
];

const QuickCategoryLinks = () => {
  return (
    <div className="w-full">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {categories.map((category) => (
            <CarouselItem key={category.slug} className="md:basis-1/3 lg:basis-1/4">
              <Link 
                to={`/products?category=${category.slug}`}
                className="group relative overflow-hidden rounded-lg shadow-md aspect-square block"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${categoryImages[category.slug] || '/placeholder.svg'})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <span className="text-white font-oswald text-xl tracking-wide group-hover:text-primary transition-colors duration-300">
                    {category.name}
                  </span>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <div className="flex items-center justify-end space-x-2 mt-4">
          <CarouselPrevious className="relative static transform-none" />
          <CarouselNext className="relative static transform-none" />
        </div>
      </Carousel>
    </div>
  );
};

export default QuickCategoryLinks;
