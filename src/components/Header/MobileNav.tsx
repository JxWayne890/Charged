
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
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
      { label: 'Amino Acids', href: '/category/amino-acids' },
      { label: 'Wellness', href: '/category/wellness' },
      { label: 'Daily Essentials', href: '/category/daily-essentials' },
    ],
  },
  { label: 'All Products', href: '/products' },
  { label: 'Blog', href: '/blog' },
];

const MobileNav = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const { cartCount } = useCart();

  const toggleSubMenu = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  return (
    <Sheet>
      <SheetTrigger className="lg:hidden p-2 text-white">
        <Menu size={24} />
      </SheetTrigger>
      <SheetContent side="right" className="w-3/4 sm:max-w-md bg-black/90 backdrop-blur-sm border-gray-800 text-white p-0">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b border-gray-800">
            <Logo />
            <SheetTrigger className="p-2 text-white hover:text-primary transition-colors">
              <X size={24} />
            </SheetTrigger>
          </div>
          
          <nav className="flex-grow overflow-y-auto p-4">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.label} className="border-b border-gray-800/50">
                  {item.submenu ? (
                    <div>
                      <button
                        onClick={() => toggleSubMenu(item.label)}
                        className="flex justify-between items-center w-full py-3 px-2 hover:bg-gray-800/50 rounded transition"
                      >
                        <span className="font-medium text-white">{item.label}</span>
                        {expandedItems.includes(item.label) ? (
                          <ChevronDown size={18} className="text-primary" />
                        ) : (
                          <ChevronRight size={18} className="text-primary" />
                        )}
                      </button>
                      
                      {expandedItems.includes(item.label) && (
                        <ul className="pl-4 space-y-1 py-2 bg-gray-900/50 rounded-md my-1">
                          {item.submenu.map((subItem) => (
                            <li key={subItem.label}>
                              <Link
                                to={subItem.href}
                                className="block py-2 px-3 hover:text-primary transition rounded-md hover:bg-black/30"
                              >
                                <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 inline-block"></span>
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
                      className="block py-3 px-2 hover:bg-gray-800/50 rounded transition"
                    >
                      <span className="font-medium text-white">{item.label}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="mt-auto p-4 border-t border-gray-800 bg-black/50">
            <div className="flex flex-col space-y-3">
              <Link to="/account" className="text-sm text-gray-300 hover:text-primary transition-colors flex items-center">
                <span className="w-1 h-1 bg-primary rounded-full mr-2"></span>
                My Account
              </Link>
              <Link to="/track-order" className="text-sm text-gray-300 hover:text-primary transition-colors flex items-center">
                <span className="w-1 h-1 bg-primary rounded-full mr-2"></span>
                Track Order
              </Link>
              <Link to="/contact" className="text-sm text-gray-300 hover:text-primary transition-colors flex items-center">
                <span className="w-1 h-1 bg-primary rounded-full mr-2"></span>
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
