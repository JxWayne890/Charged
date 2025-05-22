
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Category, fetchCategories } from '@/lib/categories';
import { setCachedMainCategories } from '@/utils/categoryUtils';

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
  const [dbCategories, setDbCategories] = useState<Category[]>([]);
  
  // Default categories mapping
  const categoryImages: Record<string, string> = {
    'protein': '/lovable-uploads/2aa3e52f-35ac-42ea-ac84-51ff86ec9177.png',
    'pre-workout': '/lovable-uploads/c491ed4d-1b3a-4132-8051-e5bf2757ce56.png',
    'weight-loss': '/lovable-uploads/bc24b7f2-3784-4277-be96-81767ce6d068.png',
    'daily-essentials': '/lovable-uploads/ace13b36-7daf-494c-aad3-9d2470d1b72b.png',
    'amino-acids': '/lovable-uploads/27dac938-26b9-4202-8a44-8954f41f8604.png',
    'creatine': '/lovable-uploads/181e941c-228a-4955-bfd0-67d6cad65f94.png',
  };
  
  // Fetch categories from Supabase
  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategories();
      if (data && data.length > 0) {
        setDbCategories(data);
        
        // Update the cached categories for other components to use
        setCachedMainCategories(data);
      }
    };
    
    if (!useCustomCategories) {
      loadCategories();
    }
  }, [useCustomCategories]);

  // Default categories as fallback
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
      link: '/category/weight-loss'
    },
    {
      name: 'Daily Essentials',
      image: '/lovable-uploads/ace13b36-7daf-494c-aad3-9d2470d1b72b.png',
      link: '/category/daily-essentials'
    }
  ];
  
  // Map database categories to link format (limit to 4 for display)
  const dbCategoryLinks: CategoryLink[] = dbCategories
    .slice(0, 4)
    .map(category => ({
      name: category.name,
      image: categoryImages[category.slug] || '/placeholder.svg',
      link: `/category/${category.slug}`
    }));

  // Use provided categories or database categories or default ones
  const displayCategories = useCustomCategories ? categories : 
    (dbCategories.length > 0 ? dbCategoryLinks : defaultCategories);

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
