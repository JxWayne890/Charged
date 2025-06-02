
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface CartItem {
  product: {
    id: string;
    title: string;
    images: string[];
    price: number;
    salePrice?: number;
    subscription_price?: number;
  };
  quantity: number;
  flavor?: string;
  subscription?: boolean;
}

interface OrderSummaryCardProps {
  cartItems: CartItem[];
  cartTotal: number;
  selectedDeliveryMethod: 'shipping' | 'local';
  freeShippingThreshold: number;
  loading: boolean;
  onCheckout: () => void;
  getShippingCost: () => number;
  getShippingDescription: () => string;
}

export const OrderSummaryCard = ({
  cartItems,
  cartTotal,
  selectedDeliveryMethod,
  freeShippingThreshold,
  loading,
  onCheckout,
  getShippingCost,
  getShippingDescription
}: OrderSummaryCardProps) => {
  const shippingCost = getShippingCost();
  const finalTotal = cartTotal + shippingCost;

  return (
    <Card className="sticky top-32">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {cartItems.map(item => {
          const price = item.subscription && item.product.subscription_price 
            ? item.product.subscription_price 
            : item.product.salePrice || item.product.price;
          
          return (
            <div key={`${item.product.id}-${item.flavor || 'default'}`} className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                <img 
                  src={item.product.images[0]} 
                  alt={item.product.title} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm">{item.product.title}</h4>
                {item.flavor && <p className="text-xs text-gray-500">Flavor: {item.flavor}</p>}
                {item.subscription && <p className="text-xs text-primary">Subscription</p>}
                <p className="text-sm">Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatPrice(price * item.quantity)}</p>
              </div>
            </div>
          );
        })}
        
        <Separator />
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>
              {selectedDeliveryMethod === 'local' ? 'Local Delivery' : 'Shipping'}
            </span>
            <span>{getShippingDescription()}</span>
          </div>
          {selectedDeliveryMethod === 'shipping' && cartTotal >= freeShippingThreshold && (
            <p className="text-sm text-primary">🎉 You've unlocked FREE shipping!</p>
          )}
          {selectedDeliveryMethod === 'local' && (
            <p className="text-sm text-primary">🚚 Free local delivery in San Angelo, TX!</p>
          )}
        </div>
        
        <Separator />
        
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>{formatPrice(finalTotal)}</span>
        </div>
        
        <Button 
          onClick={onCheckout} 
          disabled={loading || cartItems.length === 0} 
          className="w-full mt-6" 
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Proceed to Square Checkout'
          )}
        </Button>
        
        <p className="text-xs text-gray-500 text-center mt-2">
          Secure checkout powered by Square
        </p>
      </CardContent>
    </Card>
  );
};
