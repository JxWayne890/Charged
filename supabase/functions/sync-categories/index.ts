
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
    
    // 1. First, fetch categories from Square API
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
    
    // 2. Map Square categories to our allowed categories
    const mappedCategories = [];
    const squareIdToCategory = new Map(); // Track Square category IDs to our categories
    
    for (const obj of squareData.objects) {
      const originalName = obj.category_data.name;
      const mappedCategory = mapToAllowedCategory(originalName);
      
      if (mappedCategory) {
        console.log(`Mapped "${originalName}" → "${mappedCategory}"`);
        
        squareIdToCategory.set(obj.id, mappedCategory);
        
        mappedCategories.push({
          name: mappedCategory,
          slug: createSlug(mappedCategory),
          square_category_id: obj.id
        });
      } else {
        console.log(`Ignored category "${originalName}" (not in allowed list)`);
      }
    }
    
    // 3. Make sure we include all allowed categories, even if not found in Square
    const finalCategories = [...ALLOWED_CATEGORIES.map(name => ({
      name,
      slug: createSlug(name),
      square_category_id: `manual_${createSlug(name)}`
    }))];
    
    // De-duplicate categories (in case multiple Square categories map to the same allowed category)
    const uniqueCategories = Object.values(
      finalCategories.reduce((acc: Record<string, any>, category) => {
        if (!acc[category.name]) {
          acc[category.name] = category;
        }
        return acc;
      }, {})
    );
    
    console.log(`Final list contains ${uniqueCategories.length} unique categories`);
    
    // 4. Upsert categories to Supabase
    const { data, error } = await supabase
      .from('categories')
      .upsert(uniqueCategories, { 
        onConflict: 'name',
        ignoreDuplicates: false
      })
      .select();
    
    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    // 5. Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: `Synchronized ${uniqueCategories.length} categories`,
        categories: data
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
