
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

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
    console.log('Calling Square API to fetch categories');
    
    // Fetch categories from Square API
    const categoryRes = await fetch(
      'https://connect.squareup.com/v2/catalog/list?types=CATEGORY',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${Deno.env.get('SQUARE_ACCESS_TOKEN')}`,
          Accept: 'application/json'
        }
      }
    );

    if (!categoryRes.ok) {
      const errorText = await categoryRes.text();
      console.error(`Square Categories API returned ${categoryRes.status}: ${errorText}`);
      throw new Error(`Square API returned ${categoryRes.status}: ${errorText}`);
    }

    // Parse the response
    const categoryData = await categoryRes.json();
    
    if (!categoryData.objects || !Array.isArray(categoryData.objects)) {
      console.error('No categories returned from Square API');
      throw new Error('No categories found in Square catalog');
    }
    
    // Extract category names and IDs
    const categories = categoryData.objects.map((cat: any) => ({
      id: cat.id,
      name: cat.category_data.name
    }));
    
    console.log(`Successfully fetched ${categories.length} categories from Square`);
    console.log('Categories:', categories.map((cat: any) => `${cat.id}: ${cat.name}`).join(', '));

    return new Response(
      JSON.stringify({ categories }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (err) {
    console.error('Categories Fetch Error:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch Square Categories', details: err.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
