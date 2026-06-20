import { Helmet } from "react-helmet";

function SecureShopping() {
  return (
    <>
      <Helmet>
        <title>Secure Shopping | Islamic Book Zone</title>
      </Helmet>

      {/* Full Screen Wrapper */}
      <div className="min-h-screen bg-gray-50 flex items-start py-20">
        <div className="max-w-3xl mx-auto w-full px-6">

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-blue-700 text-3xl">🛡️</span>
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
                Secure Shopping
              </h1>
            </div>

            {/* Main Paragraph */}
            <p className="text-gray-800 mb-6 leading-relaxed">
              At <strong>Islamic Book Zone</strong>, we are committed to making your online shopping safe and secure. 
              We use <strong>industry-standard encryption (SSL)</strong> and secure protocols to protect your personal and payment information. 
              Your financial details are transmitted <strong>directly and securely to our payment processors</strong>, and we <strong>do not store complete card information</strong> on our servers.
            </p>

            {/* Bullet Points */}
            <p className="text-gray-800 mb-2 font-semibold">To maintain your safety:</p>
            <ul className="!list-disc !list-inside !pl-5 text-gray-800 space-y-2 mb-6">
              <li>Always keep your password confidential and change it regularly.</li>
              <li>Never share OTPs or sensitive credentials with anyone.</li>
              <li>Beware of unsolicited emails asking for personal or payment information.</li>
            </ul>

            {/* Closing Paragraph */}
            <p className="text-gray-800 leading-relaxed font-medium">
              Shopping on our platform is designed to be <strong>secure, trustworthy, and reliable</strong>.
            </p>

            {/* Divider */}
            <div className="mt-10 border-t pt-4 text-sm text-gray-500 text-right">
              Last updated: {new Date().toLocaleDateString()}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default SecureShopping;
