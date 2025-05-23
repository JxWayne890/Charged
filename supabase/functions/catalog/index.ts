
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Define our standard categories that will be used throughout the application
const standardCategories = [
  { name: 'Pre Workout', slug: 'pre-workout' },
  { name: 'Protein', slug: 'protein' },
  { name: 'Creatine', slug: 'creatine' },
  { name: 'BCAA', slug: 'bcaa' },
  { name: 'Aminos', slug: 'aminos' },
  { name: 'Vitamins', slug: 'vitamins' },
  { name: 'Multivitamin', slug: 'multivitamin' },
  { name: 'Fat Burners', slug: 'fat-burners' },
  { name: 'Pump Supplement', slug: 'pump-supplement' },
  { name: 'Testosterone', slug: 'testosterone' },
  { name: 'Anti-Aging Supplement', slug: 'anti-aging-supplement' },
  { name: 'Dry Spell', slug: 'dry-spell' }
];

// Map of Square category IDs to our category slugs
let squareCategoryIdMap = {};

// Product-specific category overrides - EXACT PRODUCT NAMES from Square API
const productCategoryMap = {
  // Fat Burners
  'Alpha Lion Gains Candy Caloriburn (60 caps)': 'fat-burners',
  'Alpha Lion Night Burn (60 caps)': 'fat-burners',
  
  // Pre Workout - exhaustive list as provided
  'Alpha Lion Superhuman Extreme Grapezilla (21 srv)': 'pre-workout',
  'Alpha Lion Superhuman Extreme Hulk Juice (21 srv)': 'pre-workout',
  'Alpha Lion Superhuman Pre Stim Hulk Juice (21 srv)': 'pre-workout',
  'Alpha Lion Superhuman Pre Stim Miami Vice (21 srv)': 'pre-workout',
  'Black Magic Supplements BZRK Cali Sunset': 'pre-workout',
  'Black Magic Supplements BZRK Haterade': 'pre-workout',
  'Black Magic Supplements BZRK Peach Rings': 'pre-workout',
  'Black Magic Supplements BZRK Vice': 'pre-workout',
  'Black Magic Supplements Bombsicle': 'pre-workout',
  'Black Magic Supplements Frosty Blue': 'pre-workout',
  'Black Magic Supplements Mad Melon': 'pre-workout',
  'Black Magic Supplements BZRK': 'pre-workout',
  'Bucked Up BAMF Pump N\' Grind (Grape & Green Apple)': 'pre-workout',
  'Bucked Up BAMF POG (Pear Orange Guava)': 'pre-workout',
  'Bucked Up Babe Sparkling Orchard': 'pre-workout',
  'Bucked Up Babe Watermelon Splash': 'pre-workout',
  'Bucked Up x BKFC Pre-Workout - Bare Knuckle Punch': 'pre-workout',
  'Bucked Up Grape Gainz': 'pre-workout',
  'Bucked Up High Stimulant Mother Bucker – Gym-Junkie Juice': 'pre-workout',
  'Bucked Up High Stimulant Mother Bucker – Musclehead Mango': 'pre-workout',
  'Bucked Up High Stimulant Woke AF – Aussie Fruit': 'pre-workout',
  'Bucked Up High Stimulant Woke AF – Cherry Candy': 'pre-workout',
  'Bucked Up High Stimulant Woke AF – Miami': 'pre-workout',
  'Bucked Up - Killa OJ': 'pre-workout',
  'Chemix Blue Razz': 'pre-workout',
  'Chemix Strawberry Watermelon': 'pre-workout',
  'Raw Nutrition Essential Pre Fruit Burst (30 srv)': 'pre-workout',
  'Raw Nutrition Essential Pre Orange (30 srv)': 'pre-workout',
  'Raw Nutrition Essential Pre Peach Mango (30 srv)': 'pre-workout',
  'Raw Nutrition Essential Pre Red, White, \'N Bum (30 srv)': 'pre-workout',
  'Raw Nutrition Essential Pre Sour Watermelon (30 srv)': 'pre-workout',
  'Raw Nutrition Thavage Lemonade (40/20 srv)': 'pre-workout',
  'Raw Nutrition Thavage Raspberry Lemonade (40/20 srv)': 'pre-workout',
  'Raw Nutrition Thavage Rocket Candy (40/20 srv)': 'pre-workout',
  'Raw Nutrition Thavage South Beach Slushie (40/20 srv)': 'pre-workout',
  'Ryse Supplements Loaded Pre Bazooka Grape (30 srv)': 'pre-workout',
  'Ryse Supplements Loaded Pre Jell-O Pineapple (30 srv)': 'pre-workout',
  'Ryse Supplements Loaded Pre Kool-Aid Tropical Punch (30 srv)': 'pre-workout',
  'Ryse Supplements Loaded Pre Pink Splash (30 srv)': 'pre-workout',
  'Ryse Supplements Stim Daddy Blue Raspberry (40 srv)': 'pre-workout',
  'Ryse Supplements Stim Daddy Candy Watermelon (40 srv)': 'pre-workout',
  
  // Protein
  'Black Magic Supplements Campfire Smores': 'protein',
  'Black Magic Supplements Cookies & Cream': 'protein',
  'Black Magic Supplements Honey Grahams': 'protein',
  'Black Magic Supplements Pumpkin Spice Muffin': 'protein',
  'Ryse Supplements Loaded Protein Little Debbie Cosmic Brownie (2lb)': 'protein',
  'Ryse Supplements Loaded Protein Little Debbie Strawberry Shortcake (2lb)': 'protein',
  
  // Creatine
  'Bucked Up Creatine (50 srv)': 'creatine',
  'Raw Nutrition Creatine (30 Serving)': 'creatine',
  'Raw Nutrition Creatine (100 Serving)': 'creatine',
  
  // Vitamins
  'Metabolic Nutrition Vitamin D3 K2 (90 ct)': 'vitamins',
  
  // Multivitamin
  'Axe & Sledge Supplements Multi (90 caps)': 'multivitamin',
  'Core Nutritionals Multi (120 caps)': 'multivitamin',
  'Axe & Sledge Supplements Multi (120 caps)': 'multivitamin',
  
  // Aminos
  'Fresh Supplements Amino – Shark Gummies Flavor (30 srv)': 'aminos',
  'Fresh Supps Amino Lemon Italian Ice (30 srv)': 'aminos',
  
  // Anti-Aging Supplement
  'Metabolic Nutrition NAD Daily Anti-Aging (30 caps)': 'anti-aging-supplement',
  
  // Dry Spell
  'Black Magic Supplements Potent Diuretic (Rapid Water Shed for Men & Women)': 'dry-spell',
  'Black Magic Supplements Natural Gains (Testosterone Matrix, 30 Day Cycle)': 'dry-spell',
  
  // Testosterone
  'Black Magic Supplements Maximum Strength (Natural Testosterone Support, 90 Capsules)': 'testosterone',
  'Bucked Up Testosterone Booster – RUT': 'testosterone',
  
  // BCAA
  'Rule One Proteins R1 BCAA Fruit Punch (30 srv)': 'bcaa',
  'Rule One Proteins R1 BCAA Orange (30 srv)': 'bcaa',
  
  // Pump Supplement
  'Raw Nutrition Pump Squared Unflavored (20 srv)': 'pump-supplement',
};

