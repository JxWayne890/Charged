// Utility functions for category handling and standardization

// Function to standardize category names for URL parameters
export const standardizeUrlCategory = (urlCategory: string): string => {
  if (!urlCategory) return '';
  
  // Convert to lowercase, trim spaces for standardized comparison
  const normalized = urlCategory.toLowerCase().trim();
  
  console.log(`CategoryUtils: Standardizing URL category: '${urlCategory}' -> normalized: '${normalized}'`);
  
  // Use the same standardization map as the edge function
  const categoryMap: Record<string, string> = {
    // Protein categories
    'protein': 'Protein',
    'protein-powder': 'Protein',
    'whey': 'Protein',
    'whey-protein': 'Protein',
    
    // Pre-workout categories - Note consistent dash usage
    'pre-workout': 'Pre-Workout',
    'preworkout': 'Pre-Workout',
    'pre workout': 'Pre-Workout',
    'pre-workout-extreme-villain': 'Pre-Workout',
    'nootropic-pre-workout': 'Pre-Workout',
    
    // Weight loss categories
    'weight-loss': 'Weight Loss',
    'weightloss': 'Weight Loss',
    'fat-burner': 'Weight Loss',
    'fat-burn': 'Weight Loss',
    'thermogenic': 'Weight Loss',
    
    // Amino acid categories
    'amino-acids': 'Amino Acids',
    'amino': 'Amino Acids',
    'aminos': 'Amino Acids',
    'bcaa': 'Amino Acids',
    
    // Wellness categories
    'wellness': 'Wellness',
    'health': 'Wellness',
    'vitamin': 'Wellness',
    'vitamins': 'Wellness',
    'essential': 'Wellness',
    'multivitamin': 'Wellness',
    'anti-aging': 'Wellness',
    
    // Others
    'daily-essentials': 'Daily Essentials',
    'creatine': 'Creatine',
  };
  
  // Check for direct match first (handles slug format like "pre-workout")
  if (categoryMap[normalized]) {
    console.log(`CategoryUtils: Found direct URL match for '${normalized}': '${categoryMap[normalized]}'`);
    return categoryMap[normalized];
  }
  
  // Handle dash to space conversion for URL parameters
  const normalizedWithSpaces = normalized.replace(/-/g, ' ');
  if (categoryMap[normalizedWithSpaces]) {
    console.log(`CategoryUtils: Found match after dash conversion for '${normalizedWithSpaces}': '${categoryMap[normalizedWithSpaces]}'`);
    return categoryMap[normalizedWithSpaces];
  }
  
  // Try partial matches as fallback
  for (const [key, value] of Object.entries(categoryMap)) {
    // Convert dashes in URL keys to spaces for better matching
    const keyWithSpaces = key.replace(/-/g, ' ');
    
    if (normalizedWithSpaces.includes(keyWithSpaces)) {
      console.log(`CategoryUtils: Found partial match for '${normalizedWithSpaces}' with key '${keyWithSpaces}': '${value}'`);
      return value;
    }
  }
  
  // If no match, capitalize as fallback
  const capitalized = normalized.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  console.log(`CategoryUtils: No match found for '${normalized}', capitalizing: '${capitalized}'`);
  return capitalized;
};
