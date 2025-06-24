
import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';
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
              <li><Link to="/returns" className="text-gray-600 hover:text-primary transition">Return Policy</Link></li>
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

        {/* Social Media Section - Improved */}
        <div className="mb-8 pb-6 border-b border-gray-200">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-6 text-gray-800">FOLLOW US</h3>
            <div className="flex justify-center items-center gap-8">
              {/* Snapchat */}
              <div className="flex flex-col items-center group">
                <div className="flex items-center justify-center w-16 h-16 bg-gray-50 rounded-xl border border-gray-200 mb-2 group-hover:bg-gray-100 transition-colors overflow-hidden">
                  <img src="/lovable-uploads/01eec198-c74e-4a42-928d-4cf3f181ccc3.png" alt="Snapchat" className="w-full h-full object-cover" />
                </div>
                <span className="text-sm font-medium text-gray-700">ChargedUp325</span>
              </div>

              {/* Instagram */}
              <div className="flex flex-col items-center group">
                <a href="https://www.instagram.com/chargedupnutrition325?igsh=ZDlpM3lhY2dlcGhm" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-xl mb-2 hover:scale-110 transition-transform duration-200 shadow-md">
                  <Instagram className="w-8 h-8 text-white" />
                </a>
                <span className="text-sm font-medium text-gray-700">@chargedupnutrition325</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom section - Improved organization */}
        <div className="border-t border-gray-200 pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* Copyright - Left */}
            <div className="flex items-center justify-center lg:justify-start">
              <img src="/lovable-uploads/ace13b36-7daf-494c-aad3-9d2470d1b72b.png" alt="Charged Up Nutrition" className="h-20 w-auto mr-2" />
              <div className="text-center lg:text-left">
                <p className="text-sm text-gray-500">
                  &copy; {new Date().getFullYear()} Charged Up Nutrition.
                </p>
                <p className="text-sm text-gray-500">All rights reserved.</p>
              </div>
            </div>
            
            {/* Square Secure Payment - Center */}
            <div className="flex justify-center">
              <div className="text-center">
                <p className="text-gray-600 mb-2 text-sm">Secure Payment Options</p>
                <img src="/lovable-uploads/9fab4b0f-d777-4179-a555-5e1f9f2df719.png" alt="Square Secure Payment Options" className="h-28 w-auto mx-auto" />
              </div>
            </div>
            
            {/* Provider's System Attribution - Right */}
            <div className="flex items-center justify-center lg:justify-end">
              <div className="text-center lg:text-right">
                <p className="text-gray-600 mb-1 text-sm">This Website Created By:</p>
                <a href="https://providersystems.netlify.app/" target="_blank" rel="noopener noreferrer">
                  <img src="/lovable-uploads/a5d368da-6387-4918-b630-c85ee9d30d07.png" alt="The Provider's System" className="h-28 w-auto mx-auto lg:mx-0" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;
