
/**
 * Standardizes a category name to one of our approved categories
 * Note: This same logic is implemented in the Supabase Edge Function
 */
export const standardizeCategory = (categoryName: string): string => {
  const lower = (categoryName || '').toLowerCase();

  if (lower.includes('amino')) return 'Aminos';
  if (lower.includes('anti-aging')) return 'Anti-Aging Supplement';
  if (lower.includes('bcaa')) return 'BCAA';
  if (lower.includes('creatine')) return 'Creatine';
  if (lower.includes('dry spell')) return 'Dry Spell';
  if (lower.includes('fat') || lower.includes('burn')) return 'Fat Burners';
  if (lower.includes('multivitamin')) return 'Multivitamin';
  if (lower.includes('pre') && lower.includes('workout')) return 'Pre Workout';
  if (lower.includes('protein powder')) return 'Protein Powder';
  if (lower.includes('protein')) return 'Protein';
  if (lower.includes('pump')) return 'Pump Supplement';
  if (lower.includes('testosterone')) return 'Testosterone';
  if (lower.includes('vitamin')) return 'Vitamins';

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
 */
export const getMainCategories = (): {name: string, slug: string}[] => {
  return [
    { name: 'Protein', slug: 'protein' },
    { name: 'Pre Workout', slug: 'pre-workout' },
    { name: 'Fat Burners', slug: 'fat-burners' },
    { name: 'Daily Essentials', slug: 'daily-essentials' }
  ];
};

/**
 * Returns the complete list of all supported categories
 */
export const getAllCategories = (): {name: string, slug: string}[] => {
  return [
    { name: 'Aminos', slug: 'aminos' },
    { name: 'Anti-Aging Supplement', slug: 'anti-aging-supplement' },
    { name: 'BCAA', slug: 'bcaa' },
    { name: 'Creatine', slug: 'creatine' },
    { name: 'Daily Essentials', slug: 'daily-essentials' },
    { name: 'Dry Spell', slug: 'dry-spell' },
    { name: 'Fat Burners', slug: 'fat-burners' },
    { name: 'Multivitamin', slug: 'multivitamin' },
    { name: 'Pre Workout', slug: 'pre-workout' },
    { name: 'Protein', slug: 'protein' },
    { name: 'Protein Powder', slug: 'protein-powder' },
    { name: 'Pump Supplement', slug: 'pump-supplement' },
    { name: 'Testosterone', slug: 'testosterone' },
    { name: 'Vitamins', slug: 'vitamins' }
  ];
};
