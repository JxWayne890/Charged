
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to standardize category names
const standardizeCategory = (categoryName: string): string => {
  if (!categoryName) return 'Uncategorized';
  
  const lower = categoryName.toLowerCase().trim();
  
  // Protein categories
  if (lower.includes('protein') || lower.includes('whey')) {
    return 'Protein';
  }
  
  // Pre-Workout categories
  if ((lower.includes('pre') && lower.includes('workout')) || lower.includes('preworkout')) {
    return 'Pre-Workout';
  }
  
  // Weight Loss / Fat Burners
  if (lower.includes('fat burn') || lower.includes('thermogenic') || 
      lower.includes('weight loss') || lower === 'burn') {
    return 'Weight Loss';
  }
  
  // Amino Acids
  if (lower.includes('amino') || lower.includes('bcaa')) {
    return 'Amino Acids';
  }
  
  // Wellness / Vitamins
  if (lower.includes('vitamin') || lower.includes('wellness') || 
      lower.includes('multivitamin') || lower.includes('anti-aging')) {
    return 'Wellness';
  }
  
  // Daily Essentials
  if (lower.includes('daily') || lower.includes('essentials')) {
    return 'Daily Essentials';
  }
  
  // Creatine
  if (lower.includes('creatine')) {
    return 'Creatine';
  }
  
  // Testosterone
  if (lower.includes('testosterone')) {
    return 'Testosterone';
  }
  
  // If no mapping found, return the original name with first letter capitalized
  return categoryName.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
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
    
    console.log('Fetching categories from Square API');
    
    // Fetch categories from Square API
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
    
    // Process and standardize categories
    const categories = squareData.objects.map(obj => {
      const originalName = obj.category_data.name;
      const standardizedName = standardizeCategory(originalName);
      const slug = createSlug(standardizedName);
      
      return {
        name: standardizedName,
        slug,
        square_category_id: obj.id,
      };
    });
    
    // Group categories by standardized name to avoid duplicates
    const uniqueCategories = Object.values(
      categories.reduce((acc: Record<string, any>, category) => {
        if (!acc[category.name]) {
          acc[category.name] = category;
        }
        return acc;
      }, {})
    );
    
    console.log(`Standardized to ${uniqueCategories.length} unique categories`);
    
    // Upsert categories to Supabase
    const { data, error } = await supabase
      .from('categories')
      .upsert(uniqueCategories, { 
        onConflict: 'square_category_id',
        ignoreDuplicates: false
      })
      .select();
    
    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }
    
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
