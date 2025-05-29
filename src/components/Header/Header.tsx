
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Logo from './Logo';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import SearchBar from './SearchBar';
import CartButton from './CartButton';
import UserMenu from './UserMenu';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);
  const location = useLocation();
  
  // Check if current page is a product or category page
  const isProductOrCategoryPage = location.pathname.includes('/product/') || 
                                 location.pathname.includes('/products');

  useEffect(() => {
    const handleScroll = () => {
      const announcementBarHeight = 44; // Height of announcement bar
      const scrollY = window.scrollY;
      
      if (scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      
      // Check if announcement bar is still visible
      if (scrollY > announcementBarHeight) {
        setIsAnnouncementVisible(false);
      } else {
        setIsAnnouncementVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check in case the page is loaded scrolled down
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 z-40 w-full transition-all duration-300 ${
        isProductOrCategoryPage 
          ? 'bg-black py-1 shadow-lg' // Always black on product/category pages
          : isScrolled 
            ? 'bg-black/90 backdrop-blur-sm py-1 shadow-lg' 
            : 'bg-transparent py-2'
      }`}
      style={{ top: isAnnouncementVisible ? '44px' : '0px' }} // Dynamic positioning based on announcement visibility
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between lg:justify-start">
          {/* Mobile/Tablet: Hamburger menu on left */}
          <div className="flex items-center lg:hidden">
            <MobileNav />
          </div>
          
          {/* Mobile/Tablet: Search in center */}
          <div className="flex-1 flex justify-center lg:hidden">
            <SearchBar />
          </div>
          
          {/* Mobile/Tablet: Logo on right, Desktop: Logo on left */}
          <div className="flex items-center lg:mr-8">
            <Logo />
          </div>
          
          {/* Desktop: Navigation in center */}
          <div className="hidden lg:flex flex-1 justify-center">
            <DesktopNav />
          </div>
          
          {/* Desktop: Search, User Menu, Cart on right */}
          <div className="hidden lg:flex items-center space-x-1">
            <SearchBar />
            <UserMenu />
            <CartButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
