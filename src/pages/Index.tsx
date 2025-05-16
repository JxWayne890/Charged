
import HeroSection from '@/components/HeroSection';
import QuickCategoryLinks from '@/components/QuickCategoryLinks';
import ProductCarousel from '@/components/ProductCarousel';
import BundlePromo from '@/components/BundlePromo';
import ValueStrip from '@/components/ValueStrip';
import { categoryLinks } from '@/data/dummyData';
import { blogPosts } from '@/data/blog';
import BlogPostCard from '@/components/BlogPostCard';
import FeaturedProductCarousel from '@/components/FeaturedProductCarousel';
import ProductGrid from '@/components/ProductGrid';
import { Separator } from '@/components/ui/separator';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <HeroSection 
        title="Fuel Your Everyday Fitness"
        subtitle="Premium supplements backed by science to help you reach your goals."
        ctaText="Shop All Products"
        ctaLink="/shop"
        backgroundImage="/lovable-uploads/2938ee41-0bf0-46aa-9344-11afa927721b.png"
      />
      
      {/* Quick Category Links */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
        <QuickCategoryLinks categories={categoryLinks} />
      </section>
      
      {/* Square Products */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center mb-10">
          <h1 className="text-3xl font-bold text-center mb-4">Our Products</h1>
          <p className="text-gray-600 text-center max-w-2xl mb-6">
            Discover our high-quality products designed to help you reach your fitness goals.
          </p>
          <Separator className="w-24 bg-primary my-4" />
        </div>
        <ProductGrid />
      </section>
      
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
