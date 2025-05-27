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
  'protein': '/lovable-uploads/fe59bd02-c2f7-4ad7-a8c1-b555120f7b06.png',
  'pre-workout': '/lovable-uploads/0f28b808-0759-49ce-bb49-800869dba2d2.png',
  'fat-burners': '/lovable-uploads/636e9355-3345-44a0-9154-9f7fd2488f9f.png',
  'creatine': '/lovable-uploads/0bb2c2aa-fac1-4ad3-8fe8-3a0f0ee334bf.png',
  'aminos': '/lovable-uploads/ed54a9b4-2dc5-422e-9bf9-4325b8347b7e.png',
  'bcaa': '/lovable-uploads/690bac67-fe13-452c-b3bc-3904d2635dc0.png',
  'vitamins': '/lovable-uploads/a760705d-a78c-4ca3-ab20-a8b7bac55c7f.png',
  'anti-aging-supplement': '/lovable-uploads/7c7c58a3-8e2d-4e03-a84f-2f82c1df46a3.png',
  'dry-spell': '/lovable-uploads/88dc969e-d921-4194-bf4a-2b8413ffda80.png',
  'multivitamin': '/lovable-uploads/ed6937ae-361f-47d7-96b2-13ca4c1159b9.png',
  'pump-supplement': '/lovable-uploads/176bca65-36a2-47f1-afbe-64edd14a24f9.png',
  'testosterone': '/lovable-uploads/82d3876f-2ab6-4d1f-aa1c-800eba67ff9e.png'
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
                  style={{ 
                    backgroundImage: `url(${categoryImages[category.slug] || '/placeholder.svg'})`,
                    filter: 'brightness(1.3) contrast(1.1) saturate(1.2)'
                  }}
                ></div>
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
