
import { Link } from 'react-router-dom';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@/components/ui/navigation-menu';

const DesktopNav = () => {
  const categories = [
    { name: 'Protein', slug: 'protein' },
    { name: 'Pre-Workout', slug: 'pre-workout' },
    { name: 'Weight Loss', slug: 'weight-loss' },
    { name: 'Daily Essentials', slug: 'daily-essentials' }
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
              <div className="grid grid-cols-1 gap-2 p-4 w-[200px]">
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
          
          <NavigationMenuItem>
            <Link 
              to="/blog" 
              className="font-medium text-white hover:text-primary transition-colors duration-200 px-4 py-2 inline-block"
            >
              Blog
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
};

export default DesktopNav;
