
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Define the correct categories based on the provided list - THESE MUST MATCH exactly throughout the application
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
  'aminos': ['amino acid', 'recovery amino', ' amino ', 'amino-'],
  'anti-aging-supplement': ['anti-aging', 'nad daily', 'collagen peptides'],
  'bcaa': ['bcaa', 'branch chain amino acid', 'r1 bcaa', 'branched chain amino'],
  'creatine': ['creatine monohydrate', 'creatine hcl', 'creatine (', ' creatine'],
  'dry-spell': ['dry-spell', 'off-cycle', 'natural gains'],
  'fat-burners': ['fat burn', 'caloriburn', 'night burn', 'thermogenic', 'weight loss'],
  'multivitamin': ['multivitamin', 'multi vitamin', 'vitamin pack'],
  'pre-workout': [
    'pre-workout', 'preworkout', 'loaded pre', 'essential pre', 
    'stim daddy', 'bamf', 'woke af', 'superhuman pre', 'thavage', 
    'bzrk', 'pre stim', 'mother bucker', 'babe'
  ],
  'protein': ['protein', 'whey', 'isolate', 'casein', 'plant based protein'],
  'pump-supplement': ['pump squared', 'pump non-stim', 'pump matrix', 'vascularity'],
  'testosterone': ['testosterone', 'rut', 'test booster', 'maximum strength'],
  'vitamins': ['vitamin d', 'vitamin c', 'minerals', 'vitamin']
};

