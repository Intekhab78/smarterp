import { Helmet } from "react-helmet";

function ShippingPolicy() {
  return (
    <>
      <Helmet>
        <title>Shipping Policy | Islamic Book Zone</title>
      </Helmet>

      {/* Full Screen Wrapper */}
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center">
        <div className="max-w-6xl mx-auto px-6 py-16 w-full">

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">🚚</span>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                Shipping Policy
              </h1>
            </div>

            {/* Intro Paragraph */}
            <p className="text-gray-600 mb-6 leading-relaxed">
              We aim to deliver your orders quickly and reliably. Once your order is processed and confirmed:
            </p>

            {/* Shipping Rules */}
            <ul className="space-y-3 text-gray-600 !list-inside !list-disc !pl-5">
              <li>
                Orders are shipped using trusted Indian postal department as logistics partners.
              </li>
              <li>
                Shipping charges (if any) will be clearly shown at checkout; they are based on packet size, weight, and delivery location.
              </li>
              <li>
                Estimated delivery times will be communicated via email or SMS.
              </li>
              <li>
                Tracking information will be provided so you can follow your order until delivery.
              </li>
            </ul>

            {/* Note Paragraph */}
            <p className="mt-6 text-gray-600 leading-relaxed">
              Please ensure your delivery address is accurate to avoid delays. Islamic Book Zone is not responsible for delays caused by third-party carriers or incorrect address details.
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

export default ShippingPolicy;
