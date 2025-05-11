
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center">
      <div className="relative">
        <img 
          src="/lovable-uploads/ace13b36-7daf-494c-aad3-9d2470d1b72b.png" 
          alt="Charged Up Nutrition" 
          className="h-24 w-auto md:h-28" // Increased size to make the logo more prominent
        />
      </div>
    </Link>
  );
};

export default Logo;
