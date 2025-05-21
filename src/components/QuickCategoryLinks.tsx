
import { Link } from 'react-router-dom';
import { getMainCategories } from '@/utils/categoryUtils';

type CategoryLink = {
  name: string;
  image: string;
  link: string;
};

interface QuickCategoryLinksProps {
  categories?: CategoryLink[];
  useCustomCategories?: boolean;
}

const QuickCategoryLinks = ({ categories, useCustomCategories = false }: QuickCategoryLinksProps) => {
  // Default categories matching the main supplement categories
  const defaultCategories: CategoryLink[] = [
    {
      name: 'Protein',
      image: '/lovable-uploads/2aa3e52f-35ac-42ea-ac84-51ff86ec9177.png',
      link: '/category/protein'
    },
    {
      name: 'Pre-Workout',
      image: '/lovable-uploads/c491ed4d-1b3a-4132-8051-e5bf2757ce56.png',
      link: '/category/pre-workout'
    },
    {
      name: 'Weight Loss',
      image: '/lovable-uploads/bc24b7f2-3784-4277-be96-81767ce6d068.png',
      link: '/category/fat-burners'
    },
    {
      name: 'Daily Essentials',
      image: '/lovable-uploads/ace13b36-7daf-494c-aad3-9d2470d1b72b.png',
      link: '/category/daily-essentials'
    }
  ];

  // Use provided categories or default ones
  const displayCategories = useCustomCategories ? categories : defaultCategories;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {displayCategories?.map((category) => (
        <Link 
          key={category.name} 
          to={category.link}
          className="group relative overflow-hidden rounded-lg shadow-md aspect-square"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            style={{ backgroundImage: `url(${category.image})` }}
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
