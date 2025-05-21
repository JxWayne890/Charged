
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export type SquareCategory = {
  id: string;
  name: string;
};

export async function fetchSquareCategories(): Promise<SquareCategory[]> {
  console.log('Fetching categories from Square via Supabase Edge Function');
  
  try {
    // Call the Supabase Edge Function that fetches from Square
    const { data, error } = await supabase.functions.invoke('square-categories');
    
    if (error) {
      console.error('Error calling Supabase Edge Function:', error);
      toast({
        title: "Error",
        description: "Failed to load categories. Please try again later.",
        variant: "destructive",
      });
      throw new Error(error.message);
    }
    
    if (!data || !data.categories || !Array.isArray(data.categories)) {
      console.warn('No categories returned from Supabase Edge Function');
      return [];
    }
    
    console.log(`Successfully fetched ${data.categories.length} categories:`, data.categories);
    return data.categories as SquareCategory[];
  } catch (error) {
    console.error('Error fetching Square categories:', error);
    toast({
      title: "Error",
      description: "Failed to load categories. Please try again later.",
      variant: "destructive",
    });
    
    return [];
  }
}
