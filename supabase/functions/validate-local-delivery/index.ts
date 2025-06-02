
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DeliveryValidationRequest {
  city: string;
  state: string;
}

interface DeliveryValidationResponse {
  isLocalDeliveryAvailable: boolean;
  deliveryMethod?: {
    name: string;
    cost: number;
    description: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { city, state }: DeliveryValidationRequest = await req.json();

    console.log('Validating local delivery for:', { city, state });

    // Check if city is San Angelo and state is Texas (case-insensitive)
    const isSanAngelo = city.toLowerCase().trim() === 'san angelo';
    const isTexas = state.toLowerCase().trim() === 'tx' || state.toLowerCase().trim() === 'texas';
    
    const isLocalDeliveryAvailable = isSanAngelo && isTexas;

    console.log('Local delivery validation result:', {
      isSanAngelo,
      isTexas,
      isLocalDeliveryAvailable
    });

    const response: DeliveryValidationResponse = {
      isLocalDeliveryAvailable,
      ...(isLocalDeliveryAvailable && {
        deliveryMethod: {
          name: 'Local Delivery (San Angelo Only)',
          cost: 0.00,
          description: 'Free local delivery within San Angelo, TX'
        }
      })
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in validate-local-delivery function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to validate local delivery',
      isLocalDeliveryAvailable: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
