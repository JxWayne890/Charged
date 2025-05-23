
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
    
    if (!data || !Array.isArray(data)) {
      console.error('Invalid data format received from catalog function:', data);
      toast({
        title: 'Error',
        description: 'Failed to load products due to invalid data format.',
        variant: 'destructive',
      });
      return [];
    }
    
    console.log(`Successfully fetched ${data.length} products`);
    
    // Log category distribution for debugging
    const categoryDistribution = {};
    data.forEach(product => {
      categoryDistribution[product.category] = (categoryDistribution[product.category] || 0) + 1;
    });
    console.log('Category distribution in client:', categoryDistribution);
    
    // Validate all products have valid categories
    const standardCategories = [
      'pre-workout', 'protein', 'creatine', 'bcaa', 'aminos', 'vitamins', 
      'multivitamin', 'fat-burners', 'pump-supplement', 'testosterone', 
      'anti-aging-supplement', 'dry-spell'
    ];
    
    const invalidCategoryProducts = data.filter(product => 
      !standardCategories.includes(product.category)
    );
    
    if (invalidCategoryProducts.length > 0) {
      console.error('Products with invalid categories:', invalidCategoryProducts);
      toast({
        title: 'Warning',
        description: `${invalidCategoryProducts.length} products have non-standard categories.`,
        variant: 'destructive',
      });
    }
    
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
