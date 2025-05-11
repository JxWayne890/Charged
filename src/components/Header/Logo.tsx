
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center">
      <div className="relative">
        <img 
          src="/lovable-uploads/bc24b7f2-3784-4277-be96-81767ce6d068.png" 
          alt="Charged Up Nutrition" 
          className="h-12 w-auto"
        />
      </div>
    </Link>
  );
};

export default Logo;
