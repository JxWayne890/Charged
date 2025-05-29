
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center">
      <div className="relative flex items-center space-x-2">
        <img 
          src="/lovable-uploads/ace13b36-7daf-494c-aad3-9d2470d1b72b.png" 
          alt="Charged Up Nutrition" 
          className="h-16 w-auto md:h-20" // Reduced from h-24/h-28 to h-16/h-20
        />
        <div className="text-primary font-oswald font-bold text-2xl md:text-3xl tracking-wider">
          CHARGED UP
        </div>
      </div>
    </Link>
  );
};

export default Logo;
