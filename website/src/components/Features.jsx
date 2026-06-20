import { FaWhatsapp } from "react-icons/fa";

const message = `Hi, I need help with my order.`;
const WHATSAPP_LINK = `https://wa.me/919899166988?text=${encodeURIComponent(message)}`;

function Features() {
  return (
    <section className="w-full bg-gray-50 py-4">
      <div
        className="
          max-w-7xl mx-auto
          grid grid-cols-1
          md:grid-cols-4
          gap-6
          px-4
        "
      >
        {/* Free Shipping */}
        <div className="bg-white rounded-xl border border-gray-200
                        flex items-center gap-4
                        px-6 py-5
                        shadow-sm hover:shadow-md transition">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <img src="assets/images/icons/delivery-van.svg" alt="Delivery" className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 text-base">Fast Shipping</h4>
            <p className="text-gray-500 text-sm">By Using Speed Post.</p>
          </div>
        </div>

        {/* Money Back */}
        <div className="bg-white rounded-xl border border-gray-200
                        flex items-center gap-4
                        px-6 py-5
                        shadow-sm hover:shadow-md transition">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <img src="assets/images/icons/money-back.svg" alt="Money Back" className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 text-base">Valuing your Money</h4>
            <p className="text-gray-500 text-sm">Very Reasonable Price.</p>
          </div>
        </div>

        {/* ✅ WhatsApp Support Card */}
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded-xl border border-gray-200
                     flex items-center gap-4
                     px-6 py-5
                     shadow-sm hover:shadow-md transition
                     hover:border-green-400"
        >
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            {/* <img src="assets/images/icons/service-hours.svg" alt="Support" className="w-6 h-6" /> */}
            <FaWhatsapp className="text-green-500 text-2xl" />

          </div>
          <div>
            <h4 className="font-semibold text-gray-800 text-base">
              Chat on WhatsApp
            </h4>
            <p className="text-gray-500 text-sm">
              24/7 Support.

            </p>
          </div>
        </a>

        {/* Pay with Ease */}
        <div className="bg-white rounded-xl border border-gray-200
                        flex items-center gap-4
                        px-6 py-5
                        shadow-sm hover:shadow-md transition">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <img src="assets/images/icons/cash.svg" alt="Pay with Ease" className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 text-base">Pay with Ease</h4>
            <p className="text-gray-500 text-sm">Credit Card • UPI</p>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Features;
