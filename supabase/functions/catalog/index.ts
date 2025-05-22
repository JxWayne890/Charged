
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
    
    // Get categories from database first
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('name, slug, square_category_id');
      
    if (categoryError) {
      console.error('Error fetching categories from database:', categoryError);
    }
    
    // Create a map of Square category IDs to standardized categories
    const categoryMap = new Map();
    if (categoryData && categoryData.length > 0) {
      categoryData.forEach(cat => {
        categoryMap.set(cat.square_category_id, cat.name);
      });
    }

    // Fetch products from Square
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

    const squareData = await squareRes.json();

    // Get all categories from Square for reference
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
      rawCategoryData.objects?.map((obj: any) => [obj.id, obj.category_data.name]) || []
    );

    const products = squareData.objects
      .filter(
        (item: any) =>
          item.type === 'ITEM' &&
          item.item_data &&
          item.item_data.product_type !== 'APPOINTMENTS_SERVICE' &&
          item.item_data.name !== 'Training session (example service)'
      )
      .map((item: any) => {
        const variation =
          item.item_data.variations && item.item_data.variations.length > 0
            ? item.item_data.variations[0]
            : null;

        const priceInCents =
          variation?.item_variation_data?.price_money?.amount ?? 0;

        const imageIds = item.item_data.image_ids || [];
        const images = imageIds
          .map((id: string) => {
            const imgObj = squareData.objects.find(
              (obj: any) => obj.id === id && obj.type === 'IMAGE'
            );
            return imgObj?.image_data?.url || '';
          })
          .filter(Boolean);

        if (images.length === 0) images.push('/placeholder.svg');

        const slug = item.item_data.name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

        const categoryId =
          item.item_data.category_id ||
          item.item_data.reporting_category?.id ||
          item.item_data.categories?.[0]?.id ||
          null;
          
        // Use standardized category from database if available
        let category = 'Uncategorized';
        if (categoryId && categoryMap.has(categoryId)) {
          category = categoryMap.get(categoryId);
        } else {
          // Fallback to raw category name (for debugging/migration)
          const rawCategory = rawCategoryMap.get(categoryId) || 'Uncategorized';
          console.log(`Category not found in database: ${rawCategory} (${categoryId})`);
          category = 'Uncategorized';
        }

        return {
          id: item.id,
          title: item.item_data.name,
          description: item.item_data.description || '',
          price: priceInCents / 100,
          images,
          category,
          stock: variation?.item_variation_data?.inventory_count ?? 10,
          rating: 5.0,
          reviewCount: 0,
          slug,
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
    return new Response(
      JSON.stringify({ error: 'Failed to fetch Square Catalog', details: err.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
