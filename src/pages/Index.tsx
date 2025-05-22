
import { useState, useEffect } from 'react';
import HeroSection from '@/components/HeroSection';
import ProductCarousel from '@/components/ProductCarousel';
import BundlePromo from '@/components/BundlePromo';
import ValueStrip from '@/components/ValueStrip';
import { blogPosts } from '@/data/blog';
import BlogPostCard from '@/components/BlogPostCard';
import FeaturedProductCarousel from '@/components/FeaturedProductCarousel';
import { fetchSquareProducts } from '@/lib/square';
import { Product } from '@/types';
import { toast } from "@/components/ui/use-toast";
import QuickCategoryLinks from '@/components/QuickCategoryLinks';

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await fetchSquareProducts();
        setProducts(fetchedProducts);
        setError(null);
        
        if (fetchedProducts.length === 0) {
          console.warn('No products found');
          toast({
            title: "No products found",
            description: "Your catalog appears to be empty. Please check your Square account.",
            variant: "default",
          });
        }
      } catch (err) {
        console.error('Failed to load products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, []);
  
  // Filter products for featured and best sellers
  const featuredProducts = products.filter(p => p.featured);
  const bestSellerProducts = products.filter(p => p.bestSeller);
  
  // Get only the first 5 featured products for the auto scroll carousel
  const limitedFeaturedProducts = featuredProducts.slice(0, 5);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-8 max-w-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <HeroSection 
        title="Fuel Your Everyday Fitness"
        subtitle="Premium supplements backed by science to help you reach your goals."
        ctaText="Shop Best-Sellers"
        ctaLink="/best-sellers"
        backgroundImage="/lovable-uploads/2938ee41-0bf0-46aa-9344-11afa927721b.png"
      />
      
      {/* Featured Products Auto Carousel - Show only if we have featured products */}
      {limitedFeaturedProducts.length > 0 && (
        <FeaturedProductCarousel products={limitedFeaturedProducts} />
      )}
      
      {/* Quick Category Links */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
        <QuickCategoryLinks />
      </section>
      
      {/* Best Sellers - Show only if we have best seller products */}
      {bestSellerProducts.length > 0 ? (
        <section className="container mx-auto px-4 py-12">
          <ProductCarousel 
            title="Best Sellers" 
            products={bestSellerProducts} 
            viewAllLink="/products" 
          />
        </section>
      ) : (
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-6">Best Sellers</h2>
          <p className="text-center text-gray-600">No best sellers available at the moment. Check back soon!</p>
        </section>
      )}
      
      {/* Bundle Promo */}
      <section className="container mx-auto px-4 py-12">
        <BundlePromo />
      </section>
      
      {/* Content Hub Teaser */}
      <section className="container mx-auto px-4 py-12 bg-gray-50">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Latest Articles</h2>
          <a href="/blog" className="text-primary hover:text-primary-dark text-sm font-medium transition">
            View All
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.slice(0, 3).map(post => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
      
      {/* Value Strip */}
      <ValueStrip />
    </div>
  );
};

export default Index;
