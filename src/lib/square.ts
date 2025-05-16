
// Square API integration utilities
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";

export async function fetchSquareProducts(): Promise<Product[]> {
  console.log('Fetching products from Square via Supabase Edge Function');
  
  try {
    // Call the Supabase Edge Function that fetches from Square
    const { data, error } = await supabase.functions.invoke('catalog');
    
    if (error) {
      console.error('Error calling Supabase Edge Function:', error);
      toast({
        title: "Error",
        description: "Failed to load products. Please try again later.",
        variant: "destructive",
      });
      throw new Error(error.message);
    }
    
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.warn('No products returned from Supabase Edge Function');
      return [];
    }
    
    console.log(`Successfully fetched ${data.length} products`);
    return data as Product[];
  } catch (error) {
    console.error('Error fetching Square products:', error);
    toast({
      title: "Error",
      description: "Failed to load products. Please try again later.",
      variant: "destructive",
    });
    
    // Return empty array instead of mock data
    return [];
  }
}

// This function is no longer needed as the Edge Function already transforms the data
export function mapSquareProductsToAppFormat(squareProducts: Product[]) {
  return squareProducts;
}
