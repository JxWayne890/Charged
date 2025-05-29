
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-0.5">
      <div className="relative">
        <img 
          src="/lovable-uploads/3ec23b6d-7f03-45ae-86d8-a4918d2089c4.png" 
          alt="Charged Up Nutrition" 
          className="h-16 w-auto md:h-20" 
        />
      </div>
      <div className="relative">
        <img 
          src="/lovable-uploads/ecfb1702-0578-4017-9590-96b76d9e9ec2.png" 
          alt="Charged Up" 
          className="h-8 w-auto md:h-14" 
        />
      </div>
    </Link>
  );
};

export default Logo;
