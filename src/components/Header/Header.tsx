
import { useState, useEffect } from 'react';
import Logo from './Logo';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import SearchBar from './SearchBar';
import CartButton from './CartButton';
import { User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
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
        isScrolled ? 'bg-black/90 backdrop-blur-sm py-1 shadow-lg' : 'bg-transparent py-2'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <MobileNav />
          </div>
          
          <div className="flex items-center py-2">
            <Logo />
          </div>
          
          <div className="hidden lg:flex flex-1 justify-center">
            <DesktopNav />
          </div>
          
          <div className="flex items-center space-x-1">
            <SearchBar />
            <Link 
              to={user ? "/account" : "/auth"} 
              className="p-2 text-white hover:text-primary transition-colors duration-200"
            >
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
