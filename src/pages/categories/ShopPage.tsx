
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Home } from 'lucide-react';
import { formatCategoryName } from '@/utils/categoryUtils';
import { fetchCategories, Category, syncCategories } from '@/lib/categories';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Image mapping for specific categories
const categoryImages: Record<string, string> = {
  'protein': '/lovable-uploads/2aa3e52f-35ac-42ea-ac84-51ff86ec9177.png',
  'pre-workout': '/lovable-uploads/c491ed4d-1b3a-4132-8051-e5bf2757ce56.png',
  'weight-loss': '/lovable-uploads/bc24b7f2-3784-4277-be96-81767ce6d068.png',
  'daily-essentials': '/lovable-uploads/ace13b36-7daf-494c-aad3-9d2470d1b72b.png',
  'amino-acids': '/lovable-uploads/27dac938-26b9-4202-8a44-8954f41f8604.png',
  'creatine': '/lovable-uploads/181e941c-228a-4955-bfd0-67d6cad65f94.png',
  // Default image for categories without specific images
  'default': '/placeholder.svg'
};

const ShopPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const { toast } = useToast();
  
  // Fetch categories from Supabase
  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      const data = await fetchCategories();
      setCategories(data);
      setLoading(false);
    };
    
    loadCategories();
  }, []);
  
  // Handle sync button click
  const handleSyncCategories = async () => {
    setSyncing(true);
    const success = await syncCategories();
    
    if (success) {
      // Reload categories after sync
      const data = await fetchCategories();
      setCategories(data);
    }
    
    setSyncing(false);
  };
  
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
          
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold text-white">Shop All Categories</h1>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSyncCategories} 
              disabled={syncing}
              className="text-white border-white hover:bg-white/10"
            >
              <RefreshCcw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync Categories'}
            </Button>
          </div>
          
          <p className="text-gray-300 max-w-2xl">
            Browse our complete range of premium supplements organized by category to find exactly what you need.
          </p>
        </div>
      </div>
      
      {/* Categories Grid */}
      <div className="container mx-auto px-4">
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center p-12 border rounded-lg bg-gray-50">
            <h3 className="text-xl font-medium mb-4">No Categories Found</h3>
            <p className="text-gray-600 mb-6">
              No categories are currently available. Click the sync button to fetch categories from Square.
            </p>
            <Button onClick={handleSyncCategories} disabled={syncing}>
              <RefreshCcw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync Categories'}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link 
                key={category.id} 
                to={`/category/${category.slug}`}
                className="group relative overflow-hidden rounded-lg shadow-lg aspect-video"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${categoryImages[category.slug] || categoryImages.default})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                  <span className="text-white font-oswald text-2xl tracking-wide group-hover:text-primary transition-colors duration-300">
                    {formatCategoryName(category.name)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
