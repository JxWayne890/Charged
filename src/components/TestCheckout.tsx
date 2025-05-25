
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, TestTube } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TestCheckout = () => {
  const { addToCart, cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  // Sample test product
  const testProduct = {
    id: 'test-product-1',
    title: 'Test Protein Powder',
    slug: 'test-protein-powder',
    price: 29.99,
    salePrice: 24.99,
    images: ['https://placeholder.svg?height=300&width=300'],
    category: 'protein',
    description: 'Test product for checkout verification',
    inStock: true,
    inventory: 100,
    variants: []
  };

  const handleAddTestItem = () => {
    addToCart(testProduct, 1);
  };

  const handleAddMultipleItems = () => {
    addToCart(testProduct, 2);
    // Add a second test product
    const testProduct2 = {
      ...testProduct,
      id: 'test-product-2',
      title: 'Test Pre-Workout',
      price: 39.99,
      salePrice: 34.99,
      category: 'pre-workout'
    };
    addToCart(testProduct2, 1);
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <TestTube className="mr-2 h-5 w-5" />
          Checkout Test Functions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Button onClick={handleAddTestItem} variant="outline" className="w-full">
            Add 1 Test Item to Cart
          </Button>
          
          <Button onClick={handleAddMultipleItems} variant="outline" className="w-full">
            Add Multiple Test Items
          </Button>
          
          <Button onClick={clearCart} variant="outline" className="w-full">
            Clear Cart
          </Button>
        </div>

        {cartItems.length > 0 && (
          <div className="border-t pt-4">
            <div className="text-sm text-gray-600 mb-2">
              Cart: {cartItems.length} items - ${cartTotal.toFixed(2)}
            </div>
            <Button onClick={handleProceedToCheckout} className="w-full">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Test Checkout Flow
            </Button>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Test Steps:</strong></p>
          <p>1. Add test items to cart</p>
          <p>2. Click "Test Checkout Flow"</p>
          <p>3. Fill out checkout form</p>
          <p>4. Verify Square redirect</p>
          <p>5. Check order confirmation</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestCheckout;
