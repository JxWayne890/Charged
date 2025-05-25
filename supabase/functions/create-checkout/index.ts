
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  flavor?: string;
  subscription?: boolean;
}

interface CustomerInfo {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface CheckoutRequest {
  items: OrderItem[];
  customer: CustomerInfo;
  total: number;
  currency: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const squareAccessToken = Deno.env.get('SQUARE_ACCESS_TOKEN');
    const squareApplicationId = Deno.env.get('SQUARE_APPLICATION_ID');
    
    if (!squareAccessToken) {
      throw new Error('Square access token not configured');
    }

    const { items, customer, total, currency }: CheckoutRequest = await req.json();

    console.log('Creating Square checkout for order:', {
      itemCount: items.length,
      total,
      customerEmail: customer.email
    });

    // Determine Square environment
    const isProduction = squareAccessToken.startsWith('EAAAl');
    const squareApiBase = isProduction 
      ? 'https://connect.squareup.com' 
      : 'https://connect.squareupsandbox.com';

    // Create order items for Square
    const orderItems = items.map(item => ({
      name: item.name + (item.flavor ? ` - ${item.flavor}` : ''),
      quantity: item.quantity.toString(),
      item_type: 'ITEM',
      base_price_money: {
        amount: Math.round(item.price * 100), // Convert to cents
        currency: currency.toUpperCase()
      },
      total_money: {
        amount: Math.round(item.price * item.quantity * 100),
        currency: currency.toUpperCase()
      }
    }));

    // Create checkout session with Square
    const checkoutRequest = {
      idempotency_key: crypto.randomUUID(),
      order: {
        location_id: Deno.env.get('SQUARE_LOCATION_ID'),
        line_items: orderItems,
        fulfillments: [{
          type: 'SHIPMENT',
          state: 'PROPOSED',
          shipment_details: {
            recipient: {
              display_name: `${customer.firstName} ${customer.lastName}`,
              email_address: customer.email,
              phone_number: customer.phone || '',
              address: {
                address_line_1: customer.address,
                locality: customer.city,
                administrative_district_level_1: customer.state,
                postal_code: customer.zipCode,
                country: customer.country
              }
            }
          }
        }]
      },
      checkout_options: {
        redirect_url: `${req.headers.get('origin')}/order-success`,
        ask_for_shipping_address: true,
        accepted_payment_methods: {
          card: true,
          square_gift_card: false,
          google_pay: true,
          apple_pay: true,
          afterpay_clearpay: false
        }
      },
      pre_populated_data: {
        buyer_email: customer.email,
        buyer_phone_number: customer.phone || '',
        buyer_address: {
          address_line_1: customer.address,
          locality: customer.city,
          administrative_district_level_1: customer.state,
          postal_code: customer.zipCode,
          country: customer.country
        }
      }
    };

    console.log('Sending checkout request to Square API...');

    const squareResponse = await fetch(`${squareApiBase}/v2/online-checkout/payment-links`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${squareAccessToken}`,
        'Content-Type': 'application/json',
        'Square-Version': '2023-10-18'
      },
      body: JSON.stringify(checkoutRequest)
    });

    const responseData = await squareResponse.json();

    if (!squareResponse.ok) {
      console.error('Square API error:', responseData);
      throw new Error(`Square API error: ${responseData.errors?.[0]?.detail || 'Unknown error'}`);
    }

    console.log('Square checkout created successfully');

    const checkoutUrl = responseData.payment_link?.url;
    if (!checkoutUrl) {
      throw new Error('No checkout URL returned from Square');
    }

    return new Response(JSON.stringify({ 
      checkout_url: checkoutUrl,
      order_id: responseData.payment_link?.order_id 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in create-checkout function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to create checkout session' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
