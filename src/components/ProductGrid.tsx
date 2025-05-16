
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface SquareItem {
  id: string;
  item_data: {
    name: string;
    description?: string;
    variations?: Array<{
      id: string;
      item_variation_data: {
        price_money?: {
          amount: number;
          currency: string;
        }
      }
    }>
  }
}

const ProductGrid = () => {
  const [products, setProducts] = useState<SquareItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Calling our Supabase Edge Function
        const response = await fetch('https://uabhicleiumptashiarr.supabase.co/functions/v1/catalog', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setProducts(data.items);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Helper function to get the price of a product
  const getProductPrice = (product: SquareItem): string => {
    if (product.item_data.variations && product.item_data.variations.length > 0) {
      const variation = product.item_data.variations[0];
      if (variation.item_variation_data.price_money) {
        const { amount, currency } = variation.item_variation_data.price_money;
        // Square stores prices in cents, so divide by 100 to get dollars
        return formatPrice(amount / 100);
      }
    }
    return 'Price not available';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading products...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 text-red-700 rounded-md">
        <p>{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center p-8">
        <p>No products found in your Square catalog.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="h-full flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">{product.item_data.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <CardDescription>
              {product.item_data.description || 'No description available'}
            </CardDescription>
          </CardContent>
          <CardFooter className="pt-2 border-t">
            <p className="font-semibold">{getProductPrice(product)}</p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ProductGrid;
