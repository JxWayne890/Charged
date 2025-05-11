
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Home, Search, ShoppingCart, Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Logo from './Logo';

interface MenuItem {
  label: string;
  href: string;
  submenu?: { label: string; href: string }[];
}

const menuItems: MenuItem[] = [
  {
    label: 'Shop',
    href: '/shop',
    submenu: [
      { label: 'Protein', href: '/category/protein' },
      { label: 'Pre-Workout', href: '/category/pre-workout' },
      { label: 'Weight Loss', href: '/category/weight-loss' },
      { label: 'Daily Essentials', href: '/category/daily-essentials' },
    ],
  },
  {
    label: 'Goals',
    href: '/goals',
    submenu: [
      { label: 'Build Muscle', href: '/goals/build-muscle' },
      { label: 'Lose Weight', href: '/goals/lose-weight' },
      { label: 'Improve Performance', href: '/goals/improve-performance' },
      { label: 'General Health', href: '/goals/general-health' },
    ],
  },
  { label: 'Bundles', href: '/bundles' },
  { label: 'Blog', href: '/blog' },
];

const MobileNav = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const { cartCount } = useCart();
  const { setIsCartOpen } = useCart();

  const toggleSubMenu = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  return (
    <>
      <Sheet>
        <SheetTrigger className="lg:hidden p-2" aria-label="Menu">
          <Menu size={24} />
        </SheetTrigger>
        <SheetContent side="left" className="w-3/4 sm:max-w-md">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <Logo />
              <SheetTrigger className="p-2">
                <X size={24} />
              </SheetTrigger>
            </div>
            
            <nav className="flex-grow">
              <ul className="space-y-1">
                {menuItems.map((item) => (
                  <li key={item.label} className="border-b border-gray-200">
                    {item.submenu ? (
                      <div>
                        <button
                          onClick={() => toggleSubMenu(item.label)}
                          className="flex justify-between items-center w-full py-3 px-2 hover:bg-gray-100 rounded transition"
                        >
                          <span className="font-medium">{item.label}</span>
                          {expandedItems.includes(item.label) ? (
                            <ChevronDown size={18} />
                          ) : (
                            <ChevronRight size={18} />
                          )}
                        </button>
                        
                        {expandedItems.includes(item.label) && (
                          <ul className="pl-4 space-y-1 py-2 bg-gray-50">
                            {item.submenu.map((subItem) => (
                              <li key={subItem.label}>
                                <Link
                                  to={subItem.href}
                                  className="block py-2 px-3 hover:text-primary transition"
                                >
                                  {subItem.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ) : (
                      <Link
                        to={item.href}
                        className="block py-3 px-2 hover:bg-gray-100 rounded transition"
                      >
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            
            <div className="mt-auto pt-4 border-t border-gray-200">
              <div className="flex flex-col space-y-2">
                <Link to="/account" className="text-sm text-gray-600 hover:text-primary">
                  My Account
                </Link>
                <Link to="/track-order" className="text-sm text-gray-600 hover:text-primary">
                  Track Order
                </Link>
                <Link to="/contact" className="text-sm text-gray-600 hover:text-primary">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 lg:hidden">
        <div className="flex justify-around items-center h-16">
          <Link to="/" className="flex-1 flex flex-col items-center justify-center h-full">
            <Home size={22} />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link to="/search" className="flex-1 flex flex-col items-center justify-center h-full">
            <Search size={22} />
            <span className="text-xs mt-1">Search</span>
          </Link>
          <button 
            onClick={() => setIsCartOpen(true)} 
            className="flex-1 flex flex-col items-center justify-center h-full relative"
          >
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-[calc(50%-18px)] bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
            <span className="text-xs mt-1">Cart</span>
          </button>
          <Sheet>
            <SheetTrigger className="flex-1 flex flex-col items-center justify-center h-full">
              <Menu size={22} />
              <span className="text-xs mt-1">Menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-3/4 sm:max-w-md">
              {/* Same content as the left menu */}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
};

export default MobileNav;
