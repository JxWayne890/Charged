import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage: string;
}
const HeroSection = ({
  title,
  subtitle,
  ctaText,
  ctaLink,
  backgroundImage
}: HeroSectionProps) => {
  return <div className="relative bg-black h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-cover bg-center opacity-70" style={{
      backgroundImage: `url(${backgroundImage})`
    }}></div>
      
      {/* Bolt overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="w-full h-full max-w-md max-h-md">
          <svg viewBox="0 0 24 24" fill="white" className="w-full h-full">
            
          </svg>
        </div>
      </div>
      
      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex flex-col justify-center items-start">
        <div className="max-w-lg">
          {/* Logo above the title */}
          <div className="mb-6 flex justify-center w-full">
            <img src="/lovable-uploads/2aa3e52f-35ac-42ea-ac84-51ff86ec9177.png" alt="Charged Up Nutrition" className="h-28 md:h-32 w-auto" />
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-white mb-4 drop-shadow-md">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-white mb-6 drop-shadow-sm">
            {subtitle}
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary-dark text-white btn-hover-effect">
            <Link to={ctaLink}>
              {ctaText}
            </Link>
          </Button>
        </div>
      </div>
    </div>;
};
export default HeroSection;