// Create mappings for case-insensitive partial matches (used after the exact mapping above)
const categoryKeywordMap = {
  'pre-workout': ['pre workout', 'preworkout', 'pre-workout', 'loaded pre', 'essential pre', 'thavage', 'stimulant', 'mother bucker', 'stim daddy'],
  'protein': ['protein', 'whey', 'isolate', 'casein'],
  'creatine': ['creatine'],
  'bcaa': ['bcaa', 'branch chain amino', 'branch chain amino acid'],
  'aminos': ['amino acid', 'amino ', 'aminos', 'recovery amino'],
  'vitamins': ['vitamin', ' vitamin ', 'vitamin d', 'vitamin c'],
  'multivitamin': ['multivitamin', 'multi vitamin', 'multi '],
  'fat-burners': ['fat burn', 'thermogenic', 'weight loss', 'caloriburn', 'night burn'],
  'pump-supplement': ['pump squared', 'pump non-stim', 'pump matrix', 'vascularity'],
  'testosterone': ['testosterone', 'test booster', 'rut'],
  'anti-aging-supplement': ['anti-aging', 'nad daily', 'collagen peptides'],
  'dry-spell': ['dry-spell', 'off-cycle', 'natural gains', 'diuretic'],
};

// Simplified image URL validation that just checks format
function isValidImageUrl(url) {
  if (!url) return false;
  
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (error) {
    console.error(`Invalid image URL format: ${url}`);
    return false;
  }
}

// Process and extract images
function processImages(imageIds, squareObjects, productName) {
  console.log(`Processing images for "${productName}": ${imageIds.length} image IDs found`);
  
  const images = [];
  const imageDebugInfo = [];
  
  for (const id of imageIds) {
    const imgObj = squareObjects.find(
      (obj) => obj.id === id && obj.type === 'IMAGE'
    );
    
    if (imgObj?.image_data?.url) {
      const imageUrl = imgObj.image_data.url;
      console.log(`Found image URL for "${productName}": ${imageUrl}`);
      
      // Simple URL format validation
      if (isValidImageUrl(imageUrl)) {
        images.push(imageUrl);
        imageDebugInfo.push({ status: 'added', url: imageUrl });
        console.log(`✓ Image added for "${productName}": ${imageUrl}`);
      } else {
        console.warn(`✗ Invalid image URL format for "${productName}": ${imageUrl}`);
        imageDebugInfo.push({ status: 'invalid_format', url: imageUrl });
      }
    } else {
      console.warn(`Image object found but no URL for "${productName}", ID: ${id}`);
      imageDebugInfo.push({ status: 'no_url', id });
    }
  }
  
  // If no valid images found, use placeholder
  if (images.length === 0) {
    console.warn(`No valid images found for "${productName}", using placeholder`);
    images.push('/placeholder.svg');
    imageDebugInfo.push({ status: 'using_placeholder' });
  }
  
  console.log(`Final image count for "${productName}": ${images.length}`);
  return { images, imageDebugInfo };
}

