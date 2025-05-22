
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Define the correct categories based on the provided list
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

// Create a mapping for category detection based on more precise keywords
const categoryMapping = {
  'aminos': ['amino acid', 'recovery amino'],
  'anti-aging-supplement': ['anti-aging', 'collagen', 'nad daily'],
  'bcaa': ['bcaa', 'branch chain amino acid'],
  'creatine': ['creatine monohydrate', 'creatine hcl'],
  'dry-spell': ['dry-spell', 'off-cycle', 'natural gains'],
  'fat-burners': ['fat burn', 'caloriburn', 'night burn', 'thermogenic'],
  'multivitamin': ['multivitamin', 'multi vitamin', 'vitamin pack'],
  'pre-workout': ['pre-workout', 'preworkout', 'loaded pre', 'essential pre', 'stim daddy', 'bamf', 'woke af'],
  'protein': ['protein', 'whey', 'isolate', 'casein'],
  'pump-supplement': ['pump', 'pump squared', 'pumpkin spice'],
  'testosterone': ['testosterone', 'rut', 'test booster', 'maximum strength'],
  'vitamins': ['vitamin d', 'vitamin c', 'minerals']
};

// Product-specific overrides for products that we know are being incorrectly categorized
const productOverrides = {
  'Bucked Up Babe Sparkling Orchard': 'pre-workout',
  'Bucked Up Babe Watermelon Splash': 'pre-workout',
  'Black Magic Supplements BZRK': 'pre-workout',
  'Axe & Sledge Supplements Multi': 'multivitamin'
};

/**
 * Fetches product data from Square API
 */
async function fetchSquareData() {
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
  return squareData;
}

/**
 * Fetches category data from Square API
 */
async function fetchSquareCategories() {
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
  
  // Enhanced logging to understand what categories are available in Square
  const categoryNames = rawCategoryData.objects?.map(obj => obj.category_data.name) || [];
  console.log('Raw Square categories:', JSON.stringify(categoryNames));
  
  return {
    categoryMap: new Map(
      rawCategoryData.objects?.map((obj) => [obj.id, obj.category_data.name]) || []
    ),
    categoryData: rawCategoryData.objects || []
  };
}

/**
 * Maps Square category names to our defined category slugs
 */
function mapSquareCategoryToSlug(squareCategoryName) {
  if (!squareCategoryName) return null;
  
  // Normalize the category name for better matching
  const normalizedName = squareCategoryName.toLowerCase().trim();
  
  // Try exact match with our defined categories first
  const exactMatch = definedCategories.find(c => 
    normalizedName === c.name.toLowerCase()
  );
  
  if (exactMatch) {
    console.log(`Square category "${squareCategoryName}" exact match: ${exactMatch.slug}`);
    return exactMatch.slug;
  }
  
  // Try finding a close match
  for (const category of definedCategories) {
    if (normalizedName.includes(category.name.toLowerCase()) || 
        category.name.toLowerCase().includes(normalizedName)) {
      console.log(`Square category "${squareCategoryName}" partial match: ${category.slug}`);
      return category.slug;
    }
  }
  
  // Map some common variations
  const commonVariations = {
    'pre workout': 'pre-workout',
    'preworkout': 'pre-workout',
    'protein': 'protein',
    'amino': 'aminos',
    'bcaa': 'bcaa',
    'vitamin': 'vitamins',
    'test booster': 'testosterone',
    'fat burner': 'fat-burners',
  };
  
  for (const [variation, slug] of Object.entries(commonVariations)) {
    if (normalizedName.includes(variation)) {
      console.log(`Square category "${squareCategoryName}" variation match: ${slug}`);
      return slug;
    }
  }
  
  console.log(`No match found for Square category: "${squareCategoryName}"`);
  return null;
}

/**
 * Determines if product content matches a category based on keywords
 */
function contentMatchesCategory(content, categorySlug) {
  const keywords = categoryMapping[categorySlug];
  if (!keywords) return false;
  
  return keywords.some(keyword => content.includes(keyword.toLowerCase()));
}

/**
 * Determines the category for a product
 */
function determineProductCategory(item, squareCategoryData) {
  const productName = item.item_data.name;
  
  // 1. Check for product-specific override
  if (productOverrides[productName]) {
    const overrideCategory = productOverrides[productName];
    console.log(`Product override for "${productName}": ${overrideCategory}`);
    return overrideCategory;
  }
  
  // 2. Check Square category if available
  if (item.item_data.category_id) {
    const squareCategoryName = squareCategoryData.categoryMap.get(item.item_data.category_id);
    
    if (squareCategoryName) {
      console.log(`Product: ${productName}, Square category: ${squareCategoryName}`);
      
      // Try to map the Square category to one of our defined categories
      const mappedCategory = mapSquareCategoryToSlug(squareCategoryName);
      if (mappedCategory) {
        console.log(`Mapped Square category for "${productName}": ${mappedCategory}`);
        return mappedCategory;
      }
    }
  }
  
  // 3. Try content-based matching with more specific keywords
  const itemName = item.item_data.name.toLowerCase();
  const itemDesc = (item.item_data.description || '').toLowerCase();
  const contentToCheck = `${itemName} ${itemDesc}`;
  
  // Check against our keyword mapping
  for (const [categorySlug, keywords] of Object.entries(categoryMapping)) {
    // Check for specific keyword matches
    if (keywords.some(keyword => contentToCheck.includes(keyword.toLowerCase()))) {
      console.log(`Keyword match for "${productName}": ${categorySlug}`);
      return categorySlug;
    }
  }
  
  // 4. Use basic name pattern matching for common categories
  if (contentToCheck.includes('protein')) {
    console.log(`Basic match for "${productName}": protein`);
    return 'protein';
  } else if (contentToCheck.includes('pre-workout') || contentToCheck.includes('preworkout')) {
    console.log(`Basic match for "${productName}": pre-workout`);
    return 'pre-workout';
  } else if (contentToCheck.includes('creatine')) {
    console.log(`Basic match for "${productName}": creatine`);
    return 'creatine';
  } else if (contentToCheck.includes('vitamin')) {
    console.log(`Basic match for "${productName}": vitamins`);
    return 'vitamins';
  }
  
  // 5. If no match found, analyze name for brand-specific patterns
  if (itemName.includes('bucked up') && (itemName.includes('babe') || itemName.includes('bamf'))) {
    console.log(`Brand pattern match for "${productName}": pre-workout`);
    return 'pre-workout';
  }
  
  // 6. Default fallback as last resort
  console.log(`No category match for "${productName}", using default: supplements`);
  return 'supplements';
}

/**
 * Transforms Square API data into product objects
 */
function transformToProducts(squareData, squareCategoryData) {
  return squareData.objects
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

      // Determine the product category using our improved logic
      const category = determineProductCategory(item, squareCategoryData);

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
}

/**
 * Logs category distribution statistics
 */
function logCategoryDistribution(products) {
  const categoryDistribution = {};
  products.forEach(p => {
    categoryDistribution[p.category] = (categoryDistribution[p.category] || 0) + 1;
  });
  console.log('Category distribution:', JSON.stringify(categoryDistribution));
}

/**
 * Main handler function
 */
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Fetch data from Square API
    const squareData = await fetchSquareData();
    
    // Fetch Square categories
    const squareCategoryData = await fetchSquareCategories();
    
    // Transform to products
    const products = transformToProducts(squareData, squareCategoryData);
    
    // Log category distribution for debugging
    logCategoryDistribution(products);

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
