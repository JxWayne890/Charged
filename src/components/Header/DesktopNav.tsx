
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
        title: 'New Arrivals',
        image: '/products/preworkout-1.jpg',
        href: '/new-arrivals',
        description: 'Check out our latest supplements'
      }
    ]
  },
  'Goals': {
    columns: [
      {
        title: 'Fitness Goals',
        items: [
          { label: 'Build Muscle', href: '/goals/build-muscle' },
          { label: 'Lose Weight', href: '/goals/lose-weight' },
          { label: 'Increase Energy', href: '/goals/increase-energy' },
          { label: 'Improve Recovery', href: '/goals/improve-recovery' },
          { label: 'Enhance Performance', href: '/goals/enhance-performance' },
        ]
      },
      {
        title: 'Health Goals',
        items: [
          { label: 'General Wellness', href: '/goals/wellness' },
          { label: 'Immune Support', href: '/goals/immune-support' },
          { label: 'Better Sleep', href: '/goals/sleep' },
          { label: 'Stress Management', href: '/goals/stress-management' },
          { label: 'Joint Health', href: '/goals/joint-health' },
        ]
      }
    ]
  },
  'Brands': {
    columns: [
      {
        title: 'Our Brands',
        items: [
          { label: 'Charged Up', href: '/brands/charged-up' },
          { label: 'Performance Lab', href: '/brands/performance-lab' },
          { label: 'Elite Nutrition', href: '/brands/elite-nutrition' },
          { label: 'Vital Proteins', href: '/brands/vital-proteins' },
          { label: 'OptiFit', href: '/brands/optifit' },
        ]
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
    <nav className="hidden lg:block">
      <ul className="flex items-center space-x-6">
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
                className="absolute left-0 top-full z-50 w-[800px] bg-white shadow-lg rounded-b-lg border border-gray-100 animate-fade-in"
                style={{ marginLeft: '-200px' }}
              >
                <div className="p-6 grid grid-cols-3 gap-8">
                  <div className="col-span-2 grid grid-cols-2 gap-8">
                    {megaMenuData[menuItem].columns.map((column, idx) => (
                      <div key={idx}>
                        <h3 className="font-oswald text-sm uppercase mb-3 tracking-wide text-black">{column.title}</h3>
                        <ul className="space-y-2">
                          {column.items.map((item) => (
                            <li key={item.label}>
                              <Link 
                                to={item.href} 
                                className="text-gray-600 hover:text-primary transition-colors duration-200"
                              >
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
                      <div className="space-y-4">
                        {megaMenuData[menuItem].featured?.map((item, i) => (
                          <Link to={item.href} key={i} className="block group">
                            <div className="aspect-video mb-2 overflow-hidden rounded bg-gray-100">
                              <div 
                                className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                                style={{ backgroundImage: `url(${item.image})` }}
                              ></div>
                            </div>
                            <h3 className="font-medium text-sm group-hover:text-primary transition-colors">
                              {item.title}
                            </h3>
                            {item.description && (
                              <p className="text-xs text-gray-500 mt-1">{item.description}</p>
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
            to="/bundles" 
            className="font-medium text-white hover:text-primary transition-colors duration-200"
          >
            Bundles
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
