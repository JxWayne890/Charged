
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Home } from 'lucide-react';
import { fetchSquareCategories, SquareCategory } from '@/lib/square-categories';
import { fetchSquareProducts } from '@/lib/square';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';

const SquareCategoriesPage = () => {
  const [categories, setCategories] = useState<SquareCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        
        // Fetch both categories and products in parallel
        const [fetchedCategories, fetchedProducts] = await Promise.all([
          fetchSquareCategories(),
          fetchSquareProducts()
        ]);
        
        setCategories(fetchedCategories);
        setProducts(fetchedProducts);
        setError(null);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Failed to load categories and products. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  // Organize products by category
  const productsByCategory = categories.reduce((acc, category) => {
    // Find products that belong to this category
    const categoryProducts = products.filter(product => 
      product.category?.toLowerCase() === category.name.toLowerCase()
    );
    
    if (categoryProducts.length > 0) {
      acc[category.id] = {
        category: category,
        products: categoryProducts
      };
    }
    
    return acc;
  }, {} as Record<string, { category: SquareCategory, products: Product[] }>);

  return (
    <div className="pt-24 pb-12">
      <div className="container mx-auto px-4">
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="flex items-center">
                  <Home className="h-4 w-4 mr-1" />
                  <span>Home</span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Square Categories & Products</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="text-3xl font-bold mb-6">Square Categories & Products</h1>
        <p className="mb-8 text-gray-600">
          Below are all the categories exactly as they appear in your Square catalog, with their corresponding products:
        </p>

        {loading ? (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-center">
            <p className="text-red-600">{error}</p>
          </div>
        ) : Object.keys(productsByCategory).length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-center">
            <p className="text-yellow-700">No categories with products found in your Square catalog.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.values(productsByCategory).map(({ category, products }) => (
              <div key={category.id} className="border rounded-lg overflow-hidden shadow-sm">
                <div className="bg-gray-50 p-4 border-b">
                  <h2 className="text-xl font-semibold">
                    {category.name} <span className="text-sm font-normal text-gray-500">({products.length} products)</span>
                  </h2>
                </div>
                
                <div className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SquareCategoriesPage;
