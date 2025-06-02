import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { CustomerInfoForm } from '@/components/checkout/CustomerInfoForm';
import { ShippingAddressForm } from '@/components/checkout/ShippingAddressForm';
import { DeliveryOptionsCard } from '@/components/checkout/DeliveryOptionsCard';
import { OrderSummaryCard } from '@/components/checkout/OrderSummaryCard';
import { EmptyCartMessage } from '@/components/checkout/EmptyCartMessage';

interface LocalDeliveryInfo {
  isLocalDeliveryAvailable: boolean;
  deliveryMethod?: {
    name: string;
    cost: number;
    description: string;
  };
}

const CheckoutPage = () => {
  const {
    cartItems,
    cartTotal,
    clearCart,
    freeShippingThreshold
  } = useCart();
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [localDeliveryInfo, setLocalDeliveryInfo] = useState<LocalDeliveryInfo>({
    isLocalDeliveryAvailable: false
  });
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<'shipping' | 'local'>('shipping');
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

  // Validate local delivery when city or state changes
  useEffect(() => {
    const validateLocalDelivery = async () => {
      if (customerInfo.city && customerInfo.state) {
        try {
          const {
            data,
            error
          } = await supabase.functions.invoke('validate-local-delivery', {
            body: {
              city: customerInfo.city,
              state: customerInfo.state
            }
          });
          if (error) {
            console.error('Local delivery validation error:', error);
            setLocalDeliveryInfo({
              isLocalDeliveryAvailable: false
            });
            return;
          }
          setLocalDeliveryInfo(data);

          // If local delivery becomes unavailable, switch back to shipping
          if (!data.isLocalDeliveryAvailable && selectedDeliveryMethod === 'local') {
            setSelectedDeliveryMethod('shipping');
          }
        } catch (error) {
          console.error('Failed to validate local delivery:', error);
          setLocalDeliveryInfo({
            isLocalDeliveryAvailable: false
          });
        }
      } else {
        setLocalDeliveryInfo({
          isLocalDeliveryAvailable: false
        });
        if (selectedDeliveryMethod === 'local') {
          setSelectedDeliveryMethod('shipping');
        }
      }
    };

    // Debounce the validation to avoid too many API calls
    const timeoutId = setTimeout(validateLocalDelivery, 500);
    return () => clearTimeout(timeoutId);
  }, [customerInfo.city, customerInfo.state, selectedDeliveryMethod]);
  
  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
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
        const price = item.subscription && item.product.subscription_price ? item.product.subscription_price : item.product.salePrice || item.product.price;
        return {
          product: item.product.title,
          flavor: item.flavor || null,
          quantity: item.quantity,
          price: price,
          total: price * item.quantity,
          subscription: item.subscription || false
        };
      });
      const shippingCost = getShippingCost();
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
        shipping_method: selectedDeliveryMethod === 'local' ? 'Local Delivery (San Angelo Only)' : 'Standard Shipping',
        total: finalTotal,
        timestamp: new Date().toISOString()
      };
      console.log('Sending webhook data:', webhookData);
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
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
  
  const getShippingCost = () => {
    if (selectedDeliveryMethod === 'local') {
      return 0;
    }
    return cartTotal >= freeShippingThreshold ? 0 : 6.99;
  };
  
  const getShippingDescription = () => {
    if (selectedDeliveryMethod === 'local') {
      return 'FREE';
    }
    const shippingCost = cartTotal >= freeShippingThreshold ? 0 : 6.99;
    return shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`;
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
          price: item.subscription && item.product.subscription_price ? item.product.subscription_price : item.product.salePrice || item.product.price,
          flavor: item.flavor,
          subscription: item.subscription
        })),
        customer: customerInfo,
        total: cartTotal,
        currency: 'USD',
        deliveryMethod: selectedDeliveryMethod,
        localDelivery: selectedDeliveryMethod === 'local'
      };
      const {
        data,
        error
      } = await supabase.functions.invoke('create-checkout', {
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
    return <EmptyCartMessage />;
  }
  const shippingCost = getShippingCost();
  const finalTotal = cartTotal + shippingCost;
  return (
    <div className="container mx-auto px-4 pt-32 py-[13px]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <CustomerInfoForm 
              customerInfo={customerInfo}
              onInputChange={handleInputChange}
            />

            <ShippingAddressForm
              customerInfo={customerInfo}
              onInputChange={handleInputChange}
            />

            <DeliveryOptionsCard
              localDeliveryInfo={localDeliveryInfo}
              selectedDeliveryMethod={selectedDeliveryMethod}
              onDeliveryMethodChange={setSelectedDeliveryMethod}
              cartTotal={cartTotal}
              freeShippingThreshold={freeShippingThreshold}
            />
          </div>

          <OrderSummaryCard
            cartItems={cartItems}
            cartTotal={cartTotal}
            selectedDeliveryMethod={selectedDeliveryMethod}
            freeShippingThreshold={freeShippingThreshold}
            loading={loading}
            onCheckout={handleCheckout}
            getShippingCost={getShippingCost}
            getShippingDescription={getShippingDescription}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
