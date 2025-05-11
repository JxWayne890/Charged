
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center">
      <div className="relative">
        <img 
          src="/lovable-uploads/c491ed4d-1b3a-4132-8051-e5bf2757ce56.png" 
          alt="Charged Up Nutrition" 
          className="h-20 w-auto md:h-24" // Increased from h-16 to h-20 on mobile and h-24 on medium screens and up
        />
      </div>
    </Link>
  );
};

export default Logo;
