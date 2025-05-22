
import { Link } from 'react-router-dom';

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

// Define our categories based on the provided list
const categories = [
  { name: 'Aminos', slug: 'aminos' },
  { name: 'Anti-Aging Supplement', slug: 'anti-aging-supplement' },
  { name: 'BCAA', slug: 'bcaa' },
  { name: 'Creatine', slug: 'creatine' },
  { name: 'Dry Spell', slug: 'dry-spell' },
  { name: 'Fat Burners', slug: 'fat-burners' },
  { name: 'Multivitamin', slug: 'multivitamin' },
  { name: 'Pre-Workout', slug: 'pre-workout' },
  { name: 'Protein', slug: 'protein' },
  { name: 'Pump Supplement', slug: 'pump-supplement' },
  { name: 'Testosterone', slug: 'testosterone' },
  { name: 'Vitamins', slug: 'vitamins' }
];

// Select just the categories we want to display on the homepage
const featuredCategories = [
  'protein',
  'pre-workout',
  'creatine',
  'fat-burners'
];

const QuickCategoryLinks = () => {
  // Filter to show just the featured categories
  const displayCategories = categories.filter(cat => 
    featuredCategories.includes(cat.slug)
  );
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {displayCategories.map((category) => (
        <Link 
          key={category.slug} 
          to={`/products?category=${category.slug}`}
          className="group relative overflow-hidden rounded-lg shadow-md aspect-square"
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
      ))}
    </div>
  );
};

export default QuickCategoryLinks;
