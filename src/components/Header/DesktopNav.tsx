
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

interface MegaMenu {
  [key: string]: {
    columns: Array<{
      title: string;
      items: Array<{ label: string; href: string }>;
    }>;
    featured?: Array<{
      title: string;
      image: string;
      href: string;
      description?: string;
    }>;
  };
}

const megaMenuData: MegaMenu = {
  'Shop': {
    columns: [
      {
        title: 'Categories',
        items: [
          { label: 'Protein', href: '/category/protein' },
          { label: 'Pre-Workout', href: '/category/pre-workout' },
          { label: 'Weight Loss', href: '/category/weight-loss' },
          { label: 'Amino Acids', href: '/category/amino-acids' },
          { label: 'Wellness', href: '/category/wellness' },
          { label: 'Daily Essentials', href: '/category/daily-essentials' },
        ]
      },
      {
        title: 'Shop By Goal',
        items: [
          { label: 'Build Muscle', href: '/goals/build-muscle' },
          { label: 'Increase Energy', href: '/goals/increase-energy' },
          { label: 'Weight Management', href: '/goals/weight-management' },
          { label: 'Improve Recovery', href: '/goals/improve-recovery' },
          { label: 'Overall Wellness', href: '/goals/overall-wellness' },
        ]
      }
    ],
    featured: [
      {
        title: 'Best Sellers',
        image: '/products/protein-1.jpg',
        href: '/best-sellers',
        description: 'Our top-rated products loved by customers'
      },
      {
        title: 'All Products',
        image: '/products/preworkout-1.jpg',
        href: '/products',
        description: 'Browse our complete collection'
      }
    ]
  }
};

const DesktopNav = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const handleMouseEnter = (menu: string) => {
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  return (
    <nav className="hidden lg:flex w-full justify-center">
      <ul className="flex items-center justify-center space-x-6">
        {Object.keys(megaMenuData).map((menuItem) => (
          <li 
            key={menuItem} 
            className="relative" 
            onMouseEnter={() => handleMouseEnter(menuItem)}
            onMouseLeave={handleMouseLeave}
          >
            <Link 
              to={`/${menuItem.toLowerCase()}`} 
              className="flex items-center font-medium text-white hover:text-primary transition-colors duration-200"
            >
              {menuItem}
              <ChevronDown size={16} className="ml-1" />
            </Link>
            
            {activeMenu === menuItem && (
              <div 
                className="absolute left-1/2 top-full z-50 w-[1000px] max-h-[600px] overflow-y-auto bg-black/90 backdrop-blur-sm text-white shadow-xl rounded-b-lg border border-primary/20 animate-fade-in"
                style={{ transform: 'translateX(-50%)', maxWidth: 'calc(100vw - 40px)' }}
              >
                <div className="p-6 grid grid-cols-3 gap-8">
                  <div className="col-span-2 grid grid-cols-2 gap-8">
                    {megaMenuData[menuItem].columns.map((column, idx) => (
                      <div key={idx} className="space-y-4">
                        <h3 className="font-oswald text-base uppercase mb-3 tracking-wide text-primary border-b pb-2 border-gray-700">{column.title}</h3>
                        <ul className="space-y-3">
                          {column.items.map((item) => (
                            <li key={item.label}>
                              <Link 
                                to={item.href} 
                                className="text-gray-300 hover:text-primary transition-colors duration-200 flex items-center"
                              >
                                <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                                {item.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  
                  {megaMenuData[menuItem].featured && (
                    <div className="col-span-1">
                      <div className="space-y-6">
                        <h3 className="font-oswald text-base uppercase mb-3 tracking-wide text-primary border-b pb-2 border-gray-700">Featured</h3>
                        {megaMenuData[menuItem].featured?.map((item, i) => (
                          <Link to={item.href} key={i} className="block group">
                            <div className="aspect-video mb-3 overflow-hidden rounded-lg bg-gray-800 shadow-sm">
                              <div 
                                className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                                style={{ backgroundImage: `url(${item.image})` }}
                              ></div>
                            </div>
                            <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                              {item.title}
                            </h4>
                            {item.description && (
                              <p className="text-xs text-gray-400 mt-1">{item.description}</p>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </li>
        ))}
        <li>
          <Link 
            to="/products" 
            className="font-medium text-white hover:text-primary transition-colors duration-200"
          >
            All Products
          </Link>
        </li>
        <li>
          <Link 
            to="/blog" 
            className="font-medium text-white hover:text-primary transition-colors duration-200"
          >
            Blog
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default DesktopNav;
