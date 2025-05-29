
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back button */}
        <Link 
          to="/" 
          className="inline-flex items-center text-primary hover:text-primary-dark mb-6 transition-colors"
        >
          <ChevronLeft size={20} className="mr-1" />
          Back to Home
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service – Expanded Version</h1>
          <p className="text-gray-600 mb-8">Effective Date: May 28, 2025</p>
          
          <div className="prose prose-lg max-w-none">
            <div className="border-b border-gray-200 mb-8"></div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="mb-6">
              By visiting Charged Up Nutrition ("Charged Up," "we," "our," or "us") or by purchasing, accessing, or using any of our products, services, mobile or web applications, content, or features (collectively, the "Services"), you ("you" or "User") acknowledge that you have read, understood, and agree to be legally bound by these Terms of Service ("Terms") and any additional policies referenced herein—including our Privacy Policy and any product-specific policies or supplemental terms that accompany the Services.
            </p>
            <p className="mb-6">
              If you do not agree to these Terms, you must discontinue use of the Services immediately. Continued use after any modifications constitutes acceptance of the revised Terms.
            </p>

            <div className="border-b border-gray-200 mb-8"></div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Eligibility</h2>
            <ol className="list-decimal list-inside mb-6 space-y-2">
              <li><strong>Minimum Age.</strong> You must be 18 years of age (or the legal age of majority in your jurisdiction) and capable of forming a binding contract to use or purchase from the Services.</li>
              <li><strong>Corporate Use.</strong> If you use the Services on behalf of a company or other legal entity, you represent that you have authority to bind that entity to these Terms, and "you" will refer to that entity.</li>
              <li><strong>Prohibited Persons.</strong> You may not use the Services if you are a resident of, or will ship products to, any jurisdiction embargoed by the United States, or if you are otherwise prohibited from receiving U.S. goods and services.</li>
            </ol>

            <div className="border-b border-gray-200 mb-8"></div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Account Registration & Security</h2>
            <ol className="list-decimal list-inside mb-6 space-y-2">
              <li><strong>Accurate Information.</strong> All registration details you provide (name, email, address, payment data, etc.) must be truthful, complete, and kept up to date.</li>
              <li><strong>Credential Security.</strong> You are solely responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.</li>
              <li><strong>Notification Duty.</strong> You must promptly notify us at support@chargedupnutrition.com of any suspected unauthorized access or breach of security.</li>
              <li><strong>One Account Rule.</strong> You may not sell, transfer, or share your account with another person. We reserve the right to refuse, suspend, or terminate accounts that violate these Terms.</li>
            </ol>

            <div className="border-b border-gray-200 mb-8"></div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Orders, Pricing, & Payment</h2>
            <ol className="list-decimal list-inside mb-6 space-y-2">
              <li><strong>Offer & Acceptance.</strong> Your placement of an order constitutes an offer to purchase. All orders are subject to our acceptance, and we may refuse or limit quantities in our sole discretion.</li>
              <li><strong>Pricing Errors.</strong> Despite our best efforts, an item may be mispriced. If the correct price is higher than the listed price, we will, at our discretion, contact you for instructions or cancel the order and notify you.</li>
              <li><strong>Payment Methods.</strong> We accept Visa, MasterCard, American Express, Discover, Apple Pay, Google Pay, and any other method listed at checkout. By providing payment information, you (a) represent that you are authorized to use the chosen method and (b) authorize us (or our third-party processor) to charge your method for the total order amount, including applicable taxes and shipping.</li>
              <li><strong>Sales Tax.</strong> Applicable state and local taxes will be calculated and collected during checkout as required by law.</li>
              <li><strong>Order Modifications.</strong> Once an order is submitted, changes (shipping address, product variants, cancellations) may not be possible. Contact support promptly, but we cannot guarantee modifications.</li>
            </ol>

            <div className="border-b border-gray-200 mb-8"></div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Shipping, Delivery, & Risk of Loss</h2>
            <ol className="list-decimal list-inside mb-6 space-y-2">
              <li><strong>Service Area.</strong> We currently ship only within the continental United States, Alaska, Hawaii, and U.S. territories (excluding P.O. boxes and APO/FPO addresses unless otherwise noted).</li>
              <li><strong>Processing Times.</strong> Typical processing is 1–2 business days; high-volume periods may require additional time.</li>
              <li><strong>Delivery Estimates.</strong> Transit times displayed at checkout are estimates, not guarantees. Carrier delays, weather, or other factors beyond our control may impact delivery.</li>
              <li><strong>Risk of Loss & Title.</strong> Title to products and risk of loss pass to you upon our transfer of the package to the carrier.</li>
              <li><strong>International Re-routing.</strong> Any fees, duties, or customs charges incurred by re-routing or forwarding outside the U.S. are your responsibility.</li>
            </ol>

            <div className="border-b border-gray-200 mb-8"></div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Returns, Exchanges, & Refunds</h2>
            <ol className="list-decimal list-inside mb-6 space-y-2">
              <li><strong>Eligible Products.</strong> Unopened, sealed nutritional products in original condition may be returned within 30 days of delivery. Digital items, clearance items, and opened consumables are non-returnable unless defective on arrival.</li>
              <li><strong>Return Procedure.</strong> Obtain a Return Merchandise Authorization (RMA) from support before shipping items back. Unauthorized returns may be rejected.</li>
              <li><strong>Return Shipping Costs.</strong> Unless the return is due to our error (wrong or defective product), you are responsible for return shipping costs.</li>
              <li><strong>Refund Timeline.</strong> Approved refunds are processed back to the original payment method within 7–10 business days after the returned item is received and inspected.</li>
              <li><strong>Partial Refunds.</strong> If items show signs of tampering or are received after the 30-day window, we may apply a partial refund or reject the return.</li>
            </ol>

            <div className="border-b border-gray-200 mb-8"></div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Digital Products & Downloads</h2>
            <ol className="list-decimal list-inside mb-6 space-y-2">
              <li><strong>Delivery.</strong> Digital products (e-books, downloadable guides, meal plans, etc.) are delivered via secure link or user dashboard immediately after payment confirmation.</li>
              <li><strong>License.</strong> Upon purchase, we grant you a limited, non-exclusive, non-transferable license for personal, non-commercial use. All intellectual property rights remain with Charged Up.</li>
              <li><strong>Non-Refundable.</strong> Digital product sales are final except where expressly stated otherwise or where prohibited by law.</li>
              <li><strong>Technical Issues.</strong> If download links malfunction, contact support within 7 days with proof of purchase for replacement access.</li>
            </ol>

            <div className="border-b border-gray-200 mb-8"></div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Subscriptions & Auto-Renewals</h2>
            <ol className="list-decimal list-inside mb-6 space-y-2">
              <li><strong>Subscription Terms.</strong> Certain products or bundles may be offered through recurring delivery (e.g., monthly supplement refills) at the interval and price displayed during sign-up.</li>
              <li><strong>Billing & Renewal.</strong> Your payment method will be charged automatically at the beginning of each renewal cycle until you cancel.</li>
              <li><strong>Managing Subscriptions.</strong> You can view, pause, or cancel subscriptions at any time via your account dashboard—cancellations take effect at the next billing cycle.</li>
              <li><strong>Price Changes.</strong> We will give at least 30 days' notice of subscription price changes. Continued use after the new rate takes effect constitutes agreement to the new price.</li>
              <li><strong>Failed Payments.</strong> If automatic billing fails, we may attempt to re-process. If still unsuccessful, we may suspend or cancel the subscription and any associated benefits.</li>
            </ol>

            <div className="border-b border-gray-200 mb-8"></div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">9. User Conduct & Prohibited Activities</h2>
            <p className="mb-4">You agree to refrain from:</p>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li><strong>Illegal Use.</strong> Violating any applicable federal, state, or local laws or regulations.</li>
              <li><strong>Security Breaches.</strong> Attempting to probe, scan, or test vulnerabilities of the Service or interfere with its security.</li>
              <li><strong>Scraping & Bots.</strong> Using any data-mining, robots, or similar data-gathering tools without our express written consent.</li>
              <li><strong>Harassment.</strong> Posting or transmitting content that is defamatory, obscene, threatening, harassing, or that infringes another's rights.</li>
              <li><strong>Reverse Engineering.</strong> Disassembling, decompiling, or otherwise attempting to derive source code from the Services or software.</li>
            </ul>
            <p className="mb-6">Violation may result in account suspension, cancellation of orders, or legal action.</p>

            <div className="border-b border-gray-200 mb-8"></div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Intellectual Property & Limited License</h2>
            <ol className="list-decimal list-inside mb-6 space-y-2">
              <li><strong>Ownership.</strong> All site content—logos, product images, text, videos, designs, compilations, and underlying code—is owned or licensed by Charged Up and protected under U.S. and international IP laws.</li>
              <li><strong>User License.</strong> We grant you a limited, revocable, non-exclusive license to access and use the Services for personal, non-commercial purposes.</li>
              <li><strong>Restrictions.</strong> You may not modify, republish, transmit, sell, create derivative works from, or exploit any portion of the Services without prior written permission.</li>
              <li><strong>Trademarks.</strong> "Charged Up Nutrition" and related marks are our trademarks. All other trademarks remain the property of their respective owners.</li>
            </ol>

            <div className="border-b border-gray-200 mb-8"></div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Privacy & Data Security</h2>
            <p className="mb-6">
              Your submission of personal information is governed by our Privacy Policy, which forms part of these Terms. We implement reasonable technical and organizational measures to safeguard your data; however, no method of transmission or storage is 100 percent secure. By using the Services, you acknowledge these limitations and consent to our data-handling practices.
            </p>

            <div className="border-b border-gray-200 mb-8"></div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">12. Disclaimers</h2>
            <ol className="list-decimal list-inside mb-6 space-y-2">
              <li><strong>No Medical Advice.</strong> Statements or products on our website have not been evaluated by the U.S. Food and Drug Administration. The products are not intended to diagnose, treat, cure, or prevent any disease. Consult a qualified healthcare professional before starting any supplement program.</li>
              <li><strong>Information Accuracy.</strong> While we strive for accuracy, typographical or other errors may appear. We reserve the right to correct any errors and to change or update information at any time without prior notice.</li>
              <li><strong>Third-Party Links.</strong> Our Services may contain links to third-party websites for convenience. We do not endorse, nor are we responsible for, any third-party content or practices. Access at your own risk.</li>
              <li><strong>"AS-IS" Service.</strong> The Services are provided on an "as-is" and "as-available" basis. To the fullest extent permitted by law, we disclaim all warranties, express or implied, including merchantability, fitness for a particular purpose, and non-infringement.</li>
            </ol>

            <div className="border-b border-gray-200 mb-8"></div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">13. Limitation of Liability</h2>
            <p className="mb-6">
              To the maximum extent permitted by law, Charged Up Nutrition and its owners, officers, employees, or affiliates will not be liable for any indirect, punitive, incidental, special, or consequential damages arising out of or related to your use of the Services or products, even if we have been advised of the possibility of such damages. Our total liability for direct damages shall not exceed the amount you paid for the applicable product or thirty U.S. dollars (USD $30), whichever is greater.
            </p>

            <div className="border-b border-gray-200 mb-8"></div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">14. Indemnification</h2>
            <p className="mb-4">You agree to defend, indemnify, and hold harmless Charged Up Nutrition, its subsidiaries, affiliates, and their respective directors, officers, employees, and agents from and against any claims, damages, liabilities, losses, and expenses (including reasonable attorneys' fees) arising from:</p>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li>Your breach of these Terms;</li>
              <li>Your misuse of the Services;</li>
              <li>Your violation of any law or the rights of a third party.</li>
            </ul>

            <div className="border-b border-gray-200 mb-8"></div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">15. Termination & Suspension</h2>
            <ol className="list-decimal list-inside mb-6 space-y-2">
              <li><strong>By Us.</strong> We may suspend or terminate your account and access to the Services at any time for any violation of these Terms, fraudulent activity, or to protect the security or integrity of our operations.</li>
              <li><strong>By You.</strong> You may terminate by closing your account and ceasing all use of the Services.</li>
              <li><strong>Effect of Termination.</strong> All provisions that by their nature should survive (e.g., intellectual-property rights, disclaimers, limitation of liability, indemnity) will survive termination.</li>
            </ol>

            <div className="border-b border-gray-200 mb-8"></div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">16. Governing Law & Dispute Resolution</h2>
            <ol className="list-decimal list-inside mb-6 space-y-2">
              <li><strong>Governing Law.</strong> These Terms and any disputes will be governed by and construed in accordance with the laws of the State of Texas, without regard to conflict-of-law principles.</li>
              <li><strong>Informal Resolution.</strong> You agree to attempt in good faith to resolve any dispute by contacting us at support@chargedupnutrition.com prior to initiating formal proceedings.</li>
              <li><strong>Arbitration Agreement.</strong> Except for claims that qualify for small-claims court, any dispute arising under these Terms will be resolved exclusively by binding arbitration in San Angelo, Texas, before a single arbitrator under the Commercial Arbitration Rules of the American Arbitration Association. Class-action waivers apply.</li>
              <li><strong>Injunctive Relief.</strong> Nothing in this section restricts either party's right to seek equitable relief to protect confidential information or intellectual property.</li>
            </ol>

            <div className="border-b border-gray-200 mb-8"></div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">17. Changes to Terms</h2>
            <p className="mb-6">
              We may revise these Terms at any time in our sole discretion. Material changes will be highlighted by an updated "Effective Date" and, where feasible, reasonable notice (e.g., email or site banner). Your continued use after the effective date signifies acceptance of the revised Terms.
            </p>

            <div className="border-b border-gray-200 mb-8"></div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">18. Contact Information</h2>
            <div className="mb-6">
              <p>Charged Up Nutrition</p>
              <p>3810 Wild Rye Trl</p>
              <p>San Angelo, TX 76904</p>
              <p>Email: support@chargedupnutrition.com</p>
              <p>Phone: (325) 555-0123</p>
            </div>

            <div className="border-b border-gray-200 mb-8"></div>

            <p className="text-sm text-gray-600 italic">
              This expanded Terms of Service aims to provide clear, comprehensive protection for both Charged Up Nutrition and its customers. Nonetheless, state and federal regulations evolve, and your business model may add unique considerations. We strongly recommend a qualified attorney review this document to ensure full legal compliance, particularly regarding consumer-protection laws, FDA supplement guidelines, and e-commerce regulations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
