
import { useEffect } from 'react';

const TermsOfServicePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background pt-32">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-gray-600 mb-8">Effective Date: May 28, 2025</p>
        
        <div className="prose prose-lg max-w-none space-y-6">
          <p>
            Welcome to Charged Up Nutrition. These Terms of Service ("Terms") govern your use of our website and services. By accessing or using our website, you agree to be bound by these Terms.
          </p>

          <section>
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials on Charged Up Nutrition's website for personal, non-commercial transitory viewing only.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Disclaimer</h2>
            <p>
              The materials on Charged Up Nutrition's website are provided on an 'as is' basis. Charged Up Nutrition makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Limitations</h2>
            <p>
              In no event shall Charged Up Nutrition or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Charged Up Nutrition's website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Privacy Policy</h2>
            <p>
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the website, to understand our practices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Changes to Terms</h2>
            <p>
              Charged Up Nutrition may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
