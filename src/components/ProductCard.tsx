
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard = ({ product, className }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const { addToCart } = useCart();
  
  // Format category name for display
  const formatCategoryName = (category: string): string => {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 1);
  };

  const handleImageError = () => {
    console.log(`Image failed to load for product: ${product.title}, URL: ${product.images[currentImageIndex]}, attempt: ${loadAttempts + 1}`);
    
    // Strategy 1: Try next image if available
    if (currentImageIndex < product.images.length - 1) {
      console.log(`Trying next image for ${product.title}`);
      setCurrentImageIndex(currentImageIndex + 1);
      setLoadAttempts(0); // Reset attempts for new image
    } 
    // Strategy 2: Retry same image a few times (sometimes transient errors occur)
    else if (loadAttempts < 2) {
      console.log(`Retrying same image for ${product.title}, attempt: ${loadAttempts + 1}`);
      setLoadAttempts(loadAttempts + 1);
      // Force reload by toggling a timestamp parameter
      const currentSrc = product.images[currentImageIndex];
      if (currentSrc && !currentSrc.includes('/placeholder.svg')) {
        const newSrc = currentSrc.includes('?') 
          ? `${currentSrc}&_t=${Date.now()}`
          : `${currentSrc}?_t=${Date.now()}`;
        
        // Create a new image element to try preloading
        const img = new Image();
        img.src = newSrc;
        img.onload = () => {
          console.log(`Preload successful for ${product.title}`);
          // Force a re-render by toggling the error state
          setImageError(false);
          // We'll use the timestamp URL in getCurrentImage
        };
        img.onerror = () => {
          console.log(`Preload failed for ${product.title} even after retry`);
          setImageError(true);
        };
      }
    } 
    // Strategy 3: Fall back to placeholder as last resort
    else {
      console.log(`All images failed for ${product.title}, using placeholder`);
      setImageError(true);
      
      // Notify about image loading issue (only once)
      if (!imageError) {
        toast({
          title: "Image loading issue",
          description: `We couldn't load images for ${product.title}. This has been logged for our team to fix.`,
          variant: "default",
        });
      }
    }
  };

  const getCurrentImage = () => {
    if (imageError) {
      return '/placeholder.svg';
    }
    
    const baseUrl = product.images[currentImageIndex] || '/placeholder.svg';
    
    // Add timestamp for retry attempts only if not a placeholder
    if (loadAttempts > 0 && !baseUrl.includes('/placeholder.svg')) {
      return baseUrl.includes('?') 
        ? `${baseUrl}&_t=${Date.now()}` 
        : `${baseUrl}?_t=${Date.now()}`;
    }
    
    return baseUrl;
  };
  
  return (
    <div 
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-300 hover:shadow-md",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img 
            src={getCurrentImage()}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={handleImageError}
            onLoad={() => {
              // Reset error state and load attempts when image loads successfully
              if (imageError) setImageError(false);
              setLoadAttempts(0);
            }}
          />
          
          {product.bestSeller && (
            <div className="absolute top-2 left-2 bg-black text-white text-xs py-1 px-2 rounded">
              Best Seller
            </div>
          )}
          
          {product.salePrice && (
            <div className="absolute top-2 right-2 bg-primary text-white text-xs py-1 px-2 rounded">
              Sale
            </div>
          )}
          
          {product.stock < 10 && product.stock > 0 && (
            <div className="absolute bottom-2 left-2 bg-orange-500 text-white text-xs py-1 px-2 rounded">
              Low Stock
            </div>
          )}
        </div>
        
        <div className="flex flex-col p-4">
          {/* Category */}
          <span className="text-xs text-gray-500 uppercase mb-1">
            {product.category ? formatCategoryName(product.category) : "Supplement"}
          </span>
          
          {/* Title */}
          <h3 className="text-md font-medium line-clamp-2">
            {product.title}
          </h3>
          
          {/* Price */}
          <div className="mt-2 font-roboto-mono font-medium">
            {product.salePrice ? (
              <div className="flex items-center">
                <span className="text-red-600">${product.salePrice.toFixed(2)}</span>
                <span className="ml-2 text-sm text-gray-400 line-through">${product.price.toFixed(2)}</span>
              </div>
            ) : (
              <span>${product.price.toFixed(2)}</span>
            )}
          </div>
          
          {product.subscription_price && (
            <div className="mt-1 text-xs text-primary">
              Subscribe & Save: ${product.subscription_price.toFixed(2)}
            </div>
          )}
        </div>
      </Link>
      
      <div className={`
        mt-auto px-4 pb-4 transition-all duration-300
        ${isHovered ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 overflow-hidden'}
      `}>
        <Button 
          className="w-full text-sm py-1 flex items-center justify-center space-x-1 bg-primary hover:bg-primary-dark"
          onClick={handleAddToCart}
        >
          <Plus size={16} className="mr-1" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
