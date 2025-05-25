
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Package, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface OrderDetails {
  orderId: string;
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  customerEmail: string;
  status: string;
}

const OrderSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { clearCart } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Clear the cart since order was successful
    clearCart();
    
    const orderId = searchParams.get('orderId');
    const transactionId = searchParams.get('transactionId');
    
    if (orderId || transactionId) {
      fetchOrderDetails(orderId || transactionId);
    } else {
      setLoading(false);
    }
  }, [searchParams, clearCart]);

  const fetchOrderDetails = async (id: string) => {
    try {
      console.log('Fetching order details for:', id);
      
      const { data, error } = await supabase.functions.invoke('get-order-details', {
        body: { orderId: id }
      });

      if (error) {
        console.error('Error fetching order details:', error);
      } else if (data) {
        setOrderDetails(data);
      }
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 pt-32">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 pt-32">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-green-600 mb-2">Order Successful!</h1>
          <p className="text-gray-600">Thank you for your purchase. Your order has been confirmed.</p>
        </div>

        {orderDetails && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-center">
                <Package className="mr-2 h-5 w-5" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-left space-y-2">
                <p><strong>Order ID:</strong> {orderDetails.orderId}</p>
                <p><strong>Total:</strong> ${orderDetails.total.toFixed(2)}</p>
                <p><strong>Email:</strong> {orderDetails.customerEmail}</p>
                <p><strong>Status:</strong> <span className="text-green-600">{orderDetails.status}</span></p>
              </div>
              
              {orderDetails.items && orderDetails.items.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Items Ordered:</h4>
                  <div className="space-y-2">
                    {orderDetails.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.name}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          <p className="text-gray-600">
            A confirmation email has been sent to your email address with order details and tracking information.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link to="/products">Continue Shopping</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/account">View Order History</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
