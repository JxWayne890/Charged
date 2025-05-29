
import { Link } from 'react-router-dom';

const Footer = () => {
  return <footer className="bg-gray-100 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Newsletter Signup */}
          <div className="lg:col-span-1">
            <h3 className="text-lg mb-4">JOIN OUR NEWSLETTER</h3>
            <p className="text-gray-600 mb-4">Get 10% off your first order and stay updated on new products and promotions.</p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input type="email" placeholder="Your email" className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" required />
              <button type="submit" className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition duration-200 btn-hover-effect">
                Subscribe
              </button>
            </form>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg mb-4">SHOP</h3>
            <ul className="space-y-2">
              <li><Link to="/category/protein" className="text-gray-600 hover:text-primary transition">Protein</Link></li>
              <li><Link to="/category/pre-workout" className="text-gray-600 hover:text-primary transition">Pre-Workout</Link></li>
              <li><Link to="/category/weight-loss" className="text-gray-600 hover:text-primary transition">Weight Loss</Link></li>
              <li><Link to="/category/daily-essentials" className="text-gray-600 hover:text-primary transition">Daily Essentials</Link></li>
              <li><Link to="/bundles" className="text-gray-600 hover:text-primary transition">Bundles</Link></li>
            </ul>
          </div>
          
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
              <img src="/lovable-uploads/bc24b7f2-3784-4277-be96-81767ce6d068.png" alt="Charged Up Nutrition" className="h-8 w-auto mr-2" />
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
              <img src="/lovable-uploads/a5d368da-6387-4918-b630-c85ee9d30d07.png" alt="The Provider's System" className="h-12 w-auto" />
            </div>
          </div>
        </div>
      </div>
    </footer>;
};

export default Footer;
