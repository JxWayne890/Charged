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

// Known brand names for extraction - order matters (longer names first to avoid partial matches)
const knownBrands = [
  'Black Magic Supplements',
  'Ryse Supplements', 
  'Fresh Supplements',
  'Panda Supplements',
  'Alpha Lion',
  'Bucked Up',
  'Raw Nutrition',
  'Rule One Proteins',
  'Gorilla Mind',
  'Fresh Supps',
  'Metabolic Nutrition',
  'Core Nutritionals',
  'Axe & Sledge Supplements',
  'Chemix',
  'Abe'
];

/**
 * Extracts brand name from product title
 */
function extractBrandFromTitle(productTitle: string): string | null {
  console.log(`🏷️ Extracting brand from: "${productTitle}"`);
  
  if (!productTitle) {
    console.log('❌ No product title provided');
    return null;
  }
  
  // Check for exact brand matches at the beginning of the title
  for (const brand of knownBrands) {
    if (productTitle.toLowerCase().startsWith(brand.toLowerCase())) {
      console.log(`✅ Found brand match: "${brand}" for product: "${productTitle}"`);
      return brand;
    }
  }
  
  // Check for brand matches anywhere in the title (fallback)
  for (const brand of knownBrands) {
    if (productTitle.toLowerCase().includes(brand.toLowerCase())) {
      console.log(`✅ Found brand match (partial): "${brand}" for product: "${productTitle}"`);
      return brand;
    }
  }
  
  console.log(`❌ No brand match found for product: "${productTitle}"`);
  return null;
}

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
 * Validates if an image URL is accessible with reduced timeout for better performance
 */
async function validateImageUrl(url, productName) {
  if (!url) {
    console.log(`No image URL provided for product: ${productName}`);
    return null;
  }

  try {
    console.log(`🔍 Validating image URL for ${productName}: ${url}`);
    
    // Check if URL is properly formatted
    const urlObj = new URL(url);
    if (!urlObj.protocol.startsWith('http')) {
      console.error(`❌ Invalid protocol for image URL: ${url}`);
      return null;
    }

    // Test if image is accessible with reduced timeout for performance
    const response = await fetch(url, { 
      method: 'HEAD',
      signal: AbortSignal.timeout(1500) // Reduced from 3000ms to 1500ms
    });
    
    if (!response.ok) {
      console.error(`❌ Image URL not accessible (${response.status}): ${url}`);
      return null;
    }

    // Check if it's actually an image
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) {
      console.error(`❌ URL does not point to an image (${contentType}): ${url}`);
      return null;
    }

    console.log(`✅ Valid image confirmed for ${productName}: ${url}`);
    return url;
  } catch (error) {
    console.error(`❌ Error validating image URL for ${productName}: ${error.message}`);
    return null;
  }
}

/**
 * Fetches all catalog data from Square API with full pagination support
 */
