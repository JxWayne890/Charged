
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('Fetching products from Square API');
    const squareRes = await fetch(
      'https://connect.squareup.com/v2/catalog/list?types=ITEM,IMAGE&location_id=LAP5AV1E9Z15S',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${Deno.env.get('SQUARE_ACCESS_TOKEN')}`,
          Accept: 'application/json',
        },
      }
    );

    if (!squareRes.ok) {
      const errorText = await squareRes.text();
      throw new Error(`Square API error (${squareRes.status}): ${errorText}`);
    }

    const squareData = await squareRes.json();
    if (!squareData.objects) {
      throw new Error('Invalid or empty response from Square API');
    }

    console.log(`Fetched ${squareData.objects.length} objects from Square API`);

    // Get all raw categories from Square for reference
    const categoryRes = await fetch(
      'https://connect.squareup.com/v2/catalog/list?types=CATEGORY',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${Deno.env.get('SQUARE_ACCESS_TOKEN')}`,
          Accept: 'application/json',
        },
      }
    );

    const rawCategoryData = await categoryRes.json();
    const rawCategoryMap = new Map(
      rawCategoryData.objects?.map((obj) => [obj.id, obj.category_data.name]) || []
    );

    // Define mappings for common supplement categories
    const categoryMapping = {
      'protein': ['protein', 'whey', 'isolate', 'casein', 'blend'],
      'pre-workout': ['pre-workout', 'preworkout', 'energy', 'pump', 'focus'],
      'weight-loss': ['weight-loss', 'fat burner', 'thermogenic', 'diet', 'slim'],
      'daily-essentials': ['vitamin', 'mineral', 'multivitamin', 'omega', 'fish oil', 'daily'],
      'amino-acids': ['bcaa', 'eaa', 'amino', 'recovery', 'glutamine'],
      'creatine': ['creatine', 'monohydrate', 'hcl', 'strength'],
      'wellness': ['health', 'wellness', 'immunity', 'joint', 'digestive'],
      'protein-bars': ['bar', 'snack', 'protein bar', 'food'],
      'testosterone': ['test', 'testosterone', 'hormone', 'booster'],
      'post-workout': ['post-workout', 'recovery', 'rebuild'],
      'collagen': ['collagen', 'beauty', 'skin', 'hair', 'joint'],
      'greens': ['greens', 'superfoods', 'detox', 'alkalizing'],
      'dry-spell': ['dry-spell', 'supplement breaks', 'cycle-off']
    };

    const products = squareData.objects
      .filter(
        (item) =>
          item.type === 'ITEM' &&
          item.item_data &&
          item.item_data.product_type !== 'APPOINTMENTS_SERVICE' &&
          item.item_data.name !== 'Training session (example service)'
      )
      .map((item) => {
        const variation =
          item.item_data.variations && item.item_data.variations.length > 0
            ? item.item_data.variations[0]
            : null;

        const priceInCents =
          variation?.item_variation_data?.price_money?.amount ?? 0;

        const imageIds = item.item_data.image_ids || [];
        const images = imageIds
          .map((id) => {
            const imgObj = squareData.objects.find(
              (obj) => obj.id === id && obj.type === 'IMAGE'
            );
            return imgObj?.image_data?.url || '';
          })
          .filter(Boolean);

        if (images.length === 0) images.push('/placeholder.svg');

        const slug = item.item_data.name
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');

        // Try to determine the product category
        let category = '';
        const itemName = item.item_data.name.toLowerCase();
        const itemDesc = (item.item_data.description || '').toLowerCase();
        const contentToCheck = `${itemName} ${itemDesc}`;
        
        // Check if the item belongs to any category
        for (const [cat, keywords] of Object.entries(categoryMapping)) {
          if (keywords.some(keyword => contentToCheck.includes(keyword))) {
            category = cat;
            break;
          }
        }

        // If no category was identified through keywords, try to use Square category
        if (!category && item.item_data.category_id) {
          const squareCategoryName = rawCategoryMap.get(item.item_data.category_id);
          if (squareCategoryName) {
            const lcName = squareCategoryName.toLowerCase();
            
            // Try to map Square category to our defined categories
            for (const [cat, keywords] of Object.entries(categoryMapping)) {
              if (keywords.some(keyword => lcName.includes(keyword))) {
                category = cat;
                break;
              }
            }
            
            // If still no match, just use the Square category name as slug
            if (!category) {
              category = squareCategoryName
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-');
            }
          }
        }
        
        // Default category if still not determined
        if (!category) {
          category = 'supplements';
        }

        return {
          id: item.id,
          title: item.item_data.name,
          description: item.item_data.description || '',
          price: priceInCents / 100,
          images,
          stock: variation?.item_variation_data?.inventory_count ?? 10,
          rating: 5.0,
          reviewCount: 0,
          slug,
          category,
          bestSeller: Math.random() > 0.7,
          featured: Math.random() > 0.8,
          benefits: [item.item_data.description || ''],
          ingredients: 'Natural ingredients',
          directions: 'Follow package instructions',
          faqs: [],
          tags: [category],
        };
      });

    return new Response(JSON.stringify(products), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err) {
    console.error('Error processing request:', err);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch Square Catalog', 
        details: err.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