// Extract price from variation with better error handling
function extractPrice(variation, productName) {
  if (!variation) {
    console.warn(`No variation found for "${productName}"`);
    return 0;
  }
  
  const priceData = variation.item_variation_data?.price_money;
  if (!priceData) {
    console.warn(`No price data found for "${productName}"`);
    return 0;
  }
  
  const priceInCents = priceData.amount;
  if (typeof priceInCents !== 'number') {
    console.warn(`Invalid price amount for "${productName}": ${priceInCents}`);
    return 0;
  }
  
  const price = priceInCents / 100;
  console.log(`Price extracted for "${productName}": $${price} (${priceInCents} cents)`);
  return price;
}

// Map Square category names to our standardized slugs
function standardizeCategory(squareCategoryName) {
  if (!squareCategoryName) return null;
  
  const normalized = squareCategoryName.toLowerCase().trim();
  
  // Direct standardization mapping
  const directMapping = {
    'pre workout': 'pre-workout',
    'pre-workout': 'pre-workout',
    'preworkout': 'pre-workout',
    'protein': 'protein',
    'whey protein': 'protein',
    'protein powder': 'protein',
    'creatine': 'creatine',
    'bcaa': 'bcaa',
    'amino acids': 'aminos',
    'amino': 'aminos',
    'aminos': 'aminos',
    'vitamins': 'vitamins',
    'vitamin': 'vitamins',
    'multivitamin': 'multivitamin',
    'multi vitamin': 'multivitamin',
    'fat burners': 'fat-burners',
    'fat burner': 'fat-burners',
    'weight loss': 'fat-burners',
    'pump supplement': 'pump-supplement',
    'pump': 'pump-supplement',
    'testosterone': 'testosterone',
    'test booster': 'testosterone',
    'anti-aging': 'anti-aging-supplement',
    'anti aging': 'anti-aging-supplement',
    'anti-aging supplement': 'anti-aging-supplement',
    'dry spell': 'dry-spell'
  };
  
  // First try exact match
  if (directMapping[normalized]) {
    console.log(`Square category "${squareCategoryName}" direct mapping: ${directMapping[normalized]}`);
    return directMapping[normalized];
  }
  
  // Then look for partial matches
  for (const [slug, keywords] of Object.entries(categoryKeywordMap)) {
    if (keywords.some(keyword => normalized.includes(keyword.toLowerCase()))) {
      console.log(`Square category "${squareCategoryName}" keyword match: ${slug}`);
      return slug;
    }
  }
  
  // Find the standard category this might be
  const matchingCategory = standardCategories.find(
    category => category.name.toLowerCase() === normalized
  );
  
  if (matchingCategory) {
    return matchingCategory.slug;
  }
  
  console.log(`No category match found for "${squareCategoryName}"`);
  return null;
}

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
    const mappedSlug = standardizeCategory(squareCategoryName);
    
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
 * Determines the category for a product
 */
function determineProductCategory(item, squareCategoryData) {
  const productName = item.item_data.name;
  
  // 1. HIGHEST PRIORITY: Exact product name match from our manual mapping
  if (productCategoryMap[productName]) {
    console.log(`Product override for "${productName}": ${productCategoryMap[productName]}`);
    return productCategoryMap[productName];
  }
  
  // 2. Check Square category ID mapping
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
      const mappedCategory = standardizeCategory(squareCategoryName);
      if (mappedCategory) {
        console.log(`Mapped Square category for "${productName}": ${mappedCategory}`);
        return mappedCategory;
      }
    }
  }
  
  // 4. Try content-based matching with name and description
  const itemName = item.item_data.name.toLowerCase();
  const itemDesc = (item.item_data.description || '').toLowerCase();
  const contentToCheck = `${itemName} ${itemDesc}`;
  
  // Special handling for specific product types
  if (contentToCheck.includes('r1 bcaa') || 
      contentToCheck.includes('bcaa') && !contentToCheck.includes('bcaa, creatine')) {
    console.log(`BCAA keyword match for "${productName}": bcaa`);
    return 'bcaa';
  }
  
  // Check all keyword mappings
  for (const [categorySlug, keywords] of Object.entries(categoryKeywordMap)) {
    if (keywords.some(keyword => contentToCheck.includes(keyword.toLowerCase()))) {
      console.log(`Keyword match for "${productName}": ${categorySlug}`);
      return categorySlug;
    }
  }
  
  // Last resort: check name patterns
  if (contentToCheck.includes('protein')) {
    return 'protein';
  } else if (contentToCheck.includes('pre-workout') || contentToCheck.includes('preworkout')) {
    return 'pre-workout';
  } else if (contentToCheck.includes('creatine')) {
    return 'creatine';
  } else if (contentToCheck.includes('vitamin')) {
    return 'vitamins';
  }
  
  // Default category (should rarely get here with our extensive mapping)
  console.log(`No category match for "${productName}", using default: pre-workout`);
  return 'pre-workout';
}

