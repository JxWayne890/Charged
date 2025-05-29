
import { Link } from 'react-router-dom';

const Footer = () => {
  return <footer className="bg-gray-100 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Support */}
          <div>
            <h3 className="text-lg mb-4">SUPPORT</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-gray-600 hover:text-primary transition">Contact Us</Link></li>
              <li><Link to="/track-order" className="text-gray-600 hover:text-primary transition">Track Your Order</Link></li>
            </ul>
          </div>
          
          {/* About */}
          <div>
            <h3 className="text-lg mb-4">ABOUT US</h3>
            <ul className="space-y-2">
              <li><Link to="/reviews" className="text-gray-600 hover:text-primary transition">Reviews</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-primary transition">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-primary transition">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom section - single row layout */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between">
            {/* Copyright - Bottom Left */}
            <div className="flex items-center">
              <img src="/lovable-uploads/ace13b36-7daf-494c-aad3-9d2470d1b72b.png" alt="Charged Up Nutrition" className="h-8 w-auto mr-2" />
              <p className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Charged Up Nutrition. All rights reserved.
              </p>
            </div>
            
            {/* Square Secure Payment - Bottom Center */}
            <div className="flex justify-center">
              <img src="/lovable-uploads/9fab4b0f-d777-4179-a555-5e1f9f2df719.png" alt="Square Secure Payment Options" className="h-16 w-auto" />
            </div>
            
            {/* Provider's System Attribution - Bottom Right */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">This Webpage Created By:</span>
              <a href="https://providersystems.netlify.app/" target="_blank" rel="noopener noreferrer">
                <img src="/lovable-uploads/a5d368da-6387-4918-b630-c85ee9d30d07.png" alt="The Provider's System" className="h-12 w-auto" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};

export default Footer;
