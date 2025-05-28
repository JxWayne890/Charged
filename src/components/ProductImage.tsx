
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  onError?: () => void;
  width?: number;
}

const ProductImage = ({ src, alt, className, onError, width = 500 }: ProductImageProps) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  
  // Optimize image URL with width parameter for Square CDN
  const optimizeImageUrl = (url: string, targetWidth: number) => {
    if (!url || url.includes('placeholder.svg')) return url;
    
    // Add width parameter to Square CDN URLs
    if (url.includes('squarecdn.com') || url.includes('squareup.com')) {
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}width=${targetWidth}`;
    }
    
    return url;
  };

  const optimizedSrc = optimizeImageUrl(src, width);
  
  const handleError = () => {
    console.error(`🖼️ Image failed to load: ${optimizedSrc} (attempt ${retryCount + 1})`);
    setError(true);
    setLoading(false);
    
    // Try to retry loading the image up to 2 times, but not for placeholders
    if (retryCount < 2 && !src.includes('placeholder.svg') && src.startsWith('http')) {
      console.log(`🔄 Retrying image load (attempt ${retryCount + 1}): ${optimizedSrc}`);
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setError(false);
        setLoading(true);
      }, 1000 * (retryCount + 1)); // Progressive delay
    } else {
      console.log(`❌ Max retries reached or placeholder image for: ${optimizedSrc}`);
      onError?.();
    }
  };

  const handleLoad = () => {
    console.log(`✅ Image loaded successfully: ${optimizedSrc}`);
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
      )}
      style={{ backgroundColor: '#f3f3f3', minHeight: '200px' }}
      >
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
          "absolute inset-0 animate-pulse flex items-center justify-center z-10",
          className
        )}
        style={{ backgroundColor: '#f3f3f3', minHeight: '200px' }}
        >
          <span className="text-gray-400 text-sm">Loading...</span>
        </div>
      )}
      
      <img
        key={`${optimizedSrc}-${retryCount}`}
        src={optimizedSrc}
        alt={alt}
        className={cn(
          "transition-opacity duration-300 w-full h-full",
          loading ? "opacity-0" : "opacity-100",
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        style={loading ? { backgroundColor: '#f3f3f3', minHeight: '200px' } : undefined}
      />
    </div>
  );
};

export default ProductImage;
