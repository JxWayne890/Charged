
import React from 'react';
import { Link } from 'react-router-dom';
import { categoryLinks } from '@/data/dummyData';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Home } from 'lucide-react';

const ShopPage = () => {
  return (
    <div className="pt-24 pb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 py-16 mb-8">
        <div className="container mx-auto px-4">
          <Breadcrumb className="mb-4 text-gray-300">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/" className="flex items-center text-gray-300 hover:text-white">
                    <Home className="h-4 w-4 mr-1" />
                    Home
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-gray-400" />
              <BreadcrumbItem>
                <BreadcrumbLink className="text-white">Shop</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <h1 className="text-4xl font-bold text-white mb-2">Shop All Categories</h1>
          <p className="text-gray-300 max-w-2xl">
            Browse our complete range of premium supplements organized by category to find exactly what you need.
          </p>
        </div>
      </div>
      
      {/* Categories Grid */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categoryLinks.map((category) => (
            <Link 
              key={category.name} 
              to={category.link}
              className="group relative overflow-hidden rounded-lg shadow-lg aspect-video"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${category.image})` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <span className="text-white font-oswald text-2xl tracking-wide group-hover:text-primary transition-colors duration-300">
                  {category.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
