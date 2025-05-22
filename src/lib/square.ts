
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import { toast } from '@/components/ui/use-toast';

// Fetch products from Square via Supabase Edge Function
export async function fetchSquareProducts(): Promise<Product[]> {
  console.log('Fetching products from Square via Supabase Edge Function');
  try {
    const { data, error } = await supabase.functions.invoke('catalog');
    
    if (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: 'Failed to load products. Please try again later.',
        variant: 'destructive',
      });
      return [];
    }
    
    console.log(`Successfully fetched ${data.length} products`);
    return data as Product[];
  } catch (error) {
    console.error('Error in fetchSquareProducts:', error);
    toast({
      title: 'Error',
      description: 'Failed to load products. Please try again later.',
      variant: 'destructive',
    });
    return [];
  }
}

// Function to manually trigger category synchronization
export async function syncCategoriesFromSquare(): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke('sync-categories');
    
    if (error) {
      console.error('Error syncing categories:', error);
      toast({
        title: 'Error',
        description: 'Failed to sync categories. Please try again later.',
        variant: 'destructive',
      });
      return false;
    }
    
    toast({
      title: 'Success',
      description: data.message || 'Categories synchronized successfully.',
    });
    return true;
  } catch (error) {
    console.error('Error synchronizing categories:', error);
    toast({
      title: 'Error',
      description: 'Failed to sync categories. Please try again later.',
      variant: 'destructive',
    });
    return false;
  }
}
