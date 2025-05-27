
import { useState, useEffect } from 'react';
import { Product } from '@/types';

const PRODUCTS_PER_LOAD = 30;

interface UsePaginatedProductsProps {
  products: Product[];
}

export const usePaginatedProducts = ({ products }: UsePaginatedProductsProps) => {
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(PRODUCTS_PER_LOAD);

  // Update displayed products when products or itemsToShow changes
  useEffect(() => {
    setDisplayedProducts(products.slice(0, itemsToShow));
  }, [products, itemsToShow]);

  // Reset items to show when products change (e.g., after filtering)
  useEffect(() => {
    setItemsToShow(PRODUCTS_PER_LOAD);
  }, [products]);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    setItemsToShow(prev => prev + PRODUCTS_PER_LOAD);
    setLoadingMore(false);
  };

  const hasMoreItems = itemsToShow < products.length;

  return {
    displayedProducts,
    loadingMore,
    handleLoadMore,
    hasMoreItems,
    totalProducts: products.length,
    showingCount: displayedProducts.length
  };
};
