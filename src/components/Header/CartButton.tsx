
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const CartButton = () => {
  const { cartCount, setIsCartOpen } = useCart();

  return (
    <button
      onClick={() => setIsCartOpen(true)}
      className="relative p-2 hover:text-primary transition-colors duration-200"
      aria-label="Shopping Cart"
    >
      <ShoppingCart size={20} />
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {cartCount}
        </span>
      )}
    </button>
  );
};

export default CartButton;
