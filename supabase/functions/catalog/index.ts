
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
    console.log('Calling Square API with access token:', Deno.env.get('SQUARE_ACCESS_TOKEN')?.substring(0, 5) + '...');
    
    const squareRes = await fetch(
      'https://connect.squareup.com/v2/catalog/list?types=ITEM,IMAGE&location_id=LAP5AV1E9Z15S',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${Deno.env.get('SQUARE_ACCESS_TOKEN')}`,
          Accept: 'application/json'
        }
      }
    );

    if (!squareRes.ok) {
      const errorText = await squareRes.text();
      console.error(`Square API returned ${squareRes.status}: ${errorText}`);
      throw new Error(`Square API returned ${squareRes.status}: ${errorText}`);
    }

    const squareData = await squareRes.json();

    if (!squareData.objects || !Array.isArray(squareData.objects)) {
      console.error('No catalog objects returned from Square API:', squareData);
      return new Response(
        JSON.stringify({ 
          error: 'No products found', 
          details: squareData.errors || 'No objects returned from Square API'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    const products = squareData.objects
      .filter(
        (item: any) =>
          item.type === 'ITEM' &&
          item.item_data &&
          item.item_data.product_type !== 'APPOINTMENTS_SERVICE' &&
          item.item_data.name !== 'Training session (example service)'
      )
      .map((item: any) => {
        // Get the first variation price if available
        const variation = item.item_data.variations && item.item_data.variations.length > 0 
          ? item.item_data.variations[0] 
          : null;
        
        const priceInCents = variation && variation.item_variation_data && variation.item_variation_data.price_money 
          ? variation.item_variation_data.price_money.amount 
          : 0;
        
        // Get image URLs if available
        const imageIds = item.item_data.image_ids || [];
        const images = imageIds.map((id: string) => {
          const imageObject = squareData.objects.find((obj: any) => obj.id === id && obj.type === 'IMAGE');
          return imageObject && imageObject.image_data ? imageObject.image_data.url : '';
        }).filter((url: string) => url);
        
        // Use placeholder if no images
        if (images.length === 0) {
          images.push('/placeholder.svg');
        }
        
        // Create slug from name
        const slug = item.item_data.name
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
        
        return {
          id: item.id,
          title: item.item_data.name,
          description: item.item_data.description || '',
          price: priceInCents / 100, // Convert from cents to dollars
          images: images,
          category: item.item_data.category || 'General', // Default category
          stock: variation && variation.item_variation_data ? (variation.item_variation_data.inventory_count || 10) : 10,
          rating: 5.0, // Default rating
          reviewCount: 0, // Default review count
          slug: slug,
          bestSeller: Math.random() > 0.7, // Randomly mark some products as best sellers
          featured: Math.random() > 0.8,   // Randomly mark some products as featured
          benefits: [item.item_data.description || ''],
          ingredients: 'Natural ingredients',
          directions: 'Follow package instructions',
          faqs: [],
          tags: [item.item_data.category || 'General'],
        };
      });

    console.log(`Successfully fetched ${products.length} products from Square`);

    return new Response(
      JSON.stringify(products),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (err) {
    console.error('Catalog Fetch Error:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch Square Catalog', details: err.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
