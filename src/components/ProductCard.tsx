
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard = ({ product, className }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
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
            src={product.images[0]} 
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
