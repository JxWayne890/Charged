
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Square API URL
    const squareApiUrl = 'https://connect.squareupsandbox.com/v2/catalog/list';
    const squareToken = Deno.env.get('SQUARE_ACCESS_TOKEN');
    
    if (!squareToken) {
      return new Response(
        JSON.stringify({ error: 'Square API token not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Call Square API
    const response = await fetch(squareApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${squareToken}`,
        'Square-Version': '2023-12-13'
      },
      body: JSON.stringify({})
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Square API error:', errorData);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch catalog from Square', details: errorData }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const data = await response.json();
    
    // Filter response data to only include catalog objects of type ITEM
    const items = data.objects?.filter(obj => obj.type === 'ITEM') || [];
    
    return new Response(
      JSON.stringify({ items }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', message: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
