
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  onError?: () => void;
}

const ProductImage = ({ src, alt, className, onError }: ProductImageProps) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  
  const handleError = () => {
    console.log(`Image failed to load: ${src}`);
    setError(true);
    setLoading(false);
    
    // Try to retry loading the image up to 2 times
    if (retryCount < 2 && !src.includes('placeholder.svg')) {
      console.log(`Retrying image load (attempt ${retryCount + 1}): ${src}`);
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setError(false);
        setLoading(true);
      }, 1000 * (retryCount + 1)); // Progressive delay
    } else {
      onError?.();
    }
  };

  const handleLoad = () => {
    console.log(`Image loaded successfully: ${src}`);
    setLoading(false);
    setError(false);
  };

  // If error occurred and we've exhausted retries, show placeholder
  if (error && (retryCount >= 2 || src.includes('placeholder.svg'))) {
    return (
      <div className={cn(
        "bg-gray-100 flex items-center justify-center text-gray-400",
        className
      )}>
        <span className="text-sm">No Image</span>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      {loading && !error && (
        <div className={cn(
          "absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center",
          className
        )}>
          <span className="text-gray-400 text-sm">Loading...</span>
        </div>
      )}
      
      <img
        key={`${src}-${retryCount}`} // Force re-render on retry
        src={src}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          loading ? "opacity-0" : "opacity-100",
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
    </div>
  );
};

export default ProductImage;
