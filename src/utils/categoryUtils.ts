
import { Category } from "@/lib/categories";

/**
 * Standardizes a category name to one of our approved categories
 * Note: This same logic is implemented in the Supabase Edge Function
 */
export const standardizeCategory = (categoryName: string): string => {
  const lower = (categoryName || '').toLowerCase();

  if (lower.includes('amino')) return 'Amino Acids';
  if (lower.includes('anti-aging')) return 'Wellness';
  if (lower.includes('bcaa')) return 'Amino Acids';
  if (lower.includes('creatine')) return 'Creatine';
  if (lower.includes('dry spell')) return 'Performance';
  if (lower.includes('fat') || lower.includes('burn')) return 'Weight Loss';
  if (lower.includes('multivitamin')) return 'Wellness';
  if (lower.includes('pre') && lower.includes('workout')) return 'Pre-Workout';
  if (lower.includes('protein powder')) return 'Protein';
  if (lower.includes('protein')) return 'Protein';
  if (lower.includes('pump')) return 'Performance';
  if (lower.includes('testosterone')) return 'Testosterone';
  if (lower.includes('vitamin')) return 'Wellness';

  return 'Uncategorized';
};

/**
 * Standardizes a category from a URL parameter to match our approved categories
 */
export const standardizeUrlCategory = (urlCategory: string): string => {
  if (!urlCategory) return '';
  
  // Convert URL format (dashes) to readable format
  const normalized = urlCategory.toLowerCase().replace(/-/g, ' ');
  
  // Use same standardization as the edge function to ensure consistency
  return standardizeCategory(normalized);
};

/**
 * Creates a URL-friendly slug from a category name 
 */
export const categoryToSlug = (category: string): string => {
  return category.toLowerCase().replace(/\s+/g, '-');
};

/**
 * Formats a standard category to display format
 */
export const formatCategoryName = (category: string): string => {
  // Special cases for acronyms
  if (category.toUpperCase() === 'BCAA') return 'BCAA';
  
  // Normal case: capitalize each word
  return category
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Returns the list of main categories to display on the homepage and shop page
 * This now uses an in-memory cache with fallback to hardcoded values
 */
let cachedMainCategories: {name: string, slug: string}[] | null = null;

export const getMainCategories = (): {name: string, slug: string}[] => {
  if (cachedMainCategories) {
    return cachedMainCategories;
  }
  
  // Fallback to hardcoded values if cache is empty
  return [
    { name: 'Protein', slug: 'protein' },
    { name: 'Pre-Workout', slug: 'pre-workout' },
    { name: 'Weight Loss', slug: 'weight-loss' },
    { name: 'Daily Essentials', slug: 'daily-essentials' }
  ];
};

/**
 * Sets the cached main categories from database values
 */
export const setCachedMainCategories = (categories: Category[]) => {
  cachedMainCategories = categories.map(cat => ({
    name: cat.name,
    slug: cat.slug
  }));
};

/**
 * Returns the complete list of all supported categories
 * This now pulls from an in-memory cache with fallback to hardcoded values
 */
let cachedAllCategories: {name: string, slug: string}[] | null = null;

export const getAllCategories = (): {name: string, slug: string}[] => {
  if (cachedAllCategories) {
    return cachedAllCategories;
  }
  
  // Fallback to hardcoded values if cache is empty
  return [
    { name: 'Amino Acids', slug: 'amino-acids' },
    { name: 'Creatine', slug: 'creatine' },
    { name: 'Daily Essentials', slug: 'daily-essentials' },
    { name: 'Pre-Workout', slug: 'pre-workout' },
    { name: 'Protein', slug: 'protein' },
    { name: 'Wellness', slug: 'wellness' },
    { name: 'Weight Loss', slug: 'weight-loss' },
    { name: 'Testosterone', slug: 'testosterone' }
  ];
};

/**
 * Sets the cached all categories from database values
 */
export const setCachedAllCategories = (categories: Category[]) => {
  cachedAllCategories = categories.map(cat => ({
    name: cat.name,
    slug: cat.slug
  }));
};
