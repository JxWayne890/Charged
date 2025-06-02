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
  deliveryMethod?: string;
  localDelivery?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const squareAccessToken = Deno.env.get('SQUARE_ACCESS_TOKEN');
    const squareLocationId = Deno.env.get('SQUARE_LOCATION_ID');
    
    console.log('Square Environment Check:', {
      hasAccessToken: !!squareAccessToken,
      hasLocationId: !!squareLocationId,
      accessTokenPrefix: squareAccessToken?.substring(0, 10) + '...'
    });
    
    if (!squareAccessToken) {
      throw new Error('Square access token not configured');
    }
    
    if (!squareLocationId) {
      throw new Error('Square location ID not configured');
    }

    const { items, customer, total, currency, deliveryMethod, localDelivery }: CheckoutRequest = await req.json();

    console.log('Creating Square checkout for order:', {
      itemCount: items.length,
      total,
      customerEmail: customer.email,
      customerName: `${customer.firstName} ${customer.lastName}`,
      customerAddress: `${customer.address}, ${customer.city}, ${customer.state} ${customer.zipCode}`,
      locationId: squareLocationId,
      deliveryMethod,
      localDelivery,
      customerCity: customer.city,
      customerState: customer.state
    });

    // Determine Square environment
    const isProduction = squareAccessToken.startsWith('EAAAl');
    const squareApiBase = isProduction 
      ? 'https://connect.squareup.com' 
      : 'https://connect.squareupsandbox.com';

    console.log('Using Square environment:', isProduction ? 'Production' : 'Sandbox');

    // Calculate subtotal from items
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    console.log('Calculated subtotal:', subtotal);

    // Calculate shipping cost based on delivery method
    let shippingCost = 0;
    let shippingMethodName = 'Standard Shipping';

    if (localDelivery && deliveryMethod === 'local') {
      // Validate local delivery eligibility
      const isSanAngelo = customer.city.toLowerCase().trim() === 'san angelo';
      const isTexas = customer.state.toLowerCase().trim() === 'tx' || customer.state.toLowerCase().trim() === 'texas';
      
      if (isSanAngelo && isTexas) {
        shippingCost = 0;
        shippingMethodName = 'Local Delivery (San Angelo Only)';
        console.log('Local delivery confirmed for San Angelo, TX - shipping cost: $0.00');
      } else {
        console.log('Local delivery requested but customer not in San Angelo, TX - falling back to standard shipping');
        // Fall back to standard shipping
        const freeShippingThreshold = 55;
        shippingCost = subtotal >= freeShippingThreshold ? 0 : 6.99;
        shippingMethodName = 'Standard Shipping';
      }
    } else {
      // Standard shipping logic
      const freeShippingThreshold = 55;
      shippingCost = subtotal >= freeShippingThreshold ? 0 : 6.99;
      console.log('Standard shipping cost:', shippingCost, 'Free shipping threshold:', freeShippingThreshold);
    }

    // Create order items for Square
    const orderItems = items.map(item => ({
      name: item.name + (item.flavor ? ` - ${item.flavor}` : ''),
      quantity: item.quantity.toString(),
      item_type: 'ITEM',
      base_price_money: {
        amount: Math.round(item.price * 100), // Convert to cents
        currency: currency.toUpperCase()
      }
    }));

    // Add shipping as a line item if applicable
    if (shippingCost > 0) {
      orderItems.push({
        name: shippingMethodName,
        quantity: '1',
        item_type: 'ITEM',
        base_price_money: {
          amount: Math.round(shippingCost * 100), // Convert to cents
          currency: currency.toUpperCase()
        }
      });
      console.log('Added shipping line item:', shippingMethodName, shippingCost);
    } else {
      console.log('Free shipping applied - no shipping line item added. Method:', shippingMethodName);
    }

    // Format phone number to ensure it has +1 prefix
    const formatPhoneNumber = (phone: string) => {
      if (!phone) return '';
      // Remove any existing country code and formatting
      const cleaned = phone.replace(/\D/g, '');
      // If it's a 10-digit US number, add +1
      if (cleaned.length === 10) {
        return `+1${cleaned}`;
      }
      // If it already has country code, ensure it starts with +1
      if (cleaned.length === 11 && cleaned.startsWith('1')) {
        return `+${cleaned}`;
      }
      // Return as is if already formatted or invalid
      return phone.startsWith('+') ? phone : `+1${cleaned}`;
    };

    // Create checkout session with Square - Always ask for shipping address to ensure it's captured
    const checkoutRequest = {
      idempotency_key: crypto.randomUUID(),
      order: {
        location_id: squareLocationId,
        line_items: orderItems
      },
      checkout_options: {
        redirect_url: `${req.headers.get('origin')}/order-success`,
        ask_for_shipping_address: true, // Always ask for shipping address
        accepted_payment_methods: {
          card: true,
          square_gift_card: false,
          google_pay: true,
          apple_pay: true,
          afterpay_clearpay: false
        },
        // Restrict to US only
        allowed_locations: [{
          country: 'US'
        }]
      },
      pre_populated_data: {
        buyer_email: customer.email,
        buyer_phone_number: formatPhoneNumber(customer.phone || ''),
        buyer_address: {
          address_line_1: customer.address,
          locality: customer.city,
          administrative_district_level_1: customer.state,
          postal_code: customer.zipCode,
          country: 'US' // Force US country
        },
        buyer_display_name: `${customer.firstName} ${customer.lastName}`
      }
    };

    console.log('Sending checkout request to Square API with US-only restriction:', JSON.stringify({
      ...checkoutRequest,
      shipping_address_included: true,
      customer_address: checkoutRequest.pre_populated_data.buyer_address,
      phone_formatted: checkoutRequest.pre_populated_data.buyer_phone_number
    }, null, 2));

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

    console.log('Square API Response:', {
      status: squareResponse.status,
      statusText: squareResponse.statusText,
      hasCheckoutUrl: !!responseData.payment_link?.url,
      errors: responseData.errors
    });

    if (!squareResponse.ok) {
      console.error('Square API error details:', JSON.stringify(responseData, null, 2));
      throw new Error(`Square API error: ${responseData.errors?.[0]?.detail || 'Unknown error'}`);
    }

    console.log('Square checkout created successfully with shipping address');

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
      error: error.message || 'Failed to create checkout session',
      details: error.stack || 'No additional details available'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
