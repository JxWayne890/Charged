
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Define the correct categories based on the image
const definedCategories = [
  { name: 'Aminos', slug: 'aminos' },
  { name: 'Anti-Aging Supplement', slug: 'anti-aging-supplement' },
  { name: 'BCAA', slug: 'bcaa' },
  { name: 'Creatine', slug: 'creatine' },
  { name: 'Dry Spell', slug: 'dry-spell' },
  { name: 'Fat Burners', slug: 'fat-burners' },
  { name: 'Multivitamin', slug: 'multivitamin' },
  { name: 'Pre-Workout', slug: 'pre-workout' },
  { name: 'Protein', slug: 'protein' },
  { name: 'Pump Supplement', slug: 'pump-supplement' },
  { name: 'Testosterone', slug: 'testosterone' },
  { name: 'Vitamins', slug: 'vitamins' }
];

// Create a mapping for category detection
const categoryMapping = {
  'aminos': ['amino', 'acid', 'recovery'],
  'anti-aging-supplement': ['anti-aging', 'aging', 'youth', 'collagen'],
  'bcaa': ['bcaa', 'branch', 'amino acid'],
  'creatine': ['creatine', 'monohydrate', 'hcl', 'strength'],
  'dry-spell': ['dry-spell', 'cycle', 'break', 'off-cycle'],
  'fat-burners': ['fat', 'burn', 'weight', 'loss', 'thermogenic', 'slim'],
  'multivitamin': ['multivitamin', 'multi-vitamin', 'vitamin pack'],
  'pre-workout': ['pre-workout', 'preworkout', 'energy', 'focus'],
  'protein': ['protein', 'whey', 'isolate', 'casein', 'blend'],
  'pump-supplement': ['pump', 'vasodilator', 'nitric', 'oxide', 'no'],
  'testosterone': ['test', 'testosterone', 'hormone', 'booster'],
  'vitamins': ['vitamin', 'mineral', 'health', 'wellness']
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

        // Determine the product category using our defined categories
        let category = '';
        const itemName = item.item_data.name.toLowerCase();
        const itemDesc = (item.item_data.description || '').toLowerCase();
        const contentToCheck = `${itemName} ${itemDesc}`;
        
        // Check Square category first if available
        if (item.item_data.category_id) {
          const squareCategoryName = rawCategoryMap.get(item.item_data.category_id);
          if (squareCategoryName) {
            const matchedCategory = definedCategories.find(c => 
              squareCategoryName.toLowerCase().includes(c.name.toLowerCase())
            );
            if (matchedCategory) {
              category = matchedCategory.slug;
            }
          }
        }
        
        // If still no category, check content against our keyword mapping
        if (!category) {
          for (const [cat, keywords] of Object.entries(categoryMapping)) {
            if (keywords.some(keyword => contentToCheck.includes(keyword))) {
              category = cat;
              break;
            }
          }
        }
        
        // Last resort: assign a default category
        if (!category) {
          // Try to assign based on some common product naming patterns
          if (contentToCheck.includes('protein')) category = 'protein';
          else if (contentToCheck.includes('pre')) category = 'pre-workout';
          else if (contentToCheck.includes('vitamin')) category = 'vitamins';
          else category = 'supplements'; // Default fallback
        }

        return {
          id: item.id,
          title: item.item_data.name,
          description: item.item_data.description || '',
          price: priceInCents / 100,
          images,
          stock: variation?.item_variation_data?.inventory_count ?? 10,
          rating: 4.5,
          reviewCount: Math.floor(Math.random() * 50) + 5,
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
