import { Helmet } from "react-helmet";

function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Islamic Book Zone</title>
      </Helmet>

      {/* Full Screen Wrapper */}
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center py-16">
        <div className="max-w-5xl mx-auto px-6 w-full">
          
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">🔒</span>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                Privacy Policy
              </h1>
            </div>

            {/* Paragraphs */}
            <p className="text-gray-700 mb-4 leading-relaxed">
              Your privacy is extremely important to us. When you register or place an order on <em>Islamic Book Zone</em>, we collect only the personal information necessary to fulfill your order and improve your shopping experience (such as your name, contact details, and delivery address).
            </p>

            <p className="text-gray-700 mb-4 leading-relaxed">
              We may also use cookies and analytics to enhance the browsing experience and provide personalized recommendations. We do <strong>not rent, sell, or share your personal information</strong> with unrelated third parties, except by using postal department for delivery.
            </p>

            <p className="text-gray-700 mb-4 leading-relaxed">
              You may update or delete your account information at any time, and we will safeguard your data according to accepted security standards.
            </p>

            {/* Divider */}
            <div className="mt-10 border-t pt-6 text-sm text-gray-500 text-right">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PrivacyPolicy;
