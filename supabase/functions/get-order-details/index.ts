
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const squareAccessToken = Deno.env.get('SQUARE_ACCESS_TOKEN');
    
    if (!squareAccessToken) {
      throw new Error('Square access token not configured');
    }

    const { orderId } = await req.json();

    if (!orderId) {
      throw new Error('Order ID is required');
    }

    console.log('Fetching order details from Square for:', orderId);

    // Determine Square environment
    const isProduction = squareAccessToken.startsWith('EAAAl');
    const squareApiBase = isProduction 
      ? 'https://connect.squareup.com' 
      : 'https://connect.squareupsandbox.com';

    // Fetch order details from Square
    const orderResponse = await fetch(`${squareApiBase}/v2/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${squareAccessToken}`,
        'Content-Type': 'application/json',
        'Square-Version': '2023-10-18'
      }
    });

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json();
      console.error('Square API error:', errorData);
      throw new Error('Failed to fetch order from Square');
    }

    const orderData = await orderResponse.json();
    const order = orderData.order;

    if (!order) {
      throw new Error('Order not found');
    }

    // Extract order details
    const orderDetails = {
      orderId: order.id,
      total: order.total_money ? order.total_money.amount / 100 : 0,
      status: order.state || 'PENDING',
      customerEmail: order.fulfillments?.[0]?.shipment_details?.recipient?.email_address || '',
      items: order.line_items?.map((item: any) => ({
        name: item.name,
        quantity: parseInt(item.quantity),
        price: item.base_price_money ? item.base_price_money.amount / 100 : 0
      })) || []
    };

    console.log('Order details fetched successfully:', orderDetails.orderId);

    return new Response(JSON.stringify(orderDetails), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in get-order-details function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to fetch order details' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
