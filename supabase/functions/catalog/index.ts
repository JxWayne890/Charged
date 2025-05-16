
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    // Use Square Production API with native fetch instead of axios
    const response = await fetch('https://connect.squareup.com/v2/catalog/list', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${Deno.env.get("SQUARE_ACCESS_TOKEN")}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ types: 'ITEM' }),
    });

    if (!response.ok) {
      throw new Error(`Square API returned ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    
    // Process the items
    const items = data.objects
      .filter((obj) => obj.type === 'ITEM')
      .map((item) => ({
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
    console.error("[Square API Error]:", err);
    return new Response(
      JSON.stringify({ 
        error: "Failed to fetch catalog from Square",
        details: err.message
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
