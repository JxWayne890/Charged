
import { Shield, Truck, CreditCard, Award } from 'lucide-react';

const ValueStrip = () => {
  return (
    <div className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
              <Award size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Authorized Brands</h3>
              <p className="text-sm text-gray-600">100% authentic products</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
              <Truck size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="font-medium">30-Day Money-Back</h3>
              <p className="text-sm text-gray-600">Hassle-free returns</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
              <CreditCard size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Secure Checkout</h3>
              <p className="text-sm text-gray-600">SSL encrypted payment</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
              <Shield size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Earn Rewards</h3>
              <p className="text-sm text-gray-600">On every purchase</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValueStrip;
