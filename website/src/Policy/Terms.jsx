import { Helmet } from "react-helmet";

function Terms() {
  return (
    <>
      <Helmet>
        <title>Terms of Use | Islamic Book Zone</title>
      </Helmet>

      {/* Full Screen Wrapper */}
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center py-16">
        <div className="max-w-5xl mx-auto px-6 w-full">
          
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">📜</span>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                Terms of Use
              </h1>
            </div>

            {/* Intro Paragraph */}
            <p className="text-gray-700 mb-6 leading-relaxed">
              By using <em>Islamic Book Zone</em>, you agree to our Terms of Use, which govern how you interact with our website and services. These terms cover:
            </p>

            {/* Terms List */}
            <ul className="!list-disc !list-inside !pl-5 text-gray-700 space-y-2 mb-6">
              <li>Your responsibility is to provide accurate contact and payment information.</li>
              <li>Pricing, availability, and order acceptance rules.</li>
              <li>Intellectual property and content protection on the site.</li>
              <li>Eligibility criteria (e.g., age, legal compliance) for placing orders.</li>
              <li>Limitation of liability and dispute resolution mechanisms.</li>
            </ul>

            {/* Closing Paragraph */}
            <p className="text-gray-700 leading-relaxed">
              Our Terms of Use are designed to protect both you and our business, ensuring clarity and fairness in every transaction.
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

export default Terms;
