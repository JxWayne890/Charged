
import { Product } from "../types";

export const products: Product[] = [
  {
    id: "p001",
    title: "Performance Whey Protein",
    price: 49.99,
    salePrice: 44.99,
    subscription_price: 44.99,
    images: [
      "/products/protein-1.jpg",
      "/products/protein-1-nutrition.jpg",
      "/products/protein-1-lifestyle.jpg",
      "/products/protein-1-stack.jpg"
    ],
    stock: 85,
    category: "protein",
    tags: ["protein", "muscle-building", "recovery", "post-workout"],
    flavors: ["Chocolate", "Vanilla", "Strawberry", "Cookies & Cream"],
    dietary: ["Gluten-Free", "Soy-Free"],
    rating: 4.8,
    reviewCount: 124,
    description: "Our premium Performance Whey Protein delivers 25g of high-quality protein per serving to support muscle recovery and growth. Made with ultrafiltered whey protein isolate for maximum purity and digestibility.",
    benefits: [
      "25g protein per serving",
      "Low in carbs and fat",
      "Mixes instantly",
      "Supports muscle recovery",
      "Enhanced with digestive enzymes"
    ],
    ingredients: "Ultrafiltered Whey Protein Isolate, Cocoa Powder (chocolate flavor only), Natural and Artificial Flavors, Salt, Lecithin, Acesulfame Potassium, Sucralose, Digestive Enzyme Blend (Protease, Lactase, Amylase).",
    directions: "Mix one scoop (30g) with 8-10 oz of cold water or your favorite beverage. Take 1-3 servings daily depending on your protein requirements. Ideal for post-workout recovery.",
    faqs: [
      {
        question: "When is the best time to take this protein?",
        answer: "While Performance Whey can be taken any time to meet your protein needs, it's especially effective immediately after workouts to support muscle recovery and growth."
      },
      {
        question: "Is this protein good for weight loss?",
        answer: "Yes, our Performance Whey is low in carbs and fat while being high in protein, which can help support a calorie-controlled diet and preserve lean muscle mass during weight loss."
      },
      {
        question: "How does it mix?",
        answer: "Our protein is engineered for excellent mixability. It dissolves quickly and completely with just a few shakes in a shaker bottle or brief stirs in a glass."
      }
    ],
    featured: true,
    bestSeller: true,
    slug: "performance-whey-protein"
  },
  {
    id: "p002",
    title: "Energize Pre-Workout",
    price: 39.99,
    subscription_price: 35.99,
    images: [
      "/products/preworkout-1.jpg",
      "/products/preworkout-1-nutrition.jpg",
      "/products/preworkout-1-lifestyle.jpg"
    ],
    stock: 42,
    category: "pre-workout",
    tags: ["pre-workout", "energy", "focus", "pump"],
    flavors: ["Blue Raspberry", "Fruit Punch", "Watermelon", "Sour Gummy"],
    dietary: ["Sugar-Free", "Vegan"],
    rating: 4.9,
    reviewCount: 87,
    description: "Take your workouts to the next level with our Energize Pre-Workout. Formulated with clinically-dosed ingredients to deliver explosive energy, laser focus, and enhanced performance without the crash.",
    benefits: [
      "Clean energy without jitters",
      "Enhanced focus and mental clarity",
      "Improved blood flow and pumps",
      "Increased strength and endurance",
      "Zero sugar, zero crash"
    ],
    ingredients: "Citrulline Malate (6g), Beta-Alanine (3.2g), Caffeine (200mg), L-Tyrosine (1g), Alpha-GPC (300mg), Taurine (1g), L-Theanine (100mg), Bioperine (5mg), Natural and Artificial Flavors, Citric Acid, Malic Acid, Silica, Sucralose, Acesulfame Potassium, Natural Coloring.",
    directions: "Mix 1 scoop with 8-10 oz of cold water and consume 20-30 minutes before exercise. Start with 1/2 scoop to assess tolerance. Do not exceed 2 scoops in a 24-hour period.",
    faqs: [
      {
        question: "Will this pre-workout make me feel jittery?",
        answer: "Energize Pre-Workout contains L-Theanine paired with caffeine to provide smooth energy without the typical jitters. Most users report clean energy with enhanced focus."
      },
      {
        question: "Is the tingling sensation from Beta-Alanine normal?",
        answer: "Yes, the tingling or 'pins and needles' sensation (paresthesia) is a common and harmless side effect of Beta-Alanine. It typically subsides within 30-40 minutes."
      },
      {
        question: "Can I take this in the evening?",
        answer: "Due to its caffeine content (200mg per scoop), we don't recommend taking Energize Pre-Workout within 4-6 hours of bedtime as it may affect sleep quality."
      }
    ],
    featured: true,
    bestSeller: true,
    slug: "energize-pre-workout"
  },
  {
    id: "p003",
    title: "Thermogenic Fat Burner",
    price: 44.99,
    subscription_price: 40.49,
    images: [
      "/products/fatburner-1.jpg",
      "/products/fatburner-1-nutrition.jpg",
      "/products/fatburner-1-lifestyle.jpg"
    ],
    stock: 67,
    category: "weight-loss",
    tags: ["weight-loss", "fat-burner", "metabolism", "energy"],
    dietary: ["Gluten-Free", "Stimulant"],
    rating: 4.6,
    reviewCount: 59,
    description: "Our science-backed Thermogenic Fat Burner helps accelerate metabolism, reduce appetite, and increase energy levels for maximum fat loss results when combined with diet and exercise.",
    benefits: [
      "Boosts metabolic rate",
      "Reduces appetite and cravings",
      "Increases energy and focus",
      "Enhances thermogenesis",
      "Supports all-day fat burning"
    ],
    ingredients: "Green Tea Extract (500mg), L-Carnitine L-Tartrate (1000mg), Caffeine Anhydrous (200mg), Cayenne Pepper Extract (100mg), Grains of Paradise Extract (30mg), Black Pepper Extract (5mg), Gelatin Capsule.",
    directions: "Take 2 capsules with water in the morning. For enhanced results, take an additional 2 capsules 4-6 hours later. Do not exceed 4 capsules in a 24-hour period. Take with food if you experience stomach discomfort.",
    faqs: [
      {
        question: "How quickly will I see results?",
        answer: "When combined with proper diet and exercise, most users report noticeable increases in energy within days and visible fat loss results within 2-4 weeks of consistent use."
      },
      {
        question: "Should I cycle this product?",
        answer: "Yes, we recommend using the Thermogenic Fat Burner for 8 weeks followed by a 2-week break to maintain sensitivity to the ingredients and optimal results."
      },
      {
        question: "Can I take this with the Energize Pre-Workout?",
        answer: "We recommend spacing them apart due to the combined stimulant content. If you take the Fat Burner in the morning, use the Pre-Workout later in the day for your training session, or vice versa."
      }
    ],
    bestSeller: true,
    slug: "thermogenic-fat-burner"
  },
  {
    id: "p004",
    title: "Daily Multivitamin Plus",
    price: 29.99,
    subscription_price: 26.99,
    images: [
      "/products/multivitamin-1.jpg",
      "/products/multivitamin-1-nutrition.jpg"
    ],
    stock: 124,
    category: "daily-essentials",
    tags: ["vitamins", "minerals", "health", "wellness"],
    dietary: ["Gluten-Free", "Non-GMO"],
    rating: 4.7,
    reviewCount: 43,
    description: "Our comprehensive Daily Multivitamin Plus provides complete micronutrient support with enhanced bioavailability. Formulated specifically to meet the increased demands of active individuals.",
    benefits: [
      "Complete vitamin and mineral profile",
      "Enhanced immune support",
      "Improved energy production",
      "Advanced absorption technology",
      "Stress and recovery support"
    ],
    ingredients: "Vitamin A (as Beta-Carotene), Vitamins B1, B2, B3, B5, B6, B12, Vitamin C, Vitamin D3, Vitamin E, Vitamin K2, Folate (as 5-MTHF), Calcium, Magnesium, Zinc, Selenium, Copper, Manganese, Chromium, CoQ10, Ashwagandha Extract, Vegetable Capsule.",
    directions: "Take 2 capsules daily with a meal. For best results, take with breakfast or lunch.",
    faqs: [
      {
        question: "Can I take this with other supplements?",
        answer: "Yes, our Daily Multivitamin Plus is designed to complement the rest of your supplement regimen and fill in micronutrient gaps."
      },
      {
        question: "Why does this multivitamin have a higher price point?",
        answer: "Our formula uses premium forms of vitamins and minerals with superior bioavailability (like methylated B vitamins and chelated minerals), plus added adaptogens for stress support that aren't found in basic multivitamins."
      },
      {
        question: "Is this good for athletes?",
        answer: "Absolutely! The formula is specifically designed with active individuals in mind, with increased amounts of nutrients that support energy production, recovery, and immune function during periods of intense training."
      }
    ],
    featured: true,
    slug: "daily-multivitamin-plus"
  },
  {
    id: "p005",
    title: "Plant-Based Protein",
    price: 54.99,
    subscription_price: 49.49,
    images: [
      "/products/plant-protein-1.jpg",
      "/products/plant-protein-1-nutrition.jpg",
      "/products/plant-protein-1-lifestyle.jpg"
    ],
    stock: 38,
    category: "protein",
    tags: ["protein", "plant-based", "vegan", "dairy-free"],
    flavors: ["Chocolate", "Vanilla", "Peanut Butter"],
    dietary: ["Vegan", "Gluten-Free", "Dairy-Free", "Soy-Free", "Non-GMO"],
    rating: 4.5,
    reviewCount: 32,
    description: "Our premium Plant-Based Protein delivers 24g of complete protein from a blend of pea, rice, and hemp proteins. Smooth texture and delicious taste without the grittiness common in plant proteins.",
    benefits: [
      "24g protein per serving",
      "Complete amino acid profile",
      "Easy to digest",
      "Smooth, creamy texture",
      "Environmentally sustainable"
    ],
    ingredients: "Protein Blend (Pea Protein Isolate, Brown Rice Protein, Hemp Protein), Coconut MCT Oil, Natural Flavors, Cocoa Powder (in chocolate flavor), Stevia Leaf Extract, Sea Salt, Guar Gum, Xanthan Gum, Digestive Enzyme Blend.",
    directions: "Mix one scoop (35g) with 10-12 oz of water or your favorite plant-based milk. Shake thoroughly and enjoy. Consume 1-2 servings daily.",
    faqs: [
      {
        question: "How does this compare to whey protein?",
        answer: "Our Plant-Based Protein provides comparable muscle-building benefits to whey, with a complete amino acid profile. It's ideal for those who follow a plant-based diet or have dairy sensitivities."
      },
      {
        question: "Does this protein cause bloating?",
        answer: "We've formulated our plant protein with digestive enzymes specifically to minimize bloating issues that are common with other plant proteins. Most users report excellent digestibility."
      },
      {
        question: "Is this protein keto-friendly?",
        answer: "Yes, with only 2g of net carbs per serving, our Plant-Based Protein can fit into a ketogenic diet plan."
      }
    ],
    bestSeller: false,
    slug: "plant-based-protein"
  },
  {
    id: "p006",
    title: "Collagen Peptides",
    price: 34.99,
    subscription_price: 31.49,
    images: [
      "/products/collagen-1.jpg",
      "/products/collagen-1-nutrition.jpg"
    ],
    stock: 56,
    category: "daily-essentials",
    tags: ["collagen", "beauty", "joint-health", "hair-skin-nails"],
    flavors: ["Unflavored", "Vanilla", "Berry"],
    dietary: ["Gluten-Free", "Dairy-Free", "Keto"],
    rating: 4.8,
    reviewCount: 48,
    description: "Our premium Collagen Peptides provide 10g of hydrolyzed Types I & III collagen per serving to support healthy skin, hair, nails, joints, and gut. Sourced from grass-fed, pasture-raised bovine.",
    benefits: [
      "Improves skin elasticity",
      "Strengthens hair and nails",
      "Supports joint health and mobility",
      "Promotes gut health",
      "Easily dissolves in hot or cold liquids"
    ],
    ingredients: "Hydrolyzed Bovine Collagen Peptides (Types I & III), Natural Flavors (in flavored versions only), Stevia Leaf Extract (in flavored versions only).",
    directions: "Mix one scoop (11g) into your coffee, smoothie, or any hot or cold beverage. Unflavored version can also be added to soups, sauces, or baked goods.",
    faqs: [
      {
        question: "How long until I see results?",
        answer: "Most users report noticeable improvements in skin appearance and nail strength within 4-8 weeks of daily use. Joint benefits may take 6-12 weeks to become apparent."
      },
      {
        question: "Does collagen really work?",
        answer: "Yes, clinical studies have shown that daily collagen supplementation can improve skin elasticity, support joint comfort, and strengthen hair and nails when taken consistently."
      },
      {
        question: "Can I take this if I'm pregnant or nursing?",
        answer: "While collagen is generally considered safe, we always recommend consulting with your healthcare provider before starting any supplement during pregnancy or while breastfeeding."
      }
    ],
    featured: true,
    slug: "collagen-peptides"
  }
];
