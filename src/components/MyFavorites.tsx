
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { fetchSquareProducts } from '@/lib/square';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import { Heart } from 'lucide-react';

const MyFavorites = () => {
  const { user } = useAuth();
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setFavoriteProducts([]);
      setLoading(false);
      return;
    }

    const fetchFavoriteProducts = async () => {
      try {
        setLoading(true);
        
        // Get user's favorite product IDs
        const { data: favorites, error: favError } = await supabase
          .from('user_favorites')
          .select('product_id')
          .eq('user_id', user.id);

        if (favError) throw favError;

        if (!favorites || favorites.length === 0) {
          setFavoriteProducts([]);
          return;
        }

        // Fetch all products from Square
        const allProducts = await fetchSquareProducts();
        
        // Filter products that are in user's favorites
        const favoriteProductIds = favorites.map(fav => fav.product_id);
        const userFavoriteProducts = allProducts.filter(product => 
          favoriteProductIds.includes(product.id)
        );

        setFavoriteProducts(userFavoriteProducts);
      } catch (error) {
        console.error('Error fetching favorite products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteProducts();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (favoriteProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
        <p className="text-gray-600">
          Browse our products and click the heart icon to save your favorites here.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <Heart size={24} className="mr-2 text-red-500" />
        My Favorites ({favoriteProducts.length})
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favoriteProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default MyFavorites;
