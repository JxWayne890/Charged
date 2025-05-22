
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchSquareProducts } from '@/lib/square';
import { Product } from '@/types';

type ProductLink = {
  name: string;
  image: string;
  link: string;
};

interface QuickCategoryLinksProps {
  links?: ProductLink[];
  useCustomLinks?: boolean;
}

const QuickCategoryLinks = ({ links, useCustomLinks = false }: QuickCategoryLinksProps) => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  
  // Fetch featured products
  useEffect(() => {
    const loadFeaturedProducts = async () => {
      const allProducts = await fetchSquareProducts();
      if (allProducts && allProducts.length > 0) {
        // Filter for featured or best selling products, limit to 4
        const featured = allProducts
          .filter(product => product.featured || product.bestSeller)
          .slice(0, 4);
        setFeaturedProducts(featured);
      }
    };
    
    if (!useCustomLinks) {
      loadFeaturedProducts();
    }
  }, [useCustomLinks]);

  // Updated default category links based on the provided list
  const defaultLinks: ProductLink[] = [
    {
      name: 'Protein',
      image: '/lovable-uploads/2aa3e52f-35ac-42ea-ac84-51ff86ec9177.png',
      link: '/products?category=protein'
    },
    {
      name: 'Pre-Workout',
      image: '/lovable-uploads/c491ed4d-1b3a-4132-8051-e5bf2757ce56.png',
      link: '/products?category=pre-workout'
    },
    {
      name: 'Fat Burners',
      image: '/lovable-uploads/bc24b7f2-3784-4277-be96-81767ce6d068.png',
      link: '/products?category=fat-burners'
    },
    {
      name: 'Creatine',
      image: '/lovable-uploads/ace13b36-7daf-494c-aad3-9d2470d1b72b.png',
      link: '/products?category=creatine'
    }
  ];
  
  // Map featured products to link format
  const featuredProductLinks: ProductLink[] = featuredProducts
    .map(product => ({
      name: product.title,
      image: product.images[0] || '/placeholder.svg',
      link: `/product/${product.slug}`
    }));

  // Use provided links or featured products or default ones
  const displayLinks = useCustomLinks ? links : 
    (featuredProducts.length > 0 ? featuredProductLinks : defaultLinks);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {displayLinks?.map((item) => (
        <Link 
          key={item.name} 
          to={item.link}
          className="group relative overflow-hidden rounded-lg shadow-md aspect-square"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            style={{ backgroundImage: `url(${item.image})` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
            <span className="text-white font-oswald text-xl tracking-wide group-hover:text-primary transition-colors duration-300">
              {item.name}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default QuickCategoryLinks;
