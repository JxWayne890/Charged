
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const BundlePromo = () => {
  return (
    <div className="bg-gradient-to-r from-black to-gray-900 rounded-lg overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="py-12 md:py-16 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
              Save 15%
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Build Your Own Bundle
            </h2>
            <p className="text-gray-300 mb-6">
              Create your perfect stack by choosing any three products for automatic 15% savings. Mix and match to meet your fitness goals.
            </p>
            <Button 
              asChild
              size="lg" 
              className="bg-primary hover:bg-primary-dark text-white btn-hover-effect"
            >
              <Link to="/bundles">
                Create Your Bundle
              </Link>
            </Button>
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <div className="flex space-x-4">
                {/* First product */}
                <div className="relative w-20 h-28 md:w-32 md:h-44 rounded-lg overflow-hidden shadow-lg transform rotate-[-6deg]">
                  <img 
                    src="/products/protein-1.jpg" 
                    alt="Performance Whey Protein" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Second product */}
                <div className="relative w-20 h-28 md:w-32 md:h-44 rounded-lg overflow-hidden shadow-lg z-10">
                  <img 
                    src="/products/preworkout-1.jpg" 
                    alt="Energize Pre-Workout" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 border-2 border-primary rounded-lg"></div>
                </div>
                
                {/* Third product */}
                <div className="relative w-20 h-28 md:w-32 md:h-44 rounded-lg overflow-hidden shadow-lg transform rotate-[6deg]">
                  <img 
                    src="/products/multivitamin-1.jpg" 
                    alt="Daily Multivitamin Plus" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Plus signs */}
              <div className="absolute top-1/2 left-[18%] transform -translate-y-1/2 bg-primary/80 rounded-full w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-white font-bold">+</div>
              <div className="absolute top-1/2 right-[18%] transform -translate-y-1/2 bg-primary/80 rounded-full w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-white font-bold">+</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BundlePromo;
