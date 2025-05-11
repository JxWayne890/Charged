
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
  return (
    <div className="relative bg-black h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-70"
        style={{ backgroundImage: `url(public/lovable-uploads/27dac938-26b9-4202-8a44-8954f41f8604.png)` }}
      ></div>
      
      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex flex-col justify-center items-start">
        <div className="max-w-lg">
          {/* Logo above the title */}
          <div className="mb-6 flex justify-center w-full">
            <img 
              src="/lovable-uploads/2aa3e52f-35ac-42ea-ac84-51ff86ec9177.png" 
              alt="Charged Up Nutrition" 
              className="h-28 md:h-32 w-auto"
            />
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-white mb-4 drop-shadow-md">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-white mb-6 drop-shadow-sm">
            {subtitle}
          </p>
          <Button 
            asChild
            size="lg" 
            className="bg-primary hover:bg-primary-dark text-white btn-hover-effect"
          >
            <Link to={ctaLink}>
              {ctaText}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
