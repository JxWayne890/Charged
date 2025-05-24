
import { Product } from '@/types';

const CACHE_KEY = 'product_cache';
const CACHE_EXPIRY_KEY = 'product_cache_expiry';
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

interface CachedData {
  products: Product[];
  timestamp: number;
}

export const productCache = {
  get: (): Product[] | null => {
    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      const expiry = localStorage.getItem(CACHE_EXPIRY_KEY);
      
      if (!cachedData || !expiry) {
        return null;
      }
      
      const expiryTime = parseInt(expiry);
      const now = Date.now();
      
      if (now > expiryTime) {
        // Cache expired, clear it
        productCache.clear();
        return null;
      }
      
      const data: CachedData = JSON.parse(cachedData);
      console.log(`📦 Cache hit: Retrieved ${data.products.length} products from cache`);
      return data.products;
    } catch (error) {
      console.error('Error reading from cache:', error);
      productCache.clear();
      return null;
    }
  },
  
  set: (products: Product[]): void => {
    try {
      const data: CachedData = {
        products,
        timestamp: Date.now()
      };
      
      const expiry = Date.now() + CACHE_DURATION;
      
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(CACHE_EXPIRY_KEY, expiry.toString());
      
      console.log(`💾 Cached ${products.length} products for ${CACHE_DURATION / 1000 / 60} minutes`);
    } catch (error) {
      console.error('Error writing to cache:', error);
    }
  },
  
  clear: (): void => {
    try {
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(CACHE_EXPIRY_KEY);
      console.log('🗑️ Product cache cleared');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  },
  
  isExpired: (): boolean => {
    try {
      const expiry = localStorage.getItem(CACHE_EXPIRY_KEY);
      if (!expiry) return true;
      
      return Date.now() > parseInt(expiry);
    } catch (error) {
      return true;
    }
  }
};