async function fetchAllSquareData() {
  console.log('🔄 Fetching ALL products and images from Square API with pagination...');
  
  let allObjects = [];
  let cursor = null;
  let pageCount = 0;
  
  try {
    do {
      pageCount++;
      const url = `https://connect.squareup.com/v2/catalog/list?types=ITEM,IMAGE&location_id=LAP5AV1E9Z15S${cursor ? `&cursor=${cursor}` : ''}`;
      
      console.log(`📄 Fetching page ${pageCount}${cursor ? ` with cursor: ${cursor.substring(0, 10)}...` : ' (first page)'}`);
      
      const squareRes = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${Deno.env.get('SQUARE_ACCESS_TOKEN')}`,
          Accept: 'application/json',
        },
      });

      if (!squareRes.ok) {
        const errorText = await squareRes.text();
        throw new Error(`Square API error (${squareRes.status}): ${errorText}`);
      }

      const squareData = await squareRes.json();
      
      if (!squareData.objects || !Array.isArray(squareData.objects)) {
        console.warn(`⚠️ Page ${pageCount} returned no objects or invalid format`);
        break;
      }
      
      allObjects.push(...squareData.objects);
      cursor = squareData.cursor;
      
      console.log(`✅ Page ${pageCount}: Found ${squareData.objects.length} objects. Total so far: ${allObjects.length}`);
      
      // Safety check to prevent infinite loops
      if (pageCount > 50) {
        console.error('🚨 Too many pages fetched, breaking to prevent infinite loop');
        break;
      }
      
    } while (cursor);
    
    console.log(`🎉 Pagination complete! Fetched ${pageCount} pages with ${allObjects.length} total objects`);
    
    // Analyze the complete dataset
    const objectTypes = {};
    allObjects.forEach(obj => {
      objectTypes[obj.type] = (objectTypes[obj.type] || 0) + 1;
    });
    
    console.log(`📊 Complete dataset analysis:`, JSON.stringify(objectTypes));
    
    return { objects: allObjects };
    
  } catch (error) {
    console.error('❌ Error during pagination:', error);
    throw error;
  }
}

/**
 * Processes images from Square API with improved mapping and reduced validation
 */
async function processProductImages(item, imageMap) {
  const productName = item.item_data.name;
  const imageIds = item.item_data.image_ids || [];
  const validImages = [];
  
  console.log(`🖼️ Processing images for: ${productName}`);
  console.log(`📋 Image IDs from Square: ${JSON.stringify(imageIds)}`);

  if (imageIds.length === 0) {
    console.log(`❌ No image IDs found for product: ${productName}`);
    validImages.push('/placeholder.svg');
    return validImages;
  }

  // Process each image ID using the imageMap
  for (const imageId of imageIds) {
    console.log(`🔍 Looking for image ID: ${imageId} for product: ${productName}`);
    
    const imgObj = imageMap.get(imageId);

    if (!imgObj) {
      console.error(`❌ Image object not found for ID: ${imageId} in product: ${productName}`);
      continue;
    }

    console.log(`✅ Found image object for ${productName}:`, JSON.stringify({
      id: imgObj.id,
      type: imgObj.type,
      has_image_data: !!imgObj.image_data,
      url: imgObj.image_data?.url ? 'HAS_URL' : 'NO_URL'
    }));

    const imageUrl = imgObj.image_data?.url;
    if (!imageUrl) {
      console.error(`❌ No URL found in image data for ID: ${imageId} in product: ${productName}`);
      continue;
    }

    // Validate only 50% of images to improve performance
    if (Math.random() > 0.5) {
      console.log(`⚡ Skipping validation for performance: ${imageUrl}`);
      validImages.push(imageUrl);
    } else {
      const validUrl = await validateImageUrl(imageUrl, productName);
      if (validUrl) {
        validImages.push(validUrl);
      }
    }
  }

  // If no valid images found, use placeholder
  if (validImages.length === 0) {
    console.log(`❌ No valid images found for product: ${productName}, using placeholder`);
    validImages.push('/placeholder.svg');
  } else {
    console.log(`✅ Successfully found ${validImages.length} valid images for product: ${productName}`);
  }

  return validImages;
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
  const products = [];
  const items = squareData.objects.filter(
    (item) =>
      item.type === 'ITEM' &&
      item.item_data &&
      item.item_data.product_type !== 'APPOINTMENTS_SERVICE' &&
      item.item_data.name !== 'Training session (example service)'
  );

  // Build image lookup map from all image objects
  const imageMap = new Map();
  squareData.objects
    .filter(obj => obj.type === 'IMAGE')
    .forEach(img => {
      imageMap.set(img.id, img);
    });

  console.log(`📊 Built image lookup map with ${imageMap.size} images for ${items.length} products`);

  for (const item of items) {
    const variation =
      item.item_data.variations && item.item_data.variations.length > 0
        ? item.item_data.variations[0]
        : null;

    const priceInCents =
      variation?.item_variation_data?.price_money?.amount ?? 0;

    // Process images using the imageMap with reduced validation
    const images = await processProductImages(item, imageMap);

    const slug = item.item_data.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    // Determine the product category using our improved logic
    const category = determineProductCategory(item, squareCategoryData);
    
    // Extract brand from product title
    const brand = extractBrandFromTitle(item.item_data.name);
    
    // Validate the category against our standardized list
    const isValidCategory = standardCategories.some(c => c.slug === category);
    if (!isValidCategory) {
      console.error(`Invalid category "${category}" for product "${item.item_data.name}"`);
    }

    const product = {
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
      brand, // Add the extracted brand field
      bestSeller: Math.random() > 0.7,
      featured: Math.random() > 0.8,
      benefits: [item.item_data.description || ''],
      ingredients: 'Natural ingredients',
      directions: 'Follow package instructions',
      faqs: [],
      tags: [category],
    };

    products.push(product);
  }

  // Log brand extraction statistics
  const productsWithBrands = products.filter(p => p.brand).length;
  const productsWithoutBrands = products.filter(p => !p.brand).length;
  const brandCounts = {};
  
  products.forEach(p => {
    if (p.brand) {
      brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
    }
  });
  
  console.log(`📊 Brand extraction statistics:`, {
    totalProducts: products.length,
    productsWithBrands,
    productsWithoutBrands,
    brandDistribution: brandCounts
  });

  return products;
}

/**
 * Main handler function
 */
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 === STARTING OPTIMIZED CATALOG FETCH ===');
    const startTime = Date.now();
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Fetch ALL data from Square API with pagination
    console.log('📡 Step 1: Fetching ALL Square data with pagination...');
    const squareData = await fetchAllSquareData();
    
    // Fetch Square categories
    console.log('📂 Step 2: Fetching Square categories...');
    const squareCategoryData = await fetchSquareCategories();
    
    // Transform to products
    console.log('🔄 Step 3: Transforming products with optimized processing...');
    const products = await transformToProducts(squareData, squareCategoryData);

    const endTime = Date.now();
    console.log(`⏱️ Total processing time: ${endTime - startTime}ms`);
    console.log('✅ === OPTIMIZED CATALOG FETCH COMPLETED ===');

    return new Response(JSON.stringify(products), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err) {
    console.error('💥 Error processing request:', err);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch Square Catalog', 
        details: err.message,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
