
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center">
      <div className="relative">
        <img 
          src="/lovable-uploads/181e941c-228a-4955-bfd0-67d6cad65f94.png" 
          alt="Charged Up Nutrition" 
          className="h-16 w-auto md:h-20" // Increased from h-12 to h-16 on mobile and h-20 on medium screens and up
        />
      </div>
    </Link>
  );
};

export default Logo;
