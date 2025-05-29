import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@/lib/utils';
import { Loader2, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart, freeShippingThreshold } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const required = ['email', 'firstName', 'lastName', 'address', 'city', 'state', 'zipCode'];
    const missing = required.filter(field => !customerInfo[field]);
    
    if (missing.length > 0) {
      toast({
        title: 'Missing Information',
        description: `Please fill in: ${missing.join(', ')}`,
        variant: 'destructive'
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerInfo.email)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address',
        variant: 'destructive'
      });
      return false;
    }

    return true;
  };

  const sendWebhookData = async () => {
    try {
      const webhookUrl = 'https://n8n-1-yvtq.onrender.com/webhook-test/3576ed45-9e1a-4911-b9e4-ad2997f1a90e';
      
      // Prepare order summary with all products
      const orderSummary = cartItems.map(item => {
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

      const shippingCost = cartTotal >= freeShippingThreshold ? 0 : 6.99;
      const finalTotal = cartTotal + shippingCost;

      const webhookData = {
        first_name: customerInfo.firstName,
        last_name: customerInfo.lastName,
        email: customerInfo.email,
        phone: customerInfo.phone,
        address: customerInfo.address,
        city: customerInfo.city,
        state: customerInfo.state,
        zip: customerInfo.zipCode,
        country: customerInfo.country,
        order_summary: orderSummary,
        subtotal: cartTotal,
        shipping_cost: shippingCost,
        total: finalTotal,
        timestamp: new Date().toISOString()
      };

      console.log('Sending webhook data:', webhookData);

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

      console.log('Webhook sent successfully');
      return true;
    } catch (error) {
      console.error('Webhook error:', error);
      return false;
    }
  };

  const handleCheckout = async () => {
    if (!validateForm()) return;
    if (cartItems.length === 0) return;

    setLoading(true);

    try {
      // Send webhook data first
      await sendWebhookData();

      console.log('Creating Square checkout session...');
      
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.product.id,
          name: item.product.title,
          quantity: item.quantity,
          price: item.subscription && item.product.subscription_price 
            ? item.product.subscription_price 
            : item.product.salePrice || item.product.price,
          flavor: item.flavor,
          subscription: item.subscription
        })),
        customer: customerInfo,
        total: cartTotal,
        currency: 'USD'
      };

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: orderData
      });

      if (error) {
        console.error('Checkout creation error:', error);
        toast({
          title: 'Checkout Error',
          description: 'Failed to create checkout session. Please try again.',
          variant: 'destructive'
        });
        return;
      }

      if (data?.checkout_url) {
        console.log('Redirecting to Square checkout:', data.checkout_url);
        // Redirect to Square hosted checkout page
        window.location.href = data.checkout_url;
      } else {
        throw new Error('No checkout URL received from Square');
      }

    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: 'Checkout Failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
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
  }

  const shippingCost = cartTotal >= freeShippingThreshold ? 0 : 6.99;
  const finalTotal = cartTotal + shippingCost;

  return (
    <div className="container mx-auto px-4 py-12 pt-32">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={customerInfo.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={customerInfo.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={customerInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={customerInfo.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={customerInfo.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    value={customerInfo.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-32">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => {
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
                        {item.flavor && (
                          <p className="text-xs text-gray-500">Flavor: {item.flavor}</p>
                        )}
                        {item.subscription && (
                          <p className="text-xs text-primary">Subscription</p>
                        )}
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
                    <span>Shipping</span>
                    <span>{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span>
                  </div>
                  {cartTotal >= freeShippingThreshold && (
                    <p className="text-sm text-primary">🎉 You've unlocked FREE shipping!</p>
                  )}
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
                
                <Button 
                  onClick={handleCheckout}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
