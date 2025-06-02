
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@/lib/utils';
import { Loader2, MapPin, CheckCircle } from 'lucide-react';

interface DeliveryInfo {
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  cartItems: any[];
  cartTotal: number;
}

const DeliveryConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo | null>(null);

  useEffect(() => {
    // Get delivery info from navigation state
    const state = location.state as DeliveryInfo;
    if (!state) {
      // Redirect back to checkout if no delivery info
      navigate('/checkout');
      return;
    }
    setDeliveryInfo(state);
  }, [location.state, navigate]);

  const handleConfirmDelivery = async () => {
    if (!deliveryInfo) return;

    setLoading(true);

    try {
      // Send webhook data
      const webhookUrl = 'https://n8n-1-yvtq.onrender.com/webhook-test/3576ed45-9e1a-4911-b9e4-ad2997f1a90e';
      
      const orderSummary = deliveryInfo.cartItems.map(item => {
        const price = item.subscription && item.product.subscription_price
          ? item.product.subscription_price
          : item.product.salePrice || item.product.price;
        
        return {
          product: item.product.title,
          flavor: item.flavor || null,
          quantity: item.quantity,
          price: price,
          total: price * item.quantity,
          subscription: item.subscription || false
        };
      });

      const webhookData = {
        first_name: deliveryInfo.customerInfo.firstName,
        last_name: deliveryInfo.customerInfo.lastName,
        email: deliveryInfo.customerInfo.email,
        phone: deliveryInfo.customerInfo.phone,
        address: deliveryInfo.customerInfo.address,
        city: deliveryInfo.customerInfo.city,
        state: deliveryInfo.customerInfo.state,
        zip: deliveryInfo.customerInfo.zipCode,
        country: 'US',
        order_summary: orderSummary,
        subtotal: deliveryInfo.cartTotal,
        shipping_cost: 0,
        shipping_method: 'Local Delivery (San Angelo Only)',
        total: deliveryInfo.cartTotal,
        timestamp: new Date().toISOString()
      };

      console.log('Sending webhook data for local delivery:', webhookData);

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
      });

      if (!response.ok) {
        throw new Error(`Webhook failed with status: ${response.status}`);
      }

      console.log('Local delivery webhook sent successfully');

      // Clear cart and show success
      clearCart();
      
      toast({
        title: 'Order Confirmed!',
        description: 'Your local delivery order has been confirmed. We will contact you shortly.',
      });

      // Redirect to success page
      navigate('/order-success', { 
        state: { 
          orderConfirmed: true,
          deliveryMethod: 'Local Delivery (San Angelo Only)',
          customerInfo: deliveryInfo.customerInfo
        }
      });

    } catch (error) {
      console.error('Local delivery confirmation error:', error);
      toast({
        title: 'Confirmation Failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!deliveryInfo) {
    return (
      <div className="container mx-auto px-4 py-12 pt-32">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading delivery information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 pt-32">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Confirm Your Local Delivery</h1>
          <p className="text-gray-600">Please review your delivery details below</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Delivery Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-500" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-green-800 text-sm font-medium">
                  🎉 FREE Local Delivery in San Angelo, TX!
                </p>
              </div>
              
              <div className="space-y-2">
                <p className="font-medium">
                  {deliveryInfo.customerInfo.firstName} {deliveryInfo.customerInfo.lastName}
                </p>
                <p>{deliveryInfo.customerInfo.address}</p>
                <p>
                  {deliveryInfo.customerInfo.city}, {deliveryInfo.customerInfo.state} {deliveryInfo.customerInfo.zipCode}
                </p>
                <p className="text-sm text-gray-600">{deliveryInfo.customerInfo.email}</p>
                {deliveryInfo.customerInfo.phone && (
                  <p className="text-sm text-gray-600">{deliveryInfo.customerInfo.phone}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {deliveryInfo.cartItems.map(item => {
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
                  <span>{formatPrice(deliveryInfo.cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Local Delivery</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(deliveryInfo.cartTotal)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center space-y-4">
          <Button
            onClick={handleConfirmDelivery}
            disabled={loading}
            className="w-full max-w-md"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Confirming Order...
              </>
            ) : (
              'Confirm Local Delivery Order'
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate('/checkout')}
            disabled={loading}
            className="w-full max-w-md"
          >
            Back to Checkout
          </Button>
          
          <p className="text-xs text-gray-500 mt-4">
            We will contact you within 24 hours to schedule your delivery
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeliveryConfirmationPage;
