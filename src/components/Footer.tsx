
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

        {/* Social Media Section */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8 pb-6 border-b border-gray-200">
          {/* Snapchat (non-clickable) */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.219-.359-.219c-.78-.78-.78-2.047 0-2.827.359-.359.938-.359 1.297 0 .359.359.359.938 0 1.297-.219.219-.219.578 0 .797.219.219.578.219.797 0l2.968-2.968c.219-.219.219-.578 0-.797-.219-.219-.578-.219-.797 0-.359.359-.938.359-1.297 0-.78-.78-.78-2.047 0-2.827.359-.359.938-.359 1.297 0s.359.938 0 1.297c-.219.219-.219.578 0 .797.219.219.578.219.797 0l2.968-2.968c.219-.219.219-.578 0-.797-.219-.219-.578-.219-.797 0-.359.359-.938.359-1.297 0-.78-.78-.78-2.047 0-2.827.359-.359.938-.359 1.297 0s.359.938 0 1.297c-.219.219-.219.578 0 .797.219.219.578.219.797 0 .578-.578.578-1.516 0-2.094-.578-.578-1.516-.578-2.094 0-.578.578-.578 1.516 0 2.094.219.219.219.578 0 .797-.219.219-.578.219-.797 0-1.156-1.156-3.031-1.156-4.187 0-1.156 1.156-1.156 3.031 0 4.187.219.219.578.219.797 0 .219-.219.219-.578 0-.797-.578-.578-.578-1.516 0-2.094.578-.578 1.516-.578 2.094 0 .578.578.578 1.516 0 2.094-.219.219-.219.578 0 .797.219.219.578.219.797 0l2.968-2.968c.219-.219.219-.578 0-.797-.219-.219-.578-.219-.797 0-.359.359-.938.359-1.297 0-.78-.78-.78-2.047 0-2.827.359-.359.938-.359 1.297 0s.359.938 0 1.297c-.219.219-.219.578 0 .797.219.219.578.219.797 0l2.968-2.968c.219-.219.219-.578 0-.797-.219-.219-.578-.219-.797 0-.359.359-.938.359-1.297 0-.78-.78-.78-2.047 0-2.827.359-.359.938-.359 1.297 0s.359.938 0 1.297c-.219.219-.219.578 0 .797.219.219.578.219.797 0 .578-.578.578-1.516 0-2.094-.578-.578-1.516-.578-2.094 0-.578.578-.578 1.516 0 2.094.219.219.219.578 0 .797-.219.219-.578.219-.797 0-1.156-1.156-3.031-1.156-4.187 0-1.156 1.156-1.156 3.031 0 4.187.219.219.578.219.797 0 .219-.219.219-.578 0-.797-.578-.578-.578-1.516 0-2.094.578-.578 1.516-.578 2.094 0 .578.578.578 1.516 0 2.094-.219.219-.219.578 0 .797.219.219.578.219.797 0z"/>
              </svg>
            </div>
            <span className="text-gray-700 font-medium">ChargedUp325</span>
          </div>

          {/* Instagram (clickable) */}
          <a 
            href="https://www.instagram.com/chargedupnutrition325?igsh=ZDlpM3lhY2dlcGhm" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-8 h-8 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-200"
          >
            <Instagram className="w-5 h-5 text-white" />
          </a>
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
