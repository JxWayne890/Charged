
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import ProductImage from '@/components/ProductImage';
import FavoriteButton from '@/components/FavoriteButton';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard = ({ product, className }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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
    console.log(`Image error for product ${product.title}, trying next image...`);
    // Try next image if available
    if (currentImageIndex < product.images.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
  };
  
  return (
    <div 
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg bg-white transition-all duration-300 hover:shadow-md",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.slug}`}>
        <div className="relative w-full h-64 overflow-hidden bg-white">
          <ProductImage
            src={product.images[currentImageIndex]} 
            alt={product.title}
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
            onError={handleImageError}
            width={400}
          />
          
          {/* Favorite Button */}
          <FavoriteButton productId={product.id} />
          
          {product.bestSeller && (
            <div className="absolute top-2 right-2 bg-black text-white text-xs py-1 px-2 rounded">
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

          {/* Image indicator dots if multiple images */}
          {product.images.length > 1 && (
            <div className="absolute bottom-2 right-2 flex space-x-1">
              {product.images.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-colors",
                    index === currentImageIndex ? "bg-white" : "bg-white/50"
                  )}
                />
              ))}
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
