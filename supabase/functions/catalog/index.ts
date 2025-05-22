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
    console.log('Fetching categories from database');
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('name, slug, square_category_id');
      
    if (categoryError) {
      console.error('Error fetching categories from database:', categoryError);
      throw new Error(`Failed to fetch categories: ${categoryError.message}`);
    }
    
    if (!categoryData || categoryData.length === 0) {
      console.warn('No categories found in database! You may need to run the sync-categories function first.');
    } else {
      console.log(`Found ${categoryData.length} categories in database`);
    }
    
    // Create a map of Square category IDs to standardized categories
    const categoryMap = new Map();
    if (categoryData && categoryData.length > 0) {
      categoryData.forEach(cat => {
        categoryMap.set(cat.square_category_id, {
          name: cat.name,
          slug: cat.slug
        });
      });
    }

    // Fetch products from Square
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

    // Helper function to convert raw category to standardized name
    const standardizeCategory = (categoryId) => {
      // If we have a mapped category from our database, use it
      if (categoryId && categoryMap.has(categoryId)) {
        return categoryMap.get(categoryId).name;
      }
      
      // If this is a new category that's not in our database yet
      const rawCategoryName = rawCategoryMap.get(categoryId) || '';
      
      // Standardize the raw category based on our mapping rules
      const lowerName = rawCategoryName.toLowerCase().trim();
      
      if (lowerName.includes('protein') || lowerName.includes('whey')) {
        return 'Protein';
      }
      if (lowerName.includes('pre workout') || lowerName.includes('pre-workout') || 
          lowerName === 'pre workout' || lowerName === 'preworkout') {
        return 'Pre-Workout';
      }
      if (lowerName.includes('fat burn') || lowerName.includes('thermogenic') || 
          lowerName.includes('weight loss') || lowerName === 'burn') {
        return 'Weight Loss';
      }
      if (lowerName.includes('amino') || lowerName.includes('bcaa')) {
        return 'Amino Acids';
      }
      if (lowerName.includes('vitamin') || lowerName.includes('wellness') ||
          lowerName.includes('multivitamin') || lowerName.includes('anti-aging')) {
        return 'Wellness';
      }
      if (lowerName.includes('creatine')) {
        return 'Creatine';
      }
      if (lowerName.includes('testosterone')) {
        return 'Testosterone';
      }
      if (lowerName.includes('daily') || lowerName.includes('essentials')) {
        return 'Daily Essentials';
      }
      
      console.log(`Cannot determine standardized category for '${rawCategoryName}' (${categoryId})`);
      return 'Uncategorized';
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

        const categoryId =
          item.item_data.category_id ||
          item.item_data.reporting_category?.id ||
          item.item_data.categories?.[0]?.id ||
          null;
          
        let category = 'Uncategorized';
        let categorySlug = 'uncategorized';
        
        if (categoryId) {
          // Use category from our database if available
          if (categoryMap.has(categoryId)) {
            const mappedCategory = categoryMap.get(categoryId);
            category = mappedCategory.name;
            categorySlug = mappedCategory.slug;
            console.log(`Found mapped category for '${item.item_data.name}': ${category}`);
          } else {
            // Otherwise standardize the raw category
            category = standardizeCategory(categoryId);
            categorySlug = category.toLowerCase().replace(/\s+/g, '-');
            console.log(`Using standardized category for '${item.item_data.name}': ${category}`);
          }
        } else {
          console.log(`No category ID for product '${item.item_data.name}'`);
        }

        return {
          id: item.id,
          title: item.item_data.name,
          description: item.item_data.description || '',
          price: priceInCents / 100,
          images,
          category,
          categorySlug,
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