// Product-specific overrides for products that we know are being incorrectly categorized
// THESE MUST BE EXACT MATCHES from the Square API
const productOverrides = {
  'Bucked Up Babe Sparkling Orchard': 'pre-workout',
  'Bucked Up Babe Watermelon Splash': 'pre-workout',
  'Black Magic Supplements BZRK': 'pre-workout',
  'Black Magic Supplements BZRK Peach Rings': 'pre-workout',
  'Black Magic Supplements BZRK Haterade': 'pre-workout',
  'Black Magic Supplements BZRK Vice': 'pre-workout',
  'Black Magic Supplements BZRK Cali Sunset': 'pre-workout',
  'Black Magic Supplements Pumpkin Spice Muffin': 'pre-workout',
  'Axe & Sledge Supplements Multi (120 caps)': 'multivitamin',
  'Axe & Sledge Supplements Multi (90 caps)': 'multivitamin', 
  'Rule One Proteins R1 BCAA Fruit Punch (30 srv)': 'bcaa',
  'Rule One Proteins R1 BCAA Orange (30 srv)': 'bcaa',
  'Fresh Supplements Amino – Shark Gummies Flavor (30 srv)': 'aminos',
  'Fresh Supps Amino Lemon Italian Ice (30 srv)': 'aminos',
  'Bucked Up x BKFC Pre-Workout - Bare Knuckle Punch': 'pre-workout',
  'Bucked Up Grape Gainz': 'pre-workout',
  'Bucked Up - Killa OJ': 'pre-workout',
  'Bucked Up BAMF POG (Pear Orange Guava)': 'pre-workout',
  'Bucked Up BAMF Pump N\' Grind (Grape & Green Apple)': 'pre-workout',
  'Bucked Up High Stimulant Mother Bucker – Gym-Junkie Juice': 'pre-workout',
  'Bucked Up High Stimulant Mother Bucker – Musclehead Mango': 'pre-workout',
  'Bucked Up High Stimulant Woke AF – Aussie Fruit': 'pre-workout',
  'Bucked Up High Stimulant Woke AF – Cherry Candy': 'pre-workout',
  'Bucked Up High Stimulant Woke AF – Miami': 'pre-workout',
  'Chemix Blue Razz': 'pre-workout',
  'Chemix Strawberry Watermelon': 'pre-workout',
  'Black Magic Supplements Honey Grahams': 'protein',
  'Black Magic Supplements Cookies & Cream': 'protein',
  'Black Magic Supplements Campfire Smores': 'protein',
  'Black Magic Supplements Frosty Blue': 'pre-workout',
  'Black Magic Supplements Bombsicle': 'pre-workout',
  'Black Magic Supplements Mad Melon': 'pre-workout',
  'Ryse Supplements Loaded Pre Jell-O Pineapple (30 srv)': 'pre-workout',
  'Ryse Supplements Loaded Pre Kool-Aid Tropical Punch (30 srv)': 'pre-workout',
  'Ryse Supplements Loaded Pre Bazooka Grape (30 srv)': 'pre-workout',
  'Ryse Supplements Loaded Pre Pink Splash (30 srv)': 'pre-workout',
  'Ryse Supplements Stim Daddy Blue Raspberry (40 srv)': 'pre-workout',
  'Ryse Supplements Stim Daddy Candy Watermelon (40 srv)': 'pre-workout',
  'Ryse Supplements Loaded Protein Little Debbie Cosmic Brownie (2lb)': 'protein',
  'Ryse Supplements Loaded Protein Little Debbie Strawberry Shortcake (2lb)': 'protein',
  'Alpha Lion Superhuman Pre Stim Miami Vice (21 srv)': 'pre-workout',
  'Alpha Lion Superhuman Pre Stim Hulk Juice (21 srv)': 'pre-workout',
  'Alpha Lion Superhuman Extreme Grapezilla (21 srv)': 'pre-workout',
  'Alpha Lion Superhuman Extreme Hulk Juice (21 srv)': 'pre-workout',
  'Alpha Lion Gains Candy Caloriburn (60 caps)': 'fat-burners',
  'Alpha Lion Night Burn (60 caps)': 'fat-burners',
  'Black Magic Supplements Maximum Strength (Natural Testosterone Support, 90 Capsules)': 'testosterone',
  'Black Magic Supplements Natural Gains (Testosterone Matrix, 30 Day Cycle)': 'dry-spell',
  'Black Magic Supplements Potent Diuretic (Rapid Water Shed for Men & Women)': 'supplements',
  'Bucked Up Creatine (50 srv)': 'creatine',
  'Bucked Up Testosterone Booster – RUT': 'testosterone',
  'Core Nutritionals Multi (120 caps)': 'multivitamin',
  'Metabolic Nutrition NAD Daily Anti-Aging (30 caps)': 'anti-aging-supplement',
  'Metabolic Nutrition Vitamin D3 K2 (90 ct)': 'vitamins',
  'Raw Nutrition Creatine (100 Serving)': 'creatine',
  'Raw Nutrition Creatine (30 Serving)': 'creatine',
  'Raw Nutrition Essential Pre Fruit Burst (30 srv)': 'pre-workout',
  'Raw Nutrition Essential Pre Orange (30 srv)': 'pre-workout',
  'Raw Nutrition Essential Pre Peach Mango (30 srv)': 'pre-workout',
  'Raw Nutrition Essential Pre Red, White, \'N Bum (30 srv)': 'pre-workout',
  'Raw Nutrition Essential Pre Sour Watermelon (30 srv)': 'pre-workout',
  'Raw Nutrition Pump Squared Unflavored (20 srv)': 'pump-supplement',
  'Raw Nutrition Thavage Lemonade (40/20 srv)': 'pre-workout',
  'Raw Nutrition Thavage Raspberry Lemonade (40/20 srv)': 'pre-workout',
  'Raw Nutrition Thavage Rocket Candy (40/20 srv)': 'pre-workout',
  'Raw Nutrition Thavage South Beach Slushie (40/20 srv)': 'pre-workout'
};

