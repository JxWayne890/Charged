import { Link } from 'react-router-dom';
const Logo = () => {
  return <Link to="/" className="flex items-center space-x-3">
      <div className="relative">
        <img src="/lovable-uploads/ace13b36-7daf-494c-aad3-9d2470d1b72b.png" alt="Charged Up Nutrition" className="h-16 w-auto md:h-20" // Reduced from h-24/h-28 to h-16/h-20
      />
      </div>
      <div className="relative">
        <img src="/lovable-uploads/ecfb1702-0578-4017-9590-96b76d9e9ec2.png" alt="Charged Up" className="h-8 w-auto md:h-14" />
      </div>
    </Link>;
};
export default Logo;