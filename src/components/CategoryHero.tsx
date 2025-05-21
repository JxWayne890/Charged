
import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Home } from 'lucide-react';

interface CategoryHeroProps {
  categoryName: string;
  categoryFormatted: string;
}

const CategoryHero: React.FC<CategoryHeroProps> = ({ categoryName, categoryFormatted }) => {
  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-16 mb-8">
      <div className="container mx-auto px-4">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="flex items-center text-gray-300 hover:text-white">
                  <Home className="h-4 w-4 mr-1" />
                  <span>Home</span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-gray-400" />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/shop" className="text-gray-300 hover:text-white">Shop</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-gray-400" />
            <BreadcrumbItem>
              <BreadcrumbLink className="text-white">{categoryName}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <h1 className="text-4xl font-bold text-white mb-2">{categoryName}</h1>
        <p className="text-gray-300 max-w-2xl">
          Shop our selection of premium quality {categoryFormatted} products designed 
          to help you achieve your fitness goals.
        </p>
      </div>
    </div>
  );
};

export default CategoryHero;