/**
 * Transforms Square API data into product objects
 */
async function transformToProducts(squareData, squareCategoryData) {
  const items = squareData.objects
    .filter(
      (item) =>
        item.type === 'ITEM' &&
        item.item_data &&
        item.item_data.product_type !== 'APPOINTMENTS_SERVICE' &&
        item.item_data.name !== 'Training session (example service)'
    );

  console.log(`Processing ${items.length} valid items from Square`);

  const products = [];
  const productsWithImageIssues = [];

  for (const item of items) {
    const productName = item.item_data.name;
    console.log(`\n--- Processing product: "${productName}" ---`);

    const variation = item.item_data.variations && item.item_data.variations.length > 0
      ? item.item_data.variations[0]
      : null;

    // Extract price with better error handling
    const price = extractPrice(variation, productName);

    // Process images with improved handling
    const imageIds = item.item_data.image_ids || [];
    const { images, imageDebugInfo } = processImages(imageIds, squareData.objects, productName);
    
    // Track products with image issues for debugging
    if (images.length === 1 && images[0] === '/placeholder.svg') {
      productsWithImageIssues.push({
        name: productName,
        id: item.id,
        imageIds,
        debugInfo: imageDebugInfo
      });
    }

    const slug = item.item_data.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    // Determine the product category using our improved logic
    const category = determineProductCategory(item, squareCategoryData);
    
    // Validate the category against our standardized list
    const isValidCategory = standardCategories.some(c => c.slug === category);
    if (!isValidCategory) {
      console.error(`Invalid category "${category}" for product "${productName}"`);
    }

    const product = {
      id: item.id,
      title: productName,
      description: item.item_data.description || '',
      price,
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
      _debug: {
        imageIds,
        imageDebugInfo
      }
    };

    console.log(`✓ Product processed: "${productName}" - Price: $${price}, Images: ${images.length}, Category: ${category}`);
    products.push(product);
  }

  // Log products with image issues
  if (productsWithImageIssues.length > 0) {
    console.log(`\n==================\n${productsWithImageIssues.length} PRODUCTS WITH IMAGE ISSUES:\n==================`);
    productsWithImageIssues.forEach(p => {
      console.log(`- ${p.name} (ID: ${p.id}):`);
      console.log(`  Image IDs: ${JSON.stringify(p.imageIds)}`);
      console.log(`  Debug info: ${JSON.stringify(p.debugInfo)}`);
    });
  }

  return products;
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
  
  // Log counts by category for validation
  standardCategories.forEach(stdCat => {
    const count = products.filter(p => p.category === stdCat.slug).length;
    console.log(`${stdCat.name} (${stdCat.slug}): ${count} products`);
  });
  
  // Log BCAAproducts for verification
  const bcaaProducts = products.filter(p => p.category === 'bcaa');
  if (bcaaProducts.length > 0) {
    console.log(`BCAA products count: ${bcaaProducts.length}`);
    console.log('BCAA products:', JSON.stringify(bcaaProducts.map(p => p.title)));
  }
  
  // Validate all products have valid categories
  const invalidProducts = products.filter(p => 
    !standardCategories.some(c => c.slug === p.category)
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
    const products = await transformToProducts(squareData, squareCategoryData);
    
    // Log category distribution for debugging
    logCategoryDistribution(products);

    // Log products with missing or placeholder images
    const productsWithPlaceholder = products.filter(p => 
      p.images.length === 1 && p.images[0] === '/placeholder.svg'
    );
    
    if (productsWithPlaceholder.length > 0) {
      console.log(`\n⚠️  ${productsWithPlaceholder.length} products using placeholder images:`);
      productsWithPlaceholder.forEach(p => console.log(`- ${p.title}`));
    }

    // Create a cleaned version of products for response (without debug info)
    const cleanedProducts = products.map(({ _debug, ...product }) => product);

    console.log(`\n✅ Successfully processed ${products.length} products`);

    return new Response(JSON.stringify(cleanedProducts), {
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
