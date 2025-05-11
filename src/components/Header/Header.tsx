
import { useState, useEffect } from 'react';
import Logo from './Logo';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import SearchBar from './SearchBar';
import CartButton from './CartButton';
import { User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled ? 'bg-black/90 backdrop-blur-sm shadow-sm py-1' : 'bg-black/80 backdrop-blur-sm py-2'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center lg:hidden">
            <MobileNav />
          </div>
          
          <div className="flex items-center py-2">
            <Logo />
          </div>
          
          <div className="hidden lg:block mx-4 flex-1">
            <DesktopNav />
          </div>
          
          <div className="flex items-center space-x-1">
            <SearchBar />
            <Link to="/account" className="p-2 text-white hover:text-primary transition-colors duration-200">
              <User size={20} />
            </Link>
            <CartButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
