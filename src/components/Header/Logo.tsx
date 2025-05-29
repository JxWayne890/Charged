
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-3">
      <div className="relative">
        <img 
          src="/lovable-uploads/ace13b36-7daf-494c-aad3-9d2470d1b72b.png" 
          alt="Charged Up Nutrition" 
          className="h-16 w-auto md:h-20" // Reduced from h-24/h-28 to h-16/h-20
        />
      </div>
      <div className="relative">
        <img 
          src="/lovable-uploads/0c57aa3d-bade-44f5-a0d0-4f61d72397e5.png" 
          alt="Charged Up" 
          className="h-12 w-auto md:h-14" // Sized to complement the main logo
        />
      </div>
    </Link>
  );
};

export default Logo;
