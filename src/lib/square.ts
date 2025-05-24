
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import { toast } from '@/components/ui/use-toast';

// Fetch products from Square via Supabase Edge Function
export async function fetchSquareProducts(): Promise<Product[]> {
  console.log('🔄 Fetching products from Square via Supabase Edge Function');
  
  try {
    const startTime = Date.now();
    const { data, error } = await supabase.functions.invoke('catalog');
    const endTime = Date.now();
    
    console.log(`⏱️ Catalog fetch took ${endTime - startTime}ms`);
    
    if (error) {
      console.error('❌ Error fetching products:', error);
      toast({
        title: 'Error',
        description: 'Failed to load products. Please try again later.',
        variant: 'destructive',
      });
      return [];
    }
    
    if (!data || !Array.isArray(data)) {
      console.error('❌ Invalid data format received from catalog function:', data);
      toast({
        title: 'Error',
        description: 'Failed to load products due to invalid data format.',
        variant: 'destructive',
      });
      return [];
    }
    
    console.log(`✅ Successfully fetched ${data.length} products`);
    
    // Enhanced image analysis
    let productsWithRealImages = 0;
    let productsWithPlaceholders = 0;
    let totalImages = 0;
    let placeholderImages = 0;
    let realImages = 0;
    const problemProducts = [];
    
    data.forEach(product => {
      const hasRealImages = product.images.some(img => !img.includes('placeholder.svg') && img.startsWith('http'));
      const hasPlaceholders = product.images.some(img => img.includes('placeholder.svg'));
      
      if (hasRealImages) {
        productsWithRealImages++;
      } else if (hasPlaceholders || product.images.length === 0) {
        productsWithPlaceholders++;
        problemProducts.push({
          title: product.title,
          images: product.images,
          category: product.category
        });
      }
      
      totalImages += product.images.length;
      placeholderImages += product.images.filter(img => img.includes('placeholder.svg')).length;
      realImages += product.images.filter(img => !img.includes('placeholder.svg') && img.startsWith('http')).length;
    });
    
    const successRate = ((productsWithRealImages / data.length) * 100).toFixed(1);
    
    console.log('📊 Enhanced Image Statistics:', {
      totalProducts: data.length,
      productsWithRealImages,
      productsWithPlaceholders,
      totalImages,
      placeholderImages,
      realImages,
      successRate: `${successRate}%`,
      problemProductsCount: problemProducts.length
    });
    
    // Log some problematic products for debugging
    if (problemProducts.length > 0) {
      console.warn(`⚠️ Products without real images (showing first 5):`, 
        problemProducts.slice(0, 5).map(p => ({
          title: p.title,
          imageCount: p.images.length,
          firstImage: p.images[0]
        }))
      );
    }
    
    // Show toast if significant image issues
    if (productsWithPlaceholders > data.length * 0.5) {
      console.error(`🚨 CRITICAL: ${productsWithPlaceholders} products (${((productsWithPlaceholders / data.length) * 100).toFixed(1)}%) have no real images!`);
      
      toast({
        title: 'Image Loading Issues Detected',
        description: `${productsWithPlaceholders} products have image loading issues. Check console for details.`,
        variant: 'destructive',
      });
    } else if (productsWithPlaceholders > data.length * 0.2) {
      toast({
        title: 'Some Image Issues',
        description: `${productsWithPlaceholders} products have image loading issues.`,
        variant: 'default',
      });
    }
    
    return data as Product[];
  } catch (error) {
    console.error('💥 Error in fetchSquareProducts:', error);
    toast({
      title: 'Error',
      description: 'Failed to load products. Please try again later.',
      variant: 'destructive',
    });
    return [];
  }
}
