
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmptyCartMessage = () => {
  return (
    <div className="container mx-auto px-4 py-12 pt-32">
      <div className="text-center p-8 max-w-lg mx-auto">
        <ShoppingCart className="h-16 w-16 text-gray-300 mb-4 mx-auto" />
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="mb-6 text-gray-600">Add some products to your cart before checkout.</p>
        <Button asChild>
          <Link to="/products">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
};
