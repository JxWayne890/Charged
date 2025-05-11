
import { Link } from 'react-router-dom';
import { BlogPost } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface BlogPostCardProps {
  post: BlogPost;
}

const BlogPostCard = ({ post }: BlogPostCardProps) => {
  return (
    <Link to={`/blog/${post.slug}`} className="group block">
      <div className="overflow-hidden rounded-lg bg-gray-100 aspect-[4/3] mb-3">
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      
      <div className="flex items-center space-x-2 mb-2">
        {post.categories.slice(0, 1).map((category) => (
          <span 
            key={category} 
            className="text-xs text-primary font-medium"
          >
            {category}
          </span>
        ))}
        <span className="text-xs text-gray-500">
          {formatDistanceToNow(new Date(post.date), { addSuffix: true })}
        </span>
        <span className="text-xs text-gray-500">
          {post.readTime} min read
        </span>
      </div>
      
      <h3 className="font-medium text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
        {post.title}
      </h3>
      
      <p className="text-sm text-gray-600 line-clamp-2">
        {post.excerpt}
      </p>
      
      <div className="flex items-center mt-4 space-x-2">
        <div className="w-8 h-8 rounded-full overflow-hidden">
          <img 
            src={post.authorImage} 
            alt={post.author} 
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-sm font-medium">{post.author}</span>
      </div>
    </Link>
  );
};

export default BlogPostCard;
