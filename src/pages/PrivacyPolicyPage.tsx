
import { useEffect } from 'react';

const PrivacyPolicyPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background pt-32">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">Effective Date: May 28, 2025</p>
        
        <div className="prose prose-lg max-w-none space-y-6">
          <p>
            Charged Up Nutrition ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website [insert website URL], including any other media form, media channel, mobile website, or mobile application related or connected thereto (collectively, the "Site"). Please read this privacy policy carefully.
          </p>

          <section>
            <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
            <p className="mb-4">
              We may collect information about you in a variety of ways. The information we may collect on the Site includes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site.
              </li>
              <li>
                <strong>Payment Information:</strong> If you make purchases through the Site, we may collect data necessary to process your payment, such as your payment instrument number (e.g., credit card number), and the security code associated with your payment instrument.
              </li>
              <li>
                <strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, browser type, operating system, access times, and the pages you have viewed directly before and after accessing the Site.
              </li>
              <li>
                <strong>Mobile Device Data:</strong> Device information, such as your mobile device ID, model, and manufacturer, and information about the location of your device, if you access the Site from a mobile device.
              </li>
              <li>
                <strong>Third-Party Data:</strong> Information from third parties, such as personal information or network friends, if you connect your account to the third party and grant the Site permission to access this information.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Use of Your Information</h2>
            <p className="mb-4">
              Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Create and manage your account.</li>
              <li>Process your transactions and send you related information, including purchase confirmations and invoices.</li>
              <li>Manage your orders and deliveries.</li>
              <li>Provide customer support.</li>
              <li>Send you technical notices, updates, security alerts, and support and administrative messages.</li>
              <li>Communicate with you about products, services, offers, promotions, rewards, and events offered by Charged Up Nutrition and others, and provide news and information we think will be of interest to you.</li>
              <li>Monitor and analyze trends, usage, and activities in connection with our Services.</li>
              <li>Personalize and improve the Services and provide advertisements, content, or features that match user profiles or interests.</li>
              <li>Facilitate contests, sweepstakes, and promotions and process and deliver entries and rewards.</li>
              <li>Link or combine with information we get from others to help understand your needs and provide you with better service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Disclosure of Your Information</h2>
            <p className="mb-4">
              We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others.
              </li>
              <li>
                <strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.
              </li>
              <li>
                <strong>Marketing Communications:</strong> With your consent, or with an opportunity for you to withdraw consent, we may share your information with third parties for marketing purposes.
              </li>
              <li>
                <strong>Business Transfers:</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.
              </li>
              <li>
                <strong>Affiliates:</strong> We may share your information with our affiliates, in which case we will require those affiliates to honor this Privacy Policy.
              </li>
              <li>
                <strong>Other Third Parties:</strong> We may share your information with advertisers and investors for the purpose of conducting general business analysis.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Tracking Technologies</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Cookies and Web Beacons:</strong> We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Site to help customize the Site and improve your experience.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Security of Your Information</h2>
            <p>
              We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that no security measures are perfect or impenetrable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Policy for Children</h2>
            <p>
              We do not knowingly solicit information from or market to children under the age of 13. If we learn that we have collected personal information from a child under age 13 without verification of parental consent, we will delete that information as quickly as possible.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Controls for Do-Not-Track Features</h2>
            <p>
              Most web browsers and some mobile operating systems include a Do-Not-Track ("DNT") feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Options Regarding Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Account Information:</strong> You may at any time review or change the information in your account or terminate your account by contacting us.
              </li>
              <li>
                <strong>Emails and Communications:</strong> If you no longer wish to receive correspondence, emails, or other communications from us, you may opt-out by contacting us.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
