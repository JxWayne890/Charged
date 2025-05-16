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

// Mock products to use when Square API can't be reached
const mockProducts: SquareProduct[] = [
  {
    id: 'mock-1',
    title: 'Premium Whey Protein',
    description: 'High-quality protein powder for muscle recovery and growth.',
    price: 49.99,
    images: ['/placeholder.svg'],
    category: 'protein',
    stock: 15,
    rating: 4.8,
    reviewCount: 24,
    slug: 'premium-whey-protein'
  },
  {
    id: 'mock-2',
    title: 'Pre-Workout Energy Boost',
    description: 'Powerful pre-workout formula for maximum energy and focus.',
    price: 39.99,
    images: ['/placeholder.svg'],
    category: 'pre-workout',
    stock: 20,
    rating: 4.7,
    reviewCount: 18,
    slug: 'pre-workout-energy-boost'
  },
  {
    id: 'mock-3',
    title: 'Daily Multivitamin',
    description: 'Complete daily vitamin supplement for optimal health.',
    price: 29.99,
    images: ['/placeholder.svg'],
    category: 'wellness',
    stock: 35,
    rating: 4.9,
    reviewCount: 42,
    slug: 'daily-multivitamin'
  },
  {
    id: 'mock-4',
    title: 'BCAA Recovery Complex',
    description: 'Branched-chain amino acids for muscle recovery and endurance.',
    price: 34.99,
    images: ['/placeholder.svg'],
    category: 'amino-acids',
    stock: 18,
    rating: 4.6,
    reviewCount: 15,
    slug: 'bcaa-recovery-complex'
  },
  {
    id: 'mock-5',
    title: 'Fat Burner Extreme',
    description: 'Advanced formula to support weight management and metabolism.',
    price: 44.99,
    images: ['/placeholder.svg'],
    category: 'weight-loss',
    stock: 12,
    rating: 4.5,
    reviewCount: 27,
    slug: 'fat-burner-extreme'
  }
];

export async function fetchSquareProducts(): Promise<SquareProduct[]> {
  // For browser CORS issues with direct API calls, we're returning mock products
  // In a production environment, this should be handled through a backend proxy or serverless function
  console.log('Fetching Square products (using mock data due to CORS restrictions)');
  
  try {
    // We'll keep this code commented as reference for server-side implementation
    // Currently, direct browser calls to Square API are blocked by CORS
    /*
    const response = await fetch('https://connect.squareup.com/v2/catalog/list', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${squareAccessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
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
      return mockProducts;
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
          category: item.item_data.category_id ? 'General' : 'General', // We'll need to make a separate call to get category names
          stock: variation && variation.item_variation_data ? (variation.item_variation_data.inventory_count || 10) : 10,
          rating: 5.0, // Default rating
          reviewCount: 0, // Default review count
          slug: slug
        };
      });
    */
    
    // Return mock products for demonstration
    return Promise.resolve(mockProducts);
  } catch (error) {
    console.error('Error fetching Square products:', error);
    // Return mock products as fallback
    return mockProducts;
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
