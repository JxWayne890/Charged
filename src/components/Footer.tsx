
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Newsletter Signup */}
          <div className="lg:col-span-1">
            <h3 className="text-lg mb-4">JOIN OUR NEWSLETTER</h3>
            <p className="text-gray-600 mb-4">Get 10% off your first order and stay updated on new products and promotions.</p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Your email" 
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" 
                required 
              />
              <button 
                type="submit" 
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition duration-200 btn-hover-effect"
              >
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
              <li><Link to="/shipping-policy" className="text-gray-600 hover:text-primary transition">Shipping Policy</Link></li>
              <li><Link to="/returns" className="text-gray-600 hover:text-primary transition">Returns & Refunds</Link></li>
              <li><Link to="/faq" className="text-gray-600 hover:text-primary transition">FAQ</Link></li>
              <li><Link to="/track-order" className="text-gray-600 hover:text-primary transition">Track Your Order</Link></li>
            </ul>
          </div>
          
          {/* About */}
          <div>
            <h3 className="text-lg mb-4">ABOUT US</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-primary transition">Our Story</Link></li>
              <li><Link to="/blog" className="text-gray-600 hover:text-primary transition">Blog</Link></li>
              <li><Link to="/reviews" className="text-gray-600 hover:text-primary transition">Reviews</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-primary transition">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-primary transition">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Trust badges */}
        <div className="border-t border-gray-200 pt-8 pb-6">
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <div className="flex flex-col items-center">
              <img src="/icons/secure-payment.svg" alt="Secure Payment" className="h-8 w-auto mb-2" />
              <span className="text-sm text-gray-500">Secure Payment</span>
            </div>
            <div className="flex flex-col items-center">
              <img src="/icons/square.svg" alt="Square" className="h-8 w-auto mb-2" />
              <span className="text-sm text-gray-500">Square</span>
            </div>
            <div className="flex flex-col items-center">
              <img src="/icons/paypal.svg" alt="PayPal" className="h-8 w-auto mb-2" />
              <span className="text-sm text-gray-500">PayPal</span>
            </div>
            <div className="flex flex-col items-center">
              <img src="/icons/afterpay.svg" alt="Afterpay" className="h-8 w-auto mb-2" />
              <span className="text-sm text-gray-500">Afterpay</span>
            </div>
            <div className="flex flex-col items-center">
              <img src="/icons/gmp.svg" alt="GMP Certified" className="h-8 w-auto mb-2" />
              <span className="text-sm text-gray-500">GMP Certified</span>
            </div>
          </div>
        </div>
        
        {/* Bottom section with branding, copyright, Provider's System attribution, and social links */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col items-center space-y-6">
            {/* Provider's System Attribution */}
            <div className="flex justify-center">
              <a 
                href="https://providersystems.netlify.app/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                <span className="text-sm mr-2">This site created by</span>
                <img 
                  src="/lovable-uploads/db180b3c-808f-4386-b782-74e5cd612929.png" 
                  alt="The Provider's System" 
                  className="h-12 w-auto object-contain" 
                />
              </a>
            </div>
            
            {/* Copyright and Social Links */}
            <div className="flex flex-col md:flex-row justify-between items-center w-full">
              <div className="flex items-center mb-4 md:mb-0">
                <img 
                  src="/lovable-uploads/bc24b7f2-3784-4277-be96-81767ce6d068.png" 
                  alt="Charged Up Nutrition" 
                  className="h-8 w-auto mr-2" 
                />
                <p className="text-sm text-gray-500">
                  &copy; {new Date().getFullYear()} Charged Up Nutrition. All rights reserved.
                </p>
              </div>
              <div className="flex space-x-4">
                <a 
                  href="https://facebook.com/chargedup" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-500 hover:text-primary transition"
                >
                  <Facebook size={20} />
                </a>
                <a 
                  href="https://instagram.com/chargedup" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-500 hover:text-primary transition"
                >
                  <Instagram size={20} />
                </a>
                <a 
                  href="https://twitter.com/chargedup" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-500 hover:text-primary transition"
                >
                  <Twitter size={20} />
                </a>
                <a 
                  href="https://youtube.com/chargedup" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-500 hover:text-primary transition"
                >
                  <Youtube size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
