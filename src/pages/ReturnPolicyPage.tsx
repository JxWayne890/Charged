
import { useEffect } from 'react';

const ReturnPolicyPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background pt-32">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Return Policy</h1>
        
        <div className="prose prose-lg max-w-none space-y-8">
          <p className="text-lg text-gray-700 leading-relaxed">
            At Charged Up Nutrition, your satisfaction is important to us. If you're not completely satisfied with your purchase, we're here to help.
          </p>

          <section className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <span className="text-green-500 mr-3">✅</span>
              Returns
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We accept returns on unopened and unused items within 30 days of the delivery date. Items must be in their original condition and packaging to qualify for a refund.
            </p>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <span className="text-yellow-500 mr-3">⚠️</span>
              Defective or Damaged Products
            </h2>
            <p className="text-gray-700 leading-relaxed">
              If your item arrives defective or damaged, please contact us within 7 days of delivery. We'll work quickly to resolve the issue by offering a replacement or full refund.
            </p>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <span className="text-blue-500 mr-3">🔁</span>
              Exchanges
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We currently do not offer exchanges. If you need a different item, please return the original item and place a new order.
            </p>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <span className="text-red-500 mr-3">❌</span>
              Non-Returnable Items
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Opened products, used items, or products marked as "Final Sale" are not eligible for return.
            </p>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <span className="text-green-600 mr-3">💵</span>
              Refunds
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Once your return is received and inspected, your refund will be processed within 5–7 business days. Refunds will be issued to the original payment method.
            </p>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <span className="text-purple-500 mr-3">📬</span>
              Return Shipping
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Customers are responsible for return shipping costs unless the product was received damaged or incorrect.
            </p>
          </section>

          <div className="border-t border-gray-200 pt-8 mt-12">
            <section className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4 text-center">Need Help?</h2>
              <p className="text-gray-700 leading-relaxed text-center">
                If you have any questions about your order or this policy, please contact us at{' '}
                <a 
                  href="mailto:chargedupnutrition24@gmail.com" 
                  className="text-primary hover:underline font-medium"
                >
                  chargedupnutrition24@gmail.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicyPage;
