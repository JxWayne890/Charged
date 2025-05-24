
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { productCache } from './productCache';

// Fetch products from Square via Supabase Edge Function with caching
export async function fetchSquareProducts(): Promise<Product[]> {
  console.log('🔄 Fetching products with caching strategy');
  
  // Try to get from cache first
  const cachedProducts = productCache.get();
  if (cachedProducts) {
    console.log(`⚡ Cache hit: Using ${cachedProducts.length} cached products`);
    return cachedProducts;
  }
  
  console.log('📡 Cache miss: Fetching fresh data from Square API');
  
  try {
    const startTime = Date.now();
    const { data, error } = await supabase.functions.invoke('catalog');
    const endTime = Date.now();
    
    console.log(`⏱️ Fresh catalog fetch took ${endTime - startTime}ms`);
    
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
    
    console.log(`✅ Successfully fetched ${data.length} fresh products`);
    
    // Cache the fresh data
    productCache.set(data);
    
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
    
    // Show toast only for significant issues, not minor ones
    if (productsWithPlaceholders > data.length * 0.7) {
      console.error(`🚨 CRITICAL: ${productsWithPlaceholders} products (${((productsWithPlaceholders / data.length) * 100).toFixed(1)}%) have no real images!`);
      
      toast({
        title: 'Image Loading Issues Detected',
        description: `Many products have image loading issues. Check console for details.`,
        variant: 'destructive',
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

// New function to get a single product by slug with caching
export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  console.log(`🔍 Fetching product by slug: ${slug}`);
  
  // Try to get from cache first
  const cachedProducts = productCache.get();
  if (cachedProducts) {
    const product = cachedProducts.find(p => p.slug === slug);
    if (product) {
      console.log(`⚡ Cache hit: Found product "${product.title}" in cache`);
      return product;
    }
  }
  
  // If not in cache, fetch all products and find the one we need
  console.log('📡 Product not in cache, fetching all products');
  const products = await fetchSquareProducts();
  const product = products.find(p => p.slug === slug);
  
  if (product) {
    console.log(`✅ Found product "${product.title}" after fresh fetch`);
  } else {
    console.log(`❌ Product with slug "${slug}" not found`);
  }
  
  return product || null;
}
