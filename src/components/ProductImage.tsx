
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
    console.error(`🖼️ Image failed to load: ${src} (attempt ${retryCount + 1})`);
    setError(true);
    setLoading(false);
    
    // Try to retry loading the image up to 2 times, but not for placeholders
    if (retryCount < 2 && !src.includes('placeholder.svg') && src.startsWith('http')) {
      console.log(`🔄 Retrying image load (attempt ${retryCount + 1}): ${src}`);
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setError(false);
        setLoading(true);
      }, 1000 * (retryCount + 1)); // Progressive delay
    } else {
      console.log(`❌ Max retries reached or placeholder image for: ${src}`);
      onError?.();
    }
  };

  const handleLoad = () => {
    console.log(`✅ Image loaded successfully: ${src}`);
    setLoading(false);
    setError(false);
    setRetryCount(0); // Reset retry count on successful load
  };

  // If error occurred and we've exhausted retries, show placeholder
  if (error && (retryCount >= 2 || src.includes('placeholder.svg') || !src.startsWith('http'))) {
    return (
      <div className={cn(
        "bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200",
        className
      )}>
        <div className="text-center p-2">
          <span className="text-sm block">No Image</span>
          {src && !src.includes('placeholder.svg') && (
            <span className="text-xs text-gray-300 mt-1 block truncate max-w-32" title={src}>
              {src.split('/').pop()?.substring(0, 20)}...
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      {loading && !error && (
        <div className={cn(
          "absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center z-10",
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
          "transition-opacity duration-300 object-cover w-full h-full",
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
