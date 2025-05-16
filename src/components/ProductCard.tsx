
import { useState } from 'react';
import { Star, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
  };
  className?: string;
}

const ProductCard = ({ product, className = "" }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    // For future implementation with Square checkout
    console.log('Add to cart:', product);
  };
  
  // Format price (Square stores amounts in cents)
  const formattedPrice = formatPrice(product.price / 100);
  
  return (
    <div 
      className={`group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-300 hover:shadow-md ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {/* Placeholder image for products without images */}
          <div className="h-full w-full flex items-center justify-center bg-gray-100">
            <p className="text-gray-500 text-center p-4">{product.name}</p>
          </div>
        </div>
        
        <div className="flex flex-col p-4">
          {/* Title */}
          <h3 className="text-md font-medium line-clamp-2">
            {product.name}
          </h3>
          
          {/* Description */}
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
            {product.description || "No description available"}
          </p>
          
          {/* Price */}
          <div className="mt-2 font-medium">
            <span>{formattedPrice}</span>
          </div>
        </div>
      </div>
      
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
