
// Square API integration utilities
const squareApplicationId = import.meta.env.VITE_SQUARE_APPLICATION_ID || '';
const squareAccessToken = import.meta.env.VITE_SQUARE_ACCESS_TOKEN || '';

interface SquareProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  rating: number;
  reviewCount: number;
  slug: string;
}

export async function fetchSquareProducts(): Promise<SquareProduct[]> {
  console.log('Fetching Square products');
  
  try {
    // Use the catalog/list endpoint to get products
    const response = await fetch('https://connect.squareup.com/v2/catalog/list', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${squareAccessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': window.location.origin,
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ types: ['ITEM'] })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Square API error:', errorData);
      throw new Error(`Square API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.objects || !Array.isArray(data.objects)) {
      console.warn('No catalog objects returned from Square API');
      return [];
    }
    
    // Map Square catalog items to our product format
    const products: SquareProduct[] = data.objects
      .filter(item => item.type === 'ITEM' && item.item_data)
      .map(item => {
        // Get the first variation price if available
        const variation = item.item_data.variations && item.item_data.variations.length > 0 
          ? item.item_data.variations[0] 
          : null;
        
        const priceInCents = variation && variation.item_variation_data && variation.item_variation_data.price_money 
          ? variation.item_variation_data.price_money.amount 
          : 0;
        
        // Get image URLs if available
        const imageIds = item.item_data.image_ids || [];
        const images = imageIds.map(id => {
          const imageObject = data.objects.find(obj => obj.id === id && obj.type === 'IMAGE');
          return imageObject && imageObject.image_data ? imageObject.image_data.url : '';
        }).filter(url => url);
        
        // Use placeholder if no images
        if (images.length === 0) {
          images.push('/placeholder.svg');
        }
        
        // Create slug from name
        const slug = item.item_data.name
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
        
        return {
          id: item.id,
          title: item.item_data.name,
          description: item.item_data.description || '',
          price: priceInCents / 100, // Convert from cents to dollars
          images: images,
          category: item.item_data.category_id ? item.item_data.category_id : 'general',
          stock: variation && variation.item_variation_data ? (variation.item_variation_data.inventory_count || 10) : 10,
          rating: 4.5, // Default rating
          reviewCount: 5, // Default review count
          slug: slug
        };
      });
    
    console.log('Fetched products from Square:', products);
    return products;
  } catch (error) {
    console.error('Error fetching Square products:', error);
    // Return empty array instead of mock products
    return [];
  }
}

// Function to transform Square products to match our application's Product type
export function mapSquareProductsToAppFormat(squareProducts: SquareProduct[]) {
  return squareProducts.map(product => ({
    ...product,
    bestSeller: Math.random() > 0.7, // Randomly mark some products as best sellers
    featured: Math.random() > 0.8,   // Randomly mark some products as featured
    benefits: [product.description],
    ingredients: 'Natural ingredients',
    directions: 'Follow package instructions',
    faqs: [],
    tags: [product.category],
  }));
}
