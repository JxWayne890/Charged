import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Link } from "react-router-dom";

const DesktopNav = () => {
  return (
    <NavigationMenu className="hidden lg:block">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-white hover:text-primary">Shop</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    to="/category/protein"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">Protein</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Fuel your muscles with our premium protein supplements.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    to="/category/pre-workout"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">Pre-Workout</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Elevate your energy and focus for peak performance.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    to="/category/weight-loss"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">Weight Loss</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Support your weight management goals with our effective supplements.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    to="/category/amino-acids"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">Amino Acids</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Enhance recovery and muscle growth with essential amino acids.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    to="/category/wellness"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">Wellness</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Support your overall health and well-being with our wellness products.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    to="/category/daily-essentials"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">Daily Essentials</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Everything you need for your daily health.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    to="/all-products"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">All Products</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      View our complete catalog
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    to="/square-products"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">Products by Category</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Browse products organized by Square categories
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link to="/blog" className="text-white hover:text-primary">
              Blog
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default DesktopNav;
