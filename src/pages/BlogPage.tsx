
import { useState } from 'react';
import { blogPosts } from '@/data/blog';
import BlogPostCard from '@/components/BlogPostCard';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';

const BlogPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Get unique categories from all blog posts
  const uniqueCategories = Array.from(
    new Set(blogPosts.flatMap(post => post.categories))
  ).sort();
  
  // Filter blog posts by search query and category
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || post.categories.includes(selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-12 pt-32">
      <div className="flex flex-col items-center mb-10">
        <h1 className="text-4xl font-bold text-center mb-4">Blog & Articles</h1>
        <p className="text-gray-600 text-center max-w-2xl mb-6">
          The latest insights, research, and tips to help you maximize your performance and achieve your health goals.
        </p>
        <Separator className="w-24 bg-primary my-4" />
      </div>
      
      <div className="max-w-3xl mx-auto mb-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input 
            type="text" 
            placeholder="Search articles..." 
            className="pl-10 pr-4 py-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        <Badge 
          className={`cursor-pointer ${!selectedCategory ? 'bg-primary hover:bg-primary/90' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          onClick={() => setSelectedCategory(null)}
        >
          All
        </Badge>
        {uniqueCategories.map(category => (
          <Badge 
            key={category}
            className={`cursor-pointer ${selectedCategory === category ? 'bg-primary hover:bg-primary/90' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Badge>
        ))}
      </div>
      
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">No articles found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