// Map of Square category IDs to our category slugs
let squareCategoryIdMap = {};

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
  
  // Populate our squareCategoryIdMap for faster lookups
  squareCategoryIdMap = {};
  rawCategoryData.objects?.forEach(obj => {
    const squareCategoryName = obj.category_data.name;
    const mappedSlug = mapSquareCategoryToSlug(squareCategoryName);
    if (mappedSlug) {
      squareCategoryIdMap[obj.id] = mappedSlug;
      console.log(`Mapped Square category ID ${obj.id} (${squareCategoryName}) to ${mappedSlug}`);
    }
  });
  
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
  
  // Direct mappings for common Square category names - CASE INSENSITIVE
  const directMappings = {
    'pre workout': 'pre-workout',
    'pre-workout': 'pre-workout', 
    'bcaa': 'bcaa',
    'protein': 'protein',
    'creatine': 'creatine',
    'aminos': 'aminos',
    'amino': 'aminos',
    'amino acids': 'aminos',
    'anti aging': 'anti-aging-supplement',
    'anti-aging': 'anti-aging-supplement',
    'vitamins': 'vitamins',
    'vitamin': 'vitamins',
    'fat burner': 'fat-burners',
    'fat burners': 'fat-burners',
    'weight loss': 'fat-burners',
    'testosterone': 'testosterone',
    'multivitamin': 'multivitamin',
    'multi vitamin': 'multivitamin',
    'pump': 'pump-supplement',
    'supplements': 'supplements'
  };
  
  // Check direct mappings first - CASE INSENSITIVE
  for (const [key, slug] of Object.entries(directMappings)) {
    if (normalizedName === key) {
      console.log(`Square category "${squareCategoryName}" direct mapping: ${slug}`);
      return slug;
    }
  }
  
  // Check for contains relationships with common keywords
  for (const [key, slug] of Object.entries(directMappings)) {
    if (normalizedName.includes(key)) {
      console.log(`Square category "${squareCategoryName}" keyword match: ${slug}`);
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
  
  content = content.toLowerCase();
  return keywords.some(keyword => content.includes(keyword.toLowerCase()));
}

/**
 * Determines the category for a product
 */
function determineProductCategory(item, squareCategoryData) {
  const productName = item.item_data.name;
  
  // 1. Check for product-specific override - HIGHEST PRIORITY
  if (productOverrides[productName]) {
    const overrideCategory = productOverrides[productName];
    console.log(`Product override for "${productName}": ${overrideCategory}`);
    return overrideCategory;
  }
  
  // 2. Check Square category ID mapping (more reliable than name matching)
  if (item.item_data.category_id && squareCategoryIdMap[item.item_data.category_id]) {
    const mappedCategory = squareCategoryIdMap[item.item_data.category_id];
    console.log(`Category ID mapping for "${productName}": ${mappedCategory} (ID: ${item.item_data.category_id})`);
    return mappedCategory;
  }
  
  // 3. Check Square category using name
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
  
  // 4. Try content-based matching with more specific keywords
  const itemName = item.item_data.name.toLowerCase();
  const itemDesc = (item.item_data.description || '').toLowerCase();
  const contentToCheck = `${itemName} ${itemDesc}`;
  
  // Special case for R1 BCAA products
  if (itemName.includes('r1 bcaa') || 
      contentToCheck.includes('bcaa') || 
      contentToCheck.includes('branch chain amino') || 
      contentToCheck.includes('branched chain amino')) {
    console.log(`BCAA keyword match for "${productName}": bcaa`);
    return 'bcaa';
  }
  
  // Check against our keyword mapping
  for (const [categorySlug, keywords] of Object.entries(categoryMapping)) {
    // Check for specific keyword matches
    if (keywords.some(keyword => contentToCheck.includes(keyword.toLowerCase()))) {
      console.log(`Keyword match for "${productName}": ${categorySlug}`);
      return categorySlug;
    }
  }
  
  // 5. Use basic name pattern matching for common categories
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
  
  // 6. If no match found, analyze name for brand-specific patterns
  if (itemName.includes('bucked up') && (itemName.includes('babe') || itemName.includes('bamf'))) {
    console.log(`Brand pattern match for "${productName}": pre-workout`);
    return 'pre-workout';
  }
  
  // 7. Default fallback as last resort
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

      // Validate the category is in our defined list
      const isValidCategory = definedCategories.some(c => c.slug === category) || category === 'supplements';
      if (!isValidCategory) {
        console.error(`Invalid category "${category}" for product "${item.item_data.name}"`);
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
  
  // Log specific categories that are problematic
  const bcaaProducts = products.filter(p => p.category === 'bcaa');
  console.log(`BCAA products count: ${bcaaProducts.length}`);
  if (bcaaProducts.length > 0) {
    console.log('BCAA products:', JSON.stringify(bcaaProducts.map(p => p.title)));
  }
  
  // Validate all products have valid categories from our definedCategories list
  const invalidProducts = products.filter(p => 
    !definedCategories.some(c => c.slug === p.category) && p.category !== 'supplements'
  );
  
  if (invalidProducts.length > 0) {
    console.error(`Found ${invalidProducts.length} products with invalid categories:`, 
      JSON.stringify(invalidProducts.map(p => ({ title: p.title, category: p.category })))
    );
  }
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
