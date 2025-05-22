
import { Category } from "@/lib/categories";

// The fixed list of allowed categories - must match the ones in sync-categories
export const ALLOWED_CATEGORIES = [
  'Aminos',
  'Anti-Aging Supplement',
  'BCAA',
  'Creatine',
  'Dry Spell',
  'Fat Burners',
  'Multivitamin',
  'Pre Workout',
  'Protein',
  'Protein Powder',
  'Pump Supplement',
  'Testosterone',
  'Vitamins'
];

/**
 * Maps a category name to one of our allowed categories
 */
export const standardizeCategory = (categoryName: string): string => {
  if (!categoryName) return 'Uncategorized';
  
  const lower = categoryName.toLowerCase().trim();
  
  // Direct matches (case-insensitive)
  for (const allowedCategory of ALLOWED_CATEGORIES) {
    if (lower === allowedCategory.toLowerCase()) {
      return allowedCategory;
    }
  }
  
  // Partial matches based on keywords
  if (lower.includes('amino') || lower.includes('aminos')) {
    return 'Aminos';
  }
  
  if (lower.includes('bcaa')) {
    return 'BCAA';
  }
  
  if (lower.includes('creatine')) {
    return 'Creatine';
  }
  
  if (lower.includes('anti-aging') || lower.includes('anti aging')) {
    return 'Anti-Aging Supplement';
  }
  
  if (lower.includes('dry spell') || lower.includes('diuretic')) {
    return 'Dry Spell';
  }
  
  if (lower.includes('fat burn') || lower.includes('thermogenic') || 
      lower.includes('weight loss') || lower === 'burn') {
    return 'Fat Burners';
  }
  
  if (lower.includes('multivitamin') || 
      (lower.includes('multi') && lower.includes('vitamin'))) {
    return 'Multivitamin';
  }
  
  if ((lower.includes('pre') && lower.includes('workout')) || 
      lower === 'preworkout' || lower === 'pre-workout') {
    return 'Pre Workout';
  }
  
  if (lower.includes('protein') && lower.includes('powder')) {
    return 'Protein Powder';
  }
  
  if (lower.includes('protein')) {
    return 'Protein';
  }
  
  if (lower.includes('pump')) {
    return 'Pump Supplement';
  }
  
  if (lower.includes('test') || lower.includes('testosterone')) {
    return 'Testosterone';
  }
  
  if (lower.includes('vitamin')) {
    return 'Vitamins';
  }

  return 'Uncategorized';
};

/**
 * Standardizes a category from a URL parameter to match our allowed categories
 */
export const standardizeUrlCategory = (urlCategory: string): string => {
  if (!urlCategory) return '';
  
  // Convert URL format (dashes) to display format
  const readable = urlCategory.toLowerCase().replace(/-/g, ' ');
  
  return standardizeCategory(readable);
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
  
  // Fallback to allowed categories if cache is empty
  return ALLOWED_CATEGORIES.slice(0, 4).map(cat => ({
    name: cat,
    slug: categoryToSlug(cat)
  }));
};

/**
 * Sets the cached main categories from database values
 */
export const setCachedMainCategories = (categories: Category[]) => {
  // Only include categories that are in our allowed list
  cachedMainCategories = categories
    .filter(cat => ALLOWED_CATEGORIES.includes(cat.name))
    .map(cat => ({
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
  
  // Fallback to allowed categories if cache is empty
  return ALLOWED_CATEGORIES.map(cat => ({
    name: cat,
    slug: categoryToSlug(cat)
  }));
};

/**
 * Sets the cached all categories from database values
 */
export const setCachedAllCategories = (categories: Category[]) => {
  // Only include categories that are in our allowed list
  cachedAllCategories = categories
    .filter(cat => ALLOWED_CATEGORIES.includes(cat.name))
    .map(cat => ({
      name: cat.name,
      slug: cat.slug
    }));
};
