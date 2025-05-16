
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import axios from "https://esm.sh/axios@1.6.7";

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Use Square Sandbox API with the provided token
    const response = await axios.post(
      'https://connect.squareupsandbox.com/v2/catalog/list',
      { types: 'ITEM' },
      {
        headers: {
          Authorization: `Bearer ${Deno.env.get("SQUARE_ACCESS_TOKEN")}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Process the items
    const items = response.data.objects
      .filter((obj: any) => obj.type === 'ITEM')
      .map((item: any) => ({
        id: item.id,
        name: item.item_data.name,
        description: item.item_data.description || '',
        price: item.item_data.variations?.[0]?.item_variation_data?.price_money?.amount || 0,
        currency: item.item_data.variations?.[0]?.item_variation_data?.price_money?.currency || 'USD',
      }));

    return new Response(
      JSON.stringify(items),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (err) {
    console.error("Square API error:", err.response?.data || err);
    return new Response(
      JSON.stringify({ 
        error: "Failed to fetch catalog from Square",
        details: err.response?.data || err.message
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
