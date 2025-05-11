
import HeroSection from '@/components/HeroSection';
import QuickCategoryLinks from '@/components/QuickCategoryLinks';
import ProductCarousel from '@/components/ProductCarousel';
import BundlePromo from '@/components/BundlePromo';
import UGCStrip from '@/components/UGCStrip';
import ValueStrip from '@/components/ValueStrip';
import { products } from '@/data/products';
import { blogPosts } from '@/data/blog';
import { ugcItems, categoryLinks } from '@/data/dummyData';
import BlogPostCard from '@/components/BlogPostCard';

const Index = () => {
  // Filter for featured and best seller products
  const featuredProducts = products.filter(product => product.featured);
  const bestSellerProducts = products.filter(product => product.bestSeller);

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

      {/* Quick Category Links */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
        <QuickCategoryLinks categories={categoryLinks} />
      </section>
      
      {/* Best Sellers */}
      <section className="container mx-auto px-4 py-12">
        <ProductCarousel 
          title="Best Sellers" 
          products={bestSellerProducts} 
          viewAllLink="/best-sellers" 
        />
      </section>
      
      {/* Bundle Promo */}
      <section className="container mx-auto px-4 py-12">
        <BundlePromo />
      </section>
      
      {/* UGC Strip */}
      <section className="container mx-auto px-4 py-12">
        <UGCStrip items={ugcItems} />
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
