export interface Product {
  id: string;
  title: string;
  price: number;
  salePrice?: number;
  subscription_price?: number;
  images: string[];
  stock: number;
  category: string;
  tags: string[];
  flavors?: string[];
  dietary?: string[];
  rating: number;
  reviewCount: number;
  description: string;
  benefits: string[];
  ingredients: string;
  directions: string;
  faqs: FAQ[];
  featured?: boolean;
  bestSeller?: boolean;
  slug: string;
  brand?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  flavor?: string;
  subscription?: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userImage?: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  verified: boolean;
  helpfulCount: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  authorImage: string;
  date: string;
  categories: string[];
  readTime: number;
}
