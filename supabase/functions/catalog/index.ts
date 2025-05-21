
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to standardize category names to approved list
const standardizeCategory = (categoryName: string): string => {
  const lower = (categoryName || '').toLowerCase();

  if (lower.includes('amino')) return 'Aminos';
  if (lower.includes('anti-aging')) return 'Anti-Aging Supplement';
  if (lower.includes('bcaa')) return 'BCAA';
  if (lower.includes('creatine')) return 'Creatine';
  if (lower.includes('dry spell')) return 'Dry Spell';
  if (lower.includes('fat') || lower.includes('burn')) return 'Fat Burners';
  if (lower.includes('multivitamin')) return 'Multivitamin';
  if (lower.includes('pre') && lower.includes('workout')) return 'Pre Workout';
  if (lower.includes('protein powder')) return 'Protein Powder';
  if (lower.includes('protein')) return 'Protein';
  if (lower.includes('pump')) return 'Pump Supplement';
  if (lower.includes('testosterone')) return 'Testosterone';
  if (lower.includes('vitamin')) return 'Vitamins';

  return 'Uncategorized';
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    const categoryData = await categoryRes.json();
    const categoryMap = new Map(
      categoryData.objects?.map((obj: any) => [obj.id, obj.category_data.name]) || []
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

        let rawCategory = categoryMap.get(categoryId) || 'Uncategorized';
        const category = standardizeCategory(rawCategory);

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
