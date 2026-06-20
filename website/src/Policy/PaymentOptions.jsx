import { Helmet } from "react-helmet";

function PaymentOptions() {
  return (
    <>
      <Helmet>
        <title>Payment Options | Islamic Book Zone</title>
      </Helmet>

      {/* Full Screen Wrapper */}
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center">
        <div className="max-w-5xl mx-auto px-6 py-16 w-full">

          {/* Card */}
          <div className="!bg-white rounded-2xl shadow-xl p-8 md:p-12">

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">💳</span>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                Payment Options
              </h1>
            </div>

            {/* Intro Paragraph */}
            <p className="text-gray-600 mb-6 leading-relaxed">
              We offer multiple <strong>secure and flexible payment options</strong> to make your checkout convenient:
            </p>

            {/* Payment List */}
            <ul className="space-y-3 text-gray-600 !list-inside !list-disc !pl-5">
              <li><strong>Credit / Debit Cards</strong> (Visa, Mastercard, etc.)</li>
              <li><strong>Net Banking & UPI</strong></li>
              {/* <li><strong>Cash on Delivery (COD)</strong> where available</li> */}
              {/* <li><strong>EMI / Installment Options</strong> (if applicable)</li> */}
            </ul>

            {/* Info Paragraph */}
            <p className="mt-6 text-gray-600 leading-relaxed">
              All online payments are processed through trusted third-party payment gateways with secure encryption.
              You agree to provide accurate financial information and to use payment methods lawfully authorized to you.
              <em>Islamic Book Zone</em> reserves the right to add or modify payment options at any time.
            </p>

            {/* Divider */}
            <div className="mt-10 border-t pt-6 text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default PaymentOptions;
