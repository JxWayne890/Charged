import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// The fixed list of allowed categories
const ALLOWED_CATEGORIES = [
  'Aminos',
  'Anti-Aging Supplement',
  'BCAA',
  'Creatine',
  'Dry Spell',
  'Fat Burners',
  'Multivitamin',
  'Pre Workout',
  'Protein',
  'Protein Powder',
  'Pump Supplement',
  'Testosterone',
  'Vitamins'
];

// Function to map Square category names to our allowed categories
const mapToAllowedCategory = (categoryName: string): string | null => {
  if (!categoryName) return null;
  
  const lower = categoryName.toLowerCase().trim();
  
  // Direct matches (case-insensitive)
  for (const allowedCategory of ALLOWED_CATEGORIES) {
    if (lower === allowedCategory.toLowerCase()) {
      return allowedCategory;
    }
  }
  
  // Partial matches based on keywords
  if (lower.includes('amino') || lower.includes('aminos')) {
    return 'Aminos';
  }
  
  if (lower.includes('bcaa')) {
    return 'BCAA';
  }
  
  if (lower.includes('creatine')) {
    return 'Creatine';
  }
  
  if (lower.includes('anti-aging') || lower.includes('anti aging')) {
    return 'Anti-Aging Supplement';
  }
  
  if (lower.includes('dry spell') || lower.includes('diuretic')) {
    return 'Dry Spell';
  }
  
  if (lower.includes('fat burn') || lower.includes('thermogenic') || 
      lower.includes('weight loss') || lower === 'burn') {
    return 'Fat Burners';
  }
  
  if (lower.includes('multivitamin') || 
      (lower.includes('multi') && lower.includes('vitamin'))) {
    return 'Multivitamin';
  }
  
  if ((lower.includes('pre') && lower.includes('workout')) || 
      lower === 'preworkout' || lower === 'pre-workout') {
    return 'Pre Workout';
  }
  
  if (lower.includes('protein') && lower.includes('powder')) {
    return 'Protein Powder';
  }
  
  if (lower.includes('protein')) {
    return 'Protein';
  }
  
  if (lower.includes('pump')) {
    return 'Pump Supplement';
  }
  
  if (lower.includes('test') || lower.includes('testosterone')) {
    return 'Testosterone';
  }
  
  if (lower.includes('vitamin')) {
    return 'Vitamins';
  }
  
  // No match found
  return null;
};

// Function to create a URL-friendly slug
const createSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-');     // Replace multiple hyphens with a single hyphen
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // 1. First, check if we already have the categories in the database
    console.log('Checking existing categories in the database');
    const { data: existingCategories, error: fetchError } = await supabase
      .from('categories')
      .select('name, slug');
      
    if (fetchError) {
      console.error('Error fetching existing categories:', fetchError.message);
      throw new Error(`Failed to fetch existing categories: ${fetchError.message}`);
    }
    
    const existingCategoryNames = new Set(existingCategories?.map(cat => cat.name) || []);
    const existingSlugs = new Set(existingCategories?.map(cat => cat.slug) || []);
    
    console.log(`Found ${existingCategoryNames.size} existing categories in the database`);
    
    // 2. Fetch categories from Square API for mapping
    console.log('Fetching categories from Square API');
    
    const squareRes = await fetch(
      'https://connect.squareup.com/v2/catalog/list?types=CATEGORY',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${Deno.env.get('SQUARE_ACCESS_TOKEN')}`,
          Accept: 'application/json',
        },
      }
    );

    if (!squareRes.ok) {
      const errorData = await squareRes.json();
      throw new Error(`Square API error: ${JSON.stringify(errorData)}`);
    }
    
    const squareData = await squareRes.json();
    
    if (!squareData.objects || !Array.isArray(squareData.objects)) {
      throw new Error('Invalid response format from Square API');
    }
    
    console.log(`Found ${squareData.objects.length} categories in Square`);
    
    // 3. Map Square categories to our allowed categories
    const mappedCategories = [];
    const squareIdToCategory = new Map(); // Track Square category IDs to our categories
    
    for (const obj of squareData.objects) {
      const originalName = obj.category_data.name;
      const mappedCategory = mapToAllowedCategory(originalName);
      
      if (mappedCategory) {
        console.log(`Mapped "${originalName}" → "${mappedCategory}"`);
        squareIdToCategory.set(obj.id, mappedCategory);
      } else {
        console.log(`Ignored category "${originalName}" (not in allowed list)`);
      }
    }
    
    // 4. Create the final list of categories to insert
    const categoriesToUpsert = [];
    
    // Add all allowed categories with proper case and slugs, keep square IDs if we have them
    for (const categoryName of ALLOWED_CATEGORIES) {
      const slug = createSlug(categoryName);
      
      // Only add categories that don't already exist
      if (!existingCategoryNames.has(categoryName)) {
        // Find a matching square ID if available
        let squareId = null;
        for (const [id, name] of squareIdToCategory.entries()) {
          if (name === categoryName) {
            squareId = id;
            break;
          }
        }
        
        categoriesToUpsert.push({
          name: categoryName,
          slug: slug,
          square_category_id: squareId || `manual_${slug}`
        });
      }
    }
    
    console.log(`Preparing to upsert ${categoriesToUpsert.length} new categories`);
    
    // 5. Upsert categories to Supabase
    if (categoriesToUpsert.length > 0) {
      const { data, error } = await supabase
        .from('categories')
        .upsert(categoriesToUpsert, { 
          onConflict: 'name',
          ignoreDuplicates: true
        })
        .select();
      
      if (error) {
        console.error('Supabase upsert error:', error.message);
        throw new Error(`Supabase error: ${error.message}`);
      }
      
      console.log(`Successfully upserted ${data?.length || 0} categories`);
    } else {
      console.log('No new categories to insert');
    }
    
    // 6. Fetch all categories to return in response
    const { data: allCategories, error: allCatError } = await supabase
      .from('categories')
      .select('*')
      .order('name');
      
    if (allCatError) {
      console.error('Error fetching all categories:', allCatError.message);
      throw new Error(`Failed to fetch all categories: ${allCatError.message}`);
    }
    
    // 7. Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: `Synchronized categories successfully. ${categoriesToUpsert.length} new categories added.`,
        categories: allCategories
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error syncing categories:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
