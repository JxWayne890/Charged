
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export interface Category {
  id: string;
  name: string;
  slug: string;
  square_category_id: string;
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Failed to load categories. Please try again later.",
        variant: "destructive",
      });
      return [];
    }
    
    return data as Category[];
  } catch (error) {
    console.error('Error in fetchCategories:', error);
    toast({
      title: "Error",
      description: "Failed to load categories. Please try again later.",
      variant: "destructive",
    });
    return [];
  }
}

export async function syncCategories(): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke('sync-categories');
    
    if (error) {
      console.error('Error syncing categories:', error);
      toast({
        title: "Error",
        description: "Failed to sync categories. Please try again later.",
        variant: "destructive",
      });
      return false;
    }
    
    toast({
      title: "Success",
      description: data.message || "Categories synchronized successfully.",
    });
    return true;
  } catch (error) {
    console.error('Error in syncCategories:', error);
    toast({
      title: "Error",
      description: "Failed to sync categories. Please try again later.",
      variant: "destructive",
    });
    return false;
  }
}
