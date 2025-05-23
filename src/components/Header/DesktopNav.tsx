
import { Link } from 'react-router-dom';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@/components/ui/navigation-menu';

const DesktopNav = () => {
  // Updated categories based on the exact provided list
  const categories = [
    { name: 'Aminos', slug: 'aminos' },
    { name: 'Anti-Aging Supplement', slug: 'anti-aging-supplement' },
    { name: 'BCAA', slug: 'bcaa' },
    { name: 'Creatine', slug: 'creatine' },
    { name: 'Dry Spell', slug: 'dry-spell' },
    { name: 'Fat Burners', slug: 'fat-burners' },
    { name: 'Multivitamin', slug: 'multivitamin' },
    { name: 'Pre-Workout', slug: 'pre-workout' },
    { name: 'Protein', slug: 'protein' },
    { name: 'Pump Supplement', slug: 'pump-supplement' },
    { name: 'Testosterone', slug: 'testosterone' },
    { name: 'Vitamins', slug: 'vitamins' }
  ];
  
  return (
    <nav className="hidden lg:flex w-full justify-center">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-white hover:text-primary transition-colors duration-200">
              Categories
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid grid-cols-2 gap-2 p-4 w-[400px]">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    to={`/products?category=${category.slug}`}
                    className="block p-2 hover:bg-primary/10 rounded-md text-white hover:text-primary transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <Link 
              to="/products" 
              className="font-medium text-white hover:text-primary transition-colors duration-200 px-4 py-2 inline-block"
            >
              All Products
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
};

export default DesktopNav;
