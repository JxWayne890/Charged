
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Database } from 'lucide-react';
import { productCache } from '@/lib/productCache';

const CacheStatus = () => {
  const [cacheStatus, setCacheStatus] = useState<'empty' | 'fresh' | 'expired'>('empty');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const checkCacheStatus = () => {
    const cached = productCache.get();
    if (!cached) {
      setCacheStatus('empty');
    } else if (productCache.isExpired()) {
      setCacheStatus('expired');
    } else {
      setCacheStatus('fresh');
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    productCache.clear();
    setCacheStatus('empty');
    // Reload the page to fetch fresh data
    window.location.reload();
  };

  useEffect(() => {
    checkCacheStatus();
    // Check cache status every 30 seconds
    const interval = setInterval(checkCacheStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (cacheStatus) {
      case 'fresh': return 'text-green-600';
      case 'expired': return 'text-yellow-600';
      case 'empty': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusText = () => {
    switch (cacheStatus) {
      case 'fresh': return 'Cache Fresh';
      case 'expired': return 'Cache Expired';
      case 'empty': return 'No Cache';
      default: return 'Unknown';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-3 flex items-center gap-2 z-50">
      <Database className={`h-4 w-4 ${getStatusColor()}`} />
      <span className={`text-sm font-medium ${getStatusColor()}`}>
        {getStatusText()}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="ml-2"
      >
        <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
      </Button>
    </div>
  );
};

export default CacheStatus;
