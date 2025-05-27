
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFavorites } from '@/hooks/useFavorites';

interface FavoriteButtonProps {
  productId: string;
  className?: string;
}

const FavoriteButton = ({ productId, className }: FavoriteButtonProps) => {
  const { toggleFavorite, isFavorited, loading, isSignedIn } = useFavorites();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(productId);
  };

  if (!isSignedIn) {
    return null;
  }

  const favorited = isFavorited(productId);

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={cn(
        "absolute top-2 left-2 p-1.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200 z-10",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    >
      <Heart
        size={16}
        className={cn(
          "transition-colors duration-200",
          favorited 
            ? "fill-red-500 text-red-500" 
            : "text-gray-600 hover:text-red-500"
        )}
      />
    </button>
  );
};

export default FavoriteButton;
