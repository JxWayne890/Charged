
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  return (
    <div className="relative bg-black h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex flex-col justify-center">
        <div className="max-w-lg">
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

      {/* Background Image with Overlay - positioned to the right */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-70" 
        style={{
          backgroundImage: `url(${backgroundImage || '/lovable-uploads/2938ee41-0bf0-46aa-9344-11afa927721b.png'})`,
          backgroundPosition: isMobile ? 'right center' : 'right center',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>
    </div>
  );
};

export default HeroSection;
