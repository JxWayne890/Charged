
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
