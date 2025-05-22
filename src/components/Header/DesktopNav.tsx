
import { Link } from 'react-router-dom';

const DesktopNav = () => {
  return (
    <nav className="hidden lg:flex w-full justify-center">
      <ul className="flex items-center justify-center space-x-6">
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